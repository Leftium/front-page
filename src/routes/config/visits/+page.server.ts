import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ cookies }) => {
	const recentVisits = cookies.get('visits_recent');
	const totalVisits = cookies.get('visits_total');
	const baseline = cookies.get('visits_baseline');

	const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
	const total = totalVisits ? parseInt(totalVisits, 10) : 0;
	const currentBaseline = baseline
		? parseInt(baseline, 10)
		: recent.length > 0
			? recent[recent.length - 1]
			: null;

	return {
		recent,
		total,
		currentBaseline
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const baseline = data.get('baseline');
		const customDatetime = data.get('custom_datetime');

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

		throw redirect(303, '/');
	}
};
