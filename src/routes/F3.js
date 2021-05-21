'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const navNutri3FertilicalcCtrl = require('../controllers/NAVIGATOR_L3/NavigatorNutrient3FertilicalcCtrl')();
const navNBalance3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNBalance3Ctrl')();
const navBestFertiCtrl = require('../controllers/NAVIGATOR_L3/NavigatorBestFertilizerCtrl')();
const navNF3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNF3Ctrl')();
const navF3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorF3Ctrl')();

module.exports = function () {

	router.post('/navigator-n3-requeriments', asyncHandler(async (req, res) => {
		let response = {"results": []}
		const crops = req.body.crops || req.params.crops;
		const characteristics_plot  = req.body.plot || req.params.plot;
		const fertilization =  req.body.fertilization || req.params.fertilization;
		const soil = req.body.soil || req.params.soil;
		const params = {
			crops: crops,
			plot: characteristics_plot,
			fertilization: fertilization,
			soil: soil
		}
		response.results = await navNF3Ctrl.NPKrequeriments(params);
		res.json(response);
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
		const soilTextureObj = await navNF3Ctrl.getSoilTexture(params.soil.soil_texture);
		const crops_nutrients = await navNF3Ctrl.NPKrequeriments(params);
		const water_supply = (params.plot.water_supply == 1 || params.plot.water_supply == 'on') ? 1: 0;
		const pH = (params.soil.pH) || 7;
		const CEC = (params.CEC) || soilTextureObj.CEC || 0;
		let listFertilizers = _tranformFertilizer(params.fertilizers);
		const NPKTotal = _sumFertilizer(listFertilizers);
		for(var c = 0; c < crops_nutrients.length; c++){
			var item = { ...crops_nutrients[c] };
			let fertilizationUser = _getFertilizationAppliedByUser(listFertilizers);
			// Se restan los NPK ya aplicados por el usuario
			const _NPKrequeriments = _calculeNewNPKrequirements(fertilizationUser, item.nutrient_requirements);
			//Preparamos la nueva lista de fertilizantes, se quitan los fertilizantes fijados por el usuario
			const listFertilizersWithAmount = listFertilizers.filter(e => e.amount === 0);
			const NPKTotalToApply = _sumFertilizer(listFertilizersWithAmount);
			listFertilizersWithAmount.push(getFertilizerNone(NPKTotalToApply));
			let fertilizationAuto = [];
			if (listFertilizersWithAmount.length > 1){
				fertilizationAuto = navBestFertiCtrl.bestCombination(listFertilizersWithAmount, _NPKrequeriments.N, _NPKrequeriments.P, _NPKrequeriments.K, _NPKrequeriments.S, _NPKrequeriments.N_ur);
			}
			//Cantidad de fertilizante
			let fertilization = [...fertilizationUser, ...fertilizationAuto];
			//Eliminar el fertilizante temporal de suplemento
			fertilization = fertilization.filter(elm => elm.fertilizerID !== 'none');
			for(var f =0; f< fertilization.length; f++){
				const element = fertilization[f];
				const fertilizerObj = listFertilizers.find(e => e.fertilizerID === element.fertilizerID );
				const application_method = (fertilizerObj.application_method) || 'incorporated';
				const volaObj = await navNF3Ctrl.Nvolatilization (water_supply, pH, CEC, application_method, fertilizerObj.fertilizerID);
				fertilization[f].volatilization = {
					vola_coef: volaObj.vola_coeff, 
					total: element.amount*volaObj.vola_coeff 
				}
			}
			item.fertilization = fertilization;
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
		for (var c = 0; c < nutrients.length; c++) {
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

	router.post('/desnitrification', asyncHandler(async (req, res) => {
		let som =  req.body.som && parseFloat(req.body.som) || req.params.som && parseFloat(req.params.som) || req.body.SOM && parseFloat(req.body.SOM) || req.params.SOM && parseFloat(req.params.SOM) || 0.0;
		if(req.body.plot && req.body.plot.som){
			som = req.body.plot.som;
		}
		let water_supply =  req.body.water_supply && parseFloat(req.body.water_supply) || req.params.water_supply && parseFloat(req.params.water_supply) || req.query.water_supply ||0; // 0=>  Irrigated/humid; 1=> Rainfed /dry
		if(req.body.plot && req.body.plot.water_supply){
			water_supply = req.body.plot.water_supply;
		}
		let tillage = req.body.case || req.params.case || req.query.case;
		if(req.body.plot && req.body.plot.case){
			tillage = req.body.plot.case;
		}
		let rate_drainage = req.body.drainage || req.params.drainage || req.query.drainage;
		if(req.body.plot && req.body.plot.drainage){
			rate_drainage = req.body.plot.drainage;
		}
		const params = {
			SOM: som,
			waterSupply: water_supply,
			case: tillage,
			rateDrainage: rate_drainage
		};
		const item = navNBalance3Ctrl.desnitrification(params);
		res.json({
			results: item
		});
	}));

	router.post('/volatilization', asyncHandler(async (req, res) => {
		const factorCrop =  req.body.factor_crop || req.params.factor_crop || req.query.factor_crop,
		method = req.body.method || req.params.method && req.query.method,
		fertilizerType = req.body.fertilizer_type || req.params.fertilizer_type || req.query.fertilizer_type,
		soilpH = req.body.pH || req.params.pH || req.query.pH,
		soilCEC = req.body.cec || req.params.cec || req.query.cec || req.body.CEC || req.params.CEC || req.query.CEC || req.query.plot.CEC,
		climate = req.body.climate || req.params.climate || req.query.climate;
		const params = {
			crop: factorCrop,
			method: method,
			fertilizer : fertilizerType,
			soilpH: soilpH,
			soilCEC: soilCEC,
			climate: climate
		}
		const volatilization = navNBalance3Ctrl.volatilization(params);
		res.json({
			results: volatilization
		});
	}));

	router.post('/leaching', asyncHandler(async (req, res) => {
		const Ninit =  req.body.Ninit && parseFloat(req.body.Ninit) || req.params.Ninit && parseFloat(req.params.Ninit) || req.query.Ninit && parseFloat(req.query.Ninit),
		Z = req.body.Z && parseFloat(req.body.Z) || req.params.Z && parseFloat(req.params.Z) || req.query.Z && parseFloat(req.query.Z),
		P = req.body.P && parseFloat(req.body.P) || req.params.P && parseFloat(req.params.P) || req.query.P && parseFloat(req.query.P),
		averageWaterPercolation = req.body.average_water_percolation && parseFloat(req.body.average_water_percolation) || req.params.average_water_percolation && parseFloat(req.params.average_water_percolation) || req.query.average_water_percolation && parseFloat(req.query.average_water_percolation),
		Pw = req.body.Pw && parseFloat(req.body.Pw) || req.params.Pw && parseFloat(req.params.Pw) || req.query.pw && parseFloat(req.query.Pw),
		coverType = req.body.cover_type  || req.params.cover_type || req.query.cover_type,
		treatment = req.body.treatment  || req.params.treatment || req.query.treatment,
		hidrologic = req.body.hidrologic  || req.params.hidrologic || req.query.hidrologic || "good",
		soilHidroGroup = req.body.soil_hidro_group  || req.params.soil_hidro_group || req.query.soil_hidro_group || "A";
		const params = {
			Ninit: Ninit,
			Z: Z,
			P: P,
			averageWaterPercolation: averageWaterPercolation,
			Pw: Pw,
			coverType: coverType,
			treatment: treatment,
			hidrologic: hidrologic,
			soilHidrologicaGroup: soilHidroGroup
		}
		const leaching = navNBalance3Ctrl.leaching(params);
		res.json({
			results: leaching
		});
	}));

	router.get('/volatilization-fertilizer-types', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNBalance3Ctrl.getVolatilizationFertilizerTypes();
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
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navF3Ctrl.requeriments(input, [
				'Nuptake',
				'Nuptake_min',
				'Nuptake_max',
				'P_sufficiency',
				'P_minBM',
				'P_maxBM',
				'P_maintenance',
				'test'
			]))
		});
	}));

	return router;
}

