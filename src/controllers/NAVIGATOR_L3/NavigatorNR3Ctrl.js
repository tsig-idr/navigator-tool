const path = require('path');
const fs = require('fs');

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

	return {
		desnitrification: desnitrification
	}
}
