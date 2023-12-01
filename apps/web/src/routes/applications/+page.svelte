<script lang="ts">
	import type { Application } from '$lib/models/application.model.js';

	export let data;

	let deployments: Application[] = data.deployments?.data || [];
</script>

<div class="flex flex-col flex-1">
	<div class="flex items-center justify-between w-full">
		<h1 class="text-2xl font-bold">Deployments</h1>

		<a href="/applications/new" role="button" class="btn btn-sm btn-primary">+ Add</a>
	</div>

	<div class="mt-6 flex flex-col gap-2">
		{#if deployments.length > 0}
			{#each deployments as deployment}
				{console.log('deployment', deployment)}
				<div class="card w-full p-4 bg-base-300 text-base-content">
					<div class="flex items-baseline gap-4">
						<span class="font-bold text-lg">{deployment.name}</span>
						<span class="text-sm">
							{deployment.addon ? deployment.addon.image : 'wip'}
						</span>

						<div class="flex items-center self-center gap-1">
							<span
								class:badge-success={deployment.workingReplicas === deployment.totalReplicas}
								class:badge-error={deployment.workingReplicas !== deployment.totalReplicas}
								class="indicator-item badge badge-sm"
							/>
							<span
								class:text-success={deployment.workingReplicas === deployment.totalReplicas}
								class:text-error={deployment.workingReplicas !== deployment.totalReplicas}
							>
								{deployment.workingReplicas}/{deployment.totalReplicas}
							</span>
						</div>
					</div>

					<div class="flex items-center flex-wrap gap-4 mt-2">
						<a
							href={`/applications/${deployment.applicationId}/logs`}
							class="link link-hover text-xs">Logs</a
						>
						<a
							href={`/applications/${deployment.applicationId}/configuration`}
							class="link link-hover text-xs">Configuration</a
						>
						<a
							href={`/applications/${deployment.applicationId}/webhooks`}
							class="link link-hover text-xs">Webhooks</a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
