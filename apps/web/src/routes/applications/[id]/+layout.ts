import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$lib/models/api.model.js';
import type { Application } from '$lib/models/application.model';
import { applicationStore } from '$lib/stores/application.store.js';

export async function load({ params, fetch }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/applications/${params.id}`);
		console.log('id', params.id)

		const application = (await response.json()) as ApiResponse<Application>;
		console.log('deployment', application)

		applicationStore.set(application.data!);

		return {
			data: application.data
		};
	} catch (error) {
		console.log('error', error);
	}
}
