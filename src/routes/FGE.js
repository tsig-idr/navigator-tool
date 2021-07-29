'use strict';

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const { prototype } = require('../controllers/model/NavigatorNutrient3Model');

const dispatchers = {
	F1: require('./F1').dispatcher,
	F3: require('./F3').dispatcher,
	F4: require('./F4').dispatcher,
	G3: require('./G3').dispatcher.crops,
	E3: require('./E3').dispatcher
};

module.exports.router = function () {

	router.post('/compute', asyncHandler(async (req, res) => {
		const getVal = (path, src) => path.split('.').reduce((obj, dir) => typeof obj == 'object' && obj[dir], src);
		const vars4models = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'vars4models.json'), 'utf8'));
		const inputs = typeof req.body.inputs == 'object' && req.body.inputs || req.params.inputs && typeof req.params.inputs == 'object' || {};
		const result = {
			input: inputs,
			output: {
				farm: {
					plots: []
				}
			}
		};
		let i, plot, model,
			input, varname;
		!inputs.farm &&
			(inputs.farm = {});
		!inputs.farm.plots &&
			(inputs.farm.plots = []);
		for (i = 0; i < inputs.farm.plots.length && (plot = inputs.farm.plots[i]); i++) {
			!plot.models &&
				(plot.models = []);
			if (!vars4models[(model = plot.models.find(model => model.charAt(0) == 'F'))]) {
				return;
			}
			input = {...vars4models[model]};
			for (varname in input) {
				input[varname] = getVal(input[varname], plot);
			}
			plot.output = output4F(await dispatchers[model](input), input);
			result.output.farm.plots.push(plot.output);
		}
		inputs.farm.models = inputs.farm.models.filter(model => model.charAt(0) != 'F').sort();
		for (i = 0; i < inputs.farm.models.length && (model = inputs.farm.models[i]); i++) {
			if (!vars4models[model]) {
				continue;
			}
			input = {...vars4models[model]};
			for (varname in input) {
				if (Array.isArray(input[varname])) {
					let proto = input[varname][1];
					input[varname] = getVal(input[varname][0], inputs.farm);
					!Array.isArray(input[varname]) &&
						(input[varname] = []);
					input[varname].forEach((obj, i) => {
						const newobj = {};
						for (const field in proto) {
							newobj[field] = getVal(proto[field], obj);
						}
						obj.output &&
							Object.assign(newobj, obj.output);
						input[varname][i] = newobj;
					});
				}
			}
			Object.assign(result.output.farm, await dispatchers[model](input));
		}
		res.json(result);
	}));

	return router;
}

const output4F = (raw_outout, input) => {
	return {
		fertilization: input.fertilizers,
		balance: {
			input: {
				Nmineralization: raw_outout.Nmineralization,
				Nfixation: raw_outout.Nfixation,
				Nwater: raw_outout.Nirrigation,
				NminInitial: raw_outout.Nc_s_initial,
				recommendedFertilizer: {
					N: input.fertilizers.reduce((acc, fert) => acc + fert.N, 0),
					P: input.fertilizers.reduce((acc, fert) => acc + fert.P, 0),
					K: input.fertilizers.reduce((acc, fert) => acc + fert.K, 0)
				},
				appliedFertilizer: {
					N: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.N || 0)/100, 0),
					P: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.P || 0)/100, 0),
					K: input.applied.reduce((acc, fert) => acc + fert.amount*(fert.K || 0)/100, 0)
				}
			},
			output: {
				Nleaching: raw_outout.Nleaching,
				Uptake : {
					N: raw_outout.Nuptake,
					P: raw_outout.P_maintenance,
					K: raw_outout.K_maintenance
				},
				Ndenitrification: raw_outout.Ndenitrification,
				NminPostharvest: raw_outout.Nc_s_end,
				Nvolatilization: raw_outout.Nvolatilization
			}
		}
	};
}