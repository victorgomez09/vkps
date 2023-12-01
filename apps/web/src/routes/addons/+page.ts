import { env } from '$env/dynamic/public';

export async function load({ fetch }) {
	try {
		const addons = await fetch(`${env.PUBLIC_API_URL}/addons/list`);

		return {
			addons: await addons.json()
		};
	} catch (error) {
		console.log('error', error);
	}
}
