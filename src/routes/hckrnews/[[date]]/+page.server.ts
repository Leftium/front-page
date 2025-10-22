export const load = async ({ fetch, params }) => {
	const filename = params.date ? `${params.date.replace(/\./g, '')}.js` : 'latest.js';

	const fetched = await fetch(`https://hckrnews.com/data/${filename}`);
	const texted = await fetched.text();

	const json = JSON.parse(texted.replace(/^var entries =/, ''));

	return { json };
};
