'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navG3Ctrl = require('../controllers/L3/NavigatorG3Ctrl')();

module.exports = function () {

	router.post('/livestock', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.livestock(input, [
				'CO2fromFeed',
				'CO2fromPastures',
				'CO2fromManure',
				'CO2fromEnteric',
				'CH4fromEnteric',
				'CH4fromManure',
				'N2OfromPastures',
				'N2OfromManure',
				'test'
			]))
		});
	}));

	router.post('/crops', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.crops(input, [
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
			]))
		});
	}));

	router.post('/luc', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.luc(input, [
				'CO2fromInfrastructures',
				'CO2fromLUC',
				'test'
			]))
		});
	}));

	router.post('/energy', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || typeof req.params.input && req.params.input === 'object';
		res.json({
			results: (await navG3Ctrl.energy(input, [
				'CO2fromElectricity',
				'CO2fromEnergy',
				'CO2fromBiomass',
				'CO2fromFuels',
				'CO2fromAll',
			]))
		});
	}));

	return router;
}
