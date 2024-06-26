'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navL2Ctrl = require('../controllers/L2/NavigatorF2Ctrl')();
const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();

const dispatcher = async input => {
	let row;
	input.fertilizers = navBestFertiCtrl.get(input.fertilizers);
	input.prices &&
		input.fertilizers.forEach(fertilizer => {
			(row = input.prices.find(row => row[0] == fertilizer.fertilizerID)) &&
				(fertilizer.price = row[2]/1000);
		});
	await navL2Ctrl.data4fertilizers(input);
	!input.applications &&
		(input.applications = []);
	input.planning_done = {};
	input.planning_todo = {};
	input.startDate = input.crop_startDate;
	input.applications.sort((a, b) => new Date(a.date) - new Date(b.date));
	input.applications.forEach((application, i) => {
		(row = input.fertilizers.find(row => row.fertilizerID == application.type)) &&
			(application = {...row, ...application});
		if (application.amount) {
			application.date < input.startDate &&
				(input.startDate = application.date);
			input.planning_done[application.date] = application;
		}
		else {
			application.nextdate = i + 1 < input.applications.length ? input.applications[i + 1].date : input.crop_endDate;
			input.planning_todo[application.date] = application;
		}
	});
	let output = await navL2Ctrl.nitro(input);
	let P, K;
	switch (input.PK_strategy) {
		case 'maximum-yield':
			P = Math.max(output.P_maxBM, 0);
			K = Math.max(output.K_maxBM, 0);
			break;
		case 'minimum-fertilizer':
			P = Math.max(output.P_minBM, 0);
			K = Math.max(output.K_minBM, 0);
			break;
		case 'sufficiency':
			P = Math.max(output.P_sufficiency, 0);
			K = Math.max(output.K_sufficiency, 0);
			break;
		case 'maintenance':
			P = Math.max(output.P_maintenance, 0);
			K = Math.max(output.K_maintenance, 0);
			break;
		default:
			P = 0;
			K = 0;
			break;
	}
	input.fertilizers.pop();
	input.applications.forEach((application, i) => {
		application.date in output.planning_done_ &&
			(input.applications[i] = output.planning_done_[application.date]);
		application.date in output.planning_todo_ &&
			(input.applications[i] = output.planning_todo_[application.date]);
	});
	input.planning_done = {};
	input.planning_todo = {};
	input.applications.forEach((application, i) => {
		if (application.type == '#') {
			(row = output.results.find(row => row.Fecha == application.date)) &&
				(input.applications[i] = navBestFertiCtrl.bestOne(input.fertilizers, Math.max(row.N_rate_, 0), P, K));
			input.applications[i].P &&
				(P-= input.applications[i].P);
			input.applications[i].K &&
				(K-= input.applications[i].K);
			!input.applications[i].amount &&
				(input.applications[i].fertilizer_name = 'Not needed') &&
				(input.applications[i].method = 'Not applicable');
			input.applications[i].date = application.date;
		}
		else {
			!(application.date in input.planning_done) &&
				(input.applications[i].cost = application.amount*(application.price || 0));
			input.applications[i].N = application.amount*(application.Nbf || 0)/100;
			input.applications[i].P = application.amount*(application.Pcf || application.phosphorus.Pcf || 0)/100;
			input.applications[i].K = application.amount*(application.Kcf || application.potassium.Kcf || 0)/100;
			P-= input.applications[i].P;
			K-= input.applications[i].K;
		}
		P = Math.max(P, 0);
		K = Math.max(K, 0);
		(row = input.fertilizers.find(row => row.fertilizerID == input.applications[i].fertilizerID)) &&
			(application = {...row, ...input.applications[i]});
		input.planning_done[application.date] = application;
	});
	output = await navL2Ctrl.nitro(input);
	return {
		balance: output.results.map(day => {
			const outvars = ['Fecha', 'N_rate', 'N_deni', 'N_fert', 'N_recom', 'N_mineral_soil', 'N_mineralizado', 'N_NO3', 'N_agua', 'N_curve', 'Nl', 'N_extr_', 'N_extr_1', 'N_extr', 'Eto_tipo', 'Eto_real', 'Prec_efec', 'Riego_efec', 'Tm', 'BBCH', 'BBCH_tipo', 'BBCH_real_et', 'NDVI_tipo', 'NDVI_real'];
			for (const outvar in day) {
				if (!outvars.includes(outvar)) {
					delete day[outvar];
				}
			}
			return day;
		}),
		fertilization: input.applications
	};
};

module.exports.router = function () {

	router.post('/SWB', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input === 'object' && req.params.input || {};
		res.json({
			results: Object.values((await navL2Ctrl.swb(input, ['SWB4days'])).SWB4days)
		});
	}));

	router.post('/SNB/daily', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input === 'object' && req.params.input || {};
		res.json({
			results: (await dispatcher(input)).balance
		});
	}));
	
	router.post('/SNB/weekly', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input === 'object' && req.params.input || {};
		res.json({
			results: await navL2Ctrl.resume((await dispatcher(input)).balance)
		});
	}));

	router.post('/SNB/calendar', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input === 'object' && req.params.input || {};
		res.json({
			results: (await dispatcher(input)).fertilization
		});
	}));

	return router;
};

module.exports.dispatcher = dispatcher;
