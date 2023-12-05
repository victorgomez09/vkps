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

		<button
			on:click={() => goto('/applications/new')}
			type="button"
			class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>+ Add</button
		>
	</div>

	<div class="mt-6 flex flex-col gap-2">
		{#if applications.length > 0}
			{#each applications as application}
				<div
					class="block p-6 rounded-md shadow w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
				>
					<div class="flex items-center mb-2 gap-3">
						<h5 class="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
							{application.name}
						</h5>

						<span class="text-sm">
							{application.addon ? application.addon.image : application.image}
						</span>

						<span
							class:text-red-500={application.workingReplicas !== application.totalReplicas ||
								application.workingReplicas === 0 ||
								application.totalReplicas === 0}
							class:text-green-500={application.workingReplicas === application.totalReplicas &&
								application.workingReplicas !== 0 &&
								application.totalReplicas !== 0}
							class="inline-flex items-center text-xs font-medium py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
						>
							<span
								class:bg-red-500={application.workingReplicas !== application.totalReplicas ||
									application.workingReplicas === 0 ||
									application.totalReplicas === 0}
								class:bg-green-500={application.workingReplicas === application.totalReplicas &&
									application.workingReplicas !== 0 &&
									application.totalReplicas !== 0}
								class="w-3 h-3 me-1 rounded-full"
							/>
							{#if application.totalReplicas === 0}
								Unavailable
							{:else}
								{application.workingReplicas}/{application.totalReplicas}
							{/if}
						</span>

						<span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
							<span class="flex w-3 h-3 rounded-full me-1.5 flex-shrink-0" />
						</span>
					</div>
					<div
						class="flex items-center gap-3 text-sm mt-4 font-light text-gray-600 dark:text-gray-400"
					>
						<a
							href={`/applications/${application.applicationId}/deploy`}
							class="font-medium hover:underline"
						>
							Deploys
						</a>

						<a
							href={`/applications/${application.applicationId}/logs`}
							class="font-medium hover:underline"
						>
							Logs
						</a>

						<a
							href={`/applications/${application.applicationId}/configuration`}
							class="font-medium hover:underline"
						>
							Configuration
						</a>

						<a
							href={`/applications/${application.applicationId}/webhooks`}
							class="font-medium hover:underline"
						>
							Webhooks
						</a>
					</div>
				</div>
				<!-- <div class="card w-full p-4 shadow bg-base-300 text-base-content">
					<div class="flex items-baseline gap-4">
						<a href={`/applications/${application.applicationId}/configuration`} class="font-bold text-lg">{application.name}</a>
						<span class="text-sm">
							{application.addon ? application.addon.image : application.image}
						</span>

						<div class="flex items-center self-center gap-1">
							<span
								class:badge-success={application.workingReplicas === application.totalReplicas && application.workingReplicas !== 0 && application.totalReplicas !== 0}
								class:badge-error={application.workingReplicas !== application.totalReplicas || application.workingReplicas === 0 || application.totalReplicas === 0}
								class="indicator-item badge badge-sm"
							/>
							<span
							class:text-success={application.workingReplicas === application.totalReplicas && application.workingReplicas !== 0 && application.totalReplicas !== 0}
							class:text-error={application.workingReplicas !== application.totalReplicas || application.workingReplicas === 0 || application.totalReplicas === 0}
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
							href={`/applications/${application.applicationId}/deploy`}
							class="link link-hover text-xs">Deploy</a
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
				</div> -->
			{/each}
		{/if}
	</div>
</div>
