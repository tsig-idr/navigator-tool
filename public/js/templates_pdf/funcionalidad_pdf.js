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

function generarPDF(id, data, shouldDownload) {
    var doc = window.informePDF[id](data);
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


function getPDF(id, shouldDownload) {
    if (!(window.informePDF && window.informePDF[id])) {
        loadScript('js/templates_pdf/' + id + '_pdf.js', () => {
            generarPDF(id, dataPDF[id](), shouldDownload);
        });
    } else {
        generarPDF(id, dataPDF[id](), shouldDownload);
    } 
}

// === DATOS ===========================
const dataPDF = {
    F4: function() {
        const combos = ['crop_type', 'water_supply', 'climatic_zone'];
        const inputs = ['yield'];
        const datos = {};
        combos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        inputs.forEach(id => datos[id] = document.getElementById(id).value);
        return datos;
    },
    F3: function() {
        const combos = [
            'crop_type', 'PK_strategy', // crop
            'water_supply', 'climatic_zone', 'type_irrigated', // Plot
            'soil_texture', 'tilled', 'Nc_s_initial_unit', 'Nc_end_unit', 'Pc_method', 'Pc_s_unit', 'Kc_s_unit' // Soil
        ];
        const inputs = [
            'yield', 'export_r', 'HI_est', 'CV', 'Nc_h', 'Pc_h', 'Kc_h', // crop
            'dose_irrigation', 'Nc_NO3_water', 'rain_a', 'rain_w', // Plot
            'pH', 'CEC', 'SOM', 'depth_s', 'Nc_s_initial', 'Nc_end', 'Pc_s', 'Kc_s' // Soil
        ];
        const datos = {};
        combos.forEach(id => datos[id] = getTextSelectedFromCombo(id));
        inputs.forEach(id => datos[id] = document.getElementById(id).value);
        return datos;
    }
}
// =====================================
