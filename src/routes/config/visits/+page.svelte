<script lang="ts">
	import dayjs from 'dayjs';

	let { data } = $props();

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
</script>

<main>
	<h1>Visit History</h1>

	<p>Total visits: {data.total}</p>

	<form method="POST">
		<h2>Recent Visits</h2>
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
				/>
				{date}
				{#if needsGhost}<span class="ghost">0</span>{/if}{time} <span class="ago">({relTime})</span>
			</label>
		{/each}

		<h2>Custom Baseline</h2>
		<label>
			<input type="radio" name="baseline" value="custom" />
			<input type="datetime-local" name="custom_datetime" />
		</label>

		<button type="submit">Save</button>
	</form>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--size-4);
	}

	h1 {
		margin-bottom: var(--size-4);
	}

	h2 {
		margin-top: var(--size-4);
		margin-bottom: var(--size-2);
	}

	label {
		display: block;
		margin-bottom: var(--size-1);
		font-variant-numeric: tabular-nums;
	}

	.ago {
		display: inline-block;
		min-width: 8ch;
		text-align: right;
	}

	.ghost {
		visibility: hidden;
	}

	button {
		margin-top: var(--size-4);
		padding: var(--size-2) var(--size-4);
	}
</style>
