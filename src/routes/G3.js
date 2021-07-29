'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navG3Ctrl = require('../controllers/L3/NavigatorG3Ctrl')();
const dispatchers = {
	livestock: async input => {
		return await navG3Ctrl.livestock(input, [
			'CO2fromFeed',
			'CO2fromPastures',
			'CO2fromManure',
			'CO2fromEnteric',
			'CH4fromEnteric',
			'CH4fromManure',
			'N2OfromPastures',
			'N2OfromManure',
			'test'
		]);
	},
	crops: async input => {
		return await navG3Ctrl.crops(input, [
			'N2OfromGround',
			'CH4fromGround',
			'CO2eqfromGround',
			'CO2fromSustances',
			'CO2eqfromSustances',
			'CO2fromMachinery',
			'CO2eqfromMachinery',
			'CO2fromSOC',
			'CO2eqfromSOC',
			'CO2fromL',
			'CO2eqfromL',
			'CO2eqfromAll',
			'CO2fromAll',
			'CH4fromAll',
			'N2OfromAll',
		]);
	},
	luc: async input => {
		return await navG3Ctrl.luc(input, [
			'CO2fromInfrastructures',
			'CO2fromLUC',
			'CO2fromForests',
			'CO2fromAll',
			'test',
		]);
	},
	energy: async input => {
		return await navG3Ctrl.energy(input, [
			'CO2fromElectricity',
			'CO2fromEnergy',
			'CO2fromBiomass',
			'CO2fromFuels',
			'CO2fromAll',
		]);
	}
};
module.exports.router = function () {
	router.post('/livestock', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatchers.livestock(input)
		});
	}));
	router.post('/crops', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatchers.crops(input)
		});
	}));
	router.post('/luc', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatchers.luc(input)
		});
	}));
	router.post('/energy', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatchers.energy(input)
		});
	}));
	return router;
};
module.exports.dispatcher = dispatchers;