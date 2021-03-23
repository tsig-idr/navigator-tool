'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navL1Ctrl = require('../controllers/NAVIGATOR_L1/NavigatorL1Ctrl')();

module.exports = function () {

	router.post('/nitro', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object' || {};
		res.json({
			results: await navL1Ctrl.nitro(input)
		});
	}));

	router.post('/swb', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object' || {};
		res.json({
			results: await navL1Ctrl.swb(input)
		});
	}));

	return router;
}
