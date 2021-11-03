window.informePDF = window.informePDF || {};
informePDF.F2 = informePDF.F2 || function (vInput, nInforme) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
        // ====> Crop
        crop_type: 'Fruit trees, vines and shrubs', // Plant common name
        PK_strategy: 'Buildup & maintenance (maximum yield)', // PK strategy
        crop_startDate: '2015-01-11', // Seeding
        crop_endDate: '2015-06-11', // End of cultivation
        yield: 10000, // Yield (kg/ha)
        Nc_h: 10, // N (%)
        Pc_h: 10, // P (%)
        Kc_h: 10, // K (%)
        export_r: 100, // Export residues (%)
        HI_est: 10, // HI (%)
        CV: 20, // CV (%)
        // ====> Plot
        water_supply: 'Irrigated', // Water supply
        climatic_zone: 'climatic_zone', // Climatic zone
        type_irrigated: 'Sprinkler', // Type of irrigation
        dose_irrigation: '2500', // Irrigation dose (m3/ha)
        waterNitrate: 15, // NO3 contained (ppm)
        fileClima: 'Clima.csv', // Climatic data // (name="Clima")
        fileMeteo: 'Meteo.csv', // Meteo data // (name="Meteo")
        fileRiegos: 'Riego.csv', // Irrigation data // (name="Riegos")
        fileFenoBBCH: 'BBCH.csv', // Phenological data // (name="FenoBBCH")
        // ====> Soil
        soil_texture: 'Silty clay loam', // Soil texture
        depth_s: 0.3, // Soil depth (m)
        pH: 7, // pH
        stony: 0.15, // Stony (ratio)
        CEC: 220, // CEC (meq/kg)
        SOM: 1.5, // SOM (%)
        NO3: 2, // Nitric N NO3- (ppm)
        NH4: 3, // Ammoniacal N NH4+ (ppm)
        N_NH4: 1.5, // Δ(N - NH4)
        Nc_s_initial: 30, // Soil N initial
        Nc_s_initial_unit: 'kg N/ha', // (Unidades de "Soil N initial")
        Pc_method: 'Ammonium acetate + EDTA', // Pc method
        Pc_s: 10, // P
        Pc_s_unit: 'ppm', // (Unidades de "Pc_s")
        Kc_s: 10, // K
        Kc_s_unit: 'ppm', // (Unidades de "Kc_s")
    }

    // -- Inputs --- <<<<<<
    doc.text('Inputs', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        theme: 'grid',
        head: [
            [{ content: 'Crop', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', styles: { fillColor: [255, 255, 255], cellWidth: 70 } }, ''],
            ['Plant common name', vInput.crop_type ],
            ['PK strategy', vInput.PK_strategy ],
            ['Seeding', vInput.crop_startDate ],
            ['End of cultivation', vInput.crop_endDate],
            ['Yield (kg/ha)', vInput.yield ],
            ['N (%)', vInput.Nc_h ],
            ['P (%)', vInput.Pc_h ],
            ['K (%)', vInput.Kc_h ],
            ['Export residues (%)', vInput.export_r ],
            ['HI (%)', vInput.HI_est ],
            ['CV (%)', vInput.CV ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    });


    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Plot', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', styles: { fillColor: [255, 255, 255], cellWidth: 70 }}, ''],
            ['Water supply', vInput.water_supply ],
            ['Climatic zone', vInput.climatic_zone ],
            ['Type of irrigation', vInput.type_irrigated ],
            ['Irrigation dose (m3/ha)', vInput.dose_irrigation ],
            ['NO3 contained (ppm)', vInput.waterNitrate],
            ['Climatic data', vInput.fileClima ],
            ['Meteo data', vInput.fileMeteo ],
            ['Irrigation data', vInput.fileRiegos ],
            ['Phenological data', vInput.fileFenoBBCH ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    });


    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Soil', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', styles: { fillColor: [255, 255, 255], cellWidth: 70 }}, ''],
            ['Soil texture', vInput.soil_texture ],
            ['Soil depth (m)', vInput.depth_s ],
            ['pH', vInput.pH ],
            ['Stony (ratio)', vInput.stony ],
            ['CEC (meq/kg)', vInput.CEC ],
            ['SOM (%)', vInput.SOM ],
            ['Nitric N NO3- (ppm)', vInput.NO3 ],
            ['Ammoniacal N NH4+ (ppm)', vInput.NH4 ],
            ['Δ(N - NH4)', vInput.N_NH4 ],
            ['Soil N initial', vInput.Nc_s_initial + ' ' + vInput.Nc_s_initial_unit ],
            ['Pc method', vInput.Pc_method ],
            ['P', vInput.Pc_s + ' ' + vInput.Pc_s_unit ],
            ['K', vInput.Kc_s + ' ' + vInput.Kc_s_unit ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    })
    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<
    doc.addPage(null, 'landscape');
    doc.setFontSize(10);
    finalY = 10; // se calcula donde empieza la siguiente tabla
    if (nInforme == 1) {
        doc.text('Water Balance', 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            //useCss: true,
            html: '#F2-tabla-1',
            styles: {
                font: 'calibri',
                lineColor: [255, 255, 255],
                lineWidth: 0.1,
                cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
            }
        });
    }
    // ---------------------

    if (nInforme == 2) {
        doc.text('Nitrogen balance', 14, finalY + 15);
        doc.autoTable({
            startY: finalY + 20,
            //useCss: true,
            html: '#F2-tabla-2',
            styles: {
                font: 'calibri',
                lineColor: [255, 255, 255],
                lineWidth: 0.1,
                cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
            }
        });
    }
    // ---------------------

    if (nInforme == 3) {
        doc.text('Fertilization Calendar', 14, finalY + 15)
        doc.autoTable({
            startY: finalY + 20,
            html: '#F2-tabla-3',
            styles: {
                font: 'calibri',
                lineColor: [255, 255, 255],
                lineWidth: 0.1,
                cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2}
            }
        });
    }
    
    // ================================================
    const texto = ['Water Balance', 'Nitrogen balance', 'Fertilization Calendar'];
    addHeaders(doc, 'F2 - ' + texto[nInforme-1] );
    addFooters(doc);
    return doc
}