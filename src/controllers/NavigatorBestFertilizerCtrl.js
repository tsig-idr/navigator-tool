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

	function bestCombination (fertilizers, N_req, P_req, K_req, S_req, N_max) {
		const model = {
			optimize: 'price',
			opType: 'min',
			constraints: {
				N: {
					min: (Math.min(N_req, N_max) || 0),
					max: (N_max || 0)
				},
				P: {
					min: (P_req || 0)
				},
				K: {
					min: (K_req || 0)
				},
				S: {
					min: (S_req || 0)
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
					N: Q*(fertilizer.Nbf || 0),
					P: Q*(fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0),
					P2O5: Q*(fertilizer.Pcf || fertilizer.phosphorus.Pcf || 0)*2.293,
					K: Q*(fertilizer.Kcf || fertilizer.potassium.Kcf || 0),
					K2O: Q*(fertilizer.Kcf || fertilizer.potassium.Kcf || 0)*1.205,
					S: Q*(fertilizer.Scf || fertilizer.sulphur.Scf || 0),
					N_ur: Q*(fertilizer.Ncf_ure || fertilizer.nitrogen.Ncf_ure || 0)/(fertilizer.Ncf || fertilizer.nitrogen.Ncf || 1)*fertilizer.Nbf,
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
			cost = amount*fertilizer.price;
			if (cost < bestCost) {
				bestCost = cost;
				bestFertilizer = {
					fertilizerID: fertilizer.fertilizerID,
					fertilizer_name: fertilizer.fertilizer_name,
					method: getMethod(fertilizer.fertilizerID),
					amount: amount,
					N: amount*Nbf,
					P: amount*Pcf,
					P2O5: amount*Pcf*2.293,
					K: amount*Kcf,
					K2O: amount*Kcf*1.205,
					cost: cost
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

function getMethod (fertilizerID) {
	let csv = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F3', 'Fertilizers_aux.csv'), 'utf8'),
		row;
	csv = csv.split('\n').map(line => line.split(';'));
	if (row = csv.find(row => row[0] == fertilizerID)) {
		return row[1].trim();
	}
	return null;
}