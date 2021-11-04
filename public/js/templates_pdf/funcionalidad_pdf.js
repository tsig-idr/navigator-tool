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
        const vDates = [
            
        ]
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
        const vDates = [
            
        ]
        const vFiles = [
            
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
        const vDates = [
            
        ]
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
        const vDates = [
            
        ]
        const vFiles = [
            
        ];
        const datos = {};
        vCombos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        vInputs.forEach(id => datos[id] = document.getElementById(id).value);
        vDates.forEach(id => datos[id] = getTextDateFromInputDate(id));
        vFiles.forEach(id => datos[id] = getNameFileFromInputFile(id));
        return datos;
    },


}
// =====================================
