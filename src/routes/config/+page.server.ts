import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const COOKIE_OPTIONS = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365
};

export const load: PageServerLoad = async ({ cookies, url }) => {
	const recent = cookies.get('visits_recent')?.split('-').map(Number) ?? [];
	const total = parseInt(cookies.get('visits_total') ?? '0', 10);

	return {
		recent,
		total,
		source: url.searchParams.get('from') || 'hckrnews',
		pagesPerLoad: parseInt(cookies.get('pages_per_load') ?? '3', 10)
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const pagesPerLoad = data.get('pages_per_load');

		if (pagesPerLoad) {
			cookies.set('pages_per_load', pagesPerLoad.toString(), COOKIE_OPTIONS);
		}

		const selectedFeed = data.get('feed') || url.searchParams.get('from') || 'hckrnews';
		throw redirect(303, `/config?from=${selectedFeed}`);
	}
};
