/**
 * Devuelve El texto de la opción seleccionada
 * @param {string} id Identificador del combo
 * @returns string
 */
function getTextSelectedFromCombo(id) {
    const combo = document.getElementById(id);
    if (combo) {
        return combo.options[combo.selectedIndex].text;
    }
    return '';
}

function getTextDateFromInputDate(id) {
    const iDate = document.getElementById(id);
    if (iDate) {
        return iDate.value;
    }
    return '';
}

function getNameFileFromInputFile(id) {
    const iFile = document.getElementById(id);
    if (iFile) {
        return iFile.files.item(0).name;
    }
    return '';
}

function getValueFromInputName(id) {
    const iFile = document.querySelector('input[name="input['+id+']"]');
    if (iFile) {
        return iFile.value;
    }
    return '';
}

function generarPDF(id, data, shouldDownload, subF) {
    var doc = window.informePDF[id](data, subF);
    doc.setProperties({
        title: 'Fichero: ' + id,
        subject: 'Fichero pdf - Autotable (' + id + ')'
    });
    if (shouldDownload) {
        doc.save('informe-'+id+'.pdf');
    } else {
        document.getElementById("output").data = doc.output('datauristring');
    }
}


function getPDF(id, shouldDownload, subF) {
    if (!(window.informePDF && window.informePDF[id])) {
        loadScript('js/templates_pdf/' + id + '_pdf.js', () => {
            generarPDF(id, dataPDF[id](), shouldDownload, subF);
        });
    } else {
        generarPDF(id, dataPDF[id](), shouldDownload, subF);
    } 
}

