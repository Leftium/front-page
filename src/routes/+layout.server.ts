import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionStartCookie = cookies.get('session_start');

	if (sessionStartCookie) {
		const sessionStart = parseInt(sessionStartCookie, 10);
		const sessionExpires = sessionStart + 20 * 60;

		return {
			sessionExpires
		};
	}

	return {};
};
