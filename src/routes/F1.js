'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navL1Ctrl = require('../controllers/NAVIGATOR_L1/NavigatorF1Ctrl')();

module.exports = function () {

	router.post('/SNB/daily', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json(await navL1Ctrl.nitro(input, ['results']));
	}));
	
	router.post('/SNB/weekly', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: await navL1Ctrl.resume((await navL1Ctrl.nitro(input, ['results'])).results)
		});
	}));

	router.post('/SNB/calendar', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: await navL1Ctrl.nitro(input, calendarVars)
		});
	}));

	router.post('/SNB/full', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object',
			nitro = await navL1Ctrl.nitro(input, ['results', ...calendarVars]),
			resume = await navL1Ctrl.resume(nitro.results);
		nitro.SNB4days = nitro.results;
		nitro.SNB4weeks = resume;
		delete nitro.results;
		res.json({
			results: nitro
		});
	}));

	router.post('/SWB', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navL1Ctrl.swb(input, ['SWB4days'])).SWB4days
		});
	}));

	return router;
}

const calendarVars = [
	'pre_sowing_N_extrA_1',
	'top_dressing_1_N_extrA_1',
	'top_dressing_2_N_extrA_1',
	'top_dressing_3_N_extrA_1',
	'top_dressing_4_N_extrA_1',
	'top_dressing_5_N_extrA_1',
	'pre_sowing_N_mineralizado_A',
	'top_dressing_1_N_mineralizado_A',
	'top_dressing_2_N_mineralizado_A',
	'top_dressing_3_N_mineralizado_A',
	'top_dressing_4_N_mineralizado_A',
	'top_dressing_5_N_mineralizado_A',
	'pre_sowing_N_agua_A',
	'top_dressing_1_N_agua_A',
	'top_dressing_2_N_agua_A',
	'top_dressing_3_N_agua_A',
	'top_dressing_4_N_agua_A',
	'top_dressing_5_N_agua_A',
	'pre_sowing_Nl_A',
	'top_dressing_1_Nl_A',
	'top_dressing_2_Nl_A',
	'top_dressing_3_Nl_A',
	'top_dressing_4_Nl_A',
	'top_dressing_5_Nl_A',
	'pre_sowing_N_fert',
	'top_dressing_1_N_fert',
	'top_dressing_2_N_fert',
	'top_dressing_3_N_fert',
	'top_dressing_4_N_fert',
	'top_dressing_5_N_fert',
	'pre_sowing_Nh',
	'top_dressing_1_Nh',
	'top_dressing_2_Nh',
	'top_dressing_3_Nh',
	'top_dressing_4_Nh',
	'top_dressing_5_Nh',
	'pre_sowing_Balance',
	'top_dressing_1_Balance',
	'top_dressing_2_Balance',
	'top_dressing_3_Balance',
	'top_dressing_4_Balance',
	'top_dressing_5_Balance',
	'pre_sowing_N_recom',
	'top_dressing_1_N_recom',
	'top_dressing_2_N_recom',
	'top_dressing_3_N_recom',
	'top_dressing_4_N_recom',
	'top_dressing_5_N_recom'
];