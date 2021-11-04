window.informePDF = window.informePDF || {};
informePDF.G4Crops = informePDF.G4Crops || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
         // ====> Plot i
        crop_name: "Barlery 6 row", // Crop
        area: 10, // Area (ha)
        yield: 8000, // Yield (kg/ha)
        export_r: 100, // Export residues (%)
        SOM: 1.5, // SOM (%)
        tilled: "yes", // Tilled
        drain_rate: "", // Drain Rate
        rewetted: "Yes", // Rewetted
        combustible: "Fuel oil", // Combustible
        consumption: 1, // Consumption (l/ha)
        residues: "Incorporated", // Residues
        spread: "Yes", // Organic matter spread 
        removed: "No", // Cover crops removed

        seeds: 10, // Seeds Amount (kg/ha)
        herb: 1, // Herbicides (kg/ha)
        fung: 2, // Fungicides (kg/ha)
        insect: 3, // Insecticides (kg/ha)
        otreat: 4, // Other treatments (kg/ha)

        leaching: 29.04,  // Leaching (kg/ha)
        volatilization: 8.20, // Volatilization (kg/ha)

        climate: "Warm Temperate Dry", // Climate
        temp_reg: "Temperate Boreal",  // Temperature regime
        moist_reg: "Dry", // Moisture regime
        soil: "Arenosol", // Soil

    }

    // -- Inputs --- <<<<<<
    doc.text('Inputs', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        theme: 'grid',
        head: [
            [{ content: 'Plot i', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Crop', vInput.crop_name, '', 'Area (ha)', vInput.area],
            ['Yield (kg/ha)', vInput.yield, '', 'Export residues (%)', vInput.export_r],
            ['SOM (%)', vInput.SOM, '', 'Tilled', vInput.tilled],
            ['Drain Rate', vInput.drain_rate, '', 'Rewetted', vInput.rewetted],
            ['Combustible', vInput.combustible, '', 'Consumption (l/ha)', vInput.consumption],
            ['Residues', vInput.residues, '', 'Organic matter spread', vInput.spread],
            ['Cover crops removed', vInput.removed, '', 'Seeds - Amount (kg/ha)', vInput.seeds],
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            },
            3: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    });

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Pesticides', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Herbicides (kg/ha)', vInput.herb, '', 'Fungicides (kg/ha)', vInput.fung  ],
            ['Insecticides (kg/ha)', vInput.insect, '', 'Other treatments (kg/ha)', vInput.otreat ]
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            },
            3: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    })

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Nitrogen', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Leaching (kg/ha)', vInput.leaching, '', 'Volatilization (kg/ha)', vInput.volatilization  ] 
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            },
            3: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    })

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Farm', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Climate', vInput.climate, '', 'Temperature regime', vInput.temp_reg  ],
            ['Moisture regime', vInput.moist_reg, '', 'Soil', vInput.soil  ]  
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            },
            3: {
                fillColor: [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        }
    })
    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('GHG', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#G4-crops-tabla-1',
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: {
                fillColor: [176,196,222],
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


    // ================================================
    addHeaders(doc, 'G4 Crops');
    addFooters(doc);
    return doc
}