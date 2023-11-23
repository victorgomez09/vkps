<script lang="ts">
	export let data;

	const templates = data.templates.data;
</script>

<div class="flex-col justify-center">
	<div class="flex flex-col">
		<div class="grid grid-flow-rows grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{#each templates.data as template}
				<div class="card shadow bg-base-200 text-base-content">
					<div class="card-body p-4">
						<div>
							<h1 class="font-bold text-xl">{template.fancyName}</h1>
							<p class="mt-2 text-sm truncate">{template.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
