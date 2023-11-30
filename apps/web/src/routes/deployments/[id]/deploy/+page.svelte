<script lang="ts">
	import type { Deployment } from '$lib/models/deployment.model';

	export let deployment: Deployment;
	export let data: any;

	console.log('deployment', deployment);
	console.log('data from deploy page', data);
</script>

<div class="card bg-base-200">
	<div class="card-body px-4 py-2">
		<div class="w-full">
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Name</span>
				</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
				<div class="label">
					<span class="label-text-alt">Bottom Left label</span>
					<span class="label-text-alt">Bottom Right label</span>
				</div>
			</label>
		</div>
	</div>
</div>
