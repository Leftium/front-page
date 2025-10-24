<script lang="ts">
	import { FEED_SOURCES } from '$lib';

	let { data } = $props();

	const currentSource = data?.source || 'hckrnews';

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
</script>

<main>
	<h1>Select Feed</h1>

	<form method="GET" action="/">
		{#each Object.entries(groupedFeeds) as [category, feeds]}
			<h2>{category}</h2>
			{#each feeds as feed}
				<label class:disabled={!feed.available}>
					<input
						type="radio"
						name="feed"
						value={feed.id}
						checked={feed.id === currentSource}
						disabled={!feed.available}
						onchange={(e) => {
							const target = e.currentTarget as HTMLInputElement;
							window.location.href = `/${target.value}`;
						}}
					/>
					{feed.name}
					{#if !feed.available}
						<span class="coming-soon">(coming soon)</span>
					{/if}
				</label>
			{/each}
		{/each}
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
		font-size: var(--font-size-2);
		color: light-dark(#666, #999);
	}

	label {
		display: block;
		margin-bottom: var(--size-1);
		cursor: pointer;
	}

	label.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.coming-soon {
		font-size: 0.9em;
		color: light-dark(#999, #666);
		font-style: italic;
	}

	input[type='radio'] {
		margin-right: var(--size-2);
	}
</style>
