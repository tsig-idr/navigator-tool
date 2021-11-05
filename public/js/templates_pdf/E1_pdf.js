window.informePDF = window.informePDF || {};
informePDF.E1 = informePDF.E1 || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
         // ====> Plot i
        crop_name: "Barlery 6 row", // Crop
        area: 10, // Area (ha)
        yield: 8000, // Yield (kg/ha)
        price: 1, // Sell price (€/kg)

        seeds: 10, // Seeds Amount (kg/ha)

        price_seeds: 0.8, // Seeds price (€/kg)
        dose_irrigation: 2500, // Irrigation dose (m3/ha)
        price_water: 0.18, // Water price (€/m3)

        herb: 1, // Herbicides (kg/ha)
        fung: 2, // Fungicides (kg/ha)
        insect: 3, // Insecticides (kg/ha)
        otreat: 4, // Other treatments (kg/ha)

        price_herb: 0, // Herbicides price (€/kg)
        price_fung: 0, // Fungicides price (€/kg)
        price_insect: 0, // Insecticides price (€/kg)
        price_otreat: 0, // Other treatments price (€/kg)

        state: '(ES) Spain', // Member state
        region: '(555) Castilla-La Mancha', // Region
        tf8_grouping: '(3) Wine', // TF8 grouping
        economic_size: '(3) 25 000 - < 50 000 EUR', // Economic size

        MWC: 0, // Machinery work cost (€)
        HWC: 0, // Human work cost (€)
        OCS: 0, // Other generic costs (€)
        LI: 0, // Livestock income (€)
        TWI: 0, // Timber wood income (€)


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
            //[{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Crop', vInput.crop_name, '', 'Area (ha)', vInput.area],
            ['Yield (kg/ha)', vInput.yield, '', 'Sell price (€/kg)', vInput.price],
            ['Seeds amount (kg/ha)', vInput.seeds, '', 'Seeds price (€/kg)', vInput.price_seeds],
            ['Irrigation dose (m3/ha)', vInput.drain_rate, '', 'Water price (€/m3)', vInput.rewetted]
          
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
           // [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Herbicides (kg/ha)', vInput.herb, '', 'Herbicides price (€/kg)', vInput.price_herb ],
            ['Fungicides (kg/ha)', vInput.fung, '', 'Fungicides price (€/kg)', vInput.price_fung ],
            ['Insecticides (kg/ha)', vInput.insect, '', 'Insecticides price (€/kg)', vInput.price_insect  ],
            ['Other treatments (kg/ha)', vInput.otreat, '', 'Other treatments price (€/kg)', vInput.price_otreat ]
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
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Farm', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Member state', vInput.state ],
            ['Region', vInput.region ],
            ['TF8 grouping', vInput.tf8_grouping ],
            ['Economic size', vInput.economic_size ]
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
            }
           
        },
        margin: { right: 107 }
    })

    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Farm Energy', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Machinery work cost (€)', vInput.MWC ],
            ['Human work cost (€)', vInput.HWC ],
            ['Other generic costs (€)', vInput.OCS ],
            ['Livestock income (€)', vInput.LI ]
            ['Timber wood income (€)', vInput.TWI ]
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
            }
        },
        margin: { left: 107 }
    })

    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('EPA', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#E1-tabla-1',
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
    addHeaders(doc, 'E1');
    addFooters(doc);
    return doc
}