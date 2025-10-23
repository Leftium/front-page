<script lang="ts">
	let { data } = $props();
	import 'open-props/style';
	import dayjs from 'dayjs';

	function relativeTime(time: number | string): string {
		const num = typeof time === 'string' ? parseInt(time, 10) : time;
		const timestamp = num < 1e12 ? num * 1000 : num;

		const then = dayjs(timestamp);
		const now = dayjs();

		const minutes = now.diff(then, 'minute');
		if (minutes < 60) return `${minutes}m`;

		const hours = now.diff(then, 'hour');
		if (hours < 24) return `${hours}h`;

		const days = now.diff(then, 'day');
		if (days < 90) return `${days}d`;

		const months = now.diff(then, 'month');
		if (months < 12) return `${months}mo`;

		const years = now.diff(then, 'year');
		return `${years}y`;
	}

	function timeDelta(time1: number, time2: number): string {
		const then = dayjs.unix(time1);
		const later = dayjs.unix(time2);

		const seconds = later.diff(then, 'second');
		if (seconds < 60) return `${seconds}s`;

		const minutes = later.diff(then, 'minute');
		if (minutes < 60) return `${minutes}m`;

		const hours = later.diff(then, 'hour');
		if (hours < 24) return `${hours}h`;

		const days = later.diff(then, 'day');
		return `${days}d`;
	}

	function formatVisitTime(timestamp: number): string {
		const date = dayjs.unix(timestamp);
		const hour = date.hour();
		const ampm = hour >= 12 ? 'p' : 'a';
		const hour12 = hour % 12 || 12;
		return `${date.format('YYYY-MM-DD')} ${hour12}:${date.format('mm')}${ampm}`;
	}

	function relativeTimeVerbose(timestamp: number): string {
		const then = dayjs.unix(timestamp);
		const now = dayjs();

		const minutes = now.diff(then, 'minute');
		if (minutes < 1) return 'just now';
		if (minutes === 1) return '1 minute ago';
		if (minutes < 60) return `${minutes} minutes ago`;

		const hours = now.diff(then, 'hour');
		if (hours === 1) return '1 hour ago';
		if (hours < 24) return `${hours} hours ago`;

		const days = now.diff(then, 'day');
		if (days === 1) return '1 day ago';
		if (days < 30) return `${days} days ago`;

		const months = now.diff(then, 'month');
		if (months === 1) return '1 month ago';
		if (months < 12) return `${months} months ago`;

		const years = now.diff(then, 'year');
		if (years === 1) return '1 year ago';
		return `${years} years ago`;
	}
</script>

