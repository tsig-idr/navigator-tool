const path = require('path');
const fs = require('fs');
const solver = require('javascript-lp-solver');

// Fertilizers
module.exports = function () {

	var datasource = 'fertilizers-data-excel.json';

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
				N: (fertilizer.Nbf || 0),
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
					nbf: fertilizer.Nbf,
					fertilizer_name: fertilizer.fertilizer_name,
					amount: Q*100,
					N: Q*(fertilizer.Ncf || fertilizer.nitrogen.Ncf || 0),
					P: Q*(fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0),
					K: Q*(fertilizer.Kcf || fertilizer.potassium.Kcf || 0),
					S: Q*(fertilizer.Scf || fertilizer.sulphur.Scf || 0),
					N_ur: Q*(fertilizer.Ncf_ure || fertilizer.nitrogen.Ncf_ure || 0),
					cost: Q*100*(fertilizer.price || 0)
				});
			}
		});
		return bestFertilizers;
	}

	function bestOne (fertilizers, N_req, P_req, K_req) {
		let Nbf, Pcf, Kcf,
			bestCost = Number.MAX_SAFE_INTEGER,
			bestFertilizer = null,
			amount, cost;
		fertilizers.forEach(fertilizer => {
			Nbf = fertilizer.Nbf || 0;
			Pcf = fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0;
			Kcf = fertilizer.Kcf || fertilizer.potassium.Kcf || 0;
			if (!fertilizer.price || N_req && !Nbf || P_req && !Pcf || K_req && !Kcf) {
				return;
			}
			Nbf /= 100;
			Pcf /= 100;
			Kcf /= 100;
			amount = Math.max(N_req ? N_req/Nbf : 0, P_req ? P_req/Pcf : 0, K_req ? K_req/Kcf : 0);
			cost = price*amount;
			if (cost < bestCost) {
				bestCost = cost;
				bestFertilizer = {
					fertilizerID: fertilizer.fertilizerID,
					fertilizer_name: fertilizer.fertilizer_name,
					amount: amount,
					N: amount*Ncf,
					P: amount*Pcf,
					K: amount*Kcf,
					S: amount*Scf,
					N_ur: amount*Ncf_ur,
					cost: amount*fertilizer.price
				};
			}
		});
		return bestFertilizer;
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
		bestOne: bestOne,
		aggregate: aggregate
	}
}
