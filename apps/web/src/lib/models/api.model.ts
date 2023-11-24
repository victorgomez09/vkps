export type ApiResponse<T> = {
    statusCode: number,
    data?: T,
    error?: string
}