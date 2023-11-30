<script lang="ts">
	import { style } from 'ui';
	import Explainer from './Explainer.svelte';

	export let field: any;
	export let label: string;
	export let disabled: boolean = false;
	export let element: 'input' | 'textarea' = 'input';
	export let type: 'text' | 'number' = 'text';
	export let explainer: string = '';

	function parseError(error: string): string {
		switch (error) {
			case 'required':
				return `${label} is required`;

			default:
				return 'Error';
		}
	}
</script>

<div class="mt-2 grid grid-cols-2 items-center">
	<div class="flex items-center gap-2">
		<label for={label.toLowerCase()} class="font-bold truncate">{label}</label>
		{#if explainer && explainer !== ''}
			<Explainer explanation={explainer} />
		{/if}
	</div>
	{#if element === 'input'}
		<input
			name={label.toLowerCase()}
			id={label.toLowerCase()}
			class="input input-bordered w-full"
			{...{ type }}
			{disabled}
			use:style={{ field, invalid: 'input-error' }}
			bind:value={$field.value}
		/>
	{:else}
		<textarea
			name={label.toLowerCase()}
			id={label.toLowerCase()}
			class="textarea textarea-bordered w-full"
			{disabled}
			use:style={{ field, invalid: 'textarea-error' }}
			bind:value={$field.value}
		/>
	{/if}
	{#if $field.dirty && $field.invalid}
		<div class="label col-start-2">
			{#each $field.errors as error}
				<span class="font-thin text-error italic break-all">{parseError(error)}</span>
			{/each}
		</div>
	{/if}
</div>
