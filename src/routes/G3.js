'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navG3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorG3Ctrl')();

module.exports = function () {

	router.post('/livestock', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.livestock(input, [
				'CO2fromFeed',
				'CO2fromPastures',
				'CO2fromManure',
				'CO2fromEnteric',
				'CH4fromEnteric',
				'CH4fromManure',
				'N2OfromPastures',
				'N2OfromManure',
				'test'
			]))
		});
	}));

	router.post('/crops', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.crops(input, [
				'CO2eqTotal',
				'test'
			]))
		});
	}));

	return router;
}
