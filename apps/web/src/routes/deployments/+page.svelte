<script lang="ts">
	import type { ApiResponse } from '$lib/models/api.model';
	import type { Deployment } from '$lib/models/deployment.model';

	export let data: ApiResponse<Deployment[]>;

	let deployments: Deployment[] = data.data!;
</script>

<div class="flex flex-col flex-1">
	<h1 class="text-2xl font-bold">Deployments</h1>

	<div
		class="grid grid-flow-rows grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4"
	>
		{#if deployments && deployments.length === 0}
			{#each deployments as deployment}
				<div class="card shadow bg-base-200 text-base-content hover:scale-105">
					<div class="card-body p-4">
						<h1 class="card-title">{deployment.name}</h1>
						<p class="mt-2 text-sm font-thin text-ellipsis text-center">{deployment.description}</p>

						<div class="flex items-center">
							<span class="font-bold">Replicas: {deployment.replicas}</span>
							<div class="divider divider-horizontal" />
							<span class="font-bold">Cpu: {deployment.cpu}</span>
							<span class="font-bold">Memory: {deployment.memory}</span>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div>No deployments found.</div>
		{/if}
	</div>
</div>
