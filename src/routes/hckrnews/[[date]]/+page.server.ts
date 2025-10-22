export const load = async ({ fetch, params }) => {
	console.log('date param:', params.date);

	const fetched = await fetch('https://hckrnews.com/data/latest.js');
	const texted = await fetched.text();

	const json = JSON.parse(texted.replace(/^var entries =/, ''));

	return { json };
};
