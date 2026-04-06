import type { Clickup } from "./client.ts";

export interface RequestConfig {
	prefixUrl: string;
}

export interface RateLimitConfig {
	requests: number;
	interval: number;
}

export interface Hooks {
	onRequest?: (context: { request: FetchOptions }) => void | Promise<void>;
	onResponse?: (context: { request: FetchOptions; data: unknown }) => unknown | Promise<unknown>;
}

export interface ClickupOptions {
	token?: string;
	request?: Partial<RequestConfig>;
	fetch?: typeof globalThis.fetch;
	rateLimit?: Partial<RateLimitConfig>;
	hooks?: Hooks;
}

export interface ResolvedOptions {
	token?: string;
	request: RequestConfig;
	fetch?: typeof globalThis.fetch;
	rateLimit: RateLimitConfig;
	hooks: Hooks;
}

export interface RequestOptions {
	method?: string;
	path: string;
	headers?: Record<string, string>;
	query?: Record<string, unknown>;
	body?: Record<string, unknown> | FormData;
}

export interface FetchOptions {
	method: string;
	headers: Record<string, string>;
	body?: string | FormData;
}

export interface RouteOptions {
	client: Clickup;
	route?: string;
	version?: string;
}

export interface ClickupAPIErrorOptions {
	status?: number;
	message?: string;
	code?: string | null;
}
