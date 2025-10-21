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

		return rtf.format(value, unit);
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

		<a href={link}>
			<d-title>{index+1}. {title}</d-title>
			<d-metadata>
				<s-points>{points}⇧</s-points>
				<s-comments>{comments}ⓒ</s-comments>
				<s-date>{relativeTime(date)}</s-date>
				<s-time>{relativeTime(time)}</s-time>
				<s-url>{source}<s-path>{path}</s-path></s-url>
			</d-metadata>
		</a>
	{/each}

	<pre>{JSON.stringify(data.json, null, 4)}</pre>
</main>

<style>
	a {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	d-title {
		display: block;
		line-height: 1.2;
	}

	d-metadata {
		display: flex;
		gap: 0.5ch;
		margin-bottom: var(--size-2);
		font-size: var(--font-size-0);
	}

	s-points,
	s-comments,
	s-date,
	s-time {
		white-space: nowrap;
	}

	s-url {
		text-decoration: underline;
		color: var(--url-color);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;

		&:hover {
			color: var(--url-hover-color);
		}
	}

	a:visited s-url {
		color: var(--url-visited-color);
	}

	s-path {
		opacity: 0.6;

		&:hover {
			opacity: 1;
		}
	}

	:root {
		--url-color: light-dark(#0645ad, #4da3ff);
		--url-visited-color: light-dark(#0b0080, #a58cff);
		--url-hover-color: light-dark(#3366cc, #80c0ff);
	}
</style>
