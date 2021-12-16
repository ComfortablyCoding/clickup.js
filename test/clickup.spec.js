const { assert } = require('chai');
const { Clickup } = require('../src/index');
const routes = require('../src/routes');

const token = 'token';

describe('Testing Clickup Client Instance', () => {
	let clickup;
	before(() => {
		clickup = new Clickup(token);
	});

	it('should construct a Clickup instance', () => {
		assert.instanceOf(clickup, Clickup);
	});

	it('should have default prefix url', () => {
		const { prefixUrl } = clickup._service.getOptions();
		assert.strictEqual(prefixUrl, 'https://api.clickup.com/api/v2/');
	});

	it('should have default headers', () => {
		const headers = clickup._service.getHeaders();
		assert.property(headers, 'authorization');
		assert.property(headers, 'content-type');
		assert.strictEqual(headers.authorization, token);
		assert.strictEqual(headers['content-type'], 'application/json');
	});

	it('should have the default response type', () => {
		const { responseType } = clickup._service.getOptions();
		assert.strictEqual(responseType, 'json');
	});

	it('should instantiate all routes', () => {
		assert.instanceOf(clickup.authorization, routes.Authorization);
		assert.instanceOf(clickup.checklists, routes.Checklists);
		assert.instanceOf(clickup.comments, routes.Comments);
		assert.instanceOf(clickup.folders, routes.Folders);
		assert.instanceOf(clickup.goals, routes.Goals);
		assert.instanceOf(clickup.keyResults, routes.KeyResults);
		assert.instanceOf(clickup.lists, routes.Lists);
		assert.instanceOf(clickup.spaces, routes.Spaces);
		assert.instanceOf(clickup.tasks, routes.Tasks);
		assert.instanceOf(clickup.teams, routes.Teams);
		assert.instanceOf(clickup.views, routes.Views);
		assert.instanceOf(clickup.webhooks, routes.Webhooks);
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
		const { hooks } = clickup._service.getOptions();
		assert.isArray(hooks.beforeRequest);
		assert.lengthOf(hooks.beforeRequest, 1);
	});
});
