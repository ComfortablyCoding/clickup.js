const { expect } = require('chai');
const sinon = require('sinon');
const Clickup = require('../src/index');
const routes = require('../src/routes');

const token = 'token';

describe('Testing Clickup Client Instance', () => {
	let clickup;
	before(() => {
		clickup = new Clickup(token);
	});

	it('should construct a clickup instance', () => {
		expect(clickup).instanceOf(Clickup);
	});

	it('should have default prefix url', () => {
		expect(clickup._service.defaults.options.prefixUrl).equal('https://api.clickup.com/api/v2/');
	});

	it('should have default headers', () => {
		expect(clickup._service.defaults.options.headers).have.property('authorization');
		expect(clickup._service.defaults.options.headers).have.property('content-type');
		expect(clickup._service.defaults.options.headers.authorization).equal(token);
		expect(clickup._service.defaults.options.headers['content-type']).equal('application/json');
	});

	it('should have the default response type', () => {
		expect(clickup._service.defaults.options.responseType).equal('json');
	});

	it('should instantiate all routes', () => {
		expect(clickup.authorization).instanceOf(routes.Authorization);
		expect(clickup.checklists).instanceOf(routes.Checklists);
		expect(clickup.comments).instanceOf(routes.Comments);
		expect(clickup.folders).instanceOf(routes.Folders);
		expect(clickup.goals).instanceOf(routes.Goals);
		expect(clickup.keyResults).instanceOf(routes.KeyResults);
		expect(clickup.lists).instanceOf(routes.Lists);
		expect(clickup.spaces).instanceOf(routes.Spaces);
		expect(clickup.tasks).instanceOf(routes.Tasks);
		expect(clickup.teams).instanceOf(routes.Teams);
		expect(clickup.views).instanceOf(routes.Views);
		expect(clickup.webhooks).instanceOf(routes.Webhooks);
	});
});

describe('Testing Clickup buildSearchParams Method', () => {
	it('should return an instance of URLSearchParams', () => {
		expect(Clickup._buildSearchParams({})).instanceOf(URLSearchParams);
	});

	it('should construct URLSearchParams properly from an object', () => {
		const params = {
			archive: false,
			order_by: 'due_date',
			'statuses[]': ['in progress', 'completed'],
		};

		const expectedOutput = new URLSearchParams([
			['archived', 'false'],
			['order_by', 'due_date'],
			['statuses[]', 'in progress'],
			['statuses[]', 'completed'],
		]);

		expect(Clickup._buildSearchParams(params)).deep.equal(expectedOutput);
	});
});

describe('Testing Client Got Options', () => {
	let clickup;
	before(() => {
		clickup = new Clickup(token, {
			hooks: {
				beforeRequest: [
					(options) => {
						options.headers.foo = 'bar';
					},
				],
			},
		});
	});

	it('should have beforeRequest hook(s)', () => {
		expect(clickup._service.defaults.options.hooks.beforeRequest.length).gt(0);
	});
});

describe('Testing Client HTTP methods', () => {
	let clickup;
	before(async () => {
		clickup = new Clickup(token);
	});

	it('should make a GET request', async () => {
		const getStub = sinon.stub(clickup._service, 'get').resolves({ statusCode: 200, body: { id: '9hz' } });

		const { statusCode } = await clickup.tasks.get('9hz');

		const [endpoint, params] = getStub.args[0];

		expect(statusCode).eq(200);
		expect(endpoint).to.equal('task/9hz');
		expect(params).to.deep.equal({});
	});

	it('should make a POST request', async () => {
		const taskData = {
			name: 'New Task Name',
			description: 'New Task Description',
			assignees: [183],
			status: 'open',
		};

		const postStub = sinon
			.stub(clickup._service, 'post')
			.resolves({ statusCode: 200, body: { id: '9hz', ...taskData } });

		const { statusCode } = await clickup.lists.createTask('123', taskData);

		const [endpoint, body] = postStub.args[0];

		expect(statusCode).eq(200);
		expect(endpoint).to.equal('list/123/task');
		expect(body.json).to.deep.equal(taskData);
	});

	it('should make a PUT request', async () => {
		const taskData = {
			name: 'Updated Task Name',
			description: 'Updated Task Content',
			status: 'in progress',
		};
		const putStub = sinon.stub(clickup._service, 'put').resolves({ statusCode: 200, body: { id: '9hz', ...taskData } });

		const { statusCode } = await clickup.tasks.update('9hz', taskData);

		const [endpoint, body] = putStub.args[0];

		expect(statusCode).eq(200);
		expect(endpoint).to.deep.equal('task/9hz');
		expect(body.json).to.deep.equal(taskData);
	});

	it('should make a DELETE request', async () => {
		const deleteStub = sinon.stub(clickup._service, 'delete').resolves({ statusCode: 200, body: {} });

		const { statusCode } = await clickup.tasks.delete('9hz');

		const [endpoint, body] = deleteStub.args[0];

		expect(statusCode).eq(200);
		expect(endpoint).to.deep.equal('task/9hz');
		expect(body).to.deep.equal({});
	});
});
