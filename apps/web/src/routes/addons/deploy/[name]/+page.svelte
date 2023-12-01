<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { default as FormDiv, default as Input } from '$lib/components/FormDiv.svelte';
	import type { Template, TemplateEnv, TemplateVolume } from '$lib/models/template.model';
	import { randomName } from '$lib/utils/name-generator';
	import { get } from 'svelte/store';
	import { field, form, min, required } from 'ui';

	export let data: any;

	// DATA
	const template: Template = data.template.data.data;
	const envs: TemplateEnv[] = template.env || [];
	const volumes: TemplateVolume[] = template.volumes || [];

	const name = field('name', randomName, [required()]);
	const replicas = field('replicas', '1', [required(), min(1)], {
		checkOnInit: true
	});
	const memory = field('memory', '128', [required(), min(128)], {
		checkOnInit: true
	});
	const cpu = field('cpu', '100', [required(), min(100)], {
		checkOnInit: true
	});
	const envFields = (template.env || ([] as TemplateEnv[])).map((env) => {
		return field('env', env.value, [required()]);
	});
	const volumeFields = (template.volumes || ([] as TemplateVolume[])).map((volume) => {
		return field('volume', '1024', [required(), min(100)]);
	});

	const tempDeployForm = form(name, replicas, memory, cpu);

	// DEPLOYMENT
	let selectedVersion: string = 'latest';

	// FUNCTIONS
	function selectTemplateVersion(version: string) {
		selectedVersion = version;
	}

	async function handleSubmit() {
		const updatedEnvs: TemplateEnv = {} as TemplateEnv;
		Object.values(envs).map(({ key }, index) => {
			console.log('test', {
				[key]: get(envFields[index]).value
			});
			updatedEnvs[key] = get(envFields[index]).value;
		});

		const updatedvolumes: TemplateVolume[] = [];
		Object.values(volumes).map(({ path }, index) => {
			updatedvolumes.push({
				path,
				size: Number(get(volumeFields[index]).value),
				accessMode: ['ReadWriteOnce']
			});
		});
		const result = await fetch(`${env.PUBLIC_API_URL}/deployments/template/${template.name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				namespace: 'default',
				name: [...get(name).value]
					.map((char, index) => (index === 0 ? char.toUpperCase() : char))
					.join(''),
				description: template.description,
				replicas: Number(get(replicas).value),
				cpu: Number(get(cpu).value),
				memory: Number(get(memory).value),
				version: selectedVersion,
				env: updatedEnvs,
				volumes: updatedvolumes
			})
		});
		const data = await result.json();
		console.log('data', data);
	}
</script>

<div class="flex flex-1 gap-2 w-full h-full">
	<div class="card shadow bg-base-200 w-full overflow-auto">
		<div class="card-body w-full h-full max-h-0">
			<form on:submit|preventDefault={handleSubmit} class="w-full h-full">
				<div class="card-title justify-between">
					<span class="flex gap-2 items-center">
						{template.fancyName}
						<img src={template.icon} alt={`${template.fancyName} icon`} class="h-6 w-6" />
					</span>

					<button
						type="submit"
						class="btn btn-sm btn-primary"
						disabled={$tempDeployForm.dirty && !$tempDeployForm.valid}>Save</button
					>
				</div>

				<div class="divider" />

				<div class="grid grid-flow-row gap-2 px-4">
					<h1 class="font-bold text-xl">Configuration</h1>
					<div class="flex flex-col mt-2">
						<FormDiv label="Name" field={name} />

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

						<!-- <FormDiv label="Type" field={type} /> -->

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

						<FormDiv label="Replicas" field={replicas} />

						<FormDiv label="Cpu" field={cpu} />

						<FormDiv label="Memory" field={memory} />
					</div>

					<div class="divider" />

					<h1 class="font-bold text-xl">Environment variables</h1>
					{#each envs as env, index}
						<Input label={env.key} field={envFields[index]} />
					{/each}

					<div class="divider" />

					<h1 class="font-bold text-xl">Volumes</h1>
					{#each volumes as volume, index}
						<FormDiv
							label="Size of volume (Mb)"
							explainer={`Volume path <span class="font-bold italic">${volume.path}</span> to mount`}
							type="number"
							field={volumeFields[index]}
						/>
					{/each}
				</div>
			</form>
		</div>
	</div>
</div>
