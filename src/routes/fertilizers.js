'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navF3Ctrl = require('../controllers/NAVIGATOR_L3/NavigatorF3Ctrl')();

module.exports = function () {

	router.get('/', asyncHandler(async (req, res) => {
		
		const names = typeof req.query.names === 'string' && req.query.names.split(',');
		res.json({
			results: navF3Ctrl.get(names, false)
		});
	}));

	router.get('/optimization', asyncHandler(async (req, res) => {

		const include = typeof req.query.include === 'string' && req.query.include.split(','),
			exclude = typeof req.query.exclude === 'string' && req.query.exclude.split(','),
			N = typeof req.query.N === 'string' && parseFloat(req.query.N) || 0.0,
			P = typeof req.query.P === 'string' && parseFloat(req.query.P) || 0.0,
			K = typeof req.query.K === 'string' && parseFloat(req.query.K) || 0.0,
			S = typeof req.query.S === 'string' && parseFloat(req.query.S) || 0.0,
			N_ur = typeof req.query.N_ur === 'string' && parseFloat(req.query.N_ur)*N || 0.0,
			fertilizers = navF3Ctrl.bestCombination(navF3Ctrl.get(include, exclude), N, P, K, S, N_ur);
		res.json({
			results: fertilizers,
			total: navF3Ctrl.aggregate(fertilizers)
		});
	}));

	router.post('/optimization', asyncHandler(async (req, res) => {

		const include = typeof req.body.include === 'object' && req.body.include.length !== undefined && req.body.include 
				|| typeof req.params.include === 'object' && req.params.include.length !== undefined && req.params.include,
			exclude = typeof req.body.exclude === 'object' && req.body.exclude.length !== undefined && req.body.exclude
				|| typeof req.params.exclude === 'object' && req.params.exclude.length !== undefined && req.params.exclude,
			N = req.body.N && parseFloat(req.body.N) || req.params.N && parseFloat(req.params.N) || 0.0,
			P = req.body.P && parseFloat(req.body.P) || req.params.P && parseFloat(req.params.P) || 0.0,
			K = req.body.K && parseFloat(req.body.K) || req.params.K && parseFloat(req.params.K) || 0.0,
			S = req.body.S && parseFloat(req.body.S) || req.params.S && parseFloat(req.params.S) || 0.0,
			N_ur = (req.body.N_ur && parseFloat(req.body.N_ur) || req.params.N_ur && parseFloat(req.params.N_ur))*N || 0.0,
			fertilizers = navF3Ctrl.bestCombination(navF3Ctrl.get(include, exclude), N, P, K, S, N_ur);
		res.json({
			results: fertilizers,
			total: navF3Ctrl.aggregate(fertilizers)
		});
	}));

	return router;
}
