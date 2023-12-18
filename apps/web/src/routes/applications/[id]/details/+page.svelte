<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { applicationStore } from '$lib/stores/application.store';
	import { parseDate } from '$lib/utils/parse-date';

	// FUNCTIONS
	async function deployApplication() {
		const response = await fetch(
			`${env.PUBLIC_API_URL}/applications/deploy/${$applicationStore.applicationId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		const result = await response.json();
		console.log('result', result);
	}
</script>

<div class="flex flex-col flex-1">
	<div class="card bg-base-300">
		<div class="card-body">
			{#if $applicationStore.deployments.length === 0}
				<h3 class="text-base-content">This application has no deployments yet.</h3>

				<div class="mt-4">
					<button on:click={deployApplication} type="button" class="btn btn-secondary">
						Deploy
					</button>
				</div>
			{:else}
				<dl class="text-base-content">
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each $applicationStore.pods as pod}
							<li class="pb-3 sm:pb-4">
								<div class="flex items-center space-x-4 rtl:space-x-reverse">
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium truncate">
											{pod.metadata.name}
										</p>

										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											Namespace: {pod.metadata.namespace}
										</p>

										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											Node name: {pod.spec.nodeName}
										</p>

										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											Host IP: {pod.status.hostIP}
										</p>

										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											Pod IP: {pod.status.podIP}
										</p>

										<p class="text-sm text-gray-500 truncate dark:text-gray-400">
											Start time: {parseDate(pod.status.startTime)}
										</p>
									</div>
									<div
										class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
									>
										{#if pod.status.phase === 'Running'}
											<span class="badge badge-success">{pod.status.phase}</span>
										{:else}
											<span class="badge badge-error">{pod.status.phase}</span>
										{/if}
									</div>
								</div>
							</li>
						{/each}
					</ul>

					<!-- {#each $applicationStore.deployments as deployment}
						<div class="flex flex-col p-2">
							<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
								{parseDate(deployment.creationDate)}
							</dt>
						</div>
					{/each} -->
				</dl>
			{/if}
		</div>
	</div>
</div>
