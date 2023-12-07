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
	<div class="block p-4 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
		<div class="font-normal text-gray-700 dark:text-gray-400">
			{#if $applicationStore.deployments.length === 0}
				<h3 class="text-abse-300">This application has no deployments yet.</h3>
			{:else}
				<dl
					class="w-full text-gray-900 divide-y divide-gray-300 dark:text-white dark:divide-gray-700"
				>
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each $applicationStore.pods as pod}
							<li class="pb-3 sm:pb-4">
								<div class="flex items-center space-x-4 rtl:space-x-reverse">
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
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
											<span
												class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
												>{pod.status.phase}</span
											>
										{:else}
											<span
												class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
												>{pod.status.phase}</span
											>
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

			<!-- <div class="mt-4">
				<button
					on:click={deployApplication}
					type="button"
					class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Deploy
				</button>
			</div> -->
		</div>
	</div>
</div>