// === DATOS ===========================
const dataPDF = {

    F4: function() {
        const vCombos = ['crop_type', 'water_supply', 'climatic_zone'];
        const vInputs = ['yield'];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        return datos;
    },

    F3: function() {
        const vCombos = [
            'crop_type', 'PK_strategy', // crop
            'water_supply', 'climatic_zone', 'type_irrigated', // Plot
            'soil_texture', 'tilled', 'Nc_s_initial_unit', 'Nc_end_unit', 'Pc_method', 'Pc_s_unit', 'Kc_s_unit' // Soil
        ];
        const vInputs = [
            'yield', 'export_r', 'HI_est', 'CV', 'Nc_h', 'Pc_h', 'Kc_h', // crop
            'dose_irrigation', 'Nc_NO3_water', 'rain_a', 'rain_w', // Plot
            'pH', 'CEC', 'SOM', 'depth_s', 'Nc_s_initial', 'Nc_end', 'Pc_s', 'Kc_s' // Soil
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        return datos;
    },

    F2: function() {
        const vCombos = [
            'crop_type', 'PK_strategy', // crop
            'water_supply', 'climatic_zone', 'type_irrigated', // Plot
            'soil_texture', 'Nc_s_initial_unit', 'Pc_method', 'Pc_s_unit', 'Kc_s_unit' // Soil
        ];
        const vInputs = [
            'yield', 'Nc_h', 'Pc_h', 'Kc_h', 'export_r', 'HI_est', 'CV',  // crop
            'dose_irrigation', 'waterNitrate', // Plot
            'depth_s', 'pH', 'stony', 'CEC', 'SOM', 'NO3', 'NH4', 'N_NH4', 'Nc_s_initial', 'Pc_s', 'Kc_s' // Soil
        ];
        const vDates = [
            'crop_startDate', 'crop_endDate' // crop
        ]
        const vFiles = [
            'fileClima', 'fileMeteo', 'fileRiegos', 'fileFenoBBCH' // Plot
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    F1: function() {
        const vCombos = [
            'crop_type', 'PK_strategy', // crop
            'water_supply', 'climatic_zone', 'type_irrigated', // Plot
            'soil_texture', 'Nc_s_initial_unit', 'Pc_method', 'Pc_s_unit', 'Kc_s_unit' // Soil
        ];
        const vInputs = [
            'yield', 'Nc_h', 'Pc_h', 'Kc_h', 'export_r', 'HI_est', 'CV',  // crop
            'dose_irrigation', 'waterNitrate', // Plot
            'depth_s', 'pH', 'stony', 'CEC', 'SOM', 'NO3', 'NH4', 'N_NH4', 'Nc_s_initial', 'Pc_s', 'Kc_s' // Soil
        ];
        const vDates = [
            'crop_startDate', 'crop_endDate' // crop
        ]
        const vFiles = [
            'fileClima', 'fileMeteo', 'fileRiegos', 'fileFenoBBCH', 'fileNDVItipo', 'fileNDVIreal' // Plot
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G4Livestock: function() {
        const vCombos = [
            'd_c_calves_diet', 'd_c_growing_1_diet', 'd_c_growing_2_diet', 'd_c_mature_diet', // Dairy cattle
            'm_c_calves_diet', 'm_c_growing_1_diet', 'm_c_growing_2_diet' // Meat cattle
        ];
        const vInputs = [
            'd_c_4000','d_c_6000','d_c_8000','d_c_10000','d_c_calves','d_c_growing_1', 'd_c_growing_2', 'd_c_mature', // Dairy cattle
            'm_c_calves', 'm_c_mature', 'm_c_growing_1', 'm_c_growing_2', // Meat cattle
            'g_growing', 'g_mature', // Goats
            'p_growing', 'p_mature', // Pigs
            'po_broiler', 'po_hen', 'po_other', // Poultry
            'r_others', // Other rumiants
            's_growing', 's_mature', // Sheep
            'temp_av' // Manure data - Average Temperature (°C)

        ];
        const vDates = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G4Crops: function() {
        const vCombos = [
            'rewetted', 'combustible', 'residues', 'spread', 'removed', // Plot i
            'climate', 'temp_reg', 'moist_reg', 'soil' // Farm
        ];
        const vInputs = [
           'crop_name', 'area', 'yield', 'export_r', 'SOM', 'tilled', 'drain_rate', 'consumption', //Plot i
           'seeds',
           'herb', 'fung', 'insect', 'otreat', // Pesticides
           'leaching', 'volatilization', // Nitrogen
        ];
        const vDates = []
        const vFiles = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G3Livestock: function() {
        const vCombos = [
            'd_c_calves_diet', 'd_c_growing_1_diet', 'd_c_growing_2_diet', 'd_c_mature_diet', // Dairy cattle
            'm_c_calves_diet', 'm_c_growing_1_diet', 'm_c_growing_2_diet' // Meat cattle
        ];
        const vInputs = [
            'd_c_4000','d_c_6000','d_c_8000','d_c_10000','d_c_calves','d_c_growing_1', 'd_c_growing_2', 'd_c_mature', // Dairy cattle
            'm_c_calves', 'm_c_mature', 'm_c_growing_1', 'm_c_growing_2', // Meat cattle
            'g_growing', 'g_mature', // Goats
            'p_growing', 'p_mature', // Pigs
            'po_broiler', 'po_hen', 'po_other', // Poultry
            'r_others', // Other rumiants
            's_growing', 's_mature', // Sheep
            'temp_av' // Manure data - Average Temperature (°C)

        ];
        const vDates = [];
        const vFiles = [
            'fileFeeds', 'fileManure'
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },
    
    G3Crops: function() {
        const vCombos = [
            'rewetted', 'combustible', 'residues', 'spread', 'removed', // Plot i
            'climate', 'temp_reg', 'moist_reg', 'soil' // Farm
        ];
        const vInputs = [
           'crop_name', 'area', 'yield', 'export_r', 'SOM', 'tilled', 'drain_rate', 'consumption', //Plot i
           'seeds',
           'herb', 'fung', 'insect', 'otreat', // Pesticides
           'leaching', 'volatilization', // Nitrogen

        ];
        const vDates = []
        const vFiles = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G2Crops: function() {
        const vCombos = [
            'rewetted', 'combustible', 'residues', 'spread', 'removed', // Plot i
            'climate', 'temp_reg', 'moist_reg', 'soil', // Farm
            'chang_till', 'chang_cov', 'chang_com', 'chang_man', 'chang_res' // Plot i
        ];
        const vInputs = [
           'crop_name', 'area', 'yield', 'export_r', 'SOM', 'tilled', 'drain_rate', 'consumption', //Plot i
           'seeds',
           'per_till','per_cov', 'per_com', 'am_com', 'per_man', 'am_man', 'per_res', 'am_res', // Plot i
           'herb', 'fung', 'insect', 'otreat', // Pesticides
           'leaching', 'volatilization', // Nitrogen

        ];
        const vDates = []
        const vFiles = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },


    G2Livestock: function() {
        const vCombos = [];
        const vInputs = [
            'd_c_4000', 'd_c_4000_milk', 'd_c_4000_lact_d', 'd_c_4000_BW_av', // Cows 4000 kg milk
            'd_c_6000', 'd_c_6000_milk', 'd_c_6000_lact_d', 'd_c_6000_BW_av', // Cows 6000 kg milk
            'd_c_8000', 'd_c_8000_milk', 'd_c_8000_lact_d', 'd_c_8000_BW_av', // Cows 8000 kg milk
            'd_c_10000', 'd_c_10000_milk', 'd_c_10000_lact_d', 'd_c_10000_BW_av', // Cows 4000 kg milk
            'd_c_mature', 'd_c_mature_BW_av', // Mature cattle
            'd_c_calves', 'd_c_calves_BW_av', // Calves
            'd_c_growing_1', 'd_c_growing_1_BW_av', // Growing < 2 years
            'd_c_growing_2', 'd_c_growing_2_BW_av', // Growing > 2 years
            'm_c_mature', 'm_c_mature_BW_av', // Mature cattle
            'm_c_calves', 'm_c_calves_BW_av', // Calves
            'm_c_growing_1', 'm_c_growing_1_BW_av', // Growing < 2 years
            'm_c_growing_2', 'm_c_growing_2_BW_av', // Growing > 2 years
            's_mature', 's_mature_BW_av', // Mature cattle
            's_growing', 's_growing_BW_av', // Growing cattle
            'g_mature', 'g_mature_BW_av', // Mature cattle
            'g_growing', 'g_growing_BW_av', // Growing cattle
            'r_others', 'r_others_BW_av', // Horses
            'p_mature', // Mature pigs
            'p_growing', // Growing pigs
            'po_hen', // Hens
            'po_broiler', // Broiler chicken
            'po_other', // Other poultry
            'temp_av'
        ];
        const vDates = [];
        const vFiles = [
            'fileFeeds', 'fileManure'
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = getValueFromInputName(id));
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G2LUC: function() {
        return (getJSONFromFormLUC_G2) ? (getJSONFromFormLUC_G2()).input : {
			forest2cropland: 0,
            forest2grassland: 0,
            grassland2cropland: 0,
            grassland2forest: 0,
            cropland2grassland: 0,
            cropland2forest: 0,
			infrastructures: {
                trees: [],
                shrubby: [],
                orchards: [],
                low: []
            },
			forests: []
		};
    },

    G1Crops: function() {
        const vCombos = [
            'rewetted', 'combustible', 'residues', 'spread', 'removed', // Plot i
            'climate', 'temp_reg', 'moist_reg', 'soil', // Farm
            'chang_till', 'chang_cov', 'chang_com', 'chang_man', 'chang_res' // Plot i
        ];
        const vInputs = [
           'crop_name', 'area', 'yield', 'export_r', 'SOM', 'tilled', 'drain_rate', 'consumption', //Plot i
           'seeds',
           'per_till','per_cov', 'per_com', 'am_com', 'per_man', 'am_man', 'per_res', 'am_res', // Plot i
           'herb', 'fung', 'insect', 'otreat', // Pesticides
           'leaching', 'volatilization', // Nitrogen

        ];
        const vDates = []
        const vFiles = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G1Livestock: function() {
        const vCombos = [
            'additive'
        ];
        const vInputs = [
            'd_c_4000', 'd_c_4000_milk', 'd_c_4000_lact_d', 'd_c_4000_BW_av', 'd_c_4000_N_exc', 'd_c_4000_VS_exc', 'd_c_4000_MY', // Cows 4000 kg milk
            'd_c_6000', 'd_c_6000_milk', 'd_c_6000_lact_d', 'd_c_6000_BW_av', 'd_c_6000_N_exc', 'd_c_6000_VS_exc', 'd_c_6000_MY', // Cows 6000 kg milk
            'd_c_8000', 'd_c_8000_milk', 'd_c_8000_lact_d', 'd_c_8000_BW_av', 'd_c_8000_N_exc', 'd_c_8000_VS_exc', 'd_c_8000_MY', // Cows 8000 kg milk
            'd_c_10000', 'd_c_10000_milk', 'd_c_10000_lact_d', 'd_c_10000_BW_av', 'd_c_10000_N_exc', 'd_c_10000_VS_exc', 'd_c_10000_MY', // Cows 4000 kg milk
            'd_c_mature', 'd_c_mature_BW_av', 'd_c_mature_MY', 'd_c_mature_N_exc', 'd_c_mature_VS_exc', // Mature cattle
            'd_c_calves', 'd_c_calves_BW_av', 'd_c_calves_MY', 'd_c_calves_N_exc', 'd_c_calves_VS_exc', // Calves
            'd_c_growing_1', 'd_c_growing_1_BW_av', 'd_c_growing_1_MY', 'd_c_growing_1_N_exc', 'd_c_growing_1_VS_exc', // Growing < 2 years
            'd_c_growing_2', 'd_c_growing_2_BW_av', 'd_c_growing_2_MY', 'd_c_growing_2_N_exc', 'd_c_growing_2_VS_exc', // Growing > 2 years
            'm_c_mature', 'm_c_mature_BW_av', 'm_c_mature_MY', 'm_c_mature_N_exc', 'm_c_mature_VS_exc', // Mature cattle
            'm_c_calves', 'm_c_calves_BW_av', 'm_c_calves_MY', 'm_c_calves_N_exc', 'm_c_calves_VS_exc', // Calves
            'm_c_growing_1', 'm_c_growing_1_BW_av', 'm_c_growing_1_MY', 'm_c_growing_1_N_exc', 'm_c_growing_1_VS_exc', // Growing < 2 years
            'm_c_growing_2', 'm_c_growing_2_BW_av', 'm_c_growing_2_MY', 'm_c_growing_2_N_exc', 'm_c_growing_2_VS_exc', // Growing > 2 years
            's_mature', 's_mature_BW_av', 's_mature_MY', 's_mature_N_exc', 's_mature_VS_exc', // Mature cattle
            's_growing', 's_growing_BW_av', 's_growing_MY', 's_growing_N_exc', 's_growing_VS_exc', // Growing cattle
            'g_mature', 'g_mature_BW_av', 'g_mature_MY', 'g_mature_N_exc', 'g_mature_VS_exc', // Mature cattle
            'g_growing', 'g_growing_BW_av', 'g_growing_MY', 'g_growing_N_exc', 'g_growing_VS_exc', // Growing cattle
            'r_others', 'r_others_BW_av', 'r_others_MY', 'r_others_N_exc', 'r_others_VS_exc', // Horses
            'p_mature', 'p_mature_MY', 'p_mature_N_exc', 'p_mature_VS_exc', // Mature pigs
            'p_growing', 'p_growing_MY', 'p_growing_N_exc', 'p_growing_VS_exc', // Growing pigs
            'po_hen', 'po_hen_MY', 'po_hen_N_exc', 'po_hen_VS_exc', // Hens
            'po_broiler', 'po_broiler_MY', 'po_broiler_N_exc', 'po_broiler_VS_exc', // Broiler chicken
            'po_other', 'po_other_MY', 'po_other_N_exc', 'po_other_VS_exc', // Other poultry
            'methane_r', 'temp_av'
        ];
        const vDates = [];
        const vFiles = [
            'fileFeeds', 'fileManure'
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = getValueFromInputName(id));
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },

    G1LUC: function() {
        return (getJSONFromFormLUC_G1) ? (getJSONFromFormLUC_G1()).input : {
			forest2cropland: 0,
            forest2grassland: 0,
            grassland2cropland: 0,
            grassland2forest: 0,
            cropland2grassland: 0,
            cropland2forest: 0,
			infrastructures: {
                trees: [],
                shrubby: [],
                orchards: [],
                low: []
            },
			forests: []
		};
    },

    E2: function() {
        const vCombos = [
            'state','region', 'tf8_grouping', 'economic_size' // Farm
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        return datos;
    },

    E1: function() {
        const vCombos = [
            'state','region', 'tf8_grouping', 'economic_size' // Farm
        ];
        const vInputs = [
            'crop_name','area','yield','price','seeds','price_seeds','dose_irrigation','price_water', // Plot i
            'herb','fung','insect','otreat', 'price_herb','price_fung','price_insect','price_otreat', // Pesticides
            'MWC','HWC','OCS','LI','TWI', // Energy

        ];
        const vDates = []
        const vFiles = [];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    }
    


}
// =====================================
