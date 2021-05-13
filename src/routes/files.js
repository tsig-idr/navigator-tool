'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

module.exports = function () {

	router.get('/:level/:filename', asyncHandler(async (req, res) => {
		const uid = req.query.uid || req.params.uid;
		req.params.level && req.params.filename && 
			fs.readFile(path.join(path.resolve(), 'tmp', req.params.level, uid + '_' + req.params.filename), (err, data) => {
				if (err) {
					res.json({
						error: `File '${path.join(path.resolve(), 'tmp', req.params.level, uid + '_' + req.params.filename)}' not exists`
					});
				}
				else {
					res.json({
						file: data.toString()
					});
				}
			});
	}));

	router.post('/:level/:filename', asyncHandler(async (req, res) => {
		const uid = req.query.uid || req.params.uid || nanoid(5);
		req.params.level && req.params.filename &&
			fs.writeFile(path.join(path.resolve(), 'tmp', req.params.level, uid + '_' + req.params.filename), req.body.data, err => {
				!err &&
					res.json({
						uid: uid
					});
			});
	}));

	return router;
}
