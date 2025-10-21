<script lang="ts">
	let { data } = $props();

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
	{#each data.json as item (item.id)}
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
			<d-title>{title}</d-title>
			<div>
				<d-points>{points}⇧</d-points>
				<d-comments>{comments}ⓒ</d-comments>
				<d-date>{relativeTime(date)}</d-date>
				<d-time>{relativeTime(time)}</d-time>
				<d-url>{source}<s-path>{path}</s-path></d-url>
			</div>
		</a>
	{/each}

	<pre>{JSON.stringify(data.json, null, 4)}</pre>
</main>
