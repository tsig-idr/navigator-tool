'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

module.exports.router = function () {

	router.post('/', asyncHandler(async (req, res) => {
		const data = typeof req.body == 'object' && req.body || {};
		let html = fs.readFileSync(path.join(path.resolve(), 'public', 'index4SIAR.html'), 'utf-8');
		html = html.replace('{id:123}', JSON.stringify(data));
		res.send(html);
	}));

	return router;
}
