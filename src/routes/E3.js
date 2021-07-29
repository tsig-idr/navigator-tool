'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navE3Ctrl = require('../controllers/L3/NavigatorE3Ctrl')();
const dispatcher = async input => {
	!input.electricity &&
		(input.electricity = []);
	!input.energy &&
		(input.energy = []);
	!input.biomass &&
		(input.biomass = []);
	!input.fuels &&
		(input.fuels = []);
	return await navE3Ctrl.epa(input, [
		'TDC',
		'GM',
		'OI'
	]);
};
module.exports.router = function () {
	router.post('/epa', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatcher(input)
		});
	}));
	return router;
};
module.exports.dispatcher = dispatcher;
