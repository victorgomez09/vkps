<script lang="ts">
	import '../app.css';
</script>

<div class="flex flex-1 h-full">
	<div class="bg-base-300 w-[16em]" />

	<div class="flex flex-col px-4 py-2 w-full h-full bg-base-100">
		<slot />
	</div>
</div>
