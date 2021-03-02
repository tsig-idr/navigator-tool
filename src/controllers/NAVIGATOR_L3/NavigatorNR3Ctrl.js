const path = require('path');
const fs = require('fs');
const utils = require('../../utils/utils');

// Fertilizers
module.exports = function () {

	function desnitrification (params) {

		let desnitrifications = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-desnitrification-data.json'), 'utf8'));

		return desnitrifications.find(desnitrification => {
			//TODO: Change inverse calcule to generic condition.
			var rangeSOM = '[,2)';

			if(params.som < 2){
				rangeSOM = '[,2)';
			}else if( params.som >= 2 && params.som < 5){
				rangeSOM = '[2,5)';
			}else{
				rangeSOM = '[5,)';
			}

			return ((rangeSOM === desnitrification.som) && (params.waterSupply === desnitrification.waterSupply) && (params.rateDrainage === desnitrification.rateDrainage) && (params.tillage === desnitrification.tillage));
		});

	}

	function volatilization (params) {

		const dataVolatilization = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-volatilization-data.json'), 'utf8'));

		if(!utils.isNumeric(params.soilpH))
			params.soilpH = utils.parseToNumeric(params.soilpH);

		if(utils.isNumeric(params.soilpH)){
			if(params.soilpH <= 5.5){
				params.soilpH = '(,5.5]';
			}else if(params.soilpH > 5.5 && params.soilpH <= 7.3){
				params.soilpH = '(5.5,7.3]';
			}else if(params.soilpH > 7.3 && params.soilpH <= 8.5){
				params.soilpH = '(7.3,8.5]';
			}else{
				params.soilpH = '(8.5,]';
			}
		}

		if(!utils.isNumeric(params.soilCEC))
			params.soilCEC = parseFloat(params.soilCEC);

		if(utils.isNumeric(params.soilCEC)){
			if(params.soilCEC <= 16){
				params.soilCEC = '(,16]';
			}else if(params.soilCEC > 16 && params.soilCEC <= 24){
				params.soilCEC = '(16,24]';
			}else if(params.soilCEC > 24 && params.soilCEC <= 32){
				params.soilCEC = '(24,32]';
			}else{
				params.soilCEC = '(32,]';
			}
		}

		const volatilizationCoefficient = new Array();
		Object.entries(params).forEach(([key, value]) => {
			const items = dataVolatilization[key];
			const elem = items.find(item => item.key === value);
			volatilizationCoefficient.push(elem);
		});

		
		var sumVolCoeTotal = volatilizationCoefficient.reduce(function(prev, cur) {
			return prev + cur.value;
		}, 0);

		return {
			results: volatilizationCoefficient,
			volatilizationCoefficient: Math.exp(sumVolCoeTotal)
		}

	}

	return {
		desnitrification: desnitrification,
		volatilization: volatilization
	}
}
