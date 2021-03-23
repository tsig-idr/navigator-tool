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

			const SOM = params.SOM || 0, 
				waterSupply = params.waterSupply || params.plot.waterSupply || params.plot.water_supply || 0,
				rateDrainage = params.rateDrainage || params.plot.drainage,
				caseDesnitrification = params.case || params.plot.case || params.plot.case_desnitrification;


			if(SOM < 2){
				rangeSOM = '[,2)';
			}else if( SOM >= 2 && SOM < 5){
				rangeSOM = '[2,5)';
			}else{
				rangeSOM = '[5,)';
			}

			return ((rangeSOM === desnitrification.som) && (parseInt(waterSupply) === desnitrification.waterSupply) && (rateDrainage === desnitrification.rateDrainage) && (caseDesnitrification === desnitrification.case));
		});

	}

	function volatilization (params) {

		const dataVolatilization = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-volatilization-data.json'), 'utf8'));

		if(!utils.isNumeric(params.soilpH) && utils.parseToNumeric(params.soilpH))
			params.soilpH = parseFloat(params.soilpH) 

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
			params: volatilizationCoefficient,
			volatilizationCoefficient: Math.exp(sumVolCoeTotal)
		}

	}

	function leaching (params) {

		var result = {
			params: params,
			Nleached: 0,
			PI: 0,
			SI: 0,
			LI: 0,
			CN: 0
		};
		const arraySoilHGroup = ["A", "B", "C", "D"];
		const dataLeaching = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-leaching-data.json'), 'utf8'));

		const cnItem =  dataLeaching.cn.find(item => {
			return (item.cover === params.coverType && item.treatment === params.treatment && item.hidrologic === params.hidrologic);
		})

		if(cnItem){
			//CN Value for soil Hydrologic Group
			var CN = cnItem.soilHidrologicalGroup[arraySoilHGroup.indexOf(params.soilHidrologicaGroup)];

			var PI = (Math.pow((params.P-(10160/CN)+101.6),2))/(params.P+15240/CN-152.4);
			var SI= Math.pow((2*params.Pw)/params.P,1/3);
			var LI = PI*SI;
			var Nleached = (params.Ninit*(1-Math.exp(-LI/(params.Z*params.averageWaterPercolation))));

			result.Nleached = Nleached; // Final results
			// Intermediate results..
			result.PI = PI; 
			result.SI = SI;
			result.LI = LI;
			result.CN = CN;

		}

		return result;
	}

	function getVolatilizationFertilizerTypes(){
		const dataVolatilization = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', 'fertilicalc-volatilization-data.json'), 'utf8'));
		return dataVolatilization.fertilizer;
	}

	return {
		desnitrification: desnitrification,
		volatilization: volatilization,
		leaching: leaching,
		getVolatilizationFertilizerTypes: getVolatilizationFertilizerTypes
	}
}
