'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const L3FertilicalcFertilizersCtrl = require('../controllers/L3Fertilicalc/fertilizersCtrl')();

module.exports = function () {

	router.get('/optimization', asyncHandler(async (req, res) => {

		const response = {'results': []},
			names = typeof req.query.names === 'string' && req.query.names.split(','),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0;

		response.results = await L3FertilicalcFertilizersCtrl.optimization(names, N, P, K);
	
		res.json(response);
	}));
	return router;
}
