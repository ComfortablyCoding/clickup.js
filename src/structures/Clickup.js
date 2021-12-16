const {
	Authorization,
	Checklists,
	Comments,
	Folders,
	Goals,
	KeyResults,
	Lists,
	Spaces,
	Tasks,
	Teams,
	Views,
	Webhooks,
} = require('../routes');
const { Request } = require('./Request');

class Clickup {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {String} token Clickup API Access Token
	 * @param {import('got/dist/source').ExtendOptions} requestOptions Options for the created got instance.
	 */
	constructor(token, requestOptions) {
		// create service instance
		/**
		 * The clickup request service
		 * @type {Request}
		 * @private
		 */
		this._service = new Request(token, requestOptions);

		// pull in all routes
		/**
		 * authorization
		 *
		 * @type {Authorization}
		 * @public
		 */
		this.authorization = new Authorization(this._service);
		/**
		 * checklists
		 *
		 * @type {Checklists}
		 * @public
		 */
		this.checklists = new Checklists(this._service);
		/**
		 * comments
		 *
		 * @type {Comments}
		 * @public
		 */
		this.comments = new Comments(this._service);
		/**
		 * folders
		 *
		 * @type {Folder}
		 * @public
		 */
		this.folders = new Folders(this._service);
		/**
		 * goals
		 *
		 * @type {Goals}
		 * @public
		 */
		this.goals = new Goals(this._service);
		/**
		 * keyResults
		 *
		 * @type {KeyResults}
		 * @public
		 */
		this.keyResults = new KeyResults(this._service);
		/**
		 * lists
		 *
		 * @type {Lists}
		 * @public
		 */
		this.lists = new Lists(this._service);
		/**
		 * spaces
		 *
		 * @type {Spaces}
		 * @public
		 */
		this.spaces = new Spaces(this._service);
		/**
		 * tasks
		 *
		 * @type {Tasks}
		 * @public
		 */
		this.tasks = new Tasks(this._service);
		/**
		 * teams
		 *
		 * @type {Teams}
		 * @public
		 */
		this.teams = new Teams(this._service);
		/**
		 * views
		 *
		 * @type {Views}
		 * @public
		 */
		this.views = new Views(this._service);
		/**
		 * webhooks
		 *
		 * @type {Webhooks}
		 * @public
		 */
		this.webhooks = new Webhooks(this._service);
	}
}

module.exports = {
	Clickup,
};
