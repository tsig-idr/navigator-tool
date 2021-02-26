'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const L3FertilicalcFertilizersCtrl = require('../controllers/L3Fertilicalc/fertilizersCtrl')();

module.exports = function () {

	router.post('/best', asyncHandler(async (req, res) => {

		const include = typeof req.query.include === 'string' && req.query.include.split(','),
			exclude = typeof req.query.exclude === 'string' && req.query.include.split(','),
			fertilizers = L3FertilicalcFertilizersCtrl.get(include, exclude),
			Nitro = req.body.N || req.params.N || req.query.N,
			Phosphorus = req.body.P || req.params.P || req.query.P,
			Potassium = req.body.K || req.params.K || req.query.K,
			Sulfur = req.body.S || req.params.S || req.query.S,
			NitroUreic = req.body.Nu || req.params.Nu || req.query.Nu,
			N = typeof Nitro === 'string' && parseFloat(Nitro) || 0.0,
			P = typeof Phosphorus === 'string' && parseFloat(Phosphorus) || 0.0,
			K = typeof Potassium === 'string' && parseFloat(Potassium) || 0.0;
		res.json(L3FertilicalcFertilizersCtrl.bestCombination(fertilizers, N, P, K));
	}));

	return router;
}
