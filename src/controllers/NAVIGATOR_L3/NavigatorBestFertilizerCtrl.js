const path = require('path');
const fs = require('fs');
const solver = require('javascript-lp-solver');

// Fertilizers
module.exports = function () {

	var datasource = 'fertilizers-data-excel-v6.json';

	function get (names, but_names) {

		let fertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', datasource), 'utf8'));
		names && but_names &&
			(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.fertilizerID) && !but_names.includes(fertilizer.fertilizerID)))
		|| 
			names && 
				(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.fertilizerID)))
			||
				but_names && 
					(fertilizers = fertilizers.filter(fertilizer => !but_names.includes(fertilizer.fertilizerID)));
		return fertilizers;
	}

	function getOrganic (names, but_names) {

		let fertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', datasource), 'utf8'));
		fertilizers = fertilizers.filter(fertilizer => fertilizer.clasification == 'organic');
		names && but_names &&
			(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.fertilizerID) && !but_names.includes(fertilizer.fertilizerID)))
		|| 
			names && 
				(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.fertilizerID)))
			||
				but_names && 
					(fertilizers = fertilizers.filter(fertilizer => !but_names.includes(fertilizer.fertilizerID)));
		return fertilizers;
	}

	function getFertilizerID (fertilizerID) {

		let fertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', datasource), 'utf8'));
		return fertilizers.find(fertilizer => fertilizer.fertilizerID === fertilizerID);
	}

	function bestCombination (fertilizers, N_req, P_req, K_req, S_req, lim_N_ur) {
		
		const model = {
			optimize: 'price',
			opType: 'min',
			constraints: {
				N: {
					min: (N_req || 0)
				},
				P: {
					min: (P_req || 0)
				},
				K: {
					min: (K_req || 0)
				},
				S: {
					min: (S_req || 0)
				},
				N_ur: {
					max: (lim_N_ur || 0)
				}
			},
			variables: {}
		};
		fertilizers.forEach(fertilizer => {
			model.variables[fertilizer.fertilizerID] = {
				N: (fertilizer.Ncf || fertilizer.nitrogen.Ncf || 0),
				P: (fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0),
				K: (fertilizer.Kcf || fertilizer.potassium.Kcf || 0),
				S: (fertilizer.Scf || fertilizer.sulphur.Scf || 0), 
				N_ur: (fertilizer.Ncf_ure || fertilizer.nitrogen.Ncf_ure || 0),
				price: (fertilizer.price || 0)
			};
		});
		let Q;
		const solution = solver.Solve(model),
			bestFertilizers = [];
		fertilizers.forEach(fertilizer => {
			if (fertilizer.fertilizerID in solution) {
				Q = solution[fertilizer.fertilizerID]; // %
				bestFertilizers.push({
					fertilizerID: fertilizer.fertilizerID,
					fertilizer_name: fertilizer.fertilizer_name,
					amount: Q*100,
					N: Q*(fertilizer.Ncf || fertilizer.nitrogen.Ncf || 0),
					P: Q*(fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0),
					K: Q*(fertilizer.Kcf || fertilizer.potassium.Kcf || 0),
					S: Q*(fertilizer.Scf || fertilizer.sulphur.Scf || 0),
					N_ur: Q*(fertilizer.Ncf_ure || fertilizer.nitrogen.Ncf_ure || 0),
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
		getFertilizerID: getFertilizerID,
		getOrganic: getOrganic,
		bestCombination: bestCombination,
		aggregate: aggregate
	}
}
