import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const recentVisits = cookies.get('visits_recent');
	const totalVisits = cookies.get('visits_total');
	const baseline = cookies.get('visits_baseline');
	const pagesPerLoad = cookies.get('pages_per_load');

	const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
	const total = totalVisits ? parseInt(totalVisits, 10) : 0;
	const currentBaseline = baseline
		? parseInt(baseline, 10)
		: recent.length > 0
			? recent[recent.length - 1]
			: null;

	const source = url.searchParams.get('from') || 'hckrnews';
	const pages = pagesPerLoad ? parseInt(pagesPerLoad, 10) : 3;

	return {
		recent,
		total,
		currentBaseline,
		source,
		pagesPerLoad: pages
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		console.log('Form submitted to server action');
		const data = await request.formData();
		const feed = data.get('feed');
		const baseline = data.get('baseline');
		const customDatetime = data.get('custom_datetime');
		const pagesPerLoad = data.get('pages_per_load');

		if (baseline === 'custom' && customDatetime) {
			const timestamp = Math.floor(new Date(customDatetime.toString()).getTime() / 1000);
			cookies.set('visits_baseline', timestamp.toString(), {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		} else if (baseline) {
			cookies.set('visits_baseline', baseline.toString(), {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		if (pagesPerLoad) {
			cookies.set('pages_per_load', pagesPerLoad.toString(), {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		const currentSource = url.searchParams.get('from') || 'hckrnews';
		const selectedFeed = feed || currentSource;

		throw redirect(303, `/${selectedFeed}`);
	}
};
