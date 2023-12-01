<script lang="ts">
	import { field, form, required } from 'ui';
	import Explainer from '$lib/components/Explainer.svelte';

	const fancyName = field('name', '', [required()]);
	const name = field('name', '');
	const description = field('description', '');
	const icon = field('icon', '', [required()]);
	const image = field('image', '', [required()]);
	const version = field('version', '', [required()]);
	const type = field('type', 'DATABASE', [required()]);
	const templateForm = form(fancyName, name, description, icon, image, version, type);

	function handleSubmit() {
		console.log('submit');
	}
</script>

<div class="flex flex-1">
	<form class="flex flex-col flex-1 w-full h-full" on:submit|preventDefault={handleSubmit}>
		<div class="flex justify-between">
			<h1 class="font-bold text-lg">New Template</h1>

			<button type="submit" class="btn btn-primary btn-sm" disabled={!$templateForm.valid}
				>Save</button
			>
		</div>
		<div class="card flex-1 bg-base-300 w-full overflow-auto mt-4">
			<div class="card-body h-full max-h-0">
				<div class="flex flex-col gap-2">
					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="fancyName" class="font-bold">Template name</label>
						<input
							name="fancyName"
							id="fancyName"
							class="input input-bordered w-full"
							bind:value={$name.value}
						/>
						{#if $name.dirty && $name.invalid}
							<div class="label">
								<span class="label-text-error">{$name.errors}</span>
							</div>
						{/if}
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="name" class="font-bold">Internal name</label>
						<input
							name="name"
							id="name"
							class="input !bg-base-200 w-full"
							value={$fancyName.value.replace(/ /g, '-').toLowerCase()}
							disabled
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="template" class="font-bold">Image</label>
						<input
							name="image"
							id="image"
							class="input input-bordered w-full"
							bind:value={$image.value}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<div>
							<label for="description" class="font-bold">Versions</label>
							<Explainer
								explanation="Add versions separeated bya a comma(,). Example: '1.0, 1.1, 2.4'"
							/>
						</div>
						<input type="text" class="input input-bordered" bind:value={$version.value} />
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="icon" class="font-bold">Icon (base64)</label>
						<input
							name="icon"
							id="icon"
							class="input input-bordered w-full"
							bind:value={$icon.value}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="description" class="font-bold">Description</label>
						<textarea
							name="description"
							id="description"
							class="textarea textarea-bordered w-full"
							bind:value={$description.value}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="description" class="font-bold">Type</label>
						<div class="dropdown w-full">
							<div tabindex="0" role="button" class="btn w-full justify-start">
								{$type.value}
							</div>
							<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-full rounded-box">
								<li><span class="p-2 hover:bg-base-200">DATABASE</span></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
