import { env } from '$env/dynamic/public';
import type { Addon } from '$lib/models/addon.model.js';
import type { ApiResponse } from '$lib/models/api.model';

export async function load({ params, fetch }) {
	try {
		const result = await fetch(`${env.PUBLIC_API_URL}/addons/${params.name}`);

		const data = (await result.json()) as ApiResponse<Addon>;
		console.log('data', data);

		// if (data.statusCode !== 200) {
		// 	return {
		// 		data: null
		// 	};
		// }

		return {
			data: data.data
		};
	} catch (error) {
		console.log('error', error);
	}
}
