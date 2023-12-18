<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="flex flex-1 w-full h-full">
	<Sidebar />
	<div class="flex flex-col flex-1 h-full overflow-hidden bg-base-100">
		<div class="p-4 w-full h-full">
			<slot />
		</div>
	</div>
</div>
