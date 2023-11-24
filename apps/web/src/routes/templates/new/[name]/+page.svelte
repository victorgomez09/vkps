<script lang="ts">
	import type { Template } from '$lib/models/template.model';

	export let data: any;

	// PAGE SETTINGS
	let selectedTab: 'config' | 'env' | 'vols' = 'config';

	// DATA
	const template: Template = data.template.data.data;
	const type: string = [...template.type.type.toLowerCase()]
		.map((char, index) => (index === 0 ? char.toUpperCase() : char))
		.join('');
	let selectedVersion: string = 'latest';

	// FUNCTIONS
	function selectTemplateVersion(version: string) {
		selectedVersion = version;
	}

	function handleSubmit() {
		console.log('template', template);
	}
</script>

<div class="flex flex-1 gap-2 w-full h-full">
	<ul class="menu bg-base-200 w-56 rounded-box gap-1">
		<li>
			<button
				type="button"
				on:click={() => (selectedTab = 'config')}
				class="px-4 py-2 cursor-pointer rounded-btn hover:bg-neutral focus:bg-neutral!"
				class:active={selectedTab === 'config'}
			>
				Configuration
			</button>
		</li>

		<li>
			<button
				type="button"
				on:click={() => (selectedTab = 'env')}
				class="px-4 py-2 cursor-pointer rounded-btn hover:bg-neutral focus:bg-neutral!"
				class:active={selectedTab === 'env'}
			>
				Env variables
			</button>
		</li>

		<li>
			<button
				type="button"
				on:click={() => (selectedTab = 'vols')}
				class="px-4 py-2 cursor-pointer rounded-btn hover:bg-neutral focus:bg-neutral!"
				class:active={selectedTab === 'vols'}
			>
				Volumes
			</button>
		</li>
	</ul>

	<div class="card shadow bg-base-200 w-full h-full">
		<div class="card-body w-full h-full overflow-auto">
			<form on:submit={handleSubmit} class="w-full h-full">
				<div class="card-title justify-between">
                    <span class="flex gap-2 items-center">
                        {template.fancyName}
                        <img src={template.icon} alt={`${template.fancyName} icon`} class="h-6 w-6">
                    </span>

                    <button class="btn btn-sm btn-primary">Save</button>
                </div>

				<div class="divider" />

				<div class="grid grid-flow-row gap-2 px-4">
					{#if selectedTab === 'config'}
						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="image" class="font-bold">Image</label>
							<input
								name="image"
								id="image"
								class="input input-bordered w-full"
								bind:value={template.image}
								required
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="type" class="font-bold">Type</label>
							<input
								name="type"
								id="type"
								class="input input-bordered w-full"
								value={type}
								disabled
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="version" class="font-bold">Version</label>
							<div class="dropdown">
								<input
									id="version"
									tabIndex={0}
									class="input input-bordered m-1 w-full justify-start"
									bind:value={selectedVersion}
								/>
								<ul
									tabIndex={0}
									class="dropdown-content bg-base-300 text-base-content rounded-box top-px h-[30vh] max-h-96 w-36 overflow-y-auto shadow mt-16 z-10 w-full"
								>
									{#each template.versions as { version }}
										<button
                                            type="button"
											class="w-full text-left p-4 hover:bg-base-200 hover:text-secondary hover:cursor-pointer"
											class:bg-base-200={selectedVersion === version}
											class:text-secondary={selectedVersion === version}
											on:click={() => selectTemplateVersion(version)}
										>
											{version}
										</button>
									{/each}
								</ul>
							</div>
						</div>
					{:else if selectedTab === 'env'}
						{#each template.env as env}
							<div class="mt-2 grid grid-cols-2 items-center">
								<label for={env.key} class="font-bold">{env.key}</label>
								<input
									name="value"
									id={env.key}
									class="input input-bordered w-full"
									bind:value={env.value}
									required
								/>
							</div>
						{/each}
					{:else}
						{#each template.volumes as volume}
							<div class="mt-2 grid grid-cols-2 gap-2 items-center">
								<input
									type="text"
									class="input input-bordered"
									placeholder="Path to mount volume"
									bind:value={volume.mount}
								/>
								<input
									name="value"
									id="value"
									class="input input-bordered w-full"
									bind:value={volume.path}
									required
								/>
							</div>
						{/each}
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
