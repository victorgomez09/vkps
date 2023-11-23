export type EngineData<T> = {
    statusCode: number;
    data?: T;
    error?: string;
};