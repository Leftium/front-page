import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionStartCookie = cookies.get('session_start');
	const totalVisits = cookies.get('visits_total');

	const result: { sessionExpires?: number; visitData?: { total: number } } = {};

	if (sessionStartCookie) {
		const sessionStart = parseInt(sessionStartCookie, 10);
		result.sessionExpires = sessionStart + 20 * 60;
	}

	if (totalVisits) {
		result.visitData = {
			total: parseInt(totalVisits, 10)
		};
	}

	return result;
};
