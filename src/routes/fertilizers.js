'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const L3FertilicalcFertilizersCtrl = require('../controllers/L3Fertilicalc/fertilizersCtrl')();

module.exports = function () {

	router.get('/best', asyncHandler(async (req, res) => {

		const include = typeof req.query.include === 'string' && req.query.include.split(','),
			exclude = typeof req.query.exclude === 'string' && req.query.include.split(','),
			fertilizers = L3FertilicalcFertilizersCtrl.get(include, exclude),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0;
		res.json(L3FertilicalcFertilizersCtrl.bestCombination(fertilizers, N, P, K));
	}));

	return router;
}
