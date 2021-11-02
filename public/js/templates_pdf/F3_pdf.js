window.informePDF = window.informePDF || {};
informePDF.F3 = informePDF.F3 || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
        // ====> Crop
        crop_type: 'Fruit trees, vines and shrubs', // Plant common name
        PK_strategy: 'Buildup & maintenance (maximum yield)', // PK strategy
        yield: 10000, // Yield (kg/ha)
        export_r: 100, // Export residues (%)
        HI_est: 10, // HI (%)
        CV: 20, // CV (%)
        Nc_h: 10, // N (%)
        Pc_h: 10, // P (%)
        Kc_h: 10, // K (%)
        // ====> Plot
        water_supply: 'Irrigated', // Water supply
        climatic_zone: 'climatic_zone', // Climatic zone
        type_irrigated: 'Sprinkler', // Type of irrigation
        dose_irrigation: '2500', // Irrigation dose (m3/ha)
        Nc_NO3_water: '24', // Nitrate concentration in water (ppm)
        rain_a: '800', // Annual rainfall (mm)
        rain_w: '480', // Autumn-winter rainfall (mm)
        // ====> Soil
        soil_texture: 'Silty clay loam', // Soil texture
        tilled: 'No', // Tilled
        pH: 7, // pH
        CEC: 220, // CEC (meq/kg)
        SOM: 1.5, // SOM (%)
        depth_s: 0.3, // Soil depth (m)
        Nc_s_initial: 30, // Soil N initial
        Nc_s_initial_unit: 'kg N/ha', // (Unidades de "Soil N initial")
        Nc_end: 20, // Soil N final
        Nc_end_unit: 'kg N/ha', // (Unidades de "Soil N final")
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
            [{ content: 'Crop', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]
        ],
        body: [
            [{ content: '', styles: { fillColor: [255, 255, 255], cellWidth: 70 } }, ''],
            ['Plant common name', vInput.crop_type ],
            ['PK strategy', vInput.PK_strategy ],
            ['Yield (kg/ha)', vInput.yield ],
            ['Export residues (%)', vInput.export_r ],
            ['HI (%)', vInput.HI_est ],
            ['CV (%)', vInput.CV ],
            ['N (%)', vInput.Nc_h ],
            ['P (%)', vInput.Pc_h ],
            ['K (%)', vInput.Kc_h ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 128],
                textColor: 255,
                fontStyle: 'bold'
            }
        }
    });

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla

    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Plot', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]
        ],
        body: [
            [{ content: '', styles: { fillColor: [255, 255, 255], cellWidth: 70 }}, ''],
            ['Water supply', vInput.water_supply ],
            ['Climatic zone', vInput.climatic_zone ],
            ['Type of irrigation', vInput.type_irrigated ],
            ['Irrigation dose (m3/ha)', vInput.dose_irrigation ],
            ['Nitrate concentration in water (ppm)', vInput.Nc_NO3_water ],
            ['Annual rainfall (mm)', vInput.rain_a ],
            ['Autumn-winter rainfall (mm)', vInput.rain_w ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 128],
                textColor: 255,
                fontStyle: 'bold'
            }
        }
    });

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Soil', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold' } }]
        ],
        body: [
            [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Soil texture', vInput.soil_texture, '', 'Tilled', vInput.tilled ],
            ['pH', vInput.pH, '', 'CEC (meq/kg)', vInput.CEC ],
            ['SOM (%)', vInput.SOM, '', 'Soil depth (m)', vInput.depth_s ],
            ['Soil N initial', vInput.Nc_s_initial + ' ' + vInput.Nc_s_initial_unit, '', 'Soil N final', vInput.Nc_end + ' ' + vInput.Nc_end_unit],
            ['Pc method', { content: vInput.Pc_method, colSpan: 4 }],
            ['P', vInput.Pc_s + ' ' + vInput.Pc_s_unit, '', 'K', vInput.Kc_s + ' ' + vInput.Kc_s_unit]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 128],
                textColor: 255,
                fontStyle: 'bold'
            },
            3: {
                fillColor: [41, 185, 128],
                textColor: 255,
                fontStyle: 'bold'
            }
        }
    })
    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<
    doc.addPage();
    finalY = 10; // se calcula donde empieza la siguiente tabla
    doc.text('Best fertilization', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#F3-tabla-1',
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 28],
                textColor: 255,
                fontStyle: 'bold'
            }
        },
        footStyles: {
            fillColor: [41, 185, 128],
            textColor: 255, 
            fontStyle: 'bold'
        }
    });

    // ---------------------

    finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('Nutrients balance', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#F3-tabla-2',
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 28],
                textColor: 255,
                fontStyle: 'bold'
            }
        },
        footStyles: {
            fillColor: [41, 185, 128],
            textColor: 255, 
            fontStyle: 'bold'
        }
    });

    // ---------------------

    finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        html: '#F3-tabla-3',
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [41, 185, 28],
                textColor: 255,
                fontStyle: 'bold'
            }
        },
        footStyles: {
            fillColor: [41, 185, 128],
            textColor: 255, 
            fontStyle: 'bold'
        }
    });

    // ================================================
    addHeaders(doc, 'F4');
    addFooters(doc);
    return doc
}