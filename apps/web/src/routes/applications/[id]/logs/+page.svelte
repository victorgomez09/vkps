<script lang="ts">
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { LogLines } from '$lib/models/log.model';

	export let data: PageDataResponse<LogLines[]>;

	const { data: logs } = data;
</script>

<div class="flex flex-col flex-1 w-full h-full">
	<div
		class="overflow-auto block p-6 bg-white border border-gray-200 rounded-md shadow w-full h-full dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="max-h-0">
			{#each logs as log, index}
				<div class="flex items-center">
					<!-- <div class="flex justify-end w-10 min-w-max p-1 border-r bg-gray-200">
						{index + 1}
					</div> -->
					<p class="whitespace-nowrap ml-2 font-normal" style={`color: ${log.color}`}>
						<b>{log.pod}</b> - {log.log}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>
