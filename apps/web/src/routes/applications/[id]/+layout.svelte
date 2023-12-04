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
		<a
			role="tab"
			class:tab-active={$page.url.pathname === `/applications/${application.applicationId}/deploy`}
			class="tab"
			href={`/applications/${application.applicationId}/deploy`}
		>
			Deploy
		</a>
		<a
			role="tab"
			class:tab-active={$page.url.pathname === `/applications/${application.applicationId}/logs`}
			class="tab"
			href={`/applications/${application.applicationId}/logs`}
		>
			Logs
		</a>
		<a
			role="tab"
			class:tab-active={$page.url.pathname ===
				`/applications/${application.applicationId}/configuration`}
			class="tab"
			href={`/applications/${application.applicationId}/configuration`}
		>
			Configuration
		</a>
		<a
			role="tab"
			class:tab-active={$page.url.pathname ===
				`/applications/${application.applicationId}/webhooks`}
			class="tab"
			href={`/applications/${application.applicationId}/webhooks`}
		>
			Webhooks
		</a>
	</div>

	<div class="flex flex-1 mt-6 pb-6">
		<slot />
	</div>
</div>
