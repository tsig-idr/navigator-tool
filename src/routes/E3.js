'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navE3Ctrl = require('../controllers/L3/NavigatorE3Ctrl')();

module.exports = function () {

	router.post('/epa', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		!input.electricity &&
			(input.electricity = []);
		!input.energy &&
			(input.energy = []);
		!input.biomass &&
			(input.biomass = []);
		!input.fuels &&
			(input.fuels = []);
		res.json({
			results: (await navE3Ctrl.epa(input, [
				'TDC',
				'GM',
				'OI'
			]))
		});
	}));

	return router;
}
