<script lang="ts">
	import { deploymentStore } from '$lib/stores/deployment.store';
	import { form, field, required } from 'ui';

	const name = field('name', $deploymentStore.name, [required()]);
</script>

<div class="card bg-base-200">
	<div class="card-body px-4 py-2">
		<div class="w-full">
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Name</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full max-w-xs"
					bind:value={$name.value}
				/>
				<div class="label">
					<span class="label-text-alt">Bottom Left label</span>
					<span class="label-text-alt">Bottom Right label</span>
				</div>
			</label>
		</div>
	</div>
</div>
