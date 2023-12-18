<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { ApplicationEnv, ApplicationVolume } from '$lib/models/application.model';
	import { forms, validators, maxLength, required, minLength, number } from 'ui';

	const form = forms({
		name: { validators: [required, maxLength(30)] },
		image: { validators: [required] },
		replicas: {
			initial: '1',
			validators: [required, minLength(1), number]
		},
		memory: {
			initial: '128',
			validators: [required, number]
		},
		cpu: {
			initial: '100',
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

		const result = await fetch(`${env.PUBLIC_API_URL}/applications/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				namespace: 'default',
				name: $form.name.value,
				description: '',
				image: $form.image.value,
				replicas: $form.replicas.value,
				cpu: $form.cpu.value,
				memory: $form.memory.value,
				env: updatedEnvs,
				volumes: updatedvolumes
			})
		});
		const data = await result.json();
		console.log('data', data);
	}
</script>

<div class="flex flex-col w-full overflow-auto">
	<div class="max-h-0">
		<h1 class="font-semibold text-xl">New application</h1>

		<form use:form on:submit|preventDefault={handleForm}>
			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h1 class="card-title text-base">Name</h1>

					<div class="flex flex-col w-full">
						<label class="form-control w-full">
							<input
								name="name"
								type="text"
								placeholder="Type here"
								class="input input-bordered w-full"
								class:input-error={$form.name?.touched &&
									Object.keys($form.name?.errors).length > 0}
							/>
							<div class="label flex-col">
								{#if $form.name?.touched && Object.keys($form.name?.errors).length > 0}
									<span class="label-text-alt font-thin text-error w-full">
										{#if $form.name?.errors.required}
											Name is required
										{:else}
											Name max lenght is 30 characters
										{/if}
									</span>
								{/if}
								<span class="label-text-alt font-thin self-baseline"
									>Choose a descriptive name for this application. Must be between 1-30 characters
									and consist of alphabets (A-Z a-z), numbers (0-9) and spaces ( ).</span
								>
							</div>
						</label>
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h1 class="card-title text-base">Image registry</h1>

					<div class="flex flex-col w-full">
						<div class="form-control w-full">
							<div class="dropdown">
								<div tabIndex={0} role="button" class="btn bg-base-100 m-1">Docker Hub</div>
								<ul
									tabIndex={0}
									class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
								>
									<li class="hover:bg-base-300"><div class="p-2">Docker Hub</div></li>
								</ul>
							</div>
							<div class="label">
								<span class="label-text-alt font-thin"
									>Application image will be pulled from this registry. Currently only Docker
									registry is supported.</span
								>
							</div>
						</div>
					</div>

					<div class="divider" />

					<h1 class="card-title text-base">Image name</h1>
					<div class="flex flex-col w-full">
						<label class="form-control w-full">
							<input
								name="image"
								type="text"
								placeholder="Type here"
								class="input input-bordered w-full"
								class:input-error={$form.image?.touched &&
									Object.keys($form.image?.errors).length > 0}
							/>
							<div class="label flex-col text-left">
								{#if $form.image?.touched && Object.keys($form.image?.errors).length > 0}
									<span class="label-text-alt font-thin text-error w-full">
										{#if $form.image?.errors.required}
											Image name is required
										{/if}
									</span>
								{/if}
								<span class="label-text-alt font-thin w-full"
									>Name of the image to pull. Tag will be selected later when making a deployment.</span
								>
							</div>
						</label>
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h1 class="card-title text-base">Environment variables</h1>

					<div class="card-actions">
						<button
							on:click={addEnvInput}
							type="button"
							class="btn btn-ghost bg-base-100 border border-base-300"
							>Add environment variable</button
						>
					</div>
					<div class="flex flex-col gap-2 w-full">
						{#each envInputs as envInput, index}
							<div class="flex items-center gap-2">
								<input
									name={`env-key-${index}`}
									type="text"
									class="input input-bordered"
									class:input-error={$form[`env-key-${index}`]?.touched &&
										Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={envInput.key}
								/>
								<input
									name={`env-value-${index}`}
									type="text"
									class="input input-bordered"
									class:input-error={$form[`env-value-${index}`]?.touched &&
										Object.keys($form[`env-value-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={envInput.value}
								/>

								<button on:click={() => removeEnvInput(index)} type="button" class="btn bg-base-100"
									>X</button
								>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h1 class="card-title text-base">Volumes</h1>

					<div class="card-actions">
						<button
							on:click={addVolumeInput}
							type="button"
							class="btn btn-ghost bg-base-100 border border-base-300">Add volume</button
						>
					</div>
					<div class="flex flex-col gap-2 w-full">
						{#each volumeInputs as volumeInput, index}
							<div class="flex items-center gap-2">
								<input
									name={`volume-key-${index}`}
									type="text"
									class="input input-bordered"
									placeholder="Container volume"
									class:input-error={$form[`volume-key-${index}`]?.touched &&
										Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={volumeInput.key}
								/>

								<input
									name={`volume-size-${index}`}
									type="number"
									class="input input-bordered"
									placeholder="Size(Mb)"
									class:input-error={$form[`volume-size-${index}`]?.touched &&
										Object.keys($form[`volume-size-${index}`]?.errors || []).length > 0}
									use:validators={[required]}
									bind:value={volumeInput.size}
								/>

								<button
									on:click={() => removeVolumeInput(index)}
									type="button"
									class="btn bg-base-100">X</button
								>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-300 shadow mt-4 w-full">
				<div class="card-body px-4 py-4">
					<h1 class="card-title text-base">Replicas</h1>

					<div class="flex items-center gap-2">
						<input
							name="replicas"
							type="number"
							class="input input-bordered w-24"
							use:validators={[required]}
							bind:value={$form.replicas.value}
						/>

						<div class="join join-horizontal">
							<button
								on:click={() => ($form.replicas.value = '1')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '1'}>1</button
							>
							<button
								on:click={() => ($form.replicas.value = '2')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '2'}>2</button
							>
							<button
								on:click={() => ($form.replicas.value = '3')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '3'}>3</button
							>
							<button
								on:click={() => ($form.replicas.value = '4')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '4'}>4</button
							>
							<button
								on:click={() => ($form.replicas.value = '5')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '5'}>5</button
							>
							<button
								on:click={() => ($form.replicas.value = '10')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.replicas.value === '10'}>10</button
							>
						</div>
					</div>

					<div class="divider" />

					<h1 class="card-title text-base">Memory</h1>

					<div class="flex items-center gap-2">
						<div class="join">
							<input
								name="memory"
								type="number"
								class="input input-bordered w-24"
								use:validators={[required]}
								bind:value={$form.memory.value}
							/>
							<div class="flex items-center justify-center bg-base-300 p-2 join-item">Mb</div>
						</div>

						<div class="join join-horizontal">
							<button
								on:click={() => ($form.memory.value = '128')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '128'}>128</button
							>
							<button
								on:click={() => ($form.memory.value = '256')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '256'}>256</button
							>
							<button
								on:click={() => ($form.memory.value = '512')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '512'}>512</button
							>
							<button
								on:click={() => ($form.memory.value = '768')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '768'}>768</button
							>
							<button
								on:click={() => ($form.memory.value = '1024')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '1024'}>1024</button
							>
							<button
								on:click={() => ($form.memory.value = '2048')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.memory.value === '2048'}>2048</button
							>
						</div>
					</div>

					<div class="divider" />

					<h1 class="card-title text-base">Cpu</h1>

					<div class="flex items-center gap-2">
						<div class="join">
							<input
								name="cpu"
								type="number"
								class="input input-bordered w-24"
								use:validators={[required]}
								bind:value={$form.cpu.value}
							/>
							<div class="flex items-center justify-center bg-base-300 p-2 join-item">mcpu</div>
						</div>

						<div class="join join-horizontal">
							<button
								on:click={() => ($form.cpu.value = '100')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '100'}>100</button
							>
							<button
								on:click={() => ($form.cpu.value = '250')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '250'}>250</button
							>
							<button
								on:click={() => ($form.cpu.value = '500')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '500'}>500</button
							>
							<button
								on:click={() => ($form.cpu.value = '750')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '750'}>750</button
							>
							<button
								on:click={() => ($form.cpu.value = '1000')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '1000'}>1000</button
							>
							<button
								on:click={() => ($form.cpu.value = '2000')}
								type="button"
								class="btn bg-base-100 join-item"
								class:bg-info={$form.cpu.value === '2000'}>2000</button
							>
						</div>
					</div>
				</div>
			</div>

			<button type="submit" class="btn btn-block btn-secondary mt-4" disabled={!$form.valid}
				>Create application</button
			>
		</form>
	</div>
</div>
