<script lang="ts">
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { LogLines } from '$lib/models/log.model';

	export let data: PageDataResponse<LogLines[]>;

	const { data: logs } = data;
</script>

<div class="flex flex-col flex-1 w-full h-full">
	<div class="mockup-code">
		{#each logs as log, index}
			<pre data-prefix={index + 1} style={`color: ${log.color}`}><code>{log.log}</code></pre>
		{/each}
	</div>
</div>
