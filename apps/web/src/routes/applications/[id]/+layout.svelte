<script lang="ts">
	import { applicationStore } from '$lib/stores/application.store';
	import type { PageDataResponse } from '$lib/models/api.model';
	import type { Application } from '$lib/models/application.model';
	import { page } from '$app/stores';

	export let data: PageDataResponse<Application>;

	// DATA
	const { data: application } = data;
</script>

<div class="flex flex-col m-4 w-full h-full">
	<h1 class="font-bold text-2xl">{application.name}</h1>

	<div
		class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
	>
		<ul class="flex flex-wrap -mb-px">
			<li class="me-2">
				<a
					href={`/applications/${$applicationStore.applicationId}/deploys`}
					class:text-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/deploys`}
					class:border-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/deploys`}
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
				>
					Deploys
				</a>
			</li>
			<li class="me-2">
				<a
					href={`/applications/${$applicationStore.applicationId}/logs`}
					class:text-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/logs`}
					class:border-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/logs`}
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
					aria-current="page"
				>
					Logs
				</a>
			</li>
			<li class="me-2">
				<a
					href={`/applications/${$applicationStore.applicationId}/configuration`}
					class:text-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/configuration`}
					class:border-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/configuration`}
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
					>Configuration</a
				>
			</li>
			<li class="me-2">
				<a
					href={`/applications/${$applicationStore.applicationId}/webhooks`}
					class:text-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/webhooks`}
					class:border-green-600={$page.url.pathname ===
						`/applications/${application.applicationId}/webhooks`}
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
				>
					Webhooks
				</a>
			</li>
		</ul>
	</div>

	<div class="mt-4">
		<slot />
	</div>
</div>
