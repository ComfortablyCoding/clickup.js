/** Whether a value is an object. */
export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Spreads `values` over `defaults`, skipping any that are `undefined`. */
export function withDefaults<T extends object>(defaults: T, values: { [K in keyof T]?: T[K] | undefined } = {}): T {
	return {
		...defaults,
		...Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)),
	};
}

/** A signal that aborts after `timeout` ms, or when `signal` does, whichever comes first. */
export function withTimeout(timeout: number, signal?: AbortSignal): AbortSignal {
	return signal ? AbortSignal.any([AbortSignal.timeout(timeout), signal]) : AbortSignal.timeout(timeout);
}

/** Waits `ms`, or rejects with the signal's reason as soon as it aborts. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	if (signal?.aborted) {
		return Promise.reject(signal.reason);
	}

	const { promise, resolve, reject } = Promise.withResolvers<void>();

	const timer = setTimeout(() => {
		signal?.removeEventListener("abort", onAbort);
		resolve();
	}, ms);

	function onAbort() {
		clearTimeout(timer);
		reject(signal?.reason);
	}

	signal?.addEventListener("abort", onAbort, { once: true });

	return promise;
}

/** Reads an environment variable, on runtimes that have them. */
export function readFromEnv(name: string): string | undefined {
	// Deno without --allow-env throws on the read itself
	try {
		return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
	} catch {
		return undefined;
	}
}
