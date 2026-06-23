<script lang="ts">
	import { resolve } from '$app/paths';
	import Plans from '$lib/icons/Plans.svelte';
	import Sim from '$lib/icons/Sim.svelte';

	let { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- Page content here -->
		<main>
			{@render children()}
		</main>
	</div>

	<div class="drawer-side is-drawer-close:overflow-visible">
		<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="flex py-4 min-h-full flex-col items-center bg-base-300 w-20">
			<ul class="menu gap-2 justify-center w-full grow">
				<li>
					<a
						href={resolve('/')}
						class="flex justify-center is-drawer-close:tooltip is-drawer-close:tooltip-right"
						data-tip="Simulador"
					>
						<Sim />
					</a>
				</li>

				<li>
					<a
						href={resolve('/planes')}
						class="flex justify-center is-drawer-close:tooltip is-drawer-close:tooltip-right"
						data-tip="Planes"
					>
						<Plans />
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
