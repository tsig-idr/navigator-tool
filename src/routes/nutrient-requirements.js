'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navNR3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorNR3Ctrl')();

module.exports = function () {

	router.post('/desnitrification', asyncHandler(async (req, res) => {
		let som =  req.body.som && parseFloat(req.body.som) || req.params.som && parseFloat(req.params.som) || 0.0;
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
			som: som,
			waterSupply: water_supply,
			case: tillage,
			rateDrainage: rate_drainage
		};

		const item = navNR3Ctrl.desnitrification(params);

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

		const volatilization = navNR3Ctrl.volatilization(params);


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

		const leaching = navNR3Ctrl.leaching(params);

		res.json({
			results: leaching
		});
	}));

	router.get('/volatilization-fertilizer-types', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navNR3Ctrl.getVolatilizationFertilizerTypes();
		res.json( response);
	}));

	return router;
}
