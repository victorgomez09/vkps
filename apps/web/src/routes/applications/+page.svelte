<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { Application } from '$lib/models/application.model.js';

	export let data: PageDataResponse<Application[]>;

	const { data: applications } = data;
</script>

<div class="flex flex-col flex-1">
	<div class="flex items-center justify-between w-full">
		<h1 class="text-2xl font-bold">Deployments</h1>

		<button on:click={() => goto('/applications/new')} type="button" class="btn btn-sm btn-primary">
			+ Add
		</button>
	</div>

	<div class="mt-6 flex flex-col gap-2">
		{#if applications.length > 0}
			{#each applications as application}
				<div class="card w-full p-4 shadow bg-base-300 text-base-content">
					<div class="flex items-baseline gap-4">
						<a
							href={`/applications/${application.applicationId}/configuration`}
							class="font-bold text-lg">{application.name}</a
						>
						<span class="text-sm">
							{application.addon ? application.addon.image : application.image}
						</span>

						<div class="flex items-center self-center gap-1">
							<span
								class:badge-success={application.workingReplicas === application.totalReplicas &&
									application.workingReplicas !== 0 &&
									application.totalReplicas !== 0}
								class:badge-error={application.workingReplicas !== application.totalReplicas ||
									application.workingReplicas === 0 ||
									application.totalReplicas === 0}
								class="indicator-item badge badge-sm"
							/>
							<span
								class:text-success={application.workingReplicas === application.totalReplicas &&
									application.workingReplicas !== 0 &&
									application.totalReplicas !== 0}
								class:text-error={application.workingReplicas !== application.totalReplicas ||
									application.workingReplicas === 0 ||
									application.totalReplicas === 0}
							>
								{application.workingReplicas}/{application.totalReplicas}
								{#if application.totalReplicas === 0}
									Shutdown
								{/if}
							</span>
						</div>
					</div>

					<div class="flex items-center flex-wrap gap-4 mt-2">
						<a
							href={`/applications/${application.applicationId}/details`}
							class="link link-hover text-xs">Details</a
						>
						<a
							href={`/applications/${application.applicationId}/logs`}
							class="link link-hover text-xs">Logs</a
						>
						<a
							href={`/applications/${application.applicationId}/configuration`}
							class="link link-hover text-xs">Configuration</a
						>
						<a
							href={`/applications/${application.applicationId}/webhooks`}
							class="link link-hover text-xs">Webhooks</a
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
