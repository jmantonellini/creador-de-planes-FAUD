<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { initializeDefaultPlan } from '$lib/stores/planesStore.svelte';
	import SideBar from '$lib/components/layouts/SideBar.svelte';
	initializeDefaultPlan();

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex flex-col min-h-screen bg-base-100">
	<SideBar>{@render children()}</SideBar>
</div>
