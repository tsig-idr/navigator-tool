'use strict';

const router = require('express').Router();

const utils = require('../utils/utils');

const asyncHandler = require('express-async-handler');
const fs = require('fs');
const npkL3Ctrl = require('../controllers/NutrientsL3Ctrl')();
const navN3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorN3Ctrl')();

module.exports = function () {

	router.post('/fertilicalc', asyncHandler(async (req, res) => {
		let response = {"results": []}

		const crops = req.body.crops || req.params.crops; // || req.query.crops;
		const characteristics_plot  = req.body.plot || req.params.plot; // || req.query.plot;

		const params = {
			crops: crops,
			characteristics: characteristics_plot
		};
		
		npkL3Ctrl.calculateNPK(params);


		res.json( { message: 'Hello Fertilicalc'});
	}));



	router.post('/navigator-n3-npk', asyncHandler(async (req, res) => {
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

	router.get('/crops', asyncHandler(async (req, res) => {
		let response = {"results": []}	
		response.results = await navN3Ctrl.getCrops();
		res.json( response);
	}));

	router.get('/crop/:crop', asyncHandler(async (req, res) => {
		let response = {"results": []}	

		const crop = req.body.crop || req.params.crop || req.query.crop;
		response.results = await navN3Ctrl.getCrop(crop);
		res.json( response);
	}));




	// 👇 This is what you were missing in your code!
	return router;
}