function getFertilizerNone(aggregated){
	// se agrega un fertilizante "none" que cubra los elementos NPKS(N_ur) no cubiertos para poder realizar el bestferlizer
	return {
		fertilizerID: 'none',
		fertilizer_name: 'none',
		nitrogen: {
			Ncf: (aggregated.N != 0) ? 0: 0.001,
			Ncf_ure: 0},
		phosphorus: {Pcf: (aggregated.P != 0) ? 0: 0.001},
		potassium: {Kcf:  (aggregated.K != 0) ? 0: 0.001},
		sulphur: {Scf: (aggregated.S != 0) ? 0: 0.001},
		price: 9999,
		application_method: 'incorporated'
	}
}

function _calculeNewNPKrequirements(fertilization_applied_user, nutrient_requirements){
	let N = parseFloat(nutrient_requirements.Ncf_avg) || 0.0,
	P = parseFloat(nutrient_requirements.Pcf) || 0.0,
	K = parseFloat(nutrient_requirements.Kcf) || 0.0,
	S = parseFloat(nutrient_requirements.Scf) || 0.0,
	N_ur = parseFloat(nutrient_requirements.N_ur) || 0.0;
	for(var f = 0; f < fertilization_applied_user.length; f++){
		var item = fertilization_applied_user[f];
		if (item.amount > 0){
			N = N - (item.N);
			P = P - (item.P);
			K = K - (item.K);
			S = S - (item.S);
			N_ur = N_ur - (item.N_ur);
		}
	}
	return {
		N: N ? N : 0,
		P: P ? P : 0,
		K: K ? K : 0,
		S: S ? S : 0,
		N_ur: N_ur > 0 ? N_ur : 0
	}
}

