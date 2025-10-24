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
			cookies.set('visits_baseline', lastVisit.toString(), { path: '/', maxAge: 60 * 60 * 24 });
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
	let nextPage: number | undefined;
	let currentPage = 1;

	if (source === 'hckrnews') {
		const hckrResult = await fetchHckrnews(fetch, date);
		result = hckrResult.stories;
		previousDate = hckrResult.previousDate;
	} else if (['top', 'new', 'best', 'ask', 'show', 'jobs'].includes(source)) {
		const page = date ? parseInt(date, 10) : 1;
		currentPage = page;
		const apiResult = await fetchHNApi(fetch, source, page);
		result = apiResult.stories;
		nextPage = apiResult.nextPage;
	} else {
		const hnResult = await fetchHN(fetch, source);
		result = hnResult.stories;
	}

	return {
		stories: result,
		previousDate,
		nextPage,
		currentPage,
		visitData,
		source
	};
};
