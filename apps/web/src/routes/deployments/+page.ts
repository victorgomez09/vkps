import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$lib/models/api.model.js';
import type { Deployment } from '$lib/models/deployment.model.js';

export async function load({ fetch }) {
	try {
		const result = await fetch(`${env.PUBLIC_API_URL}/deployments`);

		return {
			deployments: (await result.json()) as ApiResponse<Deployment[]>
		};
	} catch (error) {
		console.log('error', error);
	}
}