{#snippet upvote()}
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14"
		/>
	</svg>
{/snippet}

{#snippet message()}
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M20 2H4c-1.103 0-2 .894-2 1.992v12.016C2 17.106 2.897 18 4 18h3v4l6.351-4H20c1.103 0 2-.894 2-1.992V3.992A2 2 0 0 0 20 2"
		/>
	</svg>
{/snippet}

<main>
	{#if data.visitData}
		<d-item class="visit-info">
			<a href="/hckrnews">
				{#if data.visitData.lastVisit}
					<d-title title={formatVisitTime(data.visitData.lastVisit)}
						>Last visit: {relativeTimeVerbose(data.visitData.lastVisit)}</d-title
					>
				{:else}
					<d-title>Last visit: First visit!</d-title>
				{/if}
				<d-metadata>
					<s-url>Total visits: {data.visitData.total}</s-url>
				</d-metadata>
			</a>
			<s-scroll class="new"></s-scroll>
		</d-item>
	{/if}

	{#each data.json as item, index (item.id)}
		{@const id = item.id}
		{@const dead = item.dead}
		{@const title = dead ? 'DEAD' : item.link_text}

		{@const points = item.points}
		{@const comments = item.comments || 0}
		{@const time = item.time}
		{@const date = item.date}
		{@const dateDiffHours = dayjs.unix(date).diff(dayjs.unix(time), 'hour')}

		{@const link = dead
			? `https://news.ycombinator.com/item?id=${id}`
			: `https://hw.leftium.com/#/item/${id}`}
		{@const source = item.source?.replace(/^(www.)?/, '')}
		{@const path = item.link
			?.replace(/^https:\/\/(www.)?/, '')
			.replace(source, '')
			.replace(/\/$/, '')}

		{@const isNew = data.visitData?.lastVisit && date > data.visitData.lastVisit}

		<d-item>
			<a href={link}>
				<d-title class:dead>{title}</d-title>
				<d-metadata>
					<s-points class:high={points >= 100} class:mid={points >= 50 && points < 100}
						>{points} {@render upvote()}</s-points
					>
					<s-comments class:high={comments >= 100} class:mid={comments >= 50 && comments < 100}
						>{dead ? '?' : comments} {@render message()}</s-comments
					>
					<s-time>{relativeTime(time)}</s-time>
					<s-date class:muted={dateDiffHours < 24} class:highlighted={dateDiffHours >= 24}
						>+{timeDelta(time, date)}</s-date
					>
					<s-url>{source}<s-path>{path}</s-path></s-url>
				</d-metadata>
			</a>
			<s-scroll
				class:new={isNew}
				onclick={(e: MouseEvent) => {
					e.preventDefault();
					const target = e.currentTarget as HTMLElement;
					target.previousElementSibling?.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}}
			>
				<s-index>{index + 1}</s-index>
			</s-scroll>
		</d-item>
	{/each}

	<d-item class="more-link">
		<a href="/hckrnews/{data.previousDate}">
			<d-metadata>
				<s-url>More... {data.previousDate}</s-url>
			</d-metadata>
		</a>
		<s-scroll></s-scroll>
	</d-item>

	<pre hidden>{JSON.stringify(data.json, null, 4)}</pre>
</main>

<style>
	main {
		box-shadow: var(--shadow-6);
	}

	d-item {
		display: grid;
		grid-template-columns: 1fr 3.5ch;
		background: light-dark(#ffffff, #262626);
		border-top: 1px solid light-dark(#e6e6df, #3a3a3a);

		&:first-child {
			border-top: none;
		}

		&:hover {
			background: light-dark(rgb(245, 245, 245), #2d2d2d);
		}

		&.more-link a {
			min-height: 3.5em;
			align-items: center;
		}

		&.more-link d-metadata {
			justify-content: center;
			padding: var(--size-2);
			font-size: inherit;
			font-weight: var(--font-weight-4);
		}

		&.more-link s-url {
			text-align: center;
		}
	}

	a {
		display: grid;
		grid-column: 1;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}

	d-title {
		display: flex;
		padding: var(--size-2) var(--size-2) 0;
		color: light-dark(#222222, #e5e5e5);
		font-weight: var(--font-weight-4);
		line-height: 1.2;
		align-items: baseline;

		&.dead {
			opacity: 0.3;
		}
	}

	d-metadata {
		display: flex;
		min-width: 0;
		gap: 0.5ch;
		padding: 0 var(--size-2) var(--size-2);
		color: light-dark(#222222, #e5e5e5);
		font-size: 15px;
		font-weight: var(--font-weight-2);
	}

	s-points {
		display: flex;
		gap: 0.25ch;
		width: 5.25ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
		align-items: center;
		justify-content: flex-end;

		svg {
			width: 1em;
			height: 1em;
			flex-shrink: 0;
			opacity: 0.2;
		}

		&.mid {
			svg {
				color: #ff6600;
				opacity: 0.8;
			}
		}

		&.high {
			color: #ff6600;
			font-weight: var(--font-weight-4);

			svg {
				opacity: 1;
			}
		}
	}

	s-comments {
		display: flex;
		gap: 0.25ch;
		width: 6.25ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
		align-items: center;
		justify-content: flex-end;

		svg {
			width: 1em;
			height: 1em;
			flex-shrink: 0;
			opacity: 0.2;
		}

		&.mid {
			svg {
				color: #ff6600;
				opacity: 0.8;
			}
		}

		&.high {
			color: #ff6600;
			font-weight: var(--font-weight-4);

			svg {
				opacity: 1;
			}
		}
	}

	s-date {
		width: 4ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;

		&.muted {
			opacity: 0.2;
		}

		&.highlighted {
			color: #ff6600;
			opacity: 0.8;
		}
	}

	s-time {
		width: 4ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
	}

	s-url {
		min-width: 0;
		overflow: hidden;
		color: var(--url-color);
		font-weight: var(--font-weight-4);
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	s-path {
		opacity: 0.6;
	}

	s-scroll {
		display: flex;
		grid-column: 2;
		grid-row: 1 / 3;
		padding: var(--size-2);
		background: light-dark(rgb(245, 245, 245), #2f2f2f);
		border-right: 1px solid light-dark(#e6e6df, #3a3a3a);
		cursor: pointer;
		align-self: stretch;
		align-items: baseline;
		justify-content: flex-end;

		&:hover {
			background: light-dark(rgb(235, 235, 235), #3a3a3a);
		}

		&.new s-index {
			color: #ff6600;
			opacity: 1;
		}
	}

	s-index {
		opacity: 0.6;
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}

	a:visited s-url {
		color: var(--url-visited-color);
	}

	a:hover s-url {
		color: var(--url-hover-color);
		text-decoration: underline;
	}

	a:hover s-path {
		opacity: 1;
	}

	@media (min-width: 42.875em) {
		d-item {
			border-left: 1px solid light-dark(#e6e6df, #3a3a3a);
		}

		s-scroll {
			border-right: 1px solid light-dark(#e6e6df, #3a3a3a);
		}
	}

	:root {
		--url-color: light-dark(#0645ad, #4da3ff);
		--url-visited-color: light-dark(#0b0080, #9370db);
		--url-hover-color: light-dark(#0645ad, #6db3ff);
	}
</style>
