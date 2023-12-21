<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { ApplicationEnv, ApplicationVolume } from '$lib/models/application.model';
	import { applicationStore } from '$lib/stores/application.store';
	import { forms, maxLength, number, required, validators } from 'ui';

	const form = forms({
		name: { initial: $applicationStore.name.toString(), validators: [required, maxLength(30)] },
		image: { initial: $applicationStore.image.toString(), validators: [required] },
		replicas: {
			initial: $applicationStore.replicas.toString(),
			validators: [required, number]
		},
		memory: {
			initial: $applicationStore.memory.toString(),
			validators: [required, number]
		},
		cpu: {
			initial: $applicationStore.cpu.toString(),
			validators: [required, number]
		}
	});

	// DATA
	let envInputs: {
		key: string;
		value: string;
	}[] = [];
	let volumeInputs: {
		key: string;
		size: string;
	}[] = [];

	// FUNCTIONS
	function addEnvInput() {
		envInputs = [...envInputs, { key: '', value: '' }];
	}

	function removeEnvInput(index: number) {
		envInputs.splice(index, 1);
		envInputs = [...envInputs];
	}

	function addVolumeInput() {
		volumeInputs = [...volumeInputs, { key: '', size: '' }];
	}

	function removeVolumeInput(index: number) {
		volumeInputs.splice(index, 1);
		volumeInputs = [...volumeInputs];
	}

	async function handleForm() {
		const updatedEnvs: ApplicationEnv = {} as ApplicationEnv;
		let currentKeyEnv: string;
		Object.entries($form.values).map(([key, value]) => {
			if (key.includes('env-key-')) currentKeyEnv = value!;
			if (key.includes('env-value-')) updatedEnvs[currentKeyEnv] = value!;
		});

		const updatedvolumes: ApplicationVolume[] = [];
		let currentKeyVolume: string;
		Object.entries($form.values).map(([key, value]) => {
			if (key.includes('volume-key-')) currentKeyVolume = value!;
			if (key.includes('volume-size-')) {
				updatedvolumes.push({
					path: currentKeyVolume,
					size: Number(value!),
					accessMode: ['ReadWriteOnce']
				});
			}
		});

		console.log('$form.values.cpu', $form.values.cpu);

		const result = await fetch(
			`${env.PUBLIC_API_URL}/applications/update/${$applicationStore.applicationId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: $form.values.name,
					image: $form.values.image,
					replicas: $form.values.replicas,
					memory: $form.values.memory,
					cpu: $form.values.cpu,
					envs: updatedEnvs,
					volumes: updatedvolumes
				})
			}
		);

		if (result.status === 200) {
			console.log('data', await result.json());
		}
	}
</script>

<div class="flex flex-col w-full h-full overflow-auto">
	<div class="max-h-0">
		<form use:form on:submit|preventDefault={handleForm} class="h-full">
			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h5 class="card-title text-base">Name</h5>

					<div class="form-control">
						<input
							name="name"
							type="text"
							id="name"
							class:input-error={$form.name?.touched && Object.keys($form.name?.errors).length > 0}
							class="input input-bordered w-full"
							bind:value={$form.name.value}
							required
						/>
						<div class="label">
							{#if $form.name?.touched && Object.keys($form.name?.errors).length > 0}
								<span class="label-text-alt text-error"
									>{#if $form.name?.errors.required}
										Name is required
									{:else}
										Name max lenght is 30 characters
									{/if}</span
								>
							{/if}
							{#if Object.keys($form.name?.errors).length === 0}
								<span class="label-text-alt">
									Choose a descriptive name for this application. Must be between 1-30 characters
									and consist of alphabets (A-Z a-z), numbers (0-9) and spaces ( ).</span
								>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h5 class="card-title text-base">Image registry</h5>

					<div class="flex flex-col">
						<div class="dropdown">
							<div tabIndex={0} role="button" class="btn m-1">Docker Hub</div>
							<ul
								tabIndex={0}
								class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li class="p-2 rounded-btn cursor-pointer hover:bg-base-300">Docker Hub</li>
							</ul>
						</div>

						<div class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300">
							Application image will be pulled from this registry. Currently only Docker registry is
							supported.
						</div>
					</div>

					<div class="divider" />

					<h5 class="card-title text-base">Image name</h5>

					<div class="form-control w-full mt-2">
						<input
							name="image"
							type="text"
							id="name"
							class:input-error={$form.image?.touched &&
								Object.keys($form.image?.errors).length > 0}
							class="input input-bordered w-full"
							bind:value={$form.image.value}
						/>
						<div class="label">
							{#if $form.image?.touched && Object.keys($form.image?.errors).length > 0}
								<span class="label-text-alt text-error">
									{#if $form.image?.errors.required}
										Image name is required
									{/if}
								</span>
							{/if}
							{#if Object.keys($form.image?.errors).length === 0}
								<span class="label-text-alt">
									Name of the image to pull. Tag will be selected later when making a deployment.
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h5 class="card-title text-base">Environment variables</h5>

					<div class="mt-2">
						<button on:click={addEnvInput} type="button" class="btn btn-secondary btn-sm">
							Add environment variable
						</button>
					</div>
					<div class="flex flex-col mt-2 gap-2 w-full">
						{#each envInputs as envInput, index}
							<div class="flex items-center gap-2">
								<input
									name={`env-key-${index}`}
									type="text"
									placeholder="ENVIRONMENT_VARIABLE_NAME"
									class="input input-bordered w-full"
									class:input-error={$form[`env-key-${index}`]?.touched &&
										Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={envInput.key}
								/>
								<input
									name={`env-value-${index}`}
									type="text"
									placeholder="ENVIRONMENT_VARIABLE_VALUE"
									class="input input-bordered w-full"
									class:input-error={$form[`env-value-${index}`]?.touched &&
										Object.keys($form[`env-value-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={envInput.value}
								/>

								<button on:click={() => removeEnvInput(index)} type="button" class="btn btn-error">
									X
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h5 class="card-title text-base">Name</h5>

					<div class="mt-2">
						<button on:click={addVolumeInput} type="button" class="btn btn-secondary btn-sm">
							Add volume
						</button>
					</div>
					<div class="flex flex-col gap-2 mt-2 w-full">
						{#each volumeInputs as volumeInput, index}
							<div class="flex items-center gap-2">
								<input
									name={`volume-key-${index}`}
									type="text"
									placeholder="Container volume"
									class="input input-bordered w-full"
									class:text-error={$form[`volume-key-${index}`]?.touched &&
										Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={volumeInput.key}
								/>

								<input
									name={`volume-size-${index}`}
									type="number"
									placeholder="Size(Mb)"
									class="input input-bordered w-full"
									class:text-error={$form[`volume-size-${index}`]?.touched &&
										Object.keys($form[`volume-size-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={volumeInput.size}
								/>

								<button
									on:click={() => removeVolumeInput(index)}
									type="button"
									class="btn btn-error"
								>
									X
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h5 class="card-title text-base">Replicas</h5>

					<div class="flex items-center gap-2 mt-2 w-full">
						<input
							name="replicas"
							type="number"
							class="input input-bordered w-44"
							use:validators={[required]}
							bind:value={$form.replicas.value}
						/>

						<div class="join join-horizontal">
							<button
								on:click={() => ($form.replicas.value = '1')}
								type="button"
								class:bg-primary={$form.replicas.value === '1'}
								class="btn btn-secondary join-item"
							>
								1
							</button>
							<button
								on:click={() => ($form.replicas.value = '2')}
								type="button"
								class:bg-primary={$form.replicas.value === '2'}
								class="btn btn-secondary join-item"
							>
								2
							</button>
							<button
								on:click={() => ($form.replicas.value = '3')}
								type="button"
								class:bg-primary={$form.replicas.value === '3'}
								class="btn btn-secondary join-item"
							>
								3
							</button>
							<button
								on:click={() => ($form.replicas.value = '4')}
								type="button"
								class:bg-primary={$form.replicas.value === '4'}
								class="btn btn-secondary join-item"
							>
								4
							</button>
							<button
								on:click={() => ($form.replicas.value = '5')}
								type="button"
								class:bg-primary={$form.replicas.value === '5'}
								class="btn btn-secondary join-item"
							>
								5
							</button>
							<button
								on:click={() => ($form.replicas.value = '10')}
								type="button"
								class:bg-primary={$form.replicas.value === '10'}
								class="btn btn-secondary join-item"
							>
								10
							</button>
						</div>
					</div>

					<div class="divider" />

					<h5 class="card-title text-base">Memory (Mb)</h5>

					<div class="flex flex-col items-center gap-2">
						<div class="flex items-center gap-2 mt-2 w-full">
							<input
								name="memory"
								type="number"
								class="input input-bordered w-44"
								use:validators={[required]}
								bind:value={$form.memory.value}
							/>

							<div class="join join-horizontal">
								<button
									on:click={() => ($form.memory.value = '128')}
									type="button"
									class:bg-primary={$form.memory.value === '128'}
									class="btn btn-secondary join-item"
								>
									128
								</button>
								<button
									on:click={() => ($form.memory.value = '256')}
									type="button"
									class:bg-primary={$form.memory.value === '256'}
									class="btn btn-secondary join-item"
								>
									256
								</button>
								<button
									on:click={() => ($form.memory.value = '512')}
									type="button"
									class:bg-primary={$form.memory.value === '512'}
									class="btn btn-secondary join-item"
								>
									512
								</button>
								<button
									on:click={() => ($form.memory.value = '768')}
									type="button"
									class:bg-primary={$form.memory.value === '768'}
									class="btn btn-secondary join-item"
								>
									768
								</button>
								<button
									on:click={() => ($form.memory.value = '1024')}
									type="button"
									class:bg-primary={$form.memory.value === '1024'}
									class="btn btn-secondary join-item"
								>
									1024
								</button>
								<button
									on:click={() => ($form.memory.value = '2048')}
									type="button"
									class:bg-primary={$form.memory.value === '2048'}
									class="btn btn-secondary join-item"
								>
									2048
								</button>
							</div>
						</div>
					</div>

					<div class="divider" />

					<h5 class="card-title text-base">Cpu (mcpu)</h5>

					<div class="flex items-center mt-2 gap-2">
						<input
							name="cpu"
							type="number"
							class="input input-bordered w-44"
							use:validators={[required]}
							bind:value={$form.cpu.value}
						/>

						<div class="join join-horizontal">
							<button
								on:click={() => ($form.cpu.value = '100')}
								type="button"
								class:bg-primary={$form.cpu.value === '100'}
								class="btn btn-secondary join-item"
							>
								100
							</button>
							<button
								on:click={() => ($form.cpu.value = '250')}
								type="button"
								class:bg-primary={$form.cpu.value === '250'}
								class="btn btn-secondary join-item"
							>
								250
							</button>
							<button
								on:click={() => ($form.cpu.value = '500')}
								type="button"
								class:bg-primary={$form.cpu.value === '500'}
								class="btn btn-secondary join-item"
							>
								500
							</button>
							<button
								on:click={() => ($form.cpu.value = '750')}
								type="button"
								class:bg-primary={$form.cpu.value === '750'}
								class="btn btn-secondary join-item"
							>
								750
							</button>
							<button
								on:click={() => ($form.cpu.value = '1000')}
								type="button"
								class:bg-primary={$form.cpu.value === '1000'}
								class="btn btn-secondary join-item"
							>
								1000
							</button>
							<button
								on:click={() => ($form.cpu.value = '2000')}
								type="button"
								class:bg-primary={$form.cpu.value === '2000'}
								class="btn btn-secondary join-item"
							>
								2000
							</button>
						</div>
					</div>
				</div>
			</div>

			<button type="submit" class="btn btn-secondary btn-block mt-4" disabled={!$form.valid}>
				Update application
			</button>
		</form>
	</div>
</div>
