<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import { get } from "$lib/api";

    export const load: Load = async ({}) => {
		try {
			const result = await get<[]>('/templates/list');
			return {
				props: {
                    templates: result
                }
			};
		} catch (error: any) {
			return {
				status: 500,
				error: new Error(error)
			};
		}
	};
</script>

<script lang="ts">
    export let templates: any[]

    console.log('templates', templates)
</script>