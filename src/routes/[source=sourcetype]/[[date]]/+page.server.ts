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

		const baseline = baselineCookie ? parseInt(baselineCookie, 10) : lastVisit;

		if (baselineCookie) {
			cookies.delete('visits_baseline', { path: '/' });
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

	if (source === 'hckrnews') {
		result = await fetchHckrnews(fetch, date);
	} else if (['top', 'new', 'best', 'ask', 'show', 'jobs'].includes(source)) {
		result = await fetchHNApi(fetch, source);
	} else {
		result = await fetchHN(fetch, source);
	}

	return {
		stories: result.stories,
		previousDate: result.previousDate,
		visitData,
		source
	};
};
