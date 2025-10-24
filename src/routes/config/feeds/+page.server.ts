import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const source = url.searchParams.get('from') || 'hckrnews';
	return { source };
};
