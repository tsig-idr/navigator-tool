'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navL1Ctrl = require('../controllers/NAVIGATOR_L1/NavigatorL1Ctrl')();

module.exports = function () {

	router.post('/nitro', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object' || {
			crop: 'Trigo Blando',
			soilDensity: 1.4,
			soilDepth: 35,
			soilStony: 0.15,
			soilOrganicMaterial: 0.018,
			soilDelta_N_NH4: 0.2,
			soilNmin_0: 16,
			soilDate_Nmin_0: '30/12/2014',
			cropDate: '12/01/2015',
			mineralizationSlowdown: 0.1,
			waterNitrate: 15
		};
		res.json({
			results: await navL1Ctrl.nitro(input, ['nitro4days'])
		});
	}));

	router.post('/swb', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object' || {
			crop: 'Trigo Blando',
			soilDensity: 1.4,
			soilDepth: 35,
			soilStony: 0.15,
			soilOrganicMaterial: 0.018,
			soilDelta_N_NH4: 0.2,
			soilNmin_0: 16,
			soilDate_Nmin_0: '30/12/2014',
			cropDate: '12/01/2015',
			mineralizationSlowdown: 0.1,
			waterNitrate: 15
		};
		res.json({
			results: await navL1Ctrl.swb(input, ['SWB4days'])
		});
	}));

	return router;
}
