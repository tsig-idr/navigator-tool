'use strict';

const router = require('express').Router();

const utils = require('../utils/utils');

const asyncHandler = require('express-async-handler');
const fs = require('fs');
const npkL3Ctrl = require('../controllers/NutrientsL3Ctrl')();
const navN3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorN3Ctrl')();
const navFerti3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorF3Ctrl')();
const navNR3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNR3Ctrl')();

module.exports = function () {

	/*
	* Nutrient requirements
	*/
	router.post('/navigator-n3', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;

		const params = {
			crops: crops,
			plot: characteristics_plot
		};
		
		response.results = await navN3Ctrl.nutrientNPKbalance(params);


		res.json( response);
	}));

	/*
	* Nutrient requirements & Fertilization
	*/
	router.post('/navigator-f3', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;
		const fertilizers = typeof req.body.fertilizers === 'object' && req.body.fertilizers.length !== undefined && req.body.fertilizers 
				|| typeof req.params.fertilizers === 'object' && req.params.fertilizers.length !== undefined && req.params.fertilizers;


		const params = {
			crops: crops,
			plot: characteristics_plot,
			fertilizers: fertilizers
		};
		//Requerimientos de nutrientes de los cultivos
		const nutrients = await navN3Ctrl.nutrientNPKbalance(params);

		//Para cada cultivo se calcula: Fertilizers, Desnitrification, volatilization , leaching

		for(var c = 0; c < nutrients.length; c++){
			var nu = { ...nutrients[c] };
			delete nu.cropID;
			delete nu.crop_latin_name;
			delete nu.crop_name;
			delete nu.crop_type;

			var item = {
				"cropID": nutrients[c].cropID,
				"crop_latin_name": nutrients[c].crop_latin_name,
				"crop_name": nutrients[c].crop_name,
				"crop_type": nutrients[c].crop_type,
				"nutrient_requirements" : nu,
				"fertilization" : [],
				"volatilization": 0, // Descartado
				"desnitrification": 0,
				"leaching": 0,	//Descartado
				"N_losses": 0,	// Descartado
				"acidification ": 0 //Descartado
			}

			// Preparar datos de fertilizantes
			const N = parseFloat(nutrients[c].Ncf_avg) || 0.0,
			P = parseFloat(nutrients[c].Pcf) || 0.0,
			K = parseFloat(nutrients[c].Kcf) || 0.0,
			S = parseFloat(nutrients[c].Scf) || 0.0,
			N_ur = parseFloat(nutrients[c].N_ur) || 0.0;

			const listFertilizers = fertilizers.map(e => {
				return {
					fertilizerID: e.fertilizerID,
					fertilizer_name: e.fertilizer_name,
					Ncf: (e.N_req || e.Ncf || 0),
					Pcf: (e.P_req || e.Pcf || 0),
					Kcf: (e.K_req || e.Kcf || 0),
					Scf: (e.S_req || e.Scf || 0),
					Ncf_ure: (e.lim_N_ur || e.Ncf_ure || 0),
					price: e.price || 0
				}
			});

			//Cantidad de fertilizante
			const fertilization = navFerti3Ctrl.bestCombination(listFertilizers, N, P, K, S, N_ur);
			
			/*
			item.fertilization = fertilization.map(e => {
				e.cropID = nutrients[c].cropID;
				e.crop_latin_name = nutrients[c].crop_latin_name;
				e.crop_name= nutrients[c].crop_name;
				e.crop_type= nutrients[c].crop_type;

				return e;
			});
			*/
			item.fertilization = fertilization;
			
			//desnitrificacion
			const desnitrification = navNR3Ctrl.desnitrification(params);
			item.desnitrification = (desnitrification) ? desnitrification.desnitrification : 0;
			//Volatilizacion asociada al fertilizante.
			//const fertilizerIDs = fertilizers.map(e => e.fertilizerID);
			//const objFertilizers = navFerti3Ctrl.get(fertilizerIDs, false);


			response.results.push(item);

		}
		res.json( response);
	}));

	

	router.get('/crops', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navN3Ctrl.getCrops();
		res.json( response);
	}));

	router.get('/crop/:cropID', asyncHandler(async (req, res) => {
		let response = {"results": []}	

		const cropID = req.body.cropID || req.params.cropID || req.query.cropID;
		response.results = await navN3Ctrl.getCrop(cropID);
		res.json( response);
	}));

	router.get('/soil/types', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navN3Ctrl.getTypesOfSoils();
		
		res.json( response);
	}));

	router.get('/pkstrategies', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navN3Ctrl.PKStrategies();
		res.json( response);
	}));




	// 👇 This is what you were missing in your code!
	return router;
}
