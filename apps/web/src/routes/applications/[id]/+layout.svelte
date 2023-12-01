<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { Application } from '$lib/models/application.model';

	export let data: PageDataResponse<Application>;

	// DATA
	const { data: deployment } = data;

	$: console.log('$page.url.pathname', $page.url.pathname);
</script>

<div class="flex flex-col m-4 w-full">
	<h1 class="font-bold text-2xl">{deployment.name}</h1>
	<div role="tablist" class="tabs tabs-bordered mt-6 w-full">
		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Deploy"
			checked={$page.url.pathname === `/applications/${deployment.id}/logs`}
			on:click={() => goto(`/applications/${deployment.applicationId}/deploy`)}
		/>
		<div role="tabpanel" class="tab-content mt-2">
			<slot {deployment} />
		</div>

		<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 2" />
		<div role="tabpanel" class="tab-content p-10">Tab content 2</div>

		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Configuration"
			checked={$page.url.pathname === `/applications/${deployment.applicationId}/configuration`}
			on:click={() => goto(`/applications/${deployment.applicationId}/configuration`)}
		/>
		<div role="tabpanel" class="tab-content mt-2">
			<slot />
		</div>
	</div>
</div>
