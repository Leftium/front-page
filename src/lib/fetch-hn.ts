import type { NormalizedStory } from './fetch-hckrnews';

const SOURCE_URLS: Record<string, string> = {
	shownew: 'https://news.ycombinator.com/shownew',
	noobstories: 'https://news.ycombinator.com/noobstories',
	pool: 'https://news.ycombinator.com/pool',
	classic: 'https://news.ycombinator.com/classic',
	launches: 'https://news.ycombinator.com/launches'
};

function parseHNHTML(html: string): NormalizedStory[] {
	const stories: NormalizedStory[] = [];
	const storyRegex =
		/<tr class="athing submission" id="(\d+)">.*?<span class="titleline"><a href="([^"]+)"[^>]*>([^<]+)<\/a>(?:<span class="sitebit comhead">.*?<span class="sitestr">([^<]+)<\/span>.*?<\/span>)?<\/span>.*?<span class="score"[^>]*>(\d+) points?<\/span> by <a href="user\?id=([^"]+)"[^>]*>[^<]+<\/a> <span class="age" title="[^"]+\s+(\d{10,})".*?<\/span>.*?(?:<a href="item\?id=\d+">(\d+)&nbsp;comments?<\/a>|<a href="item\?id=\d+">discuss<\/a>)/gs;

	let match;
	while ((match = storyRegex.exec(html)) !== null) {
		const [, id, url, title, domain, points, user, timestamp, comments] = match;

		let finalUrl: string | undefined = url;
		let finalDomain: string | undefined = domain;

		if (url.startsWith('item?id=')) {
			finalUrl = `https://news.ycombinator.com/${url}`;
			finalDomain = undefined;
		} else if (!url.startsWith('http')) {
			finalUrl = `https://news.ycombinator.com/${url}`;
		} else if (!domain) {
			try {
				const urlObj = new URL(url);
				finalDomain = urlObj.hostname.replace(/^www\./, '');
			} catch {
				finalDomain = undefined;
			}
		}

		stories.push({
			id: parseInt(id, 10),
			title,
			url: finalUrl,
			domain: finalDomain,
			points: parseInt(points, 10),
			comments: comments ? parseInt(comments, 10) : 0,
			time: parseInt(timestamp, 10),
			user
		});
	}

	return stories;
}

const ITEMS_PER_PAGE = 30;

export async function fetchHN(
	fetchFn: typeof fetch,
	source: string,
	startPage: number = 1,
	endPage: number = 1
): Promise<{ stories: NormalizedStory[]; nextRange?: string }> {
	const url = SOURCE_URLS[source];
	if (!url) {
		throw new Error(`Unknown HN source: ${source}`);
	}

	// Note: HN's Show New, Classic, etc. pages use a different pagination system
	// with ?next=ID&n=count that's incompatible with our page-based approach.
	// For now, we only fetch the first page (30 items).

	const response = await fetchFn(url);
	const html = await response.text();
	const stories = parseHNHTML(html);

	// No pagination support for scraped feeds at this time
	return {
		stories,
		nextRange: undefined
	};
}
