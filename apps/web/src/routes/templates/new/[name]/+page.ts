import { env } from "$env/dynamic/public"

export async function load({ params, fetch }) {
    try {
        const result = await fetch(`${env.PUBLIC_API_URL}/templates/${params.name}`)
    
        return {
            template: await result.json()
        }
    } catch (error) {
        console.log('error', error)
    }
}