export const load = async ({ fetch, params }) => {
	const filename = params.date ? `${params.date.replace(/\./g, '')}.js` : 'latest.js';

	const fetched = await fetch(`https://hckrnews.com/data/${filename}`);
	const texted = await fetched.text();

	const json = JSON.parse(texted.replace(/^var entries =/, ''));

	// Calculate previous date in UTC
	let prevDate;
	if (params.date) {
		// Use the page param date and subtract 1 day (UTC)
		const [year, month, day] = params.date.split('.').map(Number);
		prevDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed, create UTC date
	} else {
		// Use last item's date (Unix timestamps are UTC)
		const lastItem = json[json.length - 1];
		prevDate = new Date(lastItem.date * 1000); // Convert Unix timestamp (seconds) to Date
	}
	prevDate.setUTCDate(prevDate.getUTCDate() - 1); // Subtract 1 day in UTC (handles month/year rollover)

	// Format as YYYY.MM.DD using UTC
	const previousDate = `${prevDate.getUTCFullYear()}.${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}.${String(prevDate.getUTCDate()).padStart(2, '0')}`;

	return { json, previousDate };
};
