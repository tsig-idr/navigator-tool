
const NavigatorN3Model = require('../model/NavigatorN3Model');
const utils = require('../../utils/utils');
// Nutrients (NPK)
module.exports = function () {

    const navigatorN3Model =  new NavigatorN3Model();

    async function nutrientNPKbalance(req){
        // Se preparan los datos de entrada 
        let list_crops = await _transfInputCrops(req.crops);

        if(!req.plot.soil_type)
            req.plot.fert_strategy = 'none';
        if (!req.plot.fert_strategy){
            req.plot.fert_strategy = 'maintenance';
        }
        if (!req.plot.tillage){
            req.plot.tillage = 0;
        }

        const def_params_soil = await navigatorN3Model.getParmsTypeOfSoil(req.plot.soil_type);
        const def_params_strategy = await navigatorN3Model.getParmsStrategy(req.plot.fert_strategy);
        const def_params_nutrients = await navigatorN3Model.getParmsNutrients();

        let inputs =  {
            items: [],
            plot: req.plot,
            crops: list_crops,
            n_rotation: list_crops.length,
            data_soil:  def_params_soil,
            strategy: def_params_strategy,
            nutrients: def_params_nutrients
        };

        // --- 
        inputs = await _calcDryMatterCropResidue(inputs);
        const result = await _calcDryMatterCropSoil(inputs);

        return result;
    }

    //Step 1
    async function _calcDryMatterCropResidue(inputs){

        let items  = new Array(10).fill().map( u => ({n_max: 0,n_res: 0,p_res: 0,k_res: 0,crop_type: 'nothing',dmh: 0,dmr: 0,n_fix_code: 0,n_min: 0,n_kg_crop: 0,yield_i: 0,n_kg_fix: 0,n_kg_min: 0,n_fert_i:0}));

        //let item  = {n_max: 0,n_res: 0,p_res: 0,k_res: 0,crop_type: 'nothing',dmh: 0,dmr: 0,n_fix_code: 0,n_min: 0,n_kg_crop: 0,yield_i: 0,n_kg_fix: 0,n_kg_min: 0,n_fert_i:0};

        for(var i=0; i< inputs.n_rotation; i++){
            let keyName= '';
            if(inputs.crops[i].crop)
                keyName = inputs.crops[i].crop;
            else if(inputs.crops[i].crop_latin_name){
                keyName = utils.camelize(inputs.crops[i].crop_latin_name);
            }
            
            const cropObj = await navigatorN3Model.getCropsByCrop(keyName);

            if(keyName && cropObj){
                items[i].crop = keyName;
                items[i].name = cropObj.name;
                items[i].latin_name = cropObj.latin_name;
                items[i].n_res = cropObj.residues.N_resi/100;
                items[i].p_res = cropObj.residues.P_resi/100;
                items[i].k_res = cropObj.residues.K_resi/100;
                items[i].dmh = cropObj.harvest.dm_harv/100;
                items[i].dmr = cropObj.residues.dm_resi/100;
                items[i].crop_type = cropObj.type;
                items[i].n_fix_code = cropObj.residues.N_fix_c;
                items[i].n_min = cropObj.harvest.N_min / 100;
                items[i].n_max = cropObj.harvest.N_max / 100;
                items[i].p_thres = inputs.data_soil.p_higher;
                items[i].k_thres = inputs.data_soil.k_higher;
                items[i].fk = inputs.data_soil.fk_hig;
    
                if(items[i].n_res == 0 || items[i].n_res==9.99)
                    items[i].n_res = 1.0/100;
                if(items[i].p_res == 0 || items[i].p_res==9.99)
                    items[i].p_res = 1.0/100;
                if(items[i].k_res == 0 || items[i].k_res==9.99)
                    items[i].k_res = 1.0/100;
                if(items[i].dmr == 0 || items[i].dmr==9.99)
                    items[i].dmr = items[i].dmh;
            }
        }
        
        inputs.items = items;

        return inputs;
    }

    async function _calcDryMatterCropSoil(inputs){


        const bulk_dens = inputs.data_soil.bd;

        for(var i=0; i< inputs.n_rotation; i++){

            let ip = (i -1 < 0) ? inputs.n_rotation-1: i-1;

            //Parametros de suelo
            if (inputs.strategy.value == 1 || inputs.strategy.value == 2){
                inputs.items[i].p_thres = inputs.data_soil.p_lower; 
                inputs.items[i].k_thres = inputs.data_soil.k_lower;
                inputs.items[i].fk = inputs.data_soil.fk_low;
            }

            inputs.items[i].burn = inputs.crops[i].burning;
            const n_fix = inputs.items[i].n_fix_code;
            if(inputs.plot.som == 0){
                inputs.plot.som = 2.0;
            }
            if(n_fix == 1){
                if(inputs.items[i].crop_type == "Forage_legume"){
                    if (inputs.plot.som < 3){
                        inputs.items[i].n_fix_per = 90;
                    }else{
                        inputs.items[i].n_fix_per = 60;
                    }
                }else{
                    if (inputs.plot.som < 3){
                        inputs.items[i].n_fix_per = 80;
                    }else{
                        inputs.items[i].n_fix_per = 50;
                    }
                }
            }

            if (inputs.strategy.value == 1 || inputs.strategy.value == 2){
                inputs.items[i].nc_y = inputs.items[i].n_min;
                inputs.items[i].nc_yp = inputs.items[ip].n_min; //elem.nc_yp = n_min[ip]
                
            }else{
                inputs.items[i].nc_y = inputs.crops[i].n_harv;
                inputs.items[i].nc_yp = inputs.crops[ip].n_harv; //elem.nc_yp = input_n_harv[ip]
            }

            const y_dm_med = inputs.crops[i].yield * inputs.items[i].dmh;
            const r_dm_med = y_dm_med * (1 - inputs.crops[i].h_i) / inputs.crops[i].h_i;
            const r_dm_medp = inputs.crops[ip].yield * inputs.items[ip].dmh * (1 - inputs.crops[ip].h_i) / inputs.crops[ip].h_i;
            
            inputs.items[i].n_kg_crop = (y_dm_med * inputs.items[i].nc_y + r_dm_med * inputs.items[i].n_res) * (1 + inputs.nutrients.fnr);

            const oProbCrop = await _calcProbability(inputs, i);
            inputs.items[i].n_fert_avg = oProbCrop.n_fert_i[5];
            inputs.items[i].n_fert_min=  oProbCrop.n_fert_i[2];
            inputs.items[i].n_fert_max=  oProbCrop.n_fert_i[8];
            inputs.items[i].y_dm = oProbCrop.y_dm;
            inputs.items[i].r_dm = oProbCrop.r_dm;


            let p_thres_factor = (oProbCrop.y_dm * inputs.crops[i].p_harv - 10) / 30;
            if (p_thres_factor > 2)
                p_thres_factor = 2;
            if (p_thres_factor < 1)
                p_thres_factor = 1;

            inputs.items[i].p_thres = p_thres_factor * inputs.items[i].p_thres;
            
            // ----------------------

            const p_exported = oProbCrop.y_dm * inputs.crops[i].p_harv + oProbCrop.r_dm * (1 - inputs.crops[i].fres) * inputs.items[i].p_res;

            if (inputs.strategy.value == 4) {
                inputs.items[i].p_rate = p_exported;
            }else{
                if (inputs.strategy.value == 1){
                    // strategy of sufficiency
                    if (inputs.plot.soil_P_conc > inputs.items[i].p_thres){
                        inputs.items[i].p_rate = 0;
                    }else {
                        const nyears = parseInt(0.1* bulk_dens * inputs.nutrients.soil_depth* (inputs.items[i].p_thres - inputs.plot.soil_P_conc));
                        inputs.items[i].p_rate = 10 * bulk_dens * inputs.nutrients.soil_depth / nyears * (inputs.items[i].p_thres - inputs.crops[i].soil_P_conc);
                    }
                }else{
                    //strategy of buildup and maintenance
                    if (inputs.plot.soil_P_conc < inputs.items[i].p_thres) {
                        const nyears = parseInt(10 * bulk_dens * inputs.nutrients.soil_depth * (inputs.items[i].p_thres - inputs.plot.soil_P_conc)/(100 - p_exported));
                        inputs.items[i].p_rate = p_exported + 10 * bulk_dens * inputs.nutrients.soil_depth / nyears * (inputs.items[i].p_thres - inputs.plot.soil_P_conc);
                    }else{
                        if (inputs.plot.soil_P_conc < 2 * inputs.items[i].p_thres){
                            inputs.items[i].p_rate = p_exported;
                        }else{
                            inputs.items[i].p_rate = 0.5 * p_exported;
                        }
                    }
                }
            }

            // -----------------

            const k_exported = oProbCrop.y_dm * inputs.crops[i].k_harv + oProbCrop.r_dm * (1 - inputs.crops[i].fres) * inputs.items[i].k_res;
 
            if (inputs.strategy.value == 4){
                inputs.items[i].k_rate = k_exported;
            }else{
                if( inputs.strategy.value == 1) {
                    // strategy of sufficiency
                    if (inputs.plot.soil_K_conc > inputs.items[i].k_thres){
                        inputs.items[i].k_rate = 0
                    }else{
                        const nyears = parseInt(10 * bulk_dens * inputs.nutrients.soil_depth * inputs.items[i].fk * (inputs.items[i].k_thres - inputs.plot.soil_K_conc) / 275) + 1;
                        inputs.items[i].k_rate = 10 * bulk_dens * inputs.nutrients.soil_depth * inputs.items[i].fk / nyears * (inputs.items[i].k_thres - inputs.plot.soil_K_conc);
                    }
                }else{
                    // strategy of buildup and maintenance

                    if (inputs.plot.soil_K_conc < inputs.items[i].k_thres){
                        const nyears = parseInt(10 * bulk_dens * inputs.nutrients.soil_depth * inputs.items[i].fk *(inputs.items[i].k_thres - inputs.plot.soil_K_conc) / (275 - k_exported)) + 1;
                        inputs.items[i].k_rate = k_exported + 10 * bulk_dens * inputs.nutrients.soil_depth * inputs.items[i].fk / nyears * (inputs.items[i].k_thres - inputs.plot.soil_K_conc);
                    }else{
                        if (inputs.plot.soil_K_conc < 2 * inputs.items[i].k_thres){
                            inputs.items[i].k_rate = k_exported;
                        }else{
                            inputs.items[i].k_rate = 0.5 * k_exported;
                        }
                    }
                }
            }

            inputs.items[i].p_fert = parseFloat(inputs.items[i].p_rate);
            inputs.items[i].p_fert_oxide= 2.29 * inputs.items[i].p_fert;
            inputs.items[i].k_fert=parseFloat(inputs.items[i].k_rate);
            inputs.items[i].k_fert_oxide = 1.2047* inputs.items[i].k_fert;
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
            const t=parseFloat(inputs.nutrients.t_i[i_prob]);
            const y_mean= parseFloat(inputs.crops[index].yield);
            const cvar=parseFloat(inputs.crops[index].cv);
            yield_i[i_prob] = y_mean * (1 + cvar/ 100 * t);

            y_dm = yield_i[i_prob] * inputs.items[index].dmh;
            r_dm = y_dm * (1 - inputs.crops[index].h_i) / inputs.crops[index].h_i;
            const y_dmp = inputs.crops[ip].yield * inputs.items[ip].dmh;
            const r_dmp = inputs.crops[ip].yield * inputs.items[ip].dmh * (1 - inputs.crops[ip].h_i) / inputs.crops[ip].h_i;

            const ny = y_dm * inputs.items[index].nc_y;
            const nr = r_dm * inputs.items[index].n_res;
            const nyp = y_dmp * inputs.items[index].nc_yp;
            const nrp = r_dmp * inputs.items[ip].n_res;
            const tillage = (inputs.plot.tillage == 1 || inputs.plot.tillage == 'on') ? 1: 0; 
            const kim = 0.5 + 0.2 * (inputs.items[ip].n_fix_code + tillage);
            const n_kg_min = (1 - inputs.items[index].burn) * kim * inputs.crops[ip].fres * nrp;

            let n_fert = 0;
            if (inputs.items[index].crop_type != "Trees") {
                if (inputs.items[index].n_fix_code == 0){
                    n_fert = (inputs.nutrients.n_end + (1 + inputs.nutrients.fnr) * (ny + nr) - (1 - inputs.items[index].burn) * kim * inputs.crops[ip].fres * nrp - inputs.nutrients.fnr * (nyp + nrp) - inputs.nutrients.n_other) / (1 - inputs.nutrients.fnloss);
                }else{
                    const n_fixation = (1 + inputs.nutrients.fnr) * (ny + nr) * inputs.items[i].n_fix_per / 100;
                    n_fert = (inputs.nutrients.n_end + (1 + inputs.nutrients.fnr) * (ny + nr) - (1 - items[index].burn) * kim * inputs.crops[ip].fres * nrp - inputs.nutrients.fnr * (nyp + nrp) - inputs.nutrients.n_other - n_fixation) / (1 - inputs.nutrients.fnloss);
                    inputs.items[index].n_kg_fix = n_fixation;
                }
            }
            if (n_fert < 0){
                n_fert = 0.0
            }else{
                if (inputs.items[index].n_res == 0) {
                    n_fert = y_dm * (inputs.items[index].nc_y + inputs.nutrients.beta_pl * (1 - inputs.crops[index].h_i) / inputs.crops[index].h_i * 0.01 * (1 - 0.5 * (1 - inputs.items[index].burn) * inputs.items[ip].fres)) / inputs.nutrients.efic;
                }else{
                    n_fert = (inputs.nutrients.n_end + (1 + inputs.nutrients.fnr) * (ny + nr) - (1 - inputs.items[index].burn) * kim * inputs.crops[ip].fres * nrp - inputs.nutrients.fnr * (nyp + nrp) - inputs.nutrients.n_other) / (1 - inputs.nutrients.fnloss);
                }
                  
                if (n_fert < 0) {
                    n_fert = 0;
                }  
            }
            n_fert_i[i_prob] = n_fert;
        }
        return {
            n_fert_i: n_fert_i,
            y_dm: y_dm,
            r_dm: r_dm
        }

    }

    async function _transfOutputs(inputs){

        let result = [];
        for(var j=0; j<inputs.n_rotation; j++){
            const x = inputs.items[j];
            result.push({
                "crop": x.crop,
                "crop_name": x.name,
                "crop_latin_name": x.latin_name,
                "n_fert_min": x.n_fert_min,
                "n_fert_max": x.n_fert_max,
                "n_fert_avg": x.n_fert_avg,
                "p_fert": x.p_fert,
                "k_fert": x.k_fert,
                "p_fert_oxide": x.p_fert_oxide,
                "k_fert_oxide": x.k_fert_oxide
             
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
                "crop": x.crop,
                "crop_name": x.crop_name,
                "crop_latin_name": x.crop_latin_name,
                "yield": parseInt(x.yield),
                "cv": parseInt(x.cv),
                "h_i": x.harvest_index/100,
                "fres": x.fres/100,
                "n_harv": x.N_harv/100,
                "p_harv": x.P_harv/100,
                "k_harv": x.K_harv/100,
                "burning": (x.burning == 1 || x.burning == 'on') ? 1: 0
            }
        });
    }

    async function getCrops(){
        return  navigatorN3Model.crops;
    }

    async function getCrop(crop){
        return  navigatorN3Model.crops.find(element => element.crop === crop);
    }

    

    return {
        nutrientNPKbalance: nutrientNPKbalance,
        getCrops: getCrops,
        getCrop: getCrop
    }
}