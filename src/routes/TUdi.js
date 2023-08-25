'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();
const tudiCtrl = require('../controllers/TUdi/TUdiCtrl')();

const dispatcher = async input => {
	const liableFertilizers = navBestFertiCtrl.get(input.fertilizers);
	input.prices &&
		liableFertilizers.forEach(fertilizer => {
			let row;
			(row = input.prices.find(row => row[0] == fertilizer.fertilizerID)) &&
				(fertilizer.price = row[2]/1000);
		});
	return await tudiCtrl.requeriments(input);
};

module.exports.router = function () {

	router.post('/fertilizers/optimization', asyncHandler(async (req, res) => {
		const include = typeof req.body.include === 'object' && req.body.include.length !== undefined && req.body.include 
				|| typeof req.params.include === 'object' && req.params.include.length !== undefined && req.params.include,
			exclude = typeof req.body.exclude === 'object' && req.body.exclude.length !== undefined && req.body.exclude
				|| typeof req.params.exclude === 'object' && req.params.exclude.length !== undefined && req.params.exclude,
			N = req.body.N && parseFloat(req.body.N) || req.params.N && parseFloat(req.params.N) || 0.0,
			P = req.body.P && parseFloat(req.body.P) || req.params.P && parseFloat(req.params.P) || 0.0,
			K = req.body.K && parseFloat(req.body.K) || req.params.K && parseFloat(req.params.K) || 0.0,
			S = req.body.S && parseFloat(req.body.S) || req.params.S && parseFloat(req.params.S) || 0.0,
			N_ur = (req.body.N_ur && parseFloat(req.body.N_ur) || req.params.N_ur && parseFloat(req.params.N_ur))*N || 0.0,
			fertilizers = navBestFertiCtrl.bestCombination(navBestFertiCtrl.get(include, exclude), N, P, K, S, N_ur);
		res.json({
			results: fertilizers,
			total: navBestFertiCtrl.aggregate(fertilizers)
		});
	}));

	router.post('/nutrients', asyncHandler(async (req, res) => {
		const input = typeof req.body === 'object' && req.body || req.params && typeof req.params === 'object' || {};
		const output = await dispatcher(input);
		/*const result = {};
		for (let key in output) {
			if (typeof output[key] != 'object'){
				result[key] = output[key];
			}
		}
		return res.json(result);*/
		res.json({
			requirements: {
				fertilizer: {
					N: output.N_req,
					P: output.P_req,
					K: output.K_req
				}
			},
			indicators: {
				balance: {
					N :output.N_bal,
					P :output.P_bal,
					K :output.K_bal
				},
				efficiency: {
					N :output.N_eff,
					P :output.P_eff,
					K :output.K_eff
				},
				C_applied: {
					N: output.C_applied
				}, 
				N2O_emission: {
					N: output.N2O_emission
				},
				NH3_volatilisation: {
					N: output.NH3_volatilisation
				},
				NO3_leaching: {
					N: output.NO3_leaching
				}
			}
		});
	}));

	return router;
};

module.exports.dispatcher = dispatcher;