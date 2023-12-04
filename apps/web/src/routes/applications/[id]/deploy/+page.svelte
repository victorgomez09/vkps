<script lang="ts">
	import { applicationStore } from '$lib/stores/application.store';
</script>

<div class="flex flex-col flex-1">
	<!-- CARD NAME -->
	<div class="card bg-base-200">
		<div class="card-body px-4 py-2">
			{#if $applicationStore.deployments.length === 0}
				<h3 class="text-abse-300">This application has no deployments yet.</h3>
			{:else}
				{#each $applicationStore.deployments as deployment}
					<div class="text-base-200">{deployment.creationDate}</div>
				{/each}
			{/if}

			<div class="mt-4">
				<button class="btn btn-secondary">Deploy</button>
			</div>
		</div>
	</div>
</div>
