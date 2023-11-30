<script lang="ts">
	import type { Deployment } from '$lib/models/deployment.model';

	export let data;

	let deployments: Deployment[] = data.deployments?.data || [];
</script>

<div class="flex flex-col flex-1">
	<div class="flex items-center justify-between w-full">
		<h1 class="text-2xl font-bold">Deployments</h1>

		<button class="btn btn-sm btn-primary">+ Add</button>
	</div>

	<div class="mt-6 flex flex-col gap-2">
		{#if deployments.length > 0}
			{#each deployments as deployment}
				{console.log('deployment', deployment)}
				<div class="card w-full p-4 bg-base-300 text-base-content">
					<div class="flex items-baseline gap-4">
						<span class="font-bold text-lg">{deployment.name}</span>
						<span class="text-sm">
							{deployment.template ? deployment.template.image : 'wip'}
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
							href={`/deployments/${deployment.deploymentId}/deploy`}
							class="link link-hover text-xs">Deploy</a
						>
						<a href={`/deployments/${deployment.deploymentId}/logs`} class="link link-hover text-xs"
							>Logs</a
						>
						<a
							href={`/deployments/${deployment.deploymentId}/configuration`}
							class="link link-hover text-xs">Configuration</a
						>
						<a
							href={`/deployments/${deployment.deploymentId}/webhooks`}
							class="link link-hover text-xs">Webhooks</a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
