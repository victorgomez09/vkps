<script lang="ts">
	import { applicationStore } from '$lib/stores/application.store';
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { Application } from '$lib/models/application.model';
	import { page } from '$app/stores';

	export let data: PageDataResponse<Application>;

	// DATA
	const { data: application } = data;
</script>

<div class="flex flex-col w-full h-full">
	<h1 class="font-bold text-2xl">{application.name}</h1>

	<div class="text-sm font-medium text-center">
		<div role="tablist" class="tabs tabs-bordered mt-4">
			<a
				role="tab"
				class="tab"
				href={`/applications/${$applicationStore.applicationId}/details`}
				class:tab-active={$page.url.pathname ===
					`/applications/${application.applicationId}/details`}>Details</a
			>
			<a
				role="tab"
				class="tab"
				href={`/applications/${$applicationStore.applicationId}/logs`}
				class:tab-active={$page.url.pathname === `/applications/${application.applicationId}/logs`}
				>Logs</a
			>
			<a
				role="tab"
				class="tab"
				href={`/applications/${$applicationStore.applicationId}/configuration`}
				class:tab-active={$page.url.pathname ===
					`/applications/${application.applicationId}/configuration`}>Configuration</a
			>
			<a
				role="tab"
				class="tab"
				href={`/applications/${$applicationStore.applicationId}/webhooks`}
				class:tab-active={$page.url.pathname ===
					`/applications/${application.applicationId}/webhooks`}>Webhooks</a
			>
		</div>
	</div>

	<div class="mt-4 h-full">
		<slot />
	</div>
</div>
