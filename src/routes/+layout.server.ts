import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionActive = cookies.get('session_active');

	if (sessionActive) {
		const sessionStart = parseInt(sessionActive, 10);
		const sessionExpires = sessionStart + 20 * 60;

		return {
			sessionExpires
		};
	}

	return {};
};
