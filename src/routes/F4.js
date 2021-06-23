'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();
const navF4Ctrl = require('../controllers/L4/NavigatorF4Ctrl')();

module.exports = function () {

	router.post('/requirements', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object' || {};
		const liableFertilizers = navBestFertiCtrl.get(input.fertilizers);
		const applyForcedFertilizers = forcedFertilizers => {
			forcedFertilizers.forEach(fertilizer => {
				N-= fertilizer.amount*(fertilizer.N || 0)/100;
				P-= fertilizer.amount*(fertilizer.P || 0)/100;
				K-= fertilizer.amount*(fertilizer.K || 0)/100;
			});
			N = Math.max(N, 0);
			P = Math.max(P, 0);
			K = Math.max(K, 0);
		};
		const output = await navF4Ctrl.requeriments(input);
		let	N = output.Ncrop,
			P = output.P_maintenance,
			K = output.K_maintenance;
		res.json({
			results: [
				{
					cropID: input.cropID,
					nutrient_requirements: {
						Ncf: N,
						Pcf: P,
						Kcf: K,
						P2O5cf: output.P2O5_maintenance,
						K2Ocf: output.K2O_maintenance,
						Ninputs_terms: {
							Nwater: output.Nirrigation,
							NminInitial: output.Nc_s_initial
						},
						Noutputs_terms: {
							Nuptake : output.Nuptake,
							NminPostharvest: output.Nc_s_end
						}
					},
					fertilization: applyForcedFertilizers(input.applied || []) || navBestFertiCtrl.bestCombination(liableFertilizers, N, P, K, 0.0, 0.25*N)
				}
			]
		});
	}));

	return router;
}
