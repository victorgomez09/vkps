import { env } from '$env/dynamic/public';

export async function load({ fetch }) {
	const templates = await fetch(`${env.PUBLIC_API_URL}/templates/list`);

	return {
		templates: await templates.json()
	};
}
