import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const COOKIE_OPTIONS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365
};

export const load: PageServerLoad = async ({ cookies, url }) => {
	const recent = cookies.get('visits_recent')?.split('-').map(Number) ?? [];
	const total = parseInt(cookies.get('visits_total') ?? '0', 10);
	const selectedBaseline = cookies.get('selected_baseline');

	return {
		recent,
		total,
		source: url.searchParams.get('from') || 'hckrnews',
		pagesPerLoad: parseInt(cookies.get('pages_per_load') ?? '1', 10),
		selectedBaseline: selectedBaseline ? parseInt(selectedBaseline, 10) : null
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const pagesPerLoad = data.get('pages_per_load');
		const customDatetime = data.get('custom_datetime');
		const baselineDisplay = data.get('baseline_display');

		if (pagesPerLoad) {
			cookies.set('pages_per_load', pagesPerLoad.toString(), COOKIE_OPTIONS);
		}

		if (customDatetime) {
			const timestamp = Math.floor(new Date(customDatetime.toString()).getTime() / 1000);
			cookies.set('selected_baseline', timestamp.toString(), COOKIE_OPTIONS);
		} else if (baselineDisplay) {
			cookies.set('selected_baseline', baselineDisplay.toString(), COOKIE_OPTIONS);
		}

		const selectedFeed = data.get('feed') || url.searchParams.get('from') || 'hckrnews';
		throw redirect(303, `/config?from=${selectedFeed}`);
	},
	clearBaseline: async ({ cookies }) => {
		cookies.delete('selected_baseline', { path: '/' });
		return { success: true };
	}
};
