export const load = async ({ fetch, params, cookies, url }) => {
	const recentVisits = cookies.get('visits_recent');
	const totalVisits = cookies.get('visits_total');

	let visitData = null;

	if (!params.date) {
		const now = Math.floor(Date.now() / 1000);

		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;

		recent.push(now);
		const trimmed = recent.slice(-20);

		const total = totalVisits ? parseInt(totalVisits, 10) + 1 : 1;

		cookies.set('visits_recent', trimmed.join('-'), { path: '/', maxAge: 60 * 60 * 24 * 365 });
		cookies.set('visits_total', total.toString(), { path: '/', maxAge: 60 * 60 * 24 * 365 });

		visitData = { total, lastVisit };
	} else {
		const recent = recentVisits ? recentVisits.split('-').map(Number) : [];
		const lastVisit = recent.length > 0 ? recent[recent.length - 1] : null;
		const total = totalVisits ? parseInt(totalVisits, 10) : 0;

		visitData = { total, lastVisit };
	}

	const filename = params.date ? `${params.date.replace(/\./g, '')}.js` : 'latest.js';

	const fetched = await fetch(`https://hckrnews.com/data/${filename}`);
	const texted = await fetched.text();

	const json = JSON.parse(texted.replace(/^var entries =/, ''));

	let prevDate;
	if (params.date) {
		const [year, month, day] = params.date.split('.').map(Number);
		prevDate = new Date(Date.UTC(year, month - 1, day));
	} else {
		const lastItem = json[json.length - 1];
		prevDate = new Date(lastItem.date * 1000);
	}
	prevDate.setUTCDate(prevDate.getUTCDate() - 1);

	const previousDate = `${prevDate.getUTCFullYear()}.${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}.${String(prevDate.getUTCDate()).padStart(2, '0')}`;

	return { json, previousDate, visitData };
};
