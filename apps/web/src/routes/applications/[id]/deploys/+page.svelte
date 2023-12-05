<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { applicationStore } from '$lib/stores/application.store';

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
	<div
		class="block p-6 bg-gray-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="font-normal text-gray-700 dark:text-gray-400">
			{#if $applicationStore.deployments.length === 0}
				<h3 class="text-abse-300">This application has no deployments yet.</h3>
			{:else}
				{#each $applicationStore.deployments as deployment}
					<div class="text-base-200">{deployment.creationDate}</div>
				{/each}
			{/if}

			<div class="mt-4">
				<button
					type="button"
					class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Deploy
				</button>
			</div>
		</div>
	</div>
</div>