function _sumFertilizer(fertilizers){
	const aggregated = {
		amount: 0,
		N: 0,
		P: 0,
		K: 0,
		S: 0,
		N_ur: 0,
		cost: 0
	};
	fertilizers.forEach(fertilizer => {
		aggregated.amount += fertilizer.amount;
		aggregated.N += parseFloat(fertilizer.nitrogen.Ncf) || 0.0,
		aggregated.P += parseFloat(fertilizer.phosphorus.Pcf) || 0.0,
		aggregated.K = parseFloat(fertilizer.potassium.Kcf) || 0.0,
		aggregated.S = parseFloat(fertilizer.sulphur.Scf) || 0.0,
		aggregated.N_ur = parseFloat(fertilizer.nitrogen.N_ure) || 0.0;
		aggregated.price += (fertilizer.price) || 0;
	});
	return aggregated;
}

function _tranformFertilizer(fertilizers) {
	return fertilizers.map(e => {
		let amount = 0;
		try{
			amount = parseFloat(e.amount);
			if (isNaN(amount)) {
				amount = 0;
			}
		}
		catch(e){
			amount = 0;
		}
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
			price: e.price || 0,
			amount: amount || 0,
			application_method: e.application_method || 'incorporated'
		}
	});
}

function _getFertilizationAppliedByUser (fertilizers){
	const fertilizersToApply = fertilizers.filter(f => f.amount !==0);
	const results = fertilizersToApply.map(f => {
		const Q = f.amount;
		return {
			fertilizerID: f.fertilizerID,
			fertilizer_name: f.fertilizer_name,
			amount: Q || 0,
			N: Q*(f.Ncf || f.nitrogen.Ncf || 0),
			P: Q*(f.Pcf || f.phosphorus.Pcf || 0),
			K: Q*(f.Kcf || f.potassium.Kcf || 0),
			S: Q*(f.Scf || f.sulphur.Scf || 0),
			N_ur: Q*(f.Ncf_ure || f.nitrogen.Ncf_ure || 0),
			cost: Q*(f.price || 0)
		}
	})
	return results;
}