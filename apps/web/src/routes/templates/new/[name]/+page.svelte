<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { Template, TemplateEnv } from '$lib/models/template.model';
	import { randomName } from '$lib/name-generator';

	export let data: any;

	// PAGE SETTINGS
	let selectedTab: 'config' | 'env' | 'vols' = 'config';

	// DATA
	const template: Template = data.template.data.data;
	const type: string = [...template.type.type.toLowerCase()]
		.map((char, index) => (index === 0 ? char.toUpperCase() : char))
		.join('');

	// DEPLOYMENT
	let name: string = [...randomName]
		.map((char, index) => (index === 0 ? char.toUpperCase() : char))
		.join('');
	let selectedVersion: string = 'latest';
	let replicas: number = 1;
	let cpu: number = 100;
	let memory: number = 128;

	// FUNCTIONS
	function selectTemplateVersion(version: string) {
		selectedVersion = version;
	}

	async function handleSubmit() {
		const envs: TemplateEnv = {} as TemplateEnv;
		Object.values(template.env).forEach(({ key, value }) => {
			envs.key = value;
		});
		const result = await fetch(`${env.PUBLIC_API_URL}/deployments/template/${template.name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				namespace: 'default',
				name,
				description: template.description,
				replicas,
				cpu,
				memory,
				version: selectedVersion,
				env: envs,
				volumes: template.volumes
			})
		});

		const data = await result.json();
		console.log('data', data);
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
			<form on:submit|preventDefault={handleSubmit} class="w-full h-full">
				<div class="card-title justify-between">
					<span class="flex gap-2 items-center">
						{template.fancyName}
						<img src={template.icon} alt={`${template.fancyName} icon`} class="h-6 w-6" />
					</span>

					<button class="btn btn-sm btn-primary">Save</button>
				</div>

				<div class="divider" />

				<div class="grid grid-flow-row gap-2 px-4">
					{#if selectedTab === 'config'}
						<h1 class="font-normal">General template setting</h1>
						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="name" class="font-bold">Name</label>
							<input
								name="name"
								id="name"
								class="input input-bordered w-full"
								bind:value={name}
								required
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="description" class="font-bold">Description</label>
							<textarea
								name="description"
								id="description"
								class="textarea !bg-base-300 w-full"
								placeholder={template.description}
								disabled
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="image" class="font-bold">Image</label>
							<input
								name="image"
								id="image"
								class="input !bg-base-300 w-full"
								value={template.image}
								disabled
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="type" class="font-bold">Type</label>
							<input
								name="type"
								id="type"
								class="input !bg-base-300 w-full"
								value={type}
								disabled
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="version" class="font-bold">Version</label>
							<div class="dropdown">
								<span id="version" tabIndex={0} class="btn bg-base-300 m-1 w-full justify-start"
									>{selectedVersion}</span
								>
								<ul
									tabIndex={0}
									class="dropdown-content bg-base-300 text-base-content rounded-box top-px h-[30vh] max-h-96 w-full overflow-y-auto shadow mt-16"
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

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="replicas" class="font-bold">Replicas</label>
							<input
								name="replicas"
								id="replicas"
								type="number"
								class="input input-bordered w-full"
								bind:value={replicas}
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="cpu" class="font-bold">Cpu(mcpu)</label>
							<input
								name="cpu"
								id="cpu"
								type="number"
								class="input input-bordered w-full"
								bind:value={cpu}
							/>
						</div>

						<div class="mt-2 grid grid-cols-2 items-center">
							<label for="memory" class="font-bold">Memory(Mb)</label>
							<input
								name="memory"
								id="memory"
								type="number"
								class="input input-bordered w-full"
								bind:value={memory}
							/>
						</div>
					{:else if selectedTab === 'env'}
						<div class="flex items-center">
							<h1 class="font-normal">Environment variables</h1>
						</div>
						{#each template.env as env}
							<div class="mt-2 grid grid-cols-2 items-center">
								<div class="flex">
									<label for={env.key} class="font-bold">{env.key}</label>
								</div>
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
						<h1 class="font-normal">Volumes to mount</h1>
						{#each template.volumes as volume, index}
							<div class="mt-2 grid grid-cols-3 gap-2 items-center">
								<div class="form-control w-full max-w-xs">
									<label for={`volume-path-${index}`} class="label">
										<span class="label-text">Template volume</span>
									</label>
									<input
										name={`volume-path-${index}`}
										class="input input-bordered w-full"
										bind:value={volume.path}
										required
									/>
								</div>
								<div class="form-control w-full max-w-xs">
									<label for={`volume-size-${index}`} class="label">
										<span class="label-text">Volume size (GB)</span>
									</label>
									<input
										name={`volume-size-${index}`}
										class="input input-bordered w-full"
										type="number"
										bind:value={volume.size}
										required
									/>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
