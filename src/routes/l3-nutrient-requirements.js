'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const fs = require('fs');

const navNutri3FertilicalcCtrl = require('../controllers/NAVIGATOR_L3/NavigatorNutrient3FertilicalcCtrl')();
const navNBalance3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNBalance3Ctrl')();
const navBestFertiCtrl = require('../controllers/NavigatorBestFertilizerCtrl')();
const navNF3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNF3Ctrl')();

module.exports = function () {

	router.post('/navigator-n3-requeriments', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;
		const fertilization =  req.body.fertilization || req.params.fertilization;
		const soil = req.body.soil || req.params.soil;

		const params = {
			crops: crops,
			plot: characteristics_plot,
			fertilization: fertilization,
			soil: soil
		}

		response.results = await navNF3Ctrl.NPKrequeriments(params);

		res.json( response);

	}));


	router.post('/navigator-n3-requeriments-fertilizers', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;
		const fertilization =  req.body.fertilization || req.params.fertilization;
		const soil = req.body.soil || req.params.soil;
		const fertilizers = typeof req.body.fertilizers === 'object' && req.body.fertilizers.length !== undefined && req.body.fertilizers 
				|| typeof req.params.fertilizers === 'object' && req.params.fertilizers.length !== undefined && req.params.fertilizers;

		const params = {
			crops: crops,
			plot: characteristics_plot,
			fertilization: fertilization,
			soil: soil,
			fertilizers: fertilizers
		}

		const crops_nutrients = await navNF3Ctrl.NPKrequeriments(params);

		/* // Total nutrientes de los cultivos
		var totalNutrients = {
			N:  crops_nutrients.reduce((a, b) => +a + +b.Ncf_avg, 0),
			P:  crops_nutrients.reduce((a, b) => +a + +b.Pcf, 0),
			K:  crops_nutrients.reduce((a, b) => +a + +b.Kcf, 0),
			S:  crops_nutrients.reduce((a, b) => +a + +b.Scf, 0),
			N_ur :  crops_nutrients.reduce((a, b) => +a + +b.Ncf_ure, 0),
		  }

		for (const [key, value] of Object.entries(totalNutrients)) {
			if(isNaN(value))
				totalNutrients[key] = 0;
		}
		*/


		// Preparar datos de fertilizantes
		const listFertilizers = fertilizers.map(e => {
			return {
				fertilizerID: e.fertilizerID,
				fertilizer_name: e.fertilizer_name,
				nitrogen: {
					Ncf: (e.N_req || e.Ncf || 0),
					Ncf_ure: (e.lim_N_ur || e.Ncf_ure || 0),
				},
				phosphorus: {
					Pcf: (e.P_req || e.Pcf || 0),
				},
				potassium: {
					Kcf: (e.K_req || e.Kcf || 0),
				},
				sulphur: {
					Scf: (e.S_req || e.Scf || 0),
				},
				price: e.price || 0
			}
		});

		for(var c = 0; c < crops_nutrients.length; c++){
			var nu = { ...crops_nutrients[c] };
			delete nu.cropID;
			delete nu.crop_latin_name;
			delete nu.crop_name;
			delete nu.crop_type;

			var item = {
				"cropID": crops_nutrients[c].cropID,
				"crop_latin_name": crops_nutrients[c].crop_latin_name,
				"crop_name": crops_nutrients[c].crop_name,
				"crop_type": crops_nutrients[c].crop_type,
				"nutrient_requirements" : nu,
				"fertilization" : [],
				"volatilization": 0, // Descartado
				"desnitrification": 0,
				"leaching": 0,	//Descartado
				"N_losses": 0,	// Descartado
				"acidification ": 0 //Descartado
			}

			// Preparar datos de fertilizantes
			const N = parseFloat(crops_nutrients[c].Ncf_avg) || 0.0,
			P = parseFloat(crops_nutrients[c].Pcf) || 0.0,
			K = parseFloat(crops_nutrients[c].Kcf) || 0.0,
			S = parseFloat(crops_nutrients[c].Scf) || 0.0,
			N_ur = parseFloat(crops_nutrients[c].N_ur) || 0.0;

			//Cantidad de fertilizante
			item.fertilization = navBestFertiCtrl.bestCombination(listFertilizers, N, P, K, S, N_ur);

			response.results.push(item);
		}

		res.json( response);

	}));


	/*
	* Nutrient requirements
	*/
	router.post('/n3-fertilicalc', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;

		const params = {
			crops: crops,
			plot: characteristics_plot
		};
		
		response.results = await navNutri3FertilicalcCtrl.nutrientNPKbalance(params);

		res.json( response);
	}));

	/*
	* Nutrient requirements & Fertilization
	*/
	router.post('/n3-fertilicalc-fertilizers', asyncHandler(async (req, res) => {
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
		//External nutrients requirements
		const nutrients = await navNutri3FertilicalcCtrl.nutrientNPKbalance(params);

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
					nitrogen: {
						Ncf: (e.N_req || e.Ncf || 0),
						Ncf_ure: (e.lim_N_ur || e.Ncf_ure || 0),
					},
					phosphorus: {
						Pcf: (e.P_req || e.Pcf || 0),
					},
					potassium: {
						Kcf: (e.K_req || e.Kcf || 0),
					},
					sulphur: {
						Scf: (e.S_req || e.Scf || 0),
					},
					price: e.price || 0
				}
			});

			//Cantidad de fertilizante
			const fertilization = navBestFertiCtrl.bestCombination(listFertilizers, N, P, K, S, N_ur);
			
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
			const desnitrification = navNBalance3Ctrl.desnitrification(params);
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





	// 👇 This is what you were missing in your code!
	return router;
}
