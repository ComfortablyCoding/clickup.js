export interface ClientGlobals {
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
	URL: typeof URL;
}

export type RequestInterceptor = (url: URL, options: RequestInit) => void | Promise<void>;

export type ResponseInterceptor = (data: any, request: RequestInit) => void | Promise<void>;

export interface ClientRequest {
	baseURL: string;
	onRequest?: RequestInterceptor;
	onResponse?: ResponseInterceptor;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
	path: string;
	method?: HttpMethod;
	params?: Record<string, any>;
	headers?: Record<string, string>;
	body?: string | FormData;
	onRequest?: RequestInterceptor;
	onResponse?: ResponseInterceptor;
}

export interface ClientOptions {
	globals: ClientGlobals;
	request: ClientRequest;
}
