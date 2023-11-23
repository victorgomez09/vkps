import { env } from '$env/dynamic/public';

export const get = async <T>(endpoint: string) => {
    return await request<unknown, T>({method: "GET", endpoint});
}

export const post = async <BODY, RESPONSE>(endpoint: string, data: BODY) => {
    return await request<BODY, RESPONSE>({method: "POST", endpoint, body: data});
}

const request = async <BODY, RESPONSE>({method, endpoint, body}: {
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    body?: BODY
}): Promise<RESPONSE> => {
    const result = await fetch(`${env.PUBLIC_API_URL}/${endpoint}`, {
        method,
        body: JSON.stringify(body)
    })

    return await result.json() as RESPONSE;
}