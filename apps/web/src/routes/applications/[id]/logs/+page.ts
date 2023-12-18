import { env } from '$env/dynamic/public';
import type { LogLines } from '$lib/models/log.model.js';

export async function load({ params, fetch }) {
	try {
		const response = await fetch(`${env.PUBLIC_API_URL}/applications/${params.id}/logs`);

		console.log('test', await response);

		const logs = (await response.json()) as LogLines[];

		return {
			data: logs
		};
	} catch (error) {
		console.log('error', error);
	}
}
