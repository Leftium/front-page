import type { NormalizedStory } from './fetch-hckrnews';

export async function fetchHN(
	_fetchFn: typeof fetch,
	source: string
): Promise<{ stories: NormalizedStory[]; previousDate?: string }> {
	throw new Error(`Scraping for source "${source}" not yet implemented`);
}
