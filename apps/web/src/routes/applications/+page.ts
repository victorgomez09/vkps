import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$lib/models/api.model.js';
import type { Application } from '$lib/models/application.model.js';

export async function load({ fetch }) {
	try {
		const result = await fetch(`${env.PUBLIC_API_URL}/applications`);

		return {
			data: (await result.json()) as ApiResponse<Application[]>
		};
	} catch (error) {
		console.log('error', error);
	}
}
