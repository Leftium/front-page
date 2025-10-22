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

<main>
	{#each data.json as item, index (item.id)}
		{@const id = item.id}
		{@const dead = item.dead}
		{@const title = dead ? `DEAD` : item.link_text}

		{@const points = item.points}
		{@const comments = item.comments || 0}
		{@const time = item.time}
		{@const date = item.date}

		{@const link = `https://hw.leftium.com/#/item/${id}`}
		{@const source = item.source?.replace(/^(www.)?/, '')}
		{@const path = item.link
			?.replace(/^https:\/\/(www.)?/, '')
			.replace(source, '')
			.replace(/\/$/, '')}

		<d-item>
			<a href={link}>
				<d-title>{title}</d-title>
				<d-metadata>
					<s-points>{points}⇧</s-points>
					<s-comments>{comments}ⓒ</s-comments>
					<s-date>{relativeTime(date)}</s-date>
					<s-time hidden>{relativeTime(time)}</s-time>
					<s-url>{source}<s-path>{path}</s-path></s-url>
				</d-metadata>
			</a>
			<s-scroll
				role="button"
				tabindex="0"
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
	}

	d-metadata {
		display: flex;
		min-width: 0;
		gap: 0.5ch;
		padding: 0 var(--size-2) var(--size-2);
		font-size: 15px;
		font-weight: var(--font-weight-2);
	}

	s-points,
	s-comments {
		width: 4ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
	}

	s-date {
		width: 4ch;
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
	}

	s-time {
		flex-shrink: 0;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	s-url {
		min-width: 0;
		overflow: hidden;
		color: var(--url-color);
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
		--url-visited-color: light-dark(#0b0080, #a58cff);
		--url-hover-color: light-dark(#3366cc, #80c0ff);
	}
</style>
