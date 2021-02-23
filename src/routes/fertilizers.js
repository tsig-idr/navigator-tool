'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const L3FertilicalcFertilizersCtrl = require('../controllers/L3Fertilicalc/fertilizersCtrl')();

module.exports = function () {

	router.get('/optimized', asyncHandler(async (req, res) => {

		const names = typeof req.query.names === 'string' && req.query.names.split(','),
			fertilizers = await L3FertilicalcFertilizersCtrl.get(names),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0;
		res.json(await L3FertilicalcFertilizersCtrl.optimize(fertilizers, N, P, K));
	}));

	router.get('/bestone', asyncHandler(async (req, res) => {

		const fertilizers = await L3FertilicalcFertilizersCtrl.get(),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0;
		res.json(await L3FertilicalcFertilizersCtrl.pickBest(fertilizers, N, P, K));
	}));

	return router;
}
