export const FEED_NAMES: Record<string, string> = {
	hckrnews: 'HckrNews',
	top: 'Top Stories',
	new: 'New Stories',
	best: 'Best Stories',
	ask: 'Ask HN',
	show: 'Show HN',
	jobs: 'Jobs',
	shownew: 'Show New',
	asknew: 'Ask New',
	active: 'Active',
	bestcomments: 'Best Comments',
	noobstories: 'Noob Stories',
	pool: 'Pool',
	classic: 'Classic',
	launches: 'Launches'
};

export const FEED_SOURCES = [
	{ id: 'hckrnews', name: 'HckrNews', category: 'Curated', available: true },
	{ id: 'top', name: 'Top Stories', category: 'Hacker News', available: true },
	{ id: 'new', name: 'New Stories', category: 'Hacker News', available: true },
	{ id: 'best', name: 'Best Stories', category: 'Hacker News', available: true },
	{ id: 'ask', name: 'Ask HN', category: 'Hacker News', available: true },
	{ id: 'show', name: 'Show HN', category: 'Hacker News', available: true },
	{ id: 'jobs', name: 'Jobs', category: 'Hacker News', available: true },
	{ id: 'shownew', name: 'Show New', category: 'More lists', available: true },
	{ id: 'asknew', name: 'Ask New', category: 'More lists', available: true },
	{ id: 'active', name: 'Active', category: 'More lists', available: false },
	{ id: 'bestcomments', name: 'Best Comments', category: 'More lists', available: false },
	{ id: 'noobstories', name: 'Noob Stories', category: 'More lists', available: true },
	{ id: 'pool', name: 'Pool', category: 'More lists', available: true },
	{ id: 'classic', name: 'Classic', category: 'More lists', available: true },
	{ id: 'launches', name: 'Launches', category: 'More lists', available: true }
];
