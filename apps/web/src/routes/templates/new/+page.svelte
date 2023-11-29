<script lang="ts">
	import type { Template } from '$lib/models/template.model';
	import Explainer from '$lib/components/Explainer.svelte';

	let template: Template = {
		fancyName: '',
		name: '',
		description: '',
		icon: '',
		image: '',
		versions: [],
		type: {
			type: 'DATABASE'
		}
	};
	let versions: string = '';

	function handleSubmit() {
		console.log('template', template);
	}
</script>

<div class="flex flex-1">
	<form class="flex flex-col flex-1 w-full h-full" on:submit|preventDefault={handleSubmit}>
		<div class="flex justify-between">
			<h1 class="font-bold text-lg">New Template</h1>

			<button class="btn btn-primary btn-sm">Save</button>
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
							bind:value={template.fancyName}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="name" class="font-bold">Internal name</label>
						<input
							name="name"
							id="name"
							class="input !bg-base-200 w-full"
							value={template.fancyName.replace(/ /g, '-').toLowerCase()}
							disabled
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="template" class="font-bold">Image</label>
						<input
							name="image"
							id="image"
							class="input input-bordered w-full"
							bind:value={template.image}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<div>
							<label for="description" class="font-bold">Versions</label>
							<Explainer
								explanation="Add versions separeated bya a comma(,). Example: '1.0, 1.1, 2.4'"
							/>
						</div>
						<input type="text" class="input input-bordered" bind:value={versions} />
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="icon" class="font-bold">Icon (base64)</label>
						<input
							name="icon"
							id="icon"
							class="input input-bordered w-full"
							bind:value={template.icon}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="description" class="font-bold">Description</label>
						<textarea
							name="description"
							id="description"
							class="textarea textarea-bordered w-full"
							bind:value={template.description}
						/>
					</div>

					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="description" class="font-bold">Type</label>
						<div class="dropdown w-full">
							<div tabindex="0" role="button" class="btn w-full justify-start">
								{template.type.type}
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
