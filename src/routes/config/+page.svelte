<script lang="ts">
	import dayjs from 'dayjs';
	import { FEED_SOURCES } from '$lib';
	import 'open-props/style';

	let { data } = $props();

	const currentSource = data?.source || 'hckrnews';

	let formElement: HTMLFormElement;

	const groupedFeeds = FEED_SOURCES.reduce(
		(acc, feed) => {
			if (!acc[feed.category]) {
				acc[feed.category] = [];
			}
			acc[feed.category].push(feed);
			return acc;
		},
		{} as Record<string, typeof FEED_SOURCES>
	);

	function formatVisitTime(timestamp: number): string {
		const date = dayjs.unix(timestamp);
		const hour = date.hour();
		const ampm = hour >= 12 ? 'p' : 'a';
		const hour12 = hour % 12 || 12;
		return `${date.format('YYYY-MM-DD')} ${hour12}:${date.format('mm')}${ampm}`;
	}

	function relativeTimeAbbrev(timestamp: number): string {
		const then = dayjs.unix(timestamp);
		const now = dayjs();

		const minutes = now.diff(then, 'minute');
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;

		const hours = now.diff(then, 'hour');
		if (hours < 24) return `${hours}h ago`;

		const days = now.diff(then, 'day');
		if (days < 30) return `${days}d ago`;

		const months = now.diff(then, 'month');
		if (months < 12) return `${months}mo ago`;

		const years = now.diff(then, 'year');
		return `${years}y ago`;
	}

	const uniqueVisits = data.recent.toReversed().filter((visit, index, arr) => {
		if (index === 0) return true;
		const current = dayjs.unix(visit);
		const prev = dayjs.unix(arr[index - 1]);
		return !current.isSame(prev, 'minute');
	});

	function autoSubmit() {
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<main>
	<div class="header-bar">
		<h1>Settings</h1>
		<noscript>
			<button type="submit" form="settings-form">Save</button>
		</noscript>
		<button
			class="js-only"
			type="button"
			onclick={() => (window.location.href = `/${currentSource}`)}
		>
			Back
		</button>
	</div>

	<form id="settings-form" method="POST" bind:this={formElement}>
		<h2>Feed Selection</h2>
		{#each Object.entries(groupedFeeds) as [category, feeds]}
			<h3>
				{category}
				{#if category === 'More Lists'}
					<span class="coming-soon">(coming soon)</span>
				{/if}
			</h3>
			<div class="radio-group-horizontal">
				{#each feeds as feed}
					<label class:disabled={!feed.available}>
						<input
							type="radio"
							name="feed"
							value={feed.id}
							checked={feed.id === currentSource}
							disabled={!feed.available}
							onchange={autoSubmit}
						/>
						{feed.name}
					</label>
				{/each}
			</div>
		{/each}

		<h2>Pages Per Load <span class="subheader">(30 items per page)</span></h2>
		<div class="radio-group-horizontal pages-grid">
			{#each [1, 2, 3, 4] as pages}
				<label>
					<input
						type="radio"
						name="pages_per_load"
						value={pages}
						checked={pages === data.pagesPerLoad}
						onchange={autoSubmit}
					/>
					{pages}
					{pages === 1 ? 'page' : 'pages'}
				</label>
			{/each}
		</div>

		<h2>Visit History</h2>
		<p>Total visits: {data.total}</p>

		<h3>Recent Visits</h3>
		{#each uniqueVisits as visit}
			{@const [date, time] = formatVisitTime(visit).split(' ')}
			{@const hourDigits = time.split(':')[0]}
			{@const needsGhost = hourDigits.length === 1}
			{@const relTime = relativeTimeAbbrev(visit)}
			<label>
				<input
					type="radio"
					name="baseline"
					value={visit}
					checked={visit === data.currentBaseline}
					onchange={autoSubmit}
				/>
				{date}
				{#if needsGhost}<span class="ghost">0</span>{/if}{time} <span class="ago">({relTime})</span>
			</label>
		{/each}

		<h3>Custom Baseline</h3>
		<label>
			<input type="radio" name="baseline" value="custom" onchange={autoSubmit} />
			<input type="datetime-local" name="custom_datetime" onchange={autoSubmit} />
		</label>
	</form>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--size-4);
	}

	.header-bar {
		position: sticky;
		top: 0;
		background-color: light-dark(#fff, #000);
		z-index: 10;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: var(--size-4) var(--size-4) var(--size-3) var(--size-4);
		margin: calc(-1 * var(--size-4)) calc(-1 * var(--size-4)) var(--size-3);
		backdrop-filter: blur(8px);
		background-color: light-dark(rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0.9));
		border-bottom: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1));
	}

	h1 {
		margin: 0;
	}

	h2 {
		margin-top: var(--size-5);
		margin-bottom: var(--size-2);
	}

	.subheader {
		font-size: var(--font-size-1);
		font-weight: var(--font-weight-2);
		color: light-dark(#666, #999);
	}

	h3 {
		margin-top: var(--size-3);
		margin-bottom: var(--size-2);
		font-size: var(--font-size-2);
		color: light-dark(#666, #999);
	}

	label {
		display: block;
		margin-bottom: var(--size-0);
		font-variant-numeric: tabular-nums;
	}

	label.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.radio-group-horizontal {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		row-gap: var(--size-1);
		column-gap: var(--size-3);
		margin-bottom: var(--size-2);
	}

	.radio-group-horizontal.pages-grid {
		grid-template-columns: repeat(4, 1fr);
	}

	.radio-group-horizontal label {
		display: inline-block;
		margin-bottom: 0;
	}

	.coming-soon {
		font-size: 0.9em;
		color: light-dark(#999, #666);
		font-style: italic;
	}

	.ago {
		display: inline-block;
		min-width: 8ch;
		text-align: right;
	}

	.ghost {
		visibility: hidden;
	}

	input[type='radio'] {
		margin-right: var(--size-2);
	}

	button {
		padding: var(--size-2) var(--size-3);
		cursor: pointer;
		border: 1px solid light-dark(#ddd, #333);
		background: light-dark(#f5f5f5, #1a1a1a);
		border-radius: 6px;
		font-size: var(--font-size-1);
		transition: all 0.15s ease;
	}

	button:hover {
		background: light-dark(#e8e8e8, #2a2a2a);
		border-color: light-dark(#bbb, #555);
	}

	.js-only {
		display: none;
	}

	:global(body:has(script)) .js-only {
		display: inline-block;
	}
</style>
