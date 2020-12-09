const { expect } = require('chai');
const Clickup = require('../src/index');
const routes = require('../src/routes');

describe('Testing Clickup Client Instance', () => {
	let clickup;
	before(() => {
		clickup = new Clickup('token');
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
		expect(clickup._service.defaults.options.headers.authorization).equal('token');
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

describe('Testing Clickup Class Methods', () => {
	let clickup;
	before(() => {
		clickup = new Clickup('token');
	});

	it('should return an instance of URLSearchParams', () => {
		expect(clickup._buildSearchParams({})).instanceOf(URLSearchParams);
	});

	it('should construct URLSearchParams properly from an object', () => {
		const params = {
			param1: 'value1',
			param2: 'value2',
		};

		const expectedOutput = new URLSearchParams({ param1: 'value1', param2: 'value2' });

		expect(clickup._buildSearchParams(params)).deep.equal(expectedOutput);
	});
});

describe('Testing Client Got Options', () => {
	let clickup;
	before(() => {
		clickup = new Clickup('token', {
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
