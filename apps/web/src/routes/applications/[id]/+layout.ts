import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$lib/models/api.model.js';
import type { Application } from '$lib/models/application.model';
import { deploymentStore } from '$lib/stores/deployment.store.js';

export async function load({ params, fetch }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/applications/${params.id}`);

		const deployment = (await response.json()) as ApiResponse<Application>;

		deploymentStore.set(deployment.data!);

		return {
			data: deployment.data
		};
	} catch (error) {
		console.log('error', error);
	}
}
