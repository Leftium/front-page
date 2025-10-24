import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const COOKIE_OPTIONS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365
};

export const load: PageServerLoad = async ({ cookies, url }) => {
	const recent = cookies.get('visits_recent')?.split('-').map(Number) ?? [];
	const total = parseInt(cookies.get('visits_total') ?? '0', 10);
	const baseline = cookies.get('visits_baseline');
	const currentBaseline = baseline
		? parseInt(baseline, 10)
		: recent.length > 0
			? recent[recent.length - 1]
			: null;

	return {
		recent,
		total,
		currentBaseline,
		source: url.searchParams.get('from') || 'hckrnews',
		pagesPerLoad: parseInt(cookies.get('pages_per_load') ?? '3', 10)
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const baseline = data.get('baseline');
		const customDatetime = data.get('custom_datetime');
		const pagesPerLoad = data.get('pages_per_load');

		if (baseline) {
			const timestamp =
				baseline === 'custom' && customDatetime
					? Math.floor(new Date(customDatetime.toString()).getTime() / 1000)
					: baseline;
			cookies.set('visits_baseline', timestamp.toString(), COOKIE_OPTIONS);
		}

		if (pagesPerLoad) {
			cookies.set('pages_per_load', pagesPerLoad.toString(), COOKIE_OPTIONS);
		}

		const selectedFeed = data.get('feed') || url.searchParams.get('from') || 'hckrnews';
		throw redirect(303, `/config?from=${selectedFeed}`);
	}
};
