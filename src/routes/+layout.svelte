<script lang="ts">
	import { favicon } from '@leftium/logo';
	import 'sanitize.css';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<wrap-page>
	{@render children?.()}
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
</style>
