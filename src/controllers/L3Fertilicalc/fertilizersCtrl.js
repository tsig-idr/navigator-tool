const path = require('path');
const fs = require('fs');
const solver = require('javascript-lp-solver');

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

	function bestCombination (fertilizers, N_req, P_req, K_req) {
		
		let i, fertilizer;
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
				}
			},
			variables: {}
		};
		for (i = 0; i < fertilizers.length && (fertilizer = fertilizers[i]); i++) {
			model.variables[fertilizer.name] = {
				N: (fertilizer.N_total || 0) / 100,
				P: (fertilizer.P_total || 0) / 100,
				K: (fertilizer.K_total || 0) / 100,
				price: (fertilizer.price || 0)
			};
		}
		fertilizers = {};
		const solution = solver.Solve(model);
		for (i in solution) {
			i != 'bounded' && i != 'feasible' && i != 'result' &&
				(fertilizers[i] = solution[i]);
		}
		return {
			total_cost: solution.result,
			fertilizer_amount: fertilizers
		};
	}

	function pickBest (fertilizers, N, P, K) {

		let i, fertilizer, c_N, c_P, c_K;
		fertilizers = fertilizers.filter(fertilizer => fertilizer.N_total && fertilizer.P_total && fertilizer.K_total);
		for (i = 0; i < fertilizers.length && (fertilizer = fertilizers[i]); i++) {
			c_N = fertilizer.N_total / 100;
			c_P = fertilizer.P_total / 100;
			c_K = fertilizer.K_total / 100;
			fertilizer.amount = (N*c_N + P*c_P + K*c_K) / (c_N*c_N + c_P*c_P + c_K*c_K);
			fertilizer.N = c_N*fertilizer.amount;
			fertilizer.P = c_P*fertilizer.amount;
			fertilizer.K = c_K*fertilizer.amount;
			fertilizer.cost = fertilizer.amount*fertilizer.price;
		}
		return fertilizers.sort((a, b) => a.cost - b.cost)[0];
	}

	function optimize (fertilizers, N, P, K) {

		fertilizers.splice(3, fertilizers.length);
		if (fertilizers.length < 2) {
			return [pickBest(fertilizers, N, P, K)];
		}
		let A = [], A_j, k, i, j, c_j, det, fertilizer;
		const tuples = [['P', 'K', 'N'], ['P', 'N', 'K'], ['K', 'N', 'P']],
			required = {N: N, P: P, K: K};
		if (fertilizers.length == 2) {
			for (k = 0; k < tuples.length; k++) {
				A = [];
				for (i = 0; i < tuples[k].length - 1; i++) {
					A.push([]);
					for (j = 0; j < 2; j++) {
						c_j = (fertilizers[j][`${tuples[k][i]}_total`] || 0.0) / 100;
						A[i].push(c_j);
					}
				}
				if (!(det = determinant2X2(A))) {
					continue;
				}
				for (j = 0; j < 2 && (fertilizer = fertilizers[j]); j++) {
					A_j = [[...A[0]], [...A[1]]];
					A_j[0][j] = required[tuples[k][0]];
					A_j[1][j] = required[tuples[k][1]];
					fertilizer.amount = Math.max(determinant2X2(A_j) / det, fertilizer.amount || 0.0);
				}
			}
		}
		if (fertilizers.length == 3) {
			A = [];
			for (i = 0; i < tuples[0].length; i++) {
				A.push([]);
				for (j = 0; j < 3; j++) {
					c_j = (fertilizers[j][`${tuples[0][i]}_total`] || 0.0) / 100;
					A[i].push(c_j);
				}
			}
			if (!(det = determinant3X3(A))) {
				return [];
			}
			for (j = 0; j < 3 && (fertilizer = fertilizers[j]); j++) {
				A_j = [[...A[0]], [...A[1]], [...A[2]]];
				A_j[0][j] = required[tuples[0][0]];
				A_j[1][j] = required[tuples[0][1]];
				A_j[2][j] = required[tuples[0][2]];
				fertilizer.amount = determinant3X3(A_j) / det;
			}
		}
		for (j = 0; j < fertilizers.length && (fertilizer = fertilizers[j]); j++) {
			fertilizer.cost = fertilizer.amount*fertilizer.price;
		}
		return fertilizers;
	}

	return {
		get: get,
		pickBest: pickBest,
		optimize: optimize,
		bestCombination: bestCombination
	}
}

function determinant2X2(A) {
	if (typeof A != 'object' || A.length != 2) {
		return null;
	}
	for (let i = 0, j; i < 2; i++) {
		if (typeof A[i] != 'object' || A[i].length != 2) {
			return null;
		}
		for (j = 0; j < 2; j++) {
			if (!Number.isFinite(A[i][j])) {
				return null;
			}
		}
	}
	return A[0][0]*A[1][1] - A[0][1]*A[1][0];
}

function determinant3X3(A) {
	if (typeof A != 'object' || A.length != 3) {
		return null;
	}
	for (let i = 0, j; i < 3; i++) {
		if (typeof A[i] != 'object' || A[i].length != 3) {
			return null;
		}
		for (j = 0; j < 3; j++) {
			if (!Number.isFinite(A[i][j])) {
				return null;
			}
		}
	}
	return A[0][0]*A[1][1]*A[2][2] + A[0][1]*A[1][2]*A[2][0] + A[0][2]*A[1][0]*A[2][1]
		- (A[2][0]*A[1][1]*A[0][2] + A[2][1]*A[1][2]*A[0][0] + A[2][2]*A[1][0]*A[0][1]);
}