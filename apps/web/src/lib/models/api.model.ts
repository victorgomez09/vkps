export type ApiResponse<T> = {
	statusCode: number;
	data: T;
	error?: string;
};

export type PageDataResponse<T> = {
	data: T;
};
