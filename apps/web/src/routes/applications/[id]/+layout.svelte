<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { Application } from '$lib/models/application.model';

	export let data: PageDataResponse<Application>;

	// DATA
	const { data: application } = data;
</script>

<div class="flex flex-col m-4 w-full h-full">
	<h1 class="font-bold text-2xl">{application.name}</h1>
	<div role="tablist" class="tabs tabs-bordered mt-6 w-full">
		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Deploy"
			checked={$page.url.pathname === `/applications/${application.applicationId}/deploy`}
			on:click={() => goto(`/applications/${application.applicationId}/deploy`)}
		/>
		<div role="tabpanel" class="tab-content mt-2">
			<slot />
		</div>

		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Logs"
			checked={$page.url.pathname === `/applications/${application.id}/logs`}
			on:click={() => goto(`/applications/${application.applicationId}/logs`)}
		/>
		<div role="tabpanel" class="tab-content mt-2">
			<slot deployment={application} />
		</div>

		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Configuration"
			checked={$page.url.pathname === `/applications/${application.applicationId}/configuration`}
			on:click={() => goto(`/applications/${application.applicationId}/configuration`)}
		/>
		<div role="tabpanel" class="tab-content">
			<slot />
		</div>

		<input
			type="radio"
			name="my_tabs_1"
			role="tab"
			class="tab"
			aria-label="Webhooks"
			checked={$page.url.pathname === `/applications/${application.applicationId}/webhooks`}
			on:click={() => goto(`/applications/${application.applicationId}/webhooks`)}
		/>
		<div role="tabpanel" class="tab-content mt-2">
			<slot />
		</div>
	</div>
</div>
