import { env } from '$env/dynamic/public';

export async function load({ fetch }) {
	try {
		const templates = await fetch(`${env.PUBLIC_API_URL}/templates/list`);
		console.log('templates', templates);

		return {
			templates: await templates.json()
		};
	} catch (error) {
		console.log('error', error);
	}
}
