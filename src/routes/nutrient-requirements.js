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

		const factorCrop =  req.body.factor_crop || req.params.factor_crop && req.query.factor_crop,
		method = req.body.method || req.params.method && req.query.method,
		fertilizerType = req.body.fertilizer_type || req.params.fertilizer_type && req.query.fertilizer_type,
		soilpH = req.body.pH || req.params.pH && req.query.pH,
		soilCEC = req.body.cec || req.params.cec && req.query.cec,
		climate = req.body.climate || req.params.climate && req.query.climate;

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

	router.get('/leaching', asyncHandler(async (req, res) => {

		
		res.json({
			results: "leaching"
		});
	}));

	return router;
}
