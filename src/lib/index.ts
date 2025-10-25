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
	launches: 'Launches',
	invited: 'Invited'
};

export const FEED_SOURCES = [
	{
		id: 'hckrnews',
		name: 'HckrNews',
		description: 'Chronological list of items that made it to HN homepage',
		category: 'Curated',
		available: true
	},
	{
		id: 'top',
		name: 'Top Stories',
		description: '/news',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'new',
		name: 'New Stories',
		description: '/new',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'show',
		name: 'Show HN',
		description: '/show',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'ask',
		name: 'Ask HN',
		description: '/ask',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'best',
		name: 'Best Stories',
		description: '/best',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'jobs',
		name: 'Jobs',
		description: '/jobs',
		category: 'Hacker News',
		available: true
	},
	{
		id: 'shownew',
		name: 'Show New',
		description: 'The newest Show HN posts',
		category: 'More lists',
		available: true
	},
	{
		id: 'asknew',
		name: 'Ask New',
		description: 'The newest Ask HN posts',
		category: 'More lists',
		available: true
	},
	{
		id: 'pool',
		name: 'Pool',
		description: 'Links selected for a second chance at the front page',
		category: 'More lists',
		available: true
	},
	{
		id: 'invited',
		name: 'Invited',
		description: 'Overlooked links, invited to repost',
		category: 'More lists',
		available: true
	},
	{
		id: 'noobstories',
		name: 'Noob Stories',
		description: 'Submissions from new accounts',
		category: 'More lists',
		available: true
	},
	{
		id: 'classic',
		name: 'Classic',
		description: 'Frontpage as voted by ancient accounts',
		category: 'More lists',
		available: true
	},
	{
		id: 'launches',
		name: 'Launches',
		description: 'Launches of YC startups',
		category: 'More lists',
		available: true
	},
	{
		id: 'active',
		name: 'Active',
		description: 'Most active current discussions',
		category: 'More lists',
		available: false
	},
	{
		id: 'bestcomments',
		name: 'Best Comments',
		description: 'Highest-voted recent comments',
		category: 'More lists',
		available: false
	}
];
