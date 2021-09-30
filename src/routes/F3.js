'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navNutri3FertilicalcCtrl = require('../controllers/L3/NavigatorNutrient3FertilicalcCtrl')();
const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();
const navNF3Ctrl = require('../controllers/L3/NavigatorNF3Ctrl')();
const navF3Ctrl = require('../controllers/L3/NavigatorF3Ctrl')();

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
	let output = await navF3Ctrl.requeriments(input),
		N = Math.max(output.Ncrop_avg + output.Ndenitrification - output.Nc_mineralization_amendment, 0), 
		N_ur = Math.max(0.25*(output.Ncrop_avg + output.Ndenitrification) - applied.reduce((acc, fert) => acc + fert.amount*fert.N_ur, 0)/100, 0), 
		P = applied.reduce((acc, fert) => acc + fert.amount*fert.P, 0)/100,
		K = applied.reduce((acc, fert) => acc + fert.amount*fert.K, 0)/100;
	switch (input.PK_strategy) {
		case 'maximum-yield':
			P = Math.max(output.P_maxBM - P, 0);
			K = Math.max(output.K_maxBM - K, 0);
			break;
		case 'minimum-fertilizer':
			P = Math.max(output.P_minBM - P, 0);
			K = Math.max(output.K_minBM - K, 0);
			break;
		case 'sufficiency':
			P = Math.max(output.P_sufficiency - P, 0);
			K = Math.max(output.K_sufficiency - K, 0);
			break;
		case 'maintenance':
			P = Math.max(output.P_maintenance - P, 0);
			K = Math.max(output.K_maintenance - K, 0);
			break;
		default:
			break;
	}
	input.applied = applied;
	input.fertilizers = liableFertilizers;
	output = await navF3Ctrl.data4fertilizers(input);
	input.fertilizers = navBestFertiCtrl.bestCombination(output.updated_fertilizers, N, P, K, 0.0, N_ur);
	return await navF3Ctrl.requeriments(input);
};

module.exports.router = function () {

	router.get('/crops', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNutri3FertilicalcCtrl.getCrops();
		res.json( response);
	}));

	router.get('/crop/:cropID', asyncHandler(async (req, res) => {
		let response = {"results": []}	

		const cropID = req.body.cropID || req.params.cropID || req.query.cropID;
		response.results = await navNutri3FertilicalcCtrl.getCrop(cropID);
		res.json( response);
	}));

	router.get('/soil/types', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNutri3FertilicalcCtrl.getTypesOfSoils();
		
		res.json( response);
	}));

	router.get('/pkstrategies', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNutri3FertilicalcCtrl.PKStrategies();
		res.json( response);
	}));

	router.get('/soil-textures', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNF3Ctrl.getSoilTextures();
		res.json( response);
	}));

	router.get('/soil-texture/:soilTextureID', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		const soil_texture = req.body.soilTextureID || req.params.soilTextureID || req.query.soilTextureID;
		response.results = await navNF3Ctrl.getSoilTexture(soil_texture);
		res.json( response);
	}));

	router.get('/climate-zones', asyncHandler(async (req, res) => {
		let response = {"results": []}
		response.results = await navNF3Ctrl.getClimaticZones();
		res.json( response);
	}));

	router.get('/climate-zone/:climaticZoneID', asyncHandler(async (req, res) => {
		let response = {"results": []}
		const climate_zone = req.body.climaticZoneID || req.params.climaticZoneID || req.query.climaticZoneID;
		response.results = await navNF3Ctrl.getClimaticZone(climate_zone);
		res.json( response);
	}));

	router.get('/fertilizers/all', asyncHandler(async (req, res) => {
		const names = typeof req.query.names === 'string' && req.query.names.split(',');
		res.json({
			results: navBestFertiCtrl.get(names, false)
		});
	}));

	router.get('/fertilizers/organics', asyncHandler(async (req, res) => {
		const names = typeof req.query.names === 'string' && req.query.names.split(',');
		res.json({
			results: navBestFertiCtrl.getOrganic(names, false)
		});
	}));

	router.get('/fertilizers/:fertilizerID', asyncHandler(async (req, res) => {
		const fertilizerID = req.params.fertilizerID || req.query.fertilizerID; 
		res.json({
			results: navBestFertiCtrl.getFertilizerID(fertilizerID)
		});
	}));

	router.get('/fertilizers/optimization', asyncHandler(async (req, res) => {
		const include = typeof req.query.include === 'string' && req.query.include.split(','),
			exclude = typeof req.query.exclude === 'string' && req.query.exclude.split(','),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0,
			S = typeof req.query.S === 'string' && parseFloat(req.query.S) || 0.0,
			N_ur = typeof req.query.N_ur === 'string' && parseFloat(req.query.N_ur)*N || 0.0,
			fertilizers = navBestFertiCtrl.bestCombination(navBestFertiCtrl.get(include, exclude), N, P, K, S, N_ur);
		res.json({
			results: fertilizers,
			total: navBestFertiCtrl.aggregate(fertilizers)
		});
	}));

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

	router.post('/requirements', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		const output = await dispatcher(input);
		let N, P, K, P2O5, K2O;
		N = output.Ncrop_avg;
		switch (input.PK_strategy) {
			case 'maximum-yield':
				P = output.P_maxBM;
				P2O5 = output.P2O5_maxBM;
				K = output.K_maxBM;
				K2O = output.K2O_maxBM;
				break;
			case 'minimum-fertilizer':
				P = output.P_minBM;
				P2O5 = output.P2O5_minBM;
				K = output.K_minBM;
				K2O = output.K2O_minBM;
				break;
			case 'sufficiency':
				P = output.P_sufficiency;
				P2O5 = output.P2O5_sufficiency;
				K = output.K_sufficiency;
				K2O = output.K2O_sufficiency;
				break;
			case 'maintenance':
				P = output.P_maintenance;
				P2O5 = output.P2O5_maintenance;
				K = output.K_maintenance;
				K2O = output.K2O_maintenance;
				break;
			default:
				break;
		}
		const results = [
			{
				drain_rate: output.drain_rate,
				fertilization: input.fertilizers, 
				...input,
				dose_irrigation: input.water_supply == '1' && input.dose_irrigation || 0,
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
						P2O5: input.fertilizers.reduce((acc, fert) => acc + fert.P2O5, 0),
						K: input.fertilizers.reduce((acc, fert) => acc + fert.K, 0),
						K2O: input.fertilizers.reduce((acc, fert) => acc + fert.K2O, 0)
					},
					appliedFertilizer: {
						N: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.N || 0)/100, 0),
						P: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.P || 0)/100, 0),
						P2O5: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.P || 0)/100, 0)*2.293,
						K: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.K || 0)/100, 0),
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
				Ncf_min: output.Ncrop_min,
				Ncf_max: output.Ncrop_max,
				Ncf_avg: N,
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
					Nuptake_min: output.Nuptake_min,
					Nuptake_max: output.Nuptake_max,
					Ndenitrification: output.Ndenitrification,
					NminPostharvest: output.Nc_s_end,
					Nvolatilization: output.Nvolatilization
				}
			});
		res.json({
			results: results
		});
	}));

	return router;
};

module.exports.dispatcher = dispatcher;