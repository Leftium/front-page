<script lang="ts">
	let { data } = $props();
	import 'open-props/style';

	function relativeTime(time: number | string, locale: string = 'en'): string {
		// Ensure we’re working with a number
		const num = typeof time === 'string' ? parseInt(time, 10) : time;

		// Convert seconds → ms if it looks like a Unix timestamp
		const timestamp = num < 1e12 ? num * 1000 : num;
		const now = Date.now();
		const diff = timestamp - now;

		const rtf = new Intl.RelativeTimeFormat(locale, {
			style: 'narrow',
			numeric: 'always'
		});

		const seconds = Math.round(diff / 1000);

		const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
			[60, 'second'],
			[60, 'minute'],
			[24, 'hour'],
			[7, 'day'],
			//[4.34524, 'week'],
			[12, 'month'],
			[Number.POSITIVE_INFINITY, 'year']
		];

		let unit: Intl.RelativeTimeFormatUnit = 'second';
		let value = seconds;

		for (const [amount, nextUnit] of divisions) {
			if (Math.abs(value) < amount) {
				unit = nextUnit;
				break;
			}
			value = Math.round(value / amount);
			unit = nextUnit;
		}

		return rtf.format(value, unit).replace(/ ago$/, '');
	}

	// Example usage:
	console.log(relativeTime(1761010143)); // e.g. "in 1y" or "3m ago" depending on current date
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
	{#each data.json as item, index (item.id)}
		{@const id = item.id}
		{@const dead = item.dead}
		{@const title = dead ? 'DEAD' : item.link_text}

		{@const points = item.points}
		{@const comments = item.comments || 0}
		{@const time = item.time}
		{@const date = item.date}
		{@const timeDiffHours = Math.abs((date - time) / 3600)}
		{@const showTime = timeDiffHours >= 24}

		{@const link = dead
			? `https://news.ycombinator.com/item?id=${id}`
			: `https://hw.leftium.com/#/item/${id}`}
		{@const source = item.source?.replace(/^(www.)?/, '')}
		{@const path = item.link
			?.replace(/^https:\/\/(www.)?/, '')
			.replace(source, '')
			.replace(/\/$/, '')}

		<d-item>
			<a href={link}>
				<d-title class:dead>{title}</d-title>
				<d-metadata>
					<s-points class:high={points >= 100} class:mid={points >= 50 && points < 100}
						>{points} {@render upvote()}</s-points
					>
					<s-comments class:high={comments >= 100} class:mid={comments >= 50 && comments < 100}
						>{comments} {@render message()}</s-comments
					>
					<s-date>{relativeTime(date)}</s-date>
					{#if showTime}
						<s-time>{relativeTime(time)}</s-time>
					{/if}
					<s-url>{source}<s-path>{path}</s-path></s-url>
				</d-metadata>
			</a>
			<s-scroll
				onclick={(e) => {
					e.preventDefault();
					e.currentTarget.previousElementSibling?.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}}
			>
				<s-index>{index + 1}</s-index>
			</s-scroll>
		</d-item>
	{/each}

	<pre hidden>{JSON.stringify(data.json, null, 4)}</pre>
</main>

<style>
	d-item {
		display: grid;
		grid-template-columns: 1fr 3.5ch;
		background: light-dark(#ffffff, #262626);
		border-top: 1px solid light-dark(#e6e6df, #3a3a3a);

		&:first-child {
			border-top: none;
		}

		&:hover {
			background: light-dark(#f5f5f0, #2d2d2d);
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
	}

	s-time {
		width: 4ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		font-style: italic;
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
		background: light-dark(#f5f5f0, #2f2f2f);
		border-right: 1px solid light-dark(#e6e6df, #3a3a3a);
		cursor: pointer;
		align-self: stretch;
		align-items: baseline;
		justify-content: flex-end;

		&:hover {
			background: light-dark(#ebebdf, #3a3a3a);
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
