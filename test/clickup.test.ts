import { beforeAll, describe, expect, it } from 'vitest';
import { Clickup } from '../src/index';

let client: Clickup;

beforeAll(() => {
	client = new Clickup();
});

describe('test base client instance', () => {
	it('should construct an instance', () => {
		expect(client).instanceOf(Clickup);
	});
});

describe('test client getRequestURL', () => {
	it('should return URL instance', () => {
		const url = client.getRequestURL('list/123/task');
		expect(url).instanceOf(URL);
	});

	it('should append path to baseURL path', () => {
		const url = client.getRequestURL('list/123/task');
		expect(url.pathname).equal('/api/v2/list/123/task');
	});

	it('should support basic searchParams', () => {
		const url = client.getRequestURL('list/123/task', { archived: false });
		expect(url.searchParams).toEqual(new URLSearchParams([['archived', 'false']]));
	});

	it('should support array LHS bracket notation searchParams for [] suffixed keys', () => {
		const url = client.getRequestURL('list/123/task', {
			'statuses[]': ['completed', 'in progress'],
		});

		expect(url.searchParams).toEqual(new URLSearchParams('statuses[]=completed&statuses[]=in progress'));
	});

	it('should support array LHS bracket notation searchParams for non [] suffixed keys', () => {
		const url = client.getRequestURL('list/123/task', {
			assignees: [123, 456],
		});

		const result = new URLSearchParams('assignees[]=123&assignees[]=456');
		expect(url.searchParams).toEqual(result);
	});
});
