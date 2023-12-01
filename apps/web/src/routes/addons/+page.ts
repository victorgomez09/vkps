import { env } from '$env/dynamic/public';
import type { Addon } from '$lib/models/addon.model';
import type { ApiResponse } from '$lib/models/api.model';

export async function load({ fetch }) {
	try {
		const result = await fetch(`${env.PUBLIC_API_URL}/addons/list`);

		const data = (await result.json()) as ApiResponse<Addon[]>;

		// if (data.statusCode !== 200) {
		// 	return {
		// 		data: []
		// 	};
		// }

		return {
			data: data.data
		};
	} catch (error) {
		console.log('error', error);
	}
}
