const path = require('path');
const fs = require('fs');

module.exports = function () {

	async function optimization (names, N, P, K) {

		let fertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-fertilizers-data.json'), 'utf8')),
			i, amounts;
		names &&
			(fertilizers = fertilizers.filter(fertilizer => names.includes(fertilizer.name)));

		for (i = 0; i < fertilizers.length && (fertilizer = fertilizers[i]); i++) {
			amounts = [0];
			N &&
				(fertilizer.N_total &&
					amounts.push(N * 100 / fertilizer.N_total)
				||
					amounts.push(Number.MAX_SAFE_INTEGER));
			P &&
				(fertilizer.P_total &&
					amounts.push(P * 100 / fertilizer.P_total)
				||
					amounts.push(Number.MAX_SAFE_INTEGER));
			K &&
				(fertilizer.K_total &&
					amounts.push(K * 100 / fertilizer.K_total)
				||
					amounts.push(Number.MAX_SAFE_INTEGER));

			fertilizer.amount = Math.max(...amounts);
			fertilizer.N_total &&
				(fertilizer.N = fertilizer.amount * fertilizer.N_total / 100);
			fertilizer.P_total &&
				(fertilizer.P = fertilizer.amount * fertilizer.P_total / 100);
			fertilizer.K_total &&
				(fertilizer.K = fertilizer.amount * fertilizer.K_total / 100);
			fertilizer.cost = fertilizer.amount * fertilizer.price;
		}
		return fertilizers.sort((a, b) => a.cost - b.cost);
	}
	return {
		optimization: optimization
	}
}