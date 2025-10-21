<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import 'sanitize.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
	/* based on: https://www.swyx.io/css-100-bytes, https://thecascade.dev/article/least-amount-of-css */
	:global(html) {
		max-width: min(42.875em, 100% - 1em);
		margin: auto;

		font-family: system-ui;
	}
</style>
