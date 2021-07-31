'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const navE2Ctrl = require('../controllers/L2/NavigatorE2Ctrl')();
const dispatcher = async input => {
	return await navE2Ctrl.epa(input, [
		'SE010', 
		'SE025',
		'SE080',
		'SE131',
		'SE132',
		'SE135',
		'SE136',
		'SE206',
		'SE270',
		'SE281',
		'SE284',
		'SE285',
		'SE295',
		'SE300',
		'SE305',
		'SE309',
		'SE345',
		'SE410',
		'SE415',
		'SE425',
		'SE605'
	]);
};
module.exports.router = function () {
	router.post('/epa', asyncHandler(async (req, res) => {
		const input = typeof req.body.input === 'object' && req.body.input || req.params.input && typeof req.params.input === 'object' || {};
		res.json({
			results: await dispatcher(input)
		});
	}));
	return router;
};
module.exports.dispatcher = dispatcher;
