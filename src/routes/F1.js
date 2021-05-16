'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navL1Ctrl = require('../controllers/NAVIGATOR_L1/NavigatorF1Ctrl')();

module.exports = function () {

	router.post('/SWB', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: Object.values((await navL1Ctrl.swb(input, ['SWB4days'])).SWB4days)
		});
	}));

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

	return router;
}

const calendarVars = [
	'presowing_N_extrA_1',
	'topdressing1_N_extrA_1',
	'topdressing2_N_extrA_1',
	'topdressing3_N_extrA_1',
	'topdressing4_N_extrA_1',
	'topdressing5_N_extrA_1',
	'presowing_N_mineralizado_A',
	'topdressing1_N_mineralizado_A',
	'topdressing2_N_mineralizado_A',
	'topdressing3_N_mineralizado_A',
	'topdressing4_N_mineralizado_A',
	'topdressing5_N_mineralizado_A',
	'presowing_N_agua_A',
	'topdressing1_N_agua_A',
	'topdressing2_N_agua_A',
	'topdressing3_N_agua_A',
	'topdressing4_N_agua_A',
	'topdressing5_N_agua_A',
	'presowing_Nl_A',
	'topdressing1_Nl_A',
	'topdressing2_Nl_A',
	'topdressing3_Nl_A',
	'topdressing4_Nl_A',
	'topdressing5_Nl_A',
	'presowing_N_fert',
	'topdressing1_N_fert',
	'topdressing2_N_fert',
	'topdressing3_N_fert',
	'topdressing4_N_fert',
	'topdressing5_N_fert',
	'presowing_Nh',
	'topdressing1_Nh',
	'topdressing2_Nh',
	'topdressing3_Nh',
	'topdressing4_Nh',
	'topdressing5_Nh',
	'presowing_Balance',
	'topdressing1_Balance',
	'topdressing2_Balance',
	'topdressing3_Balance',
	'topdressing4_Balance',
	'topdressing5_Balance',
	'presowing_N_recom',
	'topdressing1_N_recom',
	'topdressing2_N_recom',
	'topdressing3_N_recom',
	'topdressing4_N_recom',
	'topdressing5_N_recom',
	'presowing_N_neto',
	'topdressing1_N_neto',
	'topdressing2_N_neto',
	'topdressing3_N_neto',
	'topdressing4_N_neto',
	'topdressing5_N_neto',
	'presowing_N_bruto',
	'topdressing1_N_bruto',
	'topdressing2_N_bruto',
	'topdressing3_N_bruto',
	'topdressing4_N_bruto',
	'topdressing5_N_bruto',
	'presowing_Fertilizante',
	'topdressing1_Fertilizante',
	'topdressing2_Fertilizante',
	'topdressing3_Fertilizante',
	'topdressing4_Fertilizante',
	'topdressing5_Fertilizante',
	'presowing_UFN',
	'topdressing1_UFN',
	'topdressing2_UFN',
	'topdressing3_UFN',
	'topdressing4_UFN',
	'topdressing5_UFN'
];