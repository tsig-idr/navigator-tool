
const NutrientsL3FertilicalcModel = require('./model/NavigatorN3Model');
const utils = require('../utils/utils');
//Deprecate version. 
module.exports = function () {


    const t_i = [0, -1.29, -0.84, -0.525, -0.25, 0., 0.25, 0.525, 0.84, 1.29];
    let n_fix;
    const n_end = 10.0;
    const fnr = 0.2;
    const n_other = 10.0;
    const fnloss = 0.0;
    const efic = 0.8;
    const soil_depth = 0.3;

    async function _step1calcInputNPK(inputs){
        const nutrientsL3FertilicalcModel =  new NutrientsL3FertilicalcModel();
        //let results = [];
        let elements  = new Array(10).fill().map( u => ({n_max: 0,n_res: 0,p_res: 0,k_res: 0,crop_type: 'nothing',dmh: 0,dmr: 0,n_fix_code: 0,n_min: 0,n_kg_crop: 0,yield_i: 0,n_kg_fix: 0,n_kg_min: 0,n_fert_i:0}));
        const n_rotation = inputs.crops.length;

        for(var i=0; i< n_rotation; i++){

            const input_item = inputs.crops[i];
            //const input_global_characteristics = inputs.characteristics;
            const input_strategy = inputs.strategy; //_getFertilizerStrategy(input_global_characteristics.fert_strategy);
            const defdata_soil = inputs.data_soil; //_getDefaultDataSoil(input_global_characteristics.soil_type);

            const keyName = utils.camelize(input_item.crop_latin_name);
            const cropObj = await nutrientsL3FertilicalcModel.getCropsByCrop(keyName);

            elements[i].name = cropObj.name;
            elements[i].latin_name = cropObj.latin_name;
            elements[i].n_res = cropObj.residues.N_resi/100;
            elements[i].p_res = cropObj.residues.P_resi/100;
            elements[i].k_res = cropObj.residues.K_resi/100;
            elements[i].dmh = cropObj.harvest.dm_harv/100;
            elements[i].dmr = cropObj.residues.K_resi/100;
            elements[i].crop_type = cropObj.type;
            elements[i].n_fix_code = cropObj.residues.N_fix_c;
            elements[i].n_min = cropObj.residues.N_min / 100;
            elements[i].n_max = cropObj.residues.N_max / 100;
            elements[i].p_thres = defdata_soil.p_higher;
            elements[i].k_thres = defdata_soil.k_higher;
            elements[i].fk = defdata_soil.fk_hig;

            if(elements[i].n_res == 0 || elements[i].n_res==9.99)
                elements[i].n_res = 1.0/100;
            if(elements[i].p_res == 0 || elements[i].p_res==9.99)
                elements[i].p_res = 1.0/100;
            if(elements[i].k_res == 0 || elements[i].k_res==9.99)
                elements[i].k_res = 1.0/100;
            if(elements[i].dmr == 0 || elements[i].dmr==9.99)
                elements[i].dmr = elem.dmh;

            if (input_strategy.value == 1 || input_strategy.value == 2){
                elements[i].p_thres = defdata_soil.p_lower; 
                elements[i].k_thres = defdata_soil.k_lower;
                elements[i].fk = defdata_soil.fk_low;
            }
        }

        return elements;
    }

    async function _calcFertiCrop(inputs, items, index) {

        //crop posterior
        let ip = (index -1 < 0) ? inputs.n_rotation-1: index-1;        

        const input_item = inputs.crops[index];
        const input_item_pos = inputs.crops[ip];
        
        let yield_i  = new Array(9).fill().map( u => (0));
        let n_fert_i  = new Array(9).fill().map( u => (0));
        let y_dm, r_dm; 

        for(var i_prob=0; i_prob< 9; i_prob++){
            const t=parseFloat(t_i[i_prob]);
            const y_mean= parseFloat(input_item.yield);
            const cvar=parseFloat(input_item.cv);
            yield_i[i_prob] = y_mean * (1 + cvar/ 100 * t);

            y_dm = yield_i[i_prob] * items[index].dmh;
            r_dm = y_dm * (1 - input_item.h_i) / input_item.h_i;
            const y_dmp = input_item_pos.yield * items[ip].dmh;
            const r_dmp = input_item_pos.yield * items[ip].dmh * (1 - input_item_pos.h_i) / input_item_pos.h_i;

            const ny = y_dm * items[index].nc_y;
            const nr = r_dm * items[index].n_res;
            const nyp = y_dmp * items[index].nc_yp;
            const nrp = r_dmp * items[ip].n_res;
            const kim = 0.5 + 0.2 * (items[ip].n_fix_code + inputs.characteristics.tillage);
            const n_kg_min = (1 - items[index].burn) * kim * input_item_pos.fres * nrp;

            let n_fert = 0;
            if (items[index].crop_type != "Trees") {
                if (n_fix == 0){
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - items[index].burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other) / (1 - fnloss);
                }else{
                    const n_fixation = (1 + fnr) * (ny + nr) * n_fix_per / 100;
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - items[index].burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other - n_fixation) / (1 - fnloss);
                    item.n_kg_fix = n_fixation;
                }
            }
            if (n_fert < 0){
                n_fert = 0.0
            }else{
                if (items[index].n_res == 0) {
                    n_fert = y_dm * (nc_y + beta_pl * (1 - input_item.harvest_index) / input_item.harvest_index * 0.01 * (1 - 0.5 * (1 - item.burn) * input_item_pos.fres)) / efic;
                }else{
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - items[index].burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other) / (1 - fnloss);
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

    async function _calc10LevelsProbability(item, item_pos, input_item, input_item_pos, input_global) {
        
        let yield_i  = new Array(10).fill().map( u => (0));
        let n_fert_i  = new Array(10).fill().map( u => (0));

        for(var i_prob=0; i_prob< 10; i_prob++){
            const t=parseFloat(t_i[i_prob]);
            const y_mean= parseFloat(input_item.yield);
            const cvar=parseFloat(input_item.coef_variation_yield);
            yield_i[i_prob] = y_mean * (1 + cvar/ 100 * t);

            const y_dm = yield_i[i_prob] * item.dmh;
            const r_dm = y_dm * (1 - input_item.harvest_index) / input_item.harvest_index;
            const y_dmp = input_item_pos.yield * item_pos.dmh;
            const r_dmp = input_item_pos.yield * item_pos.dmh * (1 - input_item_pos.harvest_index) / input_item_pos.harvest_index;

            const ny = y_dm * item.nc_y;
            const nr = r_dm * item.n_res;
            const nyp = y_dmp * item.nc_yp;
            const nrp = r_dmp * item_pos.n_res;
            const kim = 0.5 + 0.2 * (item_pos.n_fix_code + input_global.tillage);
            const n_kg_min = (1 - item.burn) * kim * input_item_pos.fres * nrp;

            //CONTINUAR LINEA 214
            let n_fert = 0;
            if (item.crop_type != "Trees") {
                if (n_fix == 0){
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - item.burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other) / (1 - fnloss);
                }else{
                    const n_fixation = (1 + fnr) * (ny + nr) * n_fix_per / 100;
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - item.burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other - n_fixation) / (1 - fnloss);
                    item.n_kg_fix = n_fixation;
                }
            }
            if (n_fert < 0){
                n_fert = 0.0
            }else{
                if (item.n_res == 0) {
                    n_fert = y_dm * (nc_y + beta_pl * (1 - input_item.harvest_index) / input_item.harvest_index * 0.01 * (1 - 0.5 * (1 - item.burn) * input_item_pos.fres)) / efic;
                }else{
                    n_fert = (n_end + (1 + fnr) * (ny + nr) - (1 - item.burn) * kim * input_item_pos.fres * nrp - fnr * (nyp + nrp) - n_other) / (1 - fnloss);
                }
                  
                if (n_fert < 0) {
                    n_fert = 0;
                }  
            }
            n_fert_i[i_prob] = n_fert;
        }
        return n_fert_i;
    }

    async function _transfInputCrops(inputs){
        return inputs.map(x => {
            return {
                "crop_name": x.crop_name,
                "crop_latin_name": x.crop_latin_name,
                "yield": x.yield,
                "cv": x.coef_variation_yield,
                "h_i": x.harvest_index/100,
                "fres": x.fres/100,
                "n_harv": x.N_harv/100,
                "p_harv": x.P_harv/100,
                "k_harv": x.K_harv/100,
                "burning": x.burning
            }
        });
    }

    async function _calcRotation(inputs, items){

        const n_rotation = inputs.crops.length;
        const input_strategy = inputs.strategy; //_getFertilizerStrategy(inputs.characteristics.fert_strategy);
        const defdata_soil = inputs.data_soil; //_getDefaultDataSoil(inputs.characteristics.soil_type);

        const bulk_dens = inputs.data_soil.bd;

        for(var i=0; i< n_rotation; i++){
            //Item posterior
            let ip = (i -1 < 0) ? n_rotation-1: i-1;        

            const input_item = inputs.crops[i];
            const input_item_pos = inputs.crops[ip];

            items[i].burn = input_item.burning;
            n_fix = items[i].n_fix_code;
            if(inputs.characteristics.som == 0){
                inputs.characteristics.som = 2.0;
            }
            if(n_fix == 1){
                if(items[i].crop_type == "Forage_legume"){
                    if (inputs.characteristics.som < 3){
                        items[i].n_fix_per = 90;
                    }else{
                        items[i].n_fix_per = 60;
                    }
                }else{
                    if (inputs.characteristics.som < 3){
                        items[i].n_fix_per = 80;
                    }else{
                        items[i].n_fix_per = 50;
                    }
                }
            }

            if (input_strategy.value == 1 || input_strategy.value == 2){
                items[i].nc_y = items[i].n_min;
                items[i].nc_yp = items[ip].n_min; //elem.nc_yp = n_min[ip]
                
            }else{
                items[i].nc_y = input_item.n_harv;
                items[i].nc_yp = input_item_pos.n_harv; //elem.nc_yp = input_n_harv[ip]
            }

            let y_dm_med = input_item.yield * items[i].dmh;
            const r_dm_med = y_dm_med * (1 - input_item.h_i) / input_item.h_i;
            const r_dm_medp = input_item_pos.yield * items[ip].dmh * (1 - input_item_pos.h_i) / input_item_pos.h_i;
            items[i].n_kg_crop = (y_dm_med * items[i].nc_y + r_dm_med * items[i].n_res) * (1 + fnr);


            const objFertiCrop = await _calcFertiCrop(inputs, items, i);
            items[i].n_fert_avg = objFertiCrop.n_fert_i[4]; //Le quitamos uno porque FC1 el cero no es cultivo 
            items[i].n_fert_min=  objFertiCrop.n_fert_i[1];
            items[i].n_fert_max=  objFertiCrop.n_fert_i[7];

            let p_thres_factor = (objFertiCrop.y_dm * input_item.p_harv - 10) / 30;
            if (p_thres_factor > 2)
                p_thres_factor = 2;
            if (p_thres_factor < 1)
                p_thres_factor = 1;

            items[i].p_thres = p_thres_factor * items[i].p_thres;
            const p_exported = objFertiCrop.y_dm * input_item.p_harv + objFertiCrop.r_dm * (1 - input_item.fres) * items[i].p_res;

            if (input_strategy.value == 4) {
                items[i].p_rate = p_exported;
            }else{
                if (input_strategy.value == 1){
                    // strategy of sufficiency
                    if (input_p_conc > p_thres){
                        items[i].p_rate = 0;
                    }else {
                        const nyears = int(0.1* bulk_dens * soil_depth* (p_thres - input_item.p_conc));
                        items[i].p_rate = 10 * bulk_dens * soil_depth / nyears * (p_thres - input_item.p_conc);
                    }
                }else{
                    //strategy of buildup and maintenance
                    if (input_item.p_conc < items[i].p_thres) {
                        const nyears = int(10 * bulk_dens * soil_depth * (items[i].p_thres - input_item.p_conc)/(100 - p_exported));
                        items[i].p_rate = p_exported + 10 * bulk_dens * soil_depth / nyears * (items[i].p_thres - input_item.p_conc);
                    }else{
                        if (input_item.p_conc < 2 * items[i].p_thres){
                            items[i].p_rate = p_exported;
                        }else{
                            items[i].p_rate = 0.5 * p_exported;
                        }
                    }
                }
            }
            const k_exported = objFertiCrop.y_dm * input_item.k_harv + objFertiCrop.r_dm * (1 - input_item.fres) * items[i].k_res;
 
            if (input_strategy.value == 4){
                items[i].k_rate = k_exported;
            }else{
                if( input_strategy.value == 1) {
                    // strategy of sufficiency
                    if (input_item.k_conc > items[i].k_thres){
                        items[i].k_rate = 0
                    }else{
                        const nyears = int(10 * bulk_dens * soil_depth * fk * (items[i].k_thres - input_item.k_conc) / 275) + 1;
                        items[i].k_rate = 10 * bulk_dens * soil_depth * fk / nyears * (items[i].k_thres - input_item.k_conc);
                    }
                }else{
                    // strategy of buildup and maintenance

                    if (input_item.k_conc < items[i].k_thres){
                        const nyears = int(10 * bulk_dens * soil_depth * fk *(items[i].k_thres - input_item.k_conc) / (275 - k_exported)) + 1;
                        items[i].k_rate = k_exported + 10 * bulk_dens * soil_depth * fk / nyears * (items[i].k_thres - input_item.k_conc);
                    }else{
                        if (input_item.k_conc < 2 * items[i].k_thres){
                            items[i].k_rate = k_exported;
                        }else{
                            items[i].k_rate = 0.5 * k_exported;
                        }
                    }
                }
            }

            items[i].p_fert = parseFloat(items[i].p_rate);
            items[i].p_fert_oxide= 2.29 * items[i].p_fert;

            items[i].k_fert=parseFloat( items[i].k_rate);
            items[i].k_fert_oxide = 1.2047* items[i].k_fert;

            const o = items[i];
           

            console.log(o.name + "," + o.n_fert_min + ","+o.n_fert_max + "," + o.n_fert_avg + "," + o.p_fert + "," + o.k_fert + "," + o.p_fert_oxide + "," +o.k_fert_oxide);
        } 
    }

    async function calculateNPK(params){

        // Se preparan los datos de entrada 
        let crops = await _transfInputCrops(params.crops);
        const inputs =  {
            characteristics: params.characteristics,
            crops: crops,
            n_rotation: params.crops.length,
            data_soil:  _getDefaultDataSoil(params.characteristics.soil_type),
            strategy: _getFertilizerStrategy(params.characteristics.fert_strategy)
        };



        //const n_rotation = inputs.crops.length;
        //let defdata_soil = _getDefaultDataSoil(inputs.characteristics.soil_type);
        //const input_strategy = _getFertilizerStrategy(inputs.characteristics.fert_strategy)

        const items = await _step1calcInputNPK(inputs);
        await _calcRotation(inputs, items);
        
    }

   

    function _getFertilizerStrategy(title) {
        const strategies = [{
            "value": 1,
            "title": "sufficiency",
            "description": "Sufficiency"
        },{
            "value": 2,
            "title": "minimum-fertilizer",
            "description": "Buildup & maintenance (minimum fertilizer)"
        },
        {
            "value": 3,
            "title": "maximum-yield",
            "description": "Buildup & maintenance (maximum yield)"
        },
        {
            "value": 4,
            "title": "maintenance",
            "description": "Maintenance (for definitions see paper)"
        }];

        return strategies.find(x => x.title == title.toLowerCase());
        
    }


    function _getDefaultDataSoil(type){
        const defaultdata_soil = [
            {
                type: "none",
                p_lower: 0,
                p_higher: 0,
                k_lower: 0,
                k_higher: 0,
                fk_low: 0,
                fk_hig: 0,
                bd: 0,
            },
            {
                type: "sand",
                p_lower: 8,
                p_higher: 10,
                k_lower: 100,
                k_higher: 100,
                fk_low: 1.1,
                fk_hig: 1.2,
                bd: 1.68
            },
            {
                type: "sandy_loam",
                p_lower: 10,
                p_higher: 12,
                k_lower: 150,
                k_higher: 175,
                fk_low: 1.1,
                fk_hig: 1.2,
                bd: 1.56
            },
            {
                type: "loam",
                p_lower: 10,
                p_higher: 12,
                k_lower: 150,
                k_higher: 175,
                fk_low: 1.5,
                fk_hig: 1.7,
                bd: 1.43
            },
            {
                type: "silty_loam",
                p_lower: 10,
                p_higher: 12,
                k_lower: 150,
                k_higher: 175,
                fk_low: 1.5,
                fk_hig: 1.7,
                bd: 1.41
            },
            {
                type: "clay_loam",
                p_lower: 10,
                p_higher: 12,
                k_lower: 150,
                k_higher: 175,
                fk_low: 2,
                fk_hig: 2,
                bd: 1.31
            },
            {
                type: "clay",
                p_lower: 12,
                p_higher: 20,
                k_lower: 200,
                k_higher: 300,
                fk_low: 2.5,
                fk_hig: 5,
                bd: 1.21
            }
        ];
        return defaultdata_soil.find(x => x.type == type.toLowerCase());
    }

    return {
        calculateNPK: calculateNPK
    }
}