import type { PageServerLoad } from './$types';
import { fetchHckrnews } from '$lib/fetch-hckrnews';
import { fetchHNApi } from '$lib/fetch-hn-api';
import { fetchHN } from '$lib/fetch-hn';

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
	const source = params.source || 'hckrnews';
	const date = params.date;

	const recentVisits = cookies.get('visits_recent');
	const totalVisits = cookies.get('visits_total');
	const pagesPerLoadCookie = cookies.get('pages_per_load');

	const defaultPages = pagesPerLoadCookie ? parseInt(pagesPerLoadCookie, 10) : 1;

	let visitData = null;

	if (!date) {
		const now = Math.floor(Date.now() / 1000);

		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;

		// Update or add visit based on time difference
		if (!lastVisit || recent.length === 1) {
			// First visit ever or only one visit (need to establish baseline)
			recent.push(now);
		} else {
			const timeDiff = now - lastVisit;
			if (timeDiff < 60 * 60) {
				// Less than 60 minutes: update the most recent visit
				recent[recent.length - 1] = now;
			} else {
				// 60+ minutes: add new visit
				recent.push(now);
			}
		}

		// Keep only the last 10 visits
		const trimmed = recent.slice(-10);
		cookies.set('visits_recent', trimmed.join('-'), { path: '/', maxAge: 60 * 60 * 24 * 365 });

		const total = totalVisits ? parseInt(totalVisits, 10) + 1 : 1;
		cookies.set('visits_total', total.toString(), { path: '/', maxAge: 60 * 60 * 24 * 365 });

		// Automatic baseline: Use the previous visit (session-based detection)
		// Manual baseline will be handled client-side via sessionStorage
		const baseline = trimmed.length > 1 ? trimmed[trimmed.length - 2] : null;

		visitData = { total, lastVisit: now, baseline, recentVisits: trimmed };
	} else {
		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;
		const total = totalVisits ? parseInt(totalVisits, 10) : 0;
		const baseline = recent.length > 1 ? recent[recent.length - 2] : null;

		visitData = { total, lastVisit, baseline, recentVisits: recent };
	}

	let result;
	let previousDate: string | undefined;
	let nextRange: string | undefined;
	let startPage = 1;
	let endPage = defaultPages;
	let startIndex = 0;

	if (source === 'hckrnews') {
		const hckrResult = await fetchHckrnews(fetch, date);
		result = hckrResult.stories;
		previousDate = hckrResult.previousDate;
	} else if (['top', 'new', 'best', 'ask', 'show', 'jobs'].includes(source)) {
		if (date) {
			if (date.includes(':')) {
				const [start, end] = date.split(':').map(Number);
				startPage = start;
				endPage = end;
			} else if (/^\d+$/.test(date)) {
				startPage = endPage = parseInt(date, 10);
			}
		}

		const apiResult = await fetchHNApi(fetch, source, startPage, endPage);
		result = apiResult.stories;
		nextRange = apiResult.nextRange;
		startIndex = (startPage - 1) * 30;
	} else if (['shownew', 'noobstories', 'pool', 'classic', 'launches'].includes(source)) {
		let startId: string | undefined;
		let pageCount = defaultPages;
		let itemIndex = 0;

		if (date) {
			const parts = date.split(':');
			if (parts.length === 3) {
				startId = parts[0];
				itemIndex = parseInt(parts[1], 10);
				pageCount = parseInt(parts[2], 10);
			} else if (parts.length === 2) {
				startId = parts[0];
				itemIndex = parseInt(parts[1], 10);
			} else {
				startId = date;
				pageCount = 1;
			}
		}

		if (source === 'classic' && startId) {
			const pageNum = parseInt(startId, 10);
			startIndex = (pageNum - 1) * 30;
		} else {
			startIndex = itemIndex;
		}

		const hnResult = await fetchHN(fetch, source, startId, pageCount, startIndex);
		result = hnResult.stories;
		nextRange = hnResult.nextRange;
		startIndex = source === 'classic' ? startIndex : itemIndex;
	} else {
		const hnResult = await fetchHN(fetch, source);
		result = hnResult.stories;
	}

	return {
		stories: result,
		previousDate,
		nextRange,
		startPage,
		endPage,
		startIndex,
		visitData,
		source
	};
};
