'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const multer = require('multer');

module.exports.router = function () {

	router.post('/', multer().single('water'), asyncHandler(async (req, res) => {
		const json = typeof req.file == 'object'&& req.file.buffer && req.file.buffer.toString() || typeof req.body == 'object' && (req.body.water || JSON.stringify(req.body));
		let html = fs.readFileSync(path.join(path.resolve(), 'public', 'index4SIAR.html'), 'utf-8');
		html = html.replace('{id:123}', json);
		res.send(html);
	}));

	return router;
}
