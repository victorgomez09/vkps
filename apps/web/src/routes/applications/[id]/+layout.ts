import { env } from '$env/dynamic/public';
import type { Application } from '$lib/models/application.model';
import { applicationStore } from '$lib/stores/application.store.js';

export async function load({ params, fetch }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/applications/${params.id}`);

		const application = (await response.json()) as Application;
		console.log('application', application);

		applicationStore.set(application);

		return {
			data: application
		};
	} catch (error) {
		console.log('error', error);
	}
}
