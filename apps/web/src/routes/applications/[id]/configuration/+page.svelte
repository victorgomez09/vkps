<script lang="ts">
	import { deploymentStore } from '$lib/stores/deployment.store';
	import { form, field, required } from 'ui';

	const name = field('name', $deploymentStore.name, [required()]);
</script>

<div class="flex flex-col flex-1">
	<!-- CARD NAME -->
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

	<!-- CARD  -->
	<div class="collapse collapse-arrow bg-base-200">
		<input type="radio" name="my-accordion-2" checked="checked" />
		<div class="collapse-title text-xl font-medium">Environment variables</div>
		<div class="collapse-content">content</div>
	</div>
	<div class="collapse collapse-arrow bg-base-200">
		<input type="radio" name="my-accordion-2" />
		<div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
		<div class="collapse-content">
			<p>hello</p>
		</div>
	</div>
</div>
