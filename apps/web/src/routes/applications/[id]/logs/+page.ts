import { env } from '$env/dynamic/public';
import type { LogLines } from '$lib/models/log.model.js';

export async function load({ params, fetch }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/applications/${params.id}/logs`);

		const logs = (await response.json()) as LogLines[];
		console.log('application', logs);

		return {
			data: logs
		};
	} catch (error) {
		console.log('error', error);
	}
}
