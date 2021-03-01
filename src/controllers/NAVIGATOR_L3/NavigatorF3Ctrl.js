const path = require('path');
const fs = require('fs');
const solver = require('javascript-lp-solver');

// Fertilizers
module.exports = function () {

	function get (names, but_names) {

		let fertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-fertilizers-data.json'), 'utf8'));
		names && but_names &&
			(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.name) && !but_names.includes(fertilizer.name)))
		|| 
			names && 
				(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.name)))
			||
				but_names && 
					(fertilizers = fertilizers.filter(fertilizer => !but_names.includes(fertilizer.name)));
		return fertilizers;
	}

	function bestCombination (fertilizers, N_req, P_req, K_req, S_req, lim_N_ur) {
		
		const model = {
			optimize: 'price',
			opType: 'min',
			constraints: {
				N: {
					min: N_req
				},
				P: {
					min: P_req
				},
				K: {
					min: K_req
				},
				S: {
					min: S_req
				},
				N_ur: {
					max: lim_N_ur
				}
			},
			variables: {}
		};
		fertilizers.forEach(fertilizer => {
			model.variables[fertilizer.name] = {
				N: (fertilizer.N_total || 0) / 100,
				P: (fertilizer.P_total || 0) / 100,
				K: (fertilizer.K_total || 0) / 100,
				S: (fertilizer.S_total || 0) / 100,
				N_ur: (fertilizer.N_urea || 0) / 100,
				price: (fertilizer.price || 0)
			};
		});
		let Q;
		const solution = solver.Solve(model),
			bestFertilizers = [];
		fertilizers.forEach(fertilizer => {
			if (fertilizer.name in solution) {
				Q = solution[fertilizer.name];
				bestFertilizers.push({
					name: fertilizer.name,
					amount: Q,
					N: Q*(fertilizer.N_total || 0) / 100,
					P: Q*(fertilizer.P_total || 0) / 100,
					K: Q*(fertilizer.K_total || 0) / 100,
					S: Q*(fertilizer.S_total || 0) / 100,
					N_ur: Q*(fertilizer.N_urea || 0) / 100,
					cost: Q*(fertilizer.price || 0)
				});
			}
		});
		return bestFertilizers;
	}

	function aggregate (fertilizers) {
		
		const aggregated = {
			amount: 0,
			N: 0,
			P: 0,
			K: 0,
			S: 0,
			N_ur: 0,
			cost: 0
		};
		fertilizers.forEach(fertilizer => {
			aggregated.amount += fertilizer.amount;
			aggregated.N += fertilizer.N;
			aggregated.P += fertilizer.P;
			aggregated.K += fertilizer.K;
			aggregated.S += fertilizer.S;
			aggregated.N_ur += fertilizer.N_ur;
			aggregated.cost += fertilizer.cost;
		});
		return aggregated;
	}

	return {
		get: get,
		bestCombination: bestCombination,
		aggregate: aggregate
	}
}
