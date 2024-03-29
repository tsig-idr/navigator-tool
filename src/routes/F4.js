'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();
const navF4Ctrl = require('../controllers/L4/NavigatorF4Ctrl')();
const dispatcher = async input => {
	const liableFertilizers = navBestFertiCtrl.get(input.fertilizers);
	const applied = input.applied || [];
	input.prices &&
		liableFertilizers.forEach(fertilizer => {
			let row;
			(row = input.prices.find(row => row[0] == fertilizer.fertilizerID)) &&
				(fertilizer.price = row[2]/1000);
		});
	!input.applied &&
		(input.applied = []);
	input.fertilizers = [];
	let output = await navF4Ctrl.requeriments(input),
		N = Math.max(output.Ncrop + output.Ndenitrification - output.Nc_mineralization_amendment, 0), 
		N_max = input.vulnerable == 'yes' && 170 || Number.MAX_VALUE, 
		P = Math.max(output.P_maintenance - applied.reduce((acc, fert) => acc + fert.amount*fert.P, 0)/100, 0),
		K = Math.max(output.K_maintenance - applied.reduce((acc, fert) => acc + fert.amount*fert.K, 0)/100, 0);
	input.applied = applied;
	input.fertilizers = liableFertilizers;
	output = await navF4Ctrl.data4fertilizers(input);
	input.fertilizers = navBestFertiCtrl.bestCombination(output.updated_fertilizers, N, P, K, 0.0, N_max);
	return await navF4Ctrl.requeriments(input);
};
module.exports.router = function () {
	router.post('/requirements', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		const output = await dispatcher(input);
		let N, P, K, P2O5, K2O;
		N = output.Ncrop;
		P = output.P_maintenance;
		K = output.K_maintenance;
		P2O5 = output.P2O5_maintenance;
		K2O = output.K2O_maintenance;
		const results = [
			{
				SOM: 1.5,
				tilled: 'no',
				drain_rate: output.drain_rate,
				fertilization: input.fertilizers, 
				...input
			}
		];
		req.query.format == 'v' &&
			(results[0].balance = {
				input: {
					Nmineralization: output.Nmineralization,
					Nfixation: output.Nfixation,
					Nwater: output.Nirrigation,
					NminInitial: output.Nc_s_initial,
					recommendedFertilizer: {
						N: input.fertilizers.reduce((acc, fert) => acc + fert.N, 0),
						P: input.fertilizers.reduce((acc, fert) => acc + fert.P, 0),
						K: input.fertilizers.reduce((acc, fert) => acc + fert.K, 0),
						P2O5: input.fertilizers.reduce((acc, fert) => acc + fert.P2O5, 0),
						K2O: input.fertilizers.reduce((acc, fert) => acc + fert.K2O, 0)
					},
					appliedFertilizer: {
						N: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.N || 0)/100, 0),
						P: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.P || 0)/100, 0),
						K: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.K || 0)/100, 0),
						P2O5: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.P || 0)/100, 0)*2.293,
						K2O: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.K || 0)/100, 0)*1.205
					}
				},
				output: {
					Nleaching: output.Nleaching,
					Uptake : {
						N: output.Nuptake,
						P: P,
						K: K,
						P2O5: P2O5,
						K2O: K2O
					},
					Ndenitrification: output.Ndenitrification,
					NminPostharvest: output.Nc_s_end,
					Nvolatilization: output.Nvolatilization
				}
			})
		||
			(results[0].nutrient_requirements = {
				Ncf: N,
				Pcf: P,
				Kcf: K,
				Ninputs_terms: {
					Nmineralization: output.Nmineralization,
					Nfixation: output.Nfixation,
					Nwater: output.Nirrigation,
					NminInitial: output.Nc_s_initial
				},
				Noutputs_terms: {
					Nleaching: output.Nleaching,
					Nuptake : output.Nuptake,
					Ndenitrification: output.Ndenitrification,
					NminPostharvest: output.Nc_s_end,
					Nvolatilization: output.Nvolatilization
				},
				P2O5cf: P2O5,
				K2Ocf: K2O,
			});
		res.json({
			results: results
		});
	}));
	return router;
};
module.exports.dispatcher = dispatcher;