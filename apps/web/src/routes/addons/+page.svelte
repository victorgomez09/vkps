<script lang="ts">
	import type { Addon } from '$lib/models/addon.model';
	import type { PageDataResponse } from '$lib/models/api.model';

	export let data: PageDataResponse<Addon[]>;

	const { data: addons } = data;
	console.log('addons', addons);
</script>

<div class="flex-col justify-center">
	<div class="flex flex-col">
		<div class="flex justify-between">
			<h1 class="text-2xl font-bold">Addons</h1>
			<a href="/addons/new" class="btn btn-primary btn-sm">+ Add</a>
		</div>
		<div
			class="grid grid-flow-rows grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4"
		>
			{#each addons as addon}
				<a
					href={`/addons/deploy/${addon.name}`}
					class="card shadow bg-base-300 text-base-content hover:scale-105"
				>
					<div class="card-body p-4">
						<div class="flex flex-col items-center">
							<div class="flex flex-1 items-center gap-2">
								<img src={addon.icon} alt={`${addon.name} icon`} class="h-10 w-10" />
								<h1 class="font-bold text-xl">{addon.fancyName}</h1>
							</div>
							<p class="mt-2 text-sm font-thin text-ellipsis text-center">{addon.description}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
