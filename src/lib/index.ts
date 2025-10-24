export const FEED_NAMES: Record<string, string> = {
	hckrnews: 'HckrNews',
	top: 'Top stories',
	new: 'New stories',
	best: 'Best stories',
	ask: 'Ask HN',
	show: 'Show HN',
	jobs: 'Jobs',
	shownew: 'Show new',
	active: 'Active',
	bestcomments: 'Best comments',
	noobstories: 'Noob stories',
	pool: 'Pool',
	classic: 'Classic',
	launches: 'Launches'
};

export const FEED_SOURCES = [
	{ id: 'hckrnews', name: 'HckrNews', category: 'Curated', available: true },
	{ id: 'top', name: 'Top stories', category: 'Hacker News', available: true },
	{ id: 'new', name: 'New stories', category: 'Hacker News', available: true },
	{ id: 'best', name: 'Best stories', category: 'Hacker News', available: true },
	{ id: 'ask', name: 'Ask HN', category: 'Hacker News', available: true },
	{ id: 'show', name: 'Show HN', category: 'Hacker News', available: true },
	{ id: 'jobs', name: 'Jobs', category: 'Hacker News', available: true },
	{ id: 'shownew', name: 'Show new', category: 'More lists', available: false },
	{ id: 'active', name: 'Active', category: 'More lists', available: false },
	{ id: 'bestcomments', name: 'Best comments', category: 'More lists', available: false },
	{ id: 'noobstories', name: 'Noob stories', category: 'More lists', available: false },
	{ id: 'pool', name: 'Pool', category: 'More lists', available: false },
	{ id: 'classic', name: 'Classic', category: 'More lists', available: false },
	{ id: 'launches', name: 'Launches', category: 'More lists', available: false }
];
