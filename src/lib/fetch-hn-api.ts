import type { NormalizedStory } from './fetch-hckrnews';

interface HNItem {
	id: number;
	type: 'story' | 'job' | 'poll';
	by: string;
	time: number;
	title: string;
	url?: string;
	score?: number;
	descendants?: number;
	dead?: boolean;
	deleted?: boolean;
}

const ENDPOINTS: Record<string, string> = {
	top: 'https://hacker-news.firebaseio.com/v0/topstories.json',
	new: 'https://hacker-news.firebaseio.com/v0/newstories.json',
	best: 'https://hacker-news.firebaseio.com/v0/beststories.json',
	ask: 'https://hacker-news.firebaseio.com/v0/askstories.json',
	show: 'https://hacker-news.firebaseio.com/v0/showstories.json',
	jobs: 'https://hacker-news.firebaseio.com/v0/jobstories.json'
};

export async function fetchHNApi(
	fetchFn: typeof fetch,
	source: string
): Promise<{ stories: NormalizedStory[]; previousDate?: string }> {
	const endpoint = ENDPOINTS[source];
	if (!endpoint) {
		throw new Error(`Unknown HN API source: ${source}`);
	}

	const idsResponse = await fetchFn(endpoint);
	const ids: number[] = await idsResponse.json();

	const topIds = ids.slice(0, 30);

	const itemPromises = topIds.map(async (id) => {
		const response = await fetchFn(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
		return response.json() as Promise<HNItem>;
	});

	const items = await Promise.all(itemPromises);

	const stories: NormalizedStory[] = items
		.filter((item) => item && !item.deleted)
		.map((item) => {
			let domain: string | undefined;
			if (item.url) {
				try {
					const url = new URL(item.url);
					domain = url.hostname.replace(/^www\./, '');
				} catch {
					domain = undefined;
				}
			}

			return {
				id: item.id,
				title: item.title,
				url: item.url,
				domain,
				points: item.score || 0,
				comments: item.descendants || 0,
				time: item.time,
				user: item.by || '',
				dead: item.dead,
				deleted: item.deleted,
				type: item.type
			};
		});

	return { stories };
}
