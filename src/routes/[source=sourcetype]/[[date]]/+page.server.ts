import type { PageServerLoad } from './$types';
import { fetchHckrnews } from '$lib/fetch-hckrnews';
import { fetchHNApi } from '$lib/fetch-hn-api';
import { fetchHN } from '$lib/fetch-hn';

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
	const source = params.source || 'hckrnews';
	const date = params.date;

	const recentVisits = cookies.get('visits_recent');
	const totalVisits = cookies.get('visits_total');
	const baselineCookie = cookies.get('visits_baseline');
	const pagesPerLoadCookie = cookies.get('pages_per_load');

	const defaultPages = pagesPerLoadCookie ? parseInt(pagesPerLoadCookie, 10) : 3;

	let visitData = null;

	if (!date) {
		const now = Math.floor(Date.now() / 1000);

		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;

		const shouldRecordVisit = !lastVisit || now - lastVisit >= 30 * 60;

		if (shouldRecordVisit) {
			recent.push(now);
			const trimmed = recent.slice(-20);
			cookies.set('visits_recent', trimmed.join('-'), { path: '/', maxAge: 60 * 60 * 24 * 365 });
		}

		const total = totalVisits ? parseInt(totalVisits, 10) + 1 : 1;
		cookies.set('visits_total', total.toString(), { path: '/', maxAge: 60 * 60 * 24 * 365 });

		let baseline: number | null;
		if (baselineCookie) {
			baseline = parseInt(baselineCookie, 10);
		} else if (shouldRecordVisit && lastVisit) {
			baseline = lastVisit;
			cookies.set('visits_baseline', lastVisit.toString(), { path: '/' });
		} else {
			baseline = lastVisit;
		}

		visitData = { total, lastVisit, baseline };
	} else {
		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;
		const total = totalVisits ? parseInt(totalVisits, 10) : 0;
		const baseline = baselineCookie ? parseInt(baselineCookie, 10) : lastVisit;

		visitData = { total, lastVisit, baseline };
	}

	let result;
	let previousDate: string | undefined;
	let nextRange: string | undefined;
	let startPage = 1;
	let endPage = defaultPages;

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
		visitData,
		source
	};
};
