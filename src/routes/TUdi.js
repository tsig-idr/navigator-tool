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
			},
			balance_components: {
				N: {
					input: {
						N_atm :output.N_atm,
						Nmineralization :output.Nmineralization,
						prevNc_up_r :output.prevNc_up_r,
						N_graz_supply_total: output.N_graz_supply_total,
						N_man_supply_total: output.N_man_supply_total,
						N_min_supply_total: output.N_min_supply_total,
						prev_manure_legacyN_total: output.prev_manure_legacyN_total,
						Nc_fixation: output.Nc_fixation,
						Nc_irrigation: output.Nc_irrigation
					},
					output: {
						Nc_up_h: output.Nc_up_h,
						Nc_ex_h: output.Nc_ex_h,
						Ndenitrification: output.Ndenitrification,
						NH3volat_man_total: output.NH3volat_man_total,
						NH3_volatilization_graz_total: output.NH3_volatilization_graz_total,
						NH3volat_min_total: output.NH3volat_min_total
					}
				},
				P: {
					input: {
						prevPc_up_r :output.prevPc_up_r,
						P2O5_man_supply_total :output.P2O5_man_supply_total,
						P2O5_graz_supply_total :output.P2O5_graz_supply_total,
						P2O5_min_supply_total: output.P2O5_min_supply_total,
						Pc_status: output.Pc_status
					},
					output: {
						Pc_up_h: output.Pc_up_h,
						Pc_ex_h: output.Pc_ex_h
					}
				},
				K: {
					input: {
						prevKc_up_r :output.prevKc_up_r,
						K2O_man_supply_total :output.K2O_man_supply_total,
						K2O_graz_supply_total :output.K2O_graz_supply_total,
						K2O_min_supply_total: output.K2O_min_supply_total,
						Kc_status: output.Kc_status
					},
					output: {
						Kc_up_h: output.Kc_up_h,
						Kc_ex_h: output.Kc_ex_h
					}
				}
			}
		});
	}));

	return router;
};

module.exports.dispatcher = dispatcher;