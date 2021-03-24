const NavigatorNutrient3Model = require('../model/NavigatorNutrient3Model');
const utils = require('../../utils/utils');
// Nutrients (NPK)
module.exports = function () {

    const navNutrient3Model =  new NavigatorNutrient3Model();

    async function nutrientNPKbalance(req){
        // Se preparan los datos de entrada 
        let list_crops = await _transfInputCrops(req.crops);

        if(!req.plot.soil_type)
            req.plot.PK_strategy = 'none';
        if (!req.plot.PK_strategy){
            req.plot.PK_strategy = 'maintenance';
        }
        if (!req.plot.tillage){
            req.plot.tillage = 0;
        }

        const def_params_soil = await navNutrient3Model.getParmsTypeOfSoil(req.plot.soil_type);
        const def_params_strategy = await navNutrient3Model.getParmsStrategy(req.plot.PK_strategy);
        const def_params_nutrients = await navNutrient3Model.getParmsNutrients();

        let inputs =  {
            items: [],
            plot: req.plot,
            crops: list_crops,
            n_rotation: list_crops.length,
            data_soil:  def_params_soil,
            PK_strategy: def_params_strategy,
            nutrients: def_params_nutrients
        };

        // --- 
        inputs = await _calcDryMatterCropResidue(inputs);
        const result = await _calcDryMatterCropSoil(inputs);

        return result;
    }

    function getValue(x){
        if (typeof x !== 'undefined'){
            try {
                var n = parseFloat(x);
                return n;
            } catch (error) {
                return 0;
            }
        }
        return 0;
    }


    //Step 1
    async function _calcDryMatterCropResidue(inputs){

        let items  = new Array(10).fill().map( u => ({Nc_h_max: 0,Nc_r: 0,Pc_r: 0,Kc_r: 0,crop_type: 'nothing',DM_h: 0,DM_r: 0, DM_yield: 0, n_fix_code: 0,Nc_h_min: 0, N_kg_crop: 0,yield_i: [],N_kg_fix: 0,N_kg_min: 0,N_fert_i:0, N_res_prev_h:0}));


        for(var i=0; i< inputs.n_rotation; i++){
            let keyName= '';
            if(inputs.crops[i].cropID){
                keyName = inputs.crops[i].cropID;
            }/*else if(inputs.crops[i].crop_latin_name){
                keyName = utils.camelize(inputs.crops[i].crop_latin_name);
            }*/
            if(inputs.crops[i].yield){
                items[i].yield = inputs.crops[i].yield;
            }
            
            const cropObj = await navNutrient3Model.getCropsByCropID(keyName);

            if(keyName && cropObj){
                items[i].cropID = keyName;
                items[i].crop_name = cropObj.crop_name;
                items[i].crop_latin_name = cropObj.crop_latin_name;
                items[i].Nc_r = getValue(cropObj.residues.Nc_r_typn)/100;
                items[i].Pc_r = getValue(cropObj.residues.Pc_r_typn)/100;
                items[i].Kc_r = getValue(cropObj.residues.Kc_r_typn)/100;
                items[i].DM_h = getValue(cropObj.harvest.DM_h)/100;
                items[i].DM_r = getValue(cropObj.residues.DM_r)/100;
                items[i].crop_type = cropObj.group;
                // ??? items[i].n_fix_code = cropObj.residues.N_fix_c;
                items[i].Nc_h_min = getValue(cropObj.harvest.Nc_h_min) / 100;
                items[i].Nc_h_max = getValue(cropObj.harvest.Nc_h_max) / 100;
                items[i].Pc_thres = inputs.data_soil.Pc_s_max;
                items[i].Kc_thres = inputs.data_soil.Kc_s_max;
                items[i].fk = inputs.data_soil.PKc_s_max;
                items[i].Nc_s_initial = (inputs.crops[i].Nc_s_initial) ? inputs.crops[i].Nc_s_initial: 0;
                items[i].Nc_water = (inputs.crops[i].Nc_water) ? inputs.crops[i].Nc_water: 0;
    
                if(items[i].Nc_r == 0 || items[i].Nc_r==9.99)
                    items[i].Nc_r = 1.0/100;
                if(items[i].Pc_r == 0 || items[i].Pc_r==9.99)
                    items[i].Pc_r = 1.0/100;
                if(items[i].Kc_r == 0 || items[i].Kc_r==9.99)
                    items[i].Kc_r = 1.0/100;
                if(items[i].DM_r == 0 || items[i].DM_r==9.99)
                    items[i].DM_r = items[i].DM_h;
            }
        }
        
        inputs.items = items;

        return inputs;
    }

    async function fixation(SOM, crop){
        var n_fix_per = 0;
        if(crop.crop_type == "LEGUMES" || crop.crop_type == "FORAGES"){
            if (SOM < 3){
                n_fix_per = 90;
            }else{
                n_fix_per = 60;
            }
        }else{
            if (SOM < 3){
                n_fix_per = 80;
            }else{
                n_fix_per = 50;
            }
        }
        return n_fix_per;
    }

    async function _calcDryMatterCropSoil(inputs){


        const density_s_basic = inputs.data_soil.density_s_basic;

        for(var i=0; i< inputs.n_rotation; i++){

            let ip = (i -1 < 0) ? inputs.n_rotation-1: i-1;

            //Parametros de suelo
            if (inputs.PK_strategy.value == 1 || inputs.PK_strategy.value == 2){
                inputs.items[i].Pc_thres = inputs.data_soil.Pc_s_min; 
                inputs.items[i].Kc_thres = inputs.data_soil.Kc_s_min;
                inputs.items[i].fk = inputs.data_soil.PKc_s_min;
            }

            inputs.items[i].burning = inputs.crops[i].burning;

            // ----  Fixation ----- 
            if(inputs.plot.SOM == 0){
                inputs.plot.SOM = 2.0;
            }
            var crop_cycle = inputs.crops[i].crop_cycle;
            if (crop_cycle == 'Perennial'){
                inputs.items[i].N_fix_per = fixation(inputs.plot.SOM, inputs.crops[i]);
            }
            if(inputs.items[i].crop_type == "LEGUMES" || inputs.items[i].crop_type == "FORAGES" && crop_cycle == 'Perennial'){
                inputs.items[i].n_fix_code = 1;
            }

            /*
            const n_fix = inputs.items[i].n_fix_code;
            if(inputs.plot.SOM == 0){
                inputs.plot.SOM = 2.0;
            }
            if(n_fix == 1){
                if(inputs.items[i].crop_type == "LEGUMES" || inputs.items[i].crop_type == "FORAGES"){
                    if (inputs.plot.SOM < 3){
                        inputs.items[i].n_fix_per = 90;
                    }else{
                        inputs.items[i].n_fix_per = 60;
                    }
                }else{
                    if (inputs.plot.SOM < 3){
                        inputs.items[i].n_fix_per = 80;
                    }else{
                        inputs.items[i].n_fix_per = 50;
                    }
                }
            }
            */

            // ----  -------- ----- 

            if (inputs.PK_strategy.value == 1 || inputs.PK_strategy.value == 2){
                inputs.items[i].nc_y = inputs.items[i].Nc_h_min;
                inputs.items[i].nc_yp = inputs.items[ip].Nc_h_min; //elem.nc_yp = n_min[ip]
                
            }else{
                inputs.items[i].nc_y = inputs.crops[i].Nc_h;
                inputs.items[i].nc_yp = inputs.crops[ip].Nc_h; //elem.nc_yp = input_n_harv[ip]
            }

            const y_dm_med = inputs.crops[i].yield * inputs.items[i].DM_h;
            const r_dm_med = y_dm_med * (1 - inputs.crops[i].HI_est) / inputs.crops[i].HI_est;
            const r_dm_medp = inputs.crops[ip].yield * inputs.items[ip].DM_h * (1 - inputs.crops[ip].HI_est) / inputs.crops[ip].HI_est;
            
            inputs.items[i].N_kg_crop = (y_dm_med * inputs.items[i].nc_y + r_dm_med * inputs.items[i].Nc_r) * (1 + inputs.nutrients.Nc_fnr);

            const oProbCrop = await _calcProbability(inputs, i);
            inputs.items[i].Nc_crop = oProbCrop.n_fert_i[5];
            inputs.items[i].Nc_crop_min=  oProbCrop.n_fert_i[2];
            inputs.items[i].Nc_crop_max=  oProbCrop.n_fert_i[8];
            inputs.items[i].DM_yield = oProbCrop.DM_yield;
            inputs.items[i].DM_r = oProbCrop.DM_r;


            let Pc_thres_factor = (oProbCrop.DM_yield * inputs.crops[i].Pc_h - 10) / 30;
            if (Pc_thres_factor > 2)
                Pc_thres_factor = 2;
            if (Pc_thres_factor < 1)
                Pc_thres_factor = 1;

            inputs.items[i].Pc_thres = Pc_thres_factor * inputs.items[i].Pc_thres;
            
            // ----------------------

            const p_exported = oProbCrop.DM_yield * inputs.crops[i].Pc_h + oProbCrop.DM_r * (1 - inputs.crops[i].fmc_r) * inputs.items[i].Pc_r;

            if (inputs.PK_strategy.value == 4) {
                inputs.items[i].P_rate = p_exported;
            }else{
                if (inputs.PK_strategy.value == 1){
                    // strategy of sufficiency
                    if (inputs.plot.Pc_s > inputs.items[i].Pc_thres){
                        inputs.items[i].P_rate = 0;
                    }else {
                        const nyears = parseInt(0.1* density_s_basic * inputs.nutrients.depth_s* (inputs.items[i].Pc_thres - inputs.plot.Pc_s));
                        inputs.items[i].P_rate = 10 * density_s_basic * inputs.nutrients.depth_s / nyears * (inputs.items[i].Pc_thres - inputs.plot.Pc_s);
                    }
                }else{
                    //strategy of buildup and maintenance
                    if (inputs.plot.Pc_s < inputs.items[i].Pc_thres) {
                        const nyears = parseInt(10 * density_s_basic * inputs.nutrients.depth_s * (inputs.items[i].Pc_thres - inputs.plot.Pc_s)/(100 - p_exported));
                        inputs.items[i].P_rate = p_exported + 10 * density_s_basic * inputs.nutrients.depth_s / nyears * (inputs.items[i].Pc_thres - inputs.plot.Pc_s);
                    }else{
                        if (inputs.plot.Pc_s < 2 * inputs.items[i].Pc_thres){
                            inputs.items[i].P_rate = p_exported;
                        }else{
                            inputs.items[i].P_rate = 0.5 * p_exported;
                        }
                    }
                }

                if(inputs.items[i].P_rate == 'Infinity'){
                    inputs.items[i].P_rate = 0;
                }
            }

            // -----------------

            const k_exported = oProbCrop.DM_yield * inputs.crops[i].Kc_h + oProbCrop.DM_r * (1 - inputs.crops[i].fmc_r) * inputs.items[i].Kc_r;
 
            if (inputs.PK_strategy.value == 4){
                inputs.items[i].K_rate = k_exported;
            }else{
                if( inputs.PK_strategy.value == 1) {
                    // strategy of sufficiency
                    if (inputs.plot.Kc_s > inputs.items[i].Kc_thres){
                        inputs.items[i].K_rate = 0
                    }else{
                        const nyears = parseInt(10 * density_s_basic * inputs.nutrients.depth_s * inputs.items[i].fk * (inputs.items[i].Kc_thres - inputs.plot.Kc_s) / 275) + 1;
                        inputs.items[i].K_rate = 10 * density_s_basic * inputs.nutrients.depth_s * inputs.items[i].fk / nyears * (inputs.items[i].Kc_thres - inputs.plot.Kc_s);
                    }
                }else{
                    // strategy of buildup and maintenance

                    if (inputs.plot.Kc_s < inputs.items[i].Kc_thres){
                        const nyears = parseInt(10 * density_s_basic * inputs.nutrients.depth_s * inputs.items[i].fk *(inputs.items[i].Kc_thres - inputs.plot.Kc_s) / (275 - k_exported)) + 1;
                        inputs.items[i].K_rate = k_exported + 10 * density_s_basic * inputs.nutrients.depth_s * inputs.items[i].fk / nyears * (inputs.items[i].Kc_thres - inputs.plot.Kc_s);
                    }else{
                        if (inputs.plot.Kc_s < 2 * inputs.items[i].Kc_thres){
                            inputs.items[i].K_rate = k_exported;
                        }else{
                            inputs.items[i].K_rate = 0.5 * k_exported;
                        }
                    }
                }
            }

            

            inputs.items[i].Pcf = parseFloat(inputs.items[i].P_rate); //P concentration of fertilizer 
            inputs.items[i].P205cf= 2.29 * inputs.items[i].Pcf;
            inputs.items[i].Kcf=parseFloat(inputs.items[i].K_rate); // K concentration of fertilizer 
            inputs.items[i].K2Ocf = 1.2047* inputs.items[i].Kcf;
        }

        const result = await _transfOutputs(inputs);
        return result;
    }

    async function _calcProbability(inputs, index) {

        //crop posterior
        let ip = (index -1 < 0) ? inputs.n_rotation-1: index-1;        

        const input_item = inputs.crops[index];
        const input_item_pos = inputs.crops[ip];
        
        let yield_i  = new Array(9).fill().map( u => (0));
        let n_fert_i  = new Array(9).fill().map( u => (0));
        let y_dm, r_dm; 

        for(var i_prob=1; i_prob< 10; i_prob++){
            const t=parseFloat(inputs.nutrients.t_levels[i_prob]);
            const y_mean= parseFloat(inputs.crops[index].yield);
            const cvar=parseFloat(inputs.crops[index].CV);
            yield_i[i_prob] = y_mean * (1 + cvar/ 100 * t);

            y_dm = yield_i[i_prob] * inputs.items[index].DM_h;
            r_dm = y_dm * (1 - inputs.crops[index].HI_est) / inputs.crops[index].HI_est;
            const y_dmp = inputs.crops[ip].yield * inputs.items[ip].DM_h;
            const r_dmp = inputs.crops[ip].yield * inputs.items[ip].DM_h * (1 - inputs.crops[ip].HI_est) / inputs.crops[ip].HI_est;

            const ny = y_dm * inputs.items[index].nc_y;
            const nr = r_dm * inputs.items[index].Nc_r;
            const nyp = y_dmp * inputs.items[index].nc_yp;
            const nrp = r_dmp * inputs.items[ip].Nc_r;
            const tillage = (inputs.plot.tillage == 1 || inputs.plot.tillage == 'on') ? 1: 0;
            // The coefficient of mineralization 
            const kim = 0.5 + 0.2 * (inputs.items[ip].n_fix_code + tillage);
            inputs.items[index].N_kg_min = (1 - inputs.items[index].burning) * kim * inputs.crops[ip].fmc_r * nrp;
            inputs.items[index].kim = kim;

            let n_fert = 0;
            if (inputs.items[index].crop_type != "FRUIT_TREES_VINES_AND_SHRUBS") {
                if (inputs.items[index].n_fix_code == 0){
                    n_fert = (inputs.nutrients.Nc_s_end + (1 + inputs.nutrients.Nc_fnr) * (ny + nr) - (1 - inputs.items[index].burning) * kim * inputs.crops[ip].fmc_r * nrp - inputs.nutrients.Nc_fnr * (nyp + nrp) - inputs.nutrients.Nc_other) / (1 - inputs.nutrients.Nc_loss);
                }else{
                    const n_fixation = (1 + inputs.nutrients.Nc_fnr) * (ny + nr) * inputs.items[index].N_fix_per / 100;
                    n_fert = (inputs.nutrients.Nc_s_end + (1 + inputs.nutrients.Nc_fnr) * (ny + nr) - (1 - inputs.items[index].burning) * kim * inputs.crops[ip].fmc_r * nrp - inputs.nutrients.Nc_fnr * (nyp + nrp) - inputs.nutrients.Nc_other - n_fixation) / (1 - inputs.nutrients.Nc_loss);
                    inputs.items[index].N_kg_fix = n_fixation;
                }
            }
            if (n_fert < 0){
                n_fert = 0.0;
            }else{
                if (inputs.items[index].Nc_r == 0) {
                    n_fert = y_dm * (inputs.items[index].nc_y + inputs.nutrients.beta_pl * (1 - inputs.crops[index].HI_est) / inputs.crops[index].HI_est * 0.01 * (1 - 0.5 * (1 - inputs.items[index].burning) * inputs.items[ip].fmc_r)) / inputs.nutrients.efic;
                }else{
                    n_fert = (inputs.nutrients.Nc_s_end + (1 + inputs.nutrients.Nc_fnr) * (ny + nr) - (1 - inputs.items[index].burning) * kim * inputs.crops[ip].fmc_r * nrp - inputs.nutrients.Nc_fnr * (nyp + nrp) - inputs.nutrients.Nc_other) / (1 - inputs.nutrients.Nc_loss);
                }
                  
                if (n_fert < 0) {
                    n_fert = 0;
                }  
            }
            n_fert_i[i_prob] = n_fert;
        }

        inputs.items[index].yield_i = yield_i;

        return {
            n_fert_i: n_fert_i,
            DM_yield: y_dm,
            DM_r: r_dm
        }

    }

    async function _transfOutputs(inputs){

        let result = [];
        for(var j=0; j<inputs.n_rotation; j++){
            const x = inputs.items[j];
            result.push({
                "cropID": x.cropID,
                "crop_name": x.crop_name,
                "crop_latin_name": x.crop_latin_name,
                "crop_type": x.crop_type,
                "yield": x.yield,
                "Ncf_min": x.Nc_crop_min,
                "Ncf_max": x.Nc_crop_max,
                "Ncf_avg": x.Nc_crop,
                "Pcf": x.Pcf,
                "Kcf": x.Kcf,
                "P205cf": x.P205cf,
                "K2Ocf": x.K2Ocf,
                "N_balance": {
                    "mineralization": x.kim,
                    "fixation": x
                }
             
            });
        }

        return result;
        
    }
   

    function _getIndexInputPreviousCrop(i, inputs){
        const n_rotation = inputs.crops.length;
        const ip = (i -1 < 0) ? n_rotation-1: i-1;
        return ip;   
    }

    async function _transfInputCrops(inputs){

        if(inputs instanceof Object){
            inputs = (Object.keys(inputs).map(elem => {
                return inputs[elem]
            }));
        }


        return inputs.map(x => {
            return {
                "cropID": x.cropID,
                "crop_name": x.crop_name,
                "crop_latin_name": x.crop_latin_name,
                "crop_cycle": x.crop_cycle,
                "yield": parseInt(x.yield),
                "CV": parseInt(x.CV),
                "HI_est": x.HI_est/100,
                "fmc_r": x.fmc_r/100,
                "Nc_h": x.Nc_h/100,
                "Pc_h": x.Pc_h/100,
                "Kc_h": x.Kc_h/100,
                "burning": (x.burning == 1 || x.burning == 'on') ? 1: 0
            }
        });
    }

    async function getCrops(){
        return  navNutrient3Model.crops;
    }

    async function getCrop(cropID){
        return  navNutrient3Model.crops.find(element => element.cropID === cropID);
    }

    async function getTypesOfSoils(){
        var types_of_soils = await navNutrient3Model.getParmsTypeOfSoils();
        var soils =  types_of_soils.map(element  => {
            return {
                "type": element.type,
                "name": element.name,
            }
        });

        return soils.filter(item => item.type !== 'none');
    }

    async function PKStrategies(){
        return navNutrient3Model.getParmsStrategies();
    }

    return {
        nutrientNPKbalance: nutrientNPKbalance,
        getCrops: getCrops,
        getCrop: getCrop,
        getTypesOfSoils: getTypesOfSoils,
        PKStrategies: PKStrategies
    }
}