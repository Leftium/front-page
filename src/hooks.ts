import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	if (url.pathname === '/') {
		return '/hckrnews';
	}
};
