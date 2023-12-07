<script lang="ts">
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
	}
</script>

<div class="flex flex-col w-full h-full overflow-auto">
	<div class="max-h-0">
		<form use:form on:submit|preventDefault={handleForm} class="h-full">
			<div
				class="w-full p-4 rounded-md shadow bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Name</h5>
				<div class="mt-2">
					<input
						name="name"
						type="text"
						id="name"
						class:ring-red-500={$form.name?.touched && Object.keys($form.name?.errors).length > 0}
						class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
						placeholder="name@company.com"
						required
					/>
				</div>
				{#if $form.name?.touched && Object.keys($form.name?.errors).length > 0}
					<span class="mt-2 text-sm font-medium text-red-500 dark:text-red-300">
						{#if $form.name?.errors.required}
							Name is required
						{:else}
							Name max lenght is 30 characters
						{/if}
					</span>
				{/if}
				<div class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300">
					Choose a descriptive name for this application. Must be between 1-30 characters and
					consist of alphabets (A-Z a-z), numbers (0-9) and spaces ( ).
				</div>
			</div>

			<div
				class="mt-4 w-full p-4 rounded-md shadow bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Image registry</h5>

				<div class="flex flex-col">
					<button
						id="dropdownDefaultButton"
						data-dropdown-toggle="dropdown"
						class="font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center w-36 mt-2 bg-white hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						type="button"
					>
						Docker Hub <svg
							class="w-2.5 h-2.5 ms-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 10 6"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 4 4 4-4"
							/>
						</svg>
					</button>

					<!-- Dropdown menu -->
					<div
						id="dropdown"
						class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
					>
						<ul
							class="py-2 text-sm text-gray-700 dark:text-gray-200"
							aria-labelledby="dropdownDefaultButton"
						>
							<li>
								<span
									class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
								>
									Docker Hub
								</span>
							</li>
						</ul>
					</div>

					<div class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300">
						Application image will be pulled from this registry. Currently only Docker registry is
						supported.
					</div>
				</div>

				<div class="divider" />

				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Image name</h5>
				<div class="flex flex-col w-full mt-2">
					<input
						name="image"
						type="text"
						id="name"
						class:ring-red-500={$form.image?.touched && Object.keys($form.image?.errors).length > 0}
						class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
						placeholder="name@company.com"
						required
					/>
					{#if $form.image?.touched && Object.keys($form.image?.errors).length > 0}
						<span class="mt-2 text-sm font-medium text-red-500 dark:text-red-300">
							{#if $form.image?.errors.required}
								Image name is required
							{/if}
						</span>
					{/if}
					<span class="mt-2 text-xs font-medium text-gray-500 dark:text-gray-300">
						Name of the image to pull. Tag will be selected later when making a deployment.
					</span>
				</div>
			</div>

			<div
				class="mt-4 w-full p-4 rounded-md shadow bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Environment variables</h5>

				<div class="mt-2">
					<button
						on:click={addEnvInput}
						type="button"
						class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
					>
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
								class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								class:ring-red-500={$form[`env-key-${index}`]?.touched &&
									Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
								use:validators={[required]}
								bind:value={envInput.key}
							/>
							<input
								name={`env-value-${index}`}
								type="text"
								placeholder="ENVIRONMENT_VARIABLE_VALUE"
								class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								class:ring-red-500={$form[`env-value-${index}`]?.touched &&
									Object.keys($form[`env-value-${index}`]?.errors || []).length > 0}
								use:validators={[required]}
								bind:value={envInput.value}
							/>

							<button
								on:click={() => removeEnvInput(index)}
								type="button"
								class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>
								X
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div
				class="mt-4 w-full p-4 rounded-md shadow bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Name</h5>

				<div class="mt-2">
					<button
						on:click={addVolumeInput}
						type="button"
						class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
					>
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
								class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								class:rig-red-500={$form[`volume-key-${index}`]?.touched &&
									Object.keys($form[`env-key-${index}`]?.errors || []).length > 0}
								use:validators={[required]}
								bind:value={volumeInput.key}
							/>

							<input
								name={`volume-size-${index}`}
								type="number"
								placeholder="Size(Mb)"
								class="text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								class:rig-red-500={$form[`volume-size-${index}`]?.touched &&
									Object.keys($form[`volume-size-${index}`]?.errors || []).length > 0}
								use:validators={[required]}
								bind:value={volumeInput.size}
							/>

							<button
								on:click={() => removeVolumeInput(index)}
								type="button"
								class="font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>
								X
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div
				class="mt-4 w-full p-4 rounded-md shadow bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Replicas</h5>

				<div class="flex items-center gap-2 mt-2 w-full">
					<input
						name="replicas"
						type="number"
						class="w-44 block p-2.5 text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
						use:validators={[required]}
						bind:value={$form.replicas.value}
					/>

					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button
							on:click={() => ($form.replicas.value = '1')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '1'}
							class:text-white={$form.replicas.value === '1'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							1
						</button>
						<button
							on:click={() => ($form.replicas.value = '2')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '2'}
							class:text-white={$form.replicas.value === '2'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							2
						</button>
						<button
							on:click={() => ($form.replicas.value = '3')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '3'}
							class:text-white={$form.replicas.value === '3'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							3
						</button>
						<button
							on:click={() => ($form.replicas.value = '4')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '4'}
							class:text-white={$form.replicas.value === '4'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							4
						</button>
						<button
							on:click={() => ($form.replicas.value = '5')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '5'}
							class:text-white={$form.replicas.value === '5'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							5
						</button>
						<button
							on:click={() => ($form.replicas.value = '10')}
							type="button"
							class:!bg-green-500={$form.replicas.value === '10'}
							class:text-white={$form.replicas.value === '10'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-qhite dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							10
						</button>
					</div>
				</div>

				<div class="divider" />

				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Memory (Mb)</h5>

				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-2 mt-2 w-full">
						<input
							name="memory"
							type="number"
							class="w-44 block p-2.5 text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
							use:validators={[required]}
							bind:value={$form.memory.value}
						/>

						<div class="inline-flex rounded-md shadow-sm" role="group">
							<button
								on:click={() => ($form.memory.value = '128')}
								type="button"
								class:!bg-green-500={$form.memory.value === '128'}
								class:text-white={$form.memory.value === '128'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								128
							</button>
							<button
								on:click={() => ($form.memory.value = '256')}
								type="button"
								class:!bg-green-500={$form.memory.value === '256'}
								class:text-white={$form.memory.value === '256'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								256
							</button>
							<button
								on:click={() => ($form.memory.value = '512')}
								type="button"
								class:!bg-green-500={$form.memory.value === '512'}
								class:text-white={$form.memory.value === '512'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								512
							</button>
							<button
								on:click={() => ($form.memory.value = '768')}
								type="button"
								class:!bg-green-500={$form.memory.value === '768'}
								class:text-white={$form.memory.value === '768'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								768
							</button>
							<button
								on:click={() => ($form.memory.value = '1024')}
								type="button"
								class:!bg-green-500={$form.memory.value === '1024'}
								class:text-white={$form.memory.value === '1024'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								1024
							</button>
							<button
								on:click={() => ($form.memory.value = '2048')}
								type="button"
								class:!bg-green-500={$form.memory.value === '2048'}
								class:text-white={$form.memory.value === '2048'}
								class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-qhite dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
							>
								2048
							</button>
						</div>
					</div>
				</div>

				<div class="divider" />

				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Cpu (mcpu)</h5>

				<div class="flex items-center mt-2 gap-2">
					<input
						name="cpu"
						type="number"
						class="w-44 block p-2.5 text-sm rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
						use:validators={[required]}
						bind:value={$form.cpu.value}
					/>

					<div class="inline-flex rounded-md shadow-sm" role="group">
						<button
							on:click={() => ($form.cpu.value = '100')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '100'}
							class:text-white={$form.cpu.value === '100'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							100
						</button>
						<button
							on:click={() => ($form.cpu.value = '250')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '250'}
							class:text-white={$form.cpu.value === '250'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							250
						</button>
						<button
							on:click={() => ($form.cpu.value = '500')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '500'}
							class:text-white={$form.cpu.value === '500'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							500
						</button>
						<button
							on:click={() => ($form.cpu.value = '750')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '750'}
							class:text-white={$form.cpu.value === '750'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							750
						</button>
						<button
							on:click={() => ($form.cpu.value = '1000')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '1000'}
							class:text-white={$form.cpu.value === '1000'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							1000
						</button>
						<button
							on:click={() => ($form.cpu.value = '2000')}
							type="button"
							class:!bg-green-500={$form.cpu.value === '2000'}
							class:text-white={$form.cpu.value === '2000'}
							class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-qhite dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:text-white"
						>
							2000
						</button>
					</div>
				</div>
			</div>

			<button
				type="submit"
				class="mt-4 font-medium rounded-md text-sm px-4 py-2 text-white bg-green-700 focus:outline-none hover:bg-green-800 focus:ring-1 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				disabled={!$form.valid}
			>
				Update application
			</button>
		</form>
	</div>
</div>
