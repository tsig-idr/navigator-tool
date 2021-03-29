const path = require('path');
const fs = require('fs');
const utils = require('../../utils/utils');



module.exports = function () {

    const desnitrificationPath = 'n3-desnitrification-data.json';
    const volatilizationPath = 'n3-volatilization-data.json';
	const fertilizersPath = 'fertilizers-data-excel.json';
	const f3ParamsDataPath = 'f3-params-data.json';
	const cropsDataPath = 'crops-data-excel.json';

	//DataSources:
	const dataCrops = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', cropsDataPath ), 'utf8'));
	const dataParams = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', f3ParamsDataPath ), 'utf8'));
	const dataVolatilizations = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', volatilizationPath), 'utf8'));
	const dataFertilizers = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', fertilizersPath), 'utf8'));
	const dataDesnitrifications = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', desnitrificationPath ), 'utf8'));


	async function Nrequeriments(params){

		const cropInput = params.crops[0]; //L3 only supports one crop  
		const soilInput = params.soil;
		const plotInput = params.plot;
		let fertilizationInput = params.fertilization;

		const cropObj = dataCrops.find(crop => crop.cropID === cropInput.cropID);

		const dataParams = JSON.parse(fs.readFileSync(path.join(path.resolve(), 'data', f3ParamsDataPath ), 'utf8'));
		const soilTextureObj =  dataParams.soil_textures.find(e => e.soil_texture == soilInput.soil_texture);
		const climateZoneObj =  dataParams.climate_zones.find(e => e.climate_zone == plotInput.climatic_zone);

		const Nc_h = (cropInput.Nc_h) || cropObj.harvest.Nc_h_typn;
		const Nc_r = (cropInput.Nc_r) || cropObj.residues.Nc_r_typn;
		const HI_est = (cropInput.HI_est) || cropObj.harvest.HI_est;
		const DM_h = (cropInput.DM_h) || cropObj.harvest.DM_h;
		const CV = (cropInput.CV) || cropObj.CV;
		const pH = (soilInput.pH) || 2;
		const CEC = (soilInput.CEC) || soilTextureObj.CEC;
		const SOM = (soilInput.SOM) || 0;
		const depth_s = (soilInput.depth_s) || dataParams.default_parameters.depth_s;
		const Nmin_h = (soilInput.Nmin_h) || dataParams.default_parameters.Nc_end;

		const dose_irrigation = (plotInput.dose_irrigation) || dataParams.default_parameters.dose_irrigation; 
		const Nc_NO3_water = (plotInput.Nc_NO3_water) || dataParams.default_parameters.Nc_NO3_water; 
		const Nc_s_initial = (soilInput.Nc_s_initial) || dataParams.default_parameters.Nc_s_initial;
		const water_supply = (plotInput.water_supply == 1 || plotInput.water_supply == 'on') ? 1: 0;

		fertilizationInput.DM_amendment = (fertilizationInput.DM_amendment) || dataParams.default_parameters.fert_DM_amendment;
		fertilizationInput.Nc_DM = (fertilizationInput.Nc_DM) || dataParams.default_parameters.fert_Nc_DM_amendment;
		fertilizationInput.dose_amendment = (fertilizationInput.dose_amendment) || 15000;

		//Input terms: Nmineralization + Nfixation+ Nwater + NminInitial
		const Nmineralization = await _Nmineralization(fertilizationInput.Nc_DM, fertilizationInput.DM_amendment, fertilizationInput.dose_amendment, fertilizationInput.frequent_application, soilInput.soil_texture, soilInput.SOM, plotInput.water_supply, plotInput.climatic_zone );
		/* array */
		const Nfixation = await _Nfixation(cropObj, cropInput.yield, CV, SOM);

		const Nwater = await _Nwater(water_supply, plotInput.type_irrigation, dose_irrigation, Nc_NO3_water);

		const NminInitial = _NminInitial(soilInput.Nc_s_initial);

		const NInputTerms = Nmineralization + Nfixation[0] + Nwater + NminInitial;

		//Output terms: Leaching + Uptake + Desnitrification + Nmin postharvest + Volatilization

		const Nleaching = await _Nleaching(depth_s, climateZoneObj.rain_a, climateZoneObj.rain_w, soilTextureObj.vol_water_s, soilTextureObj.cn, Nc_s_initial);
		/*array*/
		const Nuptake = await _Nuptake(cropInput.yield, Nc_h, Nc_r, HI_est, DM_h, CV);

		const NdesnitrificationObj = await _Ndesnitrification (soilInput.case, SOM, plotInput.water_supply, plotInput.drain_rate);
		const Ndesnitrification = (NdesnitrificationObj) ? NdesnitrificationObj.desnitrification : 0;
		
		const NminPostharvest = _NminPostharvest(Nmin_h);

		const Nvolatilization = await _Nvolatilization (water_supply, fertilizationInput.application_method, fertilizationInput.fertilizerID, pH, CEC);

		const NOutputTerms = Nleaching + Nuptake[0] + Ndesnitrification + NminPostharvest + Nvolatilization;

		const Nc_crop = NOutputTerms - NInputTerms;

		return Nc_crop;

	}

	//Input terms: Nmineralization + Nfixation+ Nwater + NminInitial

	async function _Nmineralization(Nc_DM_amendment, DM_amendment, dose, freq_application_amendment, soil_texture, SOM, water_supply, climate_zone){

		const frec_application = (freq_application_amendment.toLowerCase() == 'annual') ? 1: 0.5;
		//INPUTS FOR ORGANIC AMENDMENT
		const Nc_mineralization_amendment = (Nc_DM_amendment/100) * (DM_amendment/100) * dose * frec_application;

		const soilTextureObj = dataParams.soil_textures.find(texture_s => texture_s.soil_texture == soil_texture );

		//SOM = SOM + 0.5; //SOM (associated)
		const NmineralizationSOMObj = soilTextureObj.mineralizations.find(e => {
		
			var rangeSOM = '(,0.5]';

			if(SOM <= 0.5){
				rangeSOM = '(,0.5]';
			}else if( SOM > 0.5 && SOM <= 1){
				rangeSOM = '(0.5,1]';
			}else if( SOM > 1 && SOM <= 1.5){
				rangeSOM = '(1,1.5]';
			}else if( SOM > 1.5 && SOM <= 2){
				rangeSOM = '(1.5,2]';
			}else if( SOM > 2 && SOM <= 2.5){
				rangeSOM = '(2,2.5]';
			}else if(SOM > 2.5){
				rangeSOM = '(2.5,)';
			}

			return (e.SOM === rangeSOM);
		});

	
		const climateZoneObj = dataParams.climate_zones.find(item => item.climate_zone == climate_zone);
		const factor_humidity = (water_supply == 1) ? 1: climateZoneObj.factor_humidity;
		const Nc_mineralization_SOM = NmineralizationSOMObj.Nmineralization_SOM*factor_humidity;
		//Nc_mineralization
		return Nc_mineralization_amendment + Nc_mineralization_SOM;
	}

	async function _Nfixation(cropObj, yield, CV, SOM){

		const t_levels =  dataParams.default_parameters.t_levels;
		const fnr = dataParams.default_parameters.Nc_fnr;

		CV = (CV) || dataCrops.CV;

		//const cropObj = dataCrops.find(crop => crop.cropID === cropID)
		const DM_h = cropObj.harvest.DM_h/100;
		const DM_r = cropObj.residues.DM_r/100;
		const HI_est = cropObj.harvest.HI_est/100;
		const Nc_h = cropObj.harvest.Nc_h_typn/100;
		const Nc_r = cropObj.residues.Nc_r_typn/100;

		//const crop_cycle = (cropObj.group == 'LEGUMES') ? 'Perennial': 'Annual';
		const N_fix_in_crop = (cropObj.group == 'LEGUMES') ? true: false;

		let Nc_fixation  = new Array(9).fill().map( u => (0));

		for(var i_prob=0; i_prob< t_levels.length; i_prob++){

			const y_dm = DM_h * (yield*(1+ (CV/100)*t_levels[i_prob]));
			const r_dm = (y_dm*(1-HI_est))/HI_est;
			const N_res = r_dm * Nc_r;
			const N_yield = y_dm*Nc_h;
			let N_fix_per = 0;
			if(cropObj.crop_cycle == 'Annual'){
				N_fix_per = (cropObj.group == 'LEGUMES' && SOM < 3) ? 0.8: 0.5;
			}
			if(cropObj.crop_cycle == 'Perennial'){
				N_fix_per = (cropObj.group == 'LEGUMES' && SOM < 3) ? 0.9: 0.6;
			}
	
			if(N_fix_in_crop){
				Nc_fixation[i_prob] =  (1+fnr)*(N_yield+N_res)*N_fix_per;
			}else{
				Nc_fixation[i_prob] = 10;
			}
		}

		return Nc_fixation;
	}

	async function _Nwater(water_supply, type_irrigation, dose_irrigation, Nc_NO3_water){

		if(water_supply == 0) // rainfed
			return 0;

		const typeIrrigationKeys = new Map([['trickle', 0.9 ],['sprinkler', 0.85],['surface', 0.7]]);

		Nc_NO3_water = (Nc_NO3_water) || dataParams.default_parameters.Nc_NO3_water;

		const factor_irrigation = typeIrrigationKeys.get(type_irrigation);

		if(factor_irrigation){
			return Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000;
		}else{
			return 0;
		}
		
	}

	function _NminInitial(Nc_s_initial){
		const NminInitial = (Nc_s_initial) || dataParams.default_parameters.Nc_s_initial;
		return NminInitial;
	}

	//Output terms: Leaching + Uptake + Desnitrification + Nmin postharvest + Volatilization
	function _Nleaching(depth_s, rain_a, rain_w, vol_water_s, cn, Nc_s_initial) {
	
		const PI = Math.pow((rain_a -(10160/cn) + 101.6), 2) / (rain_a + 15240 / cn -152.4);
		const SI = Math.pow(((2*rain_w)/rain_a),1/3);
		const LI = PI * SI;

		depth_s = (depth_s) || dataParams.default_parameters.depth_s;
		Nc_s_initial = (Nc_s_initial) || dataParams.default_parameters.Nc_s_initial;

		const Nc_leached = (Nc_s_initial*(1-Math.exp(-LI/(depth_s*vol_water_s))));

		return Nc_leached;


	}


	function _Nuptake(yield, Nc_h, Nc_r, HI_est, DM_h, CV){


		const t_i = dataParams.default_parameters.t_levels;
		const fnr = dataParams.default_parameters.Nc_fnr;
		let Nc_up_h  = new Array(9).fill().map( u => (0));

		DM_h = DM_h/100;
		CV = CV/100;
		HI_est = HI_est/100;
		Nc_h = Nc_h/100;
		Nc_r = Nc_r/100;

		for(var i_prob=0; i_prob< t_i.length; i_prob++){
			const h_dm_med = yield*DM_h*(1+CV*t_i[i_prob]);
			const r_dm_med = h_dm_med*(1 - HI_est)/HI_est;
			Nc_up_h[i_prob] = (h_dm_med*Nc_h+r_dm_med*Nc_r) * (1 + fnr);
		}

		return Nc_up_h;
	}


    async function _Ndesnitrification (case_desnitrification, SOM, water_supply, drain_rate) {

		return dataDesnitrifications.find(desnitrification => {
		
			var rangeSOM = '[,2)';

			if(SOM < 2){
				rangeSOM = '[,2)';
			}else if( SOM >= 2 && SOM < 5){
				rangeSOM = '[2,5)';
			}else{
				rangeSOM = '[5,)';
			}

			return ((rangeSOM === desnitrification.som) && (parseInt(water_supply) === desnitrification.waterSupply) && (drain_rate === desnitrification.rateDrainage) && (case_desnitrification === desnitrification.case));
		});

	}
	
	function _NminPostharvest(Nc_end){
		const NminPostharvest = (Nc_end) || dataParams.default_parameters.Nc_end;
		return NminPostharvest;
	}
    /*
    * vtl_fertilizer_group: type_f
    */
    async function _Nvolatilization (water_supply, application_method, fertilizerID, pH, CEC) {
        
		const waterSupply = (water_supply == 1) ?  "irrigated" : "rainfed";
        //factors in the linear regression model
		const factorsKeys = new Map([['water_supply', waterSupply],['application_method', application_method],['pH','(,5.5]'],['CEC','(,16]']]);
		const fertilizerObj =  dataFertilizers.find(fertilizer => fertilizer.fertilizerID === fertilizerID);
		
		if(fertilizerObj) {
			const vol_group = {
				'key': 'vlt_group',
				'value': fertilizerObj.volatilization.vlt_group
			};
	
			volatilizationCoefficient.push(vol_group);
		}else{
			return 10;
		}

		if(!utils.isNumeric(pH) && utils.parseToNumeric(pH))
            pH = parseFloat(pH) 
        let soilpH = '(,5.5]';
		if(utils.isNumeric(pH)){
			if(pH <= 5.5){
				factorsKeys.set('pH','(,5.5]');
			}else if(pH > 5.5 && pH <= 7.3){
				factorsKeys.set('pH','(5.5,7.3]');
			}else if(pH > 7.3 && pH <= 8.5){
                factorsKeys.set('pH','(7.3,8.5]');
			}else{
                factorsKeys.set('pH','(8.5,]');
			}
        }

		if(!utils.isNumeric(CEC))
			CEC = parseFloat(CEC);
		if(utils.isNumeric(CEC)){
			if(CEC <= 16){
				factorsKeys.set('pH','(,16]');
			}else if(CEC > 16 && CEC <= 24){
                factorsKeys.set('pH','(16,24]');
			}else if(CEC > 24 && CEC <= 32){
				factorsKeys.set('pH','(24,32]');
			}else{
                factorsKeys.set('pH','(32,]');
			}
		}

		const volatilizationCoefficient = new Array();

		for (let [key, value] of factorsKeys) {
			const items = dataParams.volatilization[key];
			const elem =  items.find(item => item.key === value);
			volatilizationCoefficient.push(elem);
		}
		
		
        //TODO: Extraer el valor de clima a un fichero externo o definir si depende de climate_zone
        const climate = {
            'key': 'climate',
            'value': -0.402
        };

        volatilizationCoefficient.push(climate);
		
		const vola_coeff = Math.exp(volatilizationCoefficient.reduce(function(prev, cur) {
			return prev + cur.value;
		}, 0));

		return  vola_coeff*10;
	}

	async function getSoilTextures(){
		return dataParams.soil_textures;
	}

    async function getSoilTexture(soil_texture){
        return  dataParams.soil_textures.find(element => element.soil_texture === soil_texture);
	}
	
	async function getFertilizersByClafication(clasification){
		dataFertilizers.find(element => element.clasification === clasification);
	}



    return {
		Nrequeriments : Nrequeriments,
		getSoilTextures: getSoilTextures,
		getSoilTexture: getSoilTexture,
		getFertilizersByClafication: getFertilizersByClafication

	}
}