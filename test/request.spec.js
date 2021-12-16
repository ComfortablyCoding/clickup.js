const { assert } = require('chai');
const sinon = require('sinon');
const { Clickup } = require('../src/index');

describe('Testing the Request HTTP methods', () => {
	let clickup;
	let stub;
	before(() => {
		clickup = new Clickup('token');
		stub = sinon.stub(clickup._service, '_instance').resolves();
	});

	afterEach(() => {
		stub.resetHistory();
	});

	it('should use proper request method per HTTP method helper', async () => {
		await clickup._service.get({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.post({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.put({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.delete({
			endpoint: 'tasks/task_id',
		});

		const [getArgs, postArgs, putArgs, deleteArgs] = stub.args;

		const [, getOptions] = getArgs;
		const [, postOptions] = postArgs;
		const [, putOptions] = putArgs;
		const [, deleteOptions] = deleteArgs;

		assert.strictEqual(getOptions.method, 'GET');
		assert.strictEqual(postOptions.method, 'POST');
		assert.strictEqual(putOptions.method, 'PUT');
		assert.strictEqual(deleteOptions.method, 'DELETE');
	});

	it('should preserve the endpoint in request', async () => {
		await clickup._service.get({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.post({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.put({
			endpoint: 'tasks/task_id',
		});
		await clickup._service.delete({
			endpoint: 'tasks/task_id',
		});

		const [getArgs, postArgs, putArgs, deleteArgs] = stub.args;

		const [getEndpoint] = getArgs;
		const [postEndpoint] = postArgs;
		const [putEndpoint] = putArgs;
		const [deleteEndpoint] = deleteArgs;

		assert.strictEqual(getEndpoint, 'tasks/task_id');
		assert.strictEqual(postEndpoint, 'tasks/task_id');
		assert.strictEqual(putEndpoint, 'tasks/task_id');
		assert.strictEqual(deleteEndpoint, 'tasks/task_id');
	});

	it('should construct the url params correctly', async () => {
		await clickup._service.get({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
		});
		await clickup._service.post({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
		});
		await clickup._service.put({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
		});
		await clickup._service.delete({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
		});
		const expectedParams = new URLSearchParams([['team_id', 123]]);

		const [getArgs, postArgs, putArgs, deleteArgs] = stub.args;

		const [, getOptions] = getArgs;
		const [, postOptions] = postArgs;
		const [, putOptions] = putArgs;
		const [, deleteOptions] = deleteArgs;

		assert.deepEqual(getOptions.searchParams, expectedParams);
		assert.deepEqual(postOptions.searchParams, expectedParams);
		assert.deepEqual(putOptions.searchParams, expectedParams);
		assert.deepEqual(deleteOptions.searchParams, expectedParams);
	});

	it('should use correct request content placement per content type', async () => {
		await clickup._service.post({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
			data: {
				priority: 1,
			},
		});
		await clickup._service.post({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
			data: {
				priority: 1,
			},
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
		await clickup._service.put({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
			data: {
				priority: 1,
			},
		});
		await clickup._service.delete({
			endpoint: 'tasks/task_id',
			params: {
				team_id: 123,
			},
			data: {
				priority: 1,
			},
		});
		const [postArgs, postWithHeaderArgs, putArgs, deleteArgs] = stub.args;

		const [, postOptions] = postArgs;
		const [, postWithHeaderOptions] = postWithHeaderArgs;
		const [, putOptions] = putArgs;
		const [, deleteOptions] = deleteArgs;

		assert.isObject(postOptions.json);
		assert.isUndefined(postOptions.body);
		assert.isObject(postWithHeaderOptions.body);
		assert.isUndefined(postWithHeaderOptions.json);
		assert.isObject(putOptions.json);
		assert.isUndefined(putOptions.body);
		assert.isObject(deleteOptions.json);
		assert.isUndefined(deleteOptions.body);
	});
});

describe('Testing the Request helper methods', () => {
	let clickup;
	before(() => {
		clickup = new Clickup('token');
	});

	it('should get all current request options', () => {
		const currentOptions = clickup._service._instance.defaults.options;
		const options = clickup._service.getOptions();

		assert.deepEqual(options, currentOptions);
	});

	it('should get all current request headers', () => {
		const currentHeaders = clickup._service._instance.defaults.options.headers;
		const headers = clickup._service.getHeaders();

		assert.deepEqual(headers, currentHeaders);
	});

	it('should get the current authorization header', () => {
		const currentAuthorizationHeader = clickup._service._instance.defaults.options.headers.authorization;
		const authorizationHeader = clickup._service.getHeader('authorization');

		assert.deepEqual(authorizationHeader, currentAuthorizationHeader);
	});

	it('should get current token', () => {
		const currentToken = clickup._service._token;
		const token = clickup._service.getToken();

		assert.deepEqual(token, currentToken);
	});
});
