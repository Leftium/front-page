<script lang="ts">
	import { favicon } from '@leftium/logo';
	import 'sanitize.css';
	import { FEED_SOURCES } from '$lib';

	import '../app.css';

	let { children } = $props();

	const availableFeeds = FEED_SOURCES.filter((feed) => feed.available);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<wrap-page>
	{@render children?.()}

	<footer>
		<div class="footer-content">
			<div class="footer-column">
				<h3>Lists</h3>
				<ul>
					{#each availableFeeds as feed}
						<li><a href="/{feed.id}">{feed.name}</a></li>
					{/each}
				</ul>
			</div>
			<div class="footer-column">
				<h3>About</h3>
				<ul>
					<li>
						<a href="https://github.com/Leftium/front-page" target="_blank" rel="noopener"
							>github.com/Leftium/front-page</a
						>
					</li>
					<li><a href="https://leftium.com" target="_blank" rel="noopener">Leftium.com</a></li>
				</ul>
			</div>
		</div>
	</footer>
</wrap-page>

<style>
	wrap-page {
		display: block;
		box-shadow: var(--shadow-6);
	}

	@media (min-width: 42.875em) {
		wrap-page {
			border-left: 1px solid light-dark(#e6e6df, #3a3a3a);
			border-right: 1px solid light-dark(#e6e6df, #3a3a3a);
		}
	}

	footer {
		background: light-dark(#f5f5f5, #1a1a1a);
		border-top: 1px solid light-dark(#e6e6df, #3a3a3a);
		padding: var(--size-6) var(--size-4);
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--size-6);
		max-width: 1200px;
		margin: 0 auto;
	}

	footer h3 {
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
		margin-bottom: var(--size-3);
		color: light-dark(#333, #ccc);
	}

	footer ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	footer li {
		margin-bottom: var(--size-2);
	}

	footer a {
		color: light-dark(#666, #999);
		text-decoration: none;
		font-size: var(--font-size-1);
		transition: color 0.15s ease;
	}

	footer a:hover {
		color: light-dark(#ff6600, #ff9944);
		text-decoration: underline;
	}
</style>
