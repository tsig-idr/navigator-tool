window.informePDF = window.informePDF || {};
informePDF.F4 = informePDF.F4 || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
        // Crop
        crop_type: 'Fruit trees, vines and shrubs',
        yield: 10000,
        // Plot
        water_supply: 'Irrigated',
        climatic_zone: 'climatic_zone'
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
            [{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Plant common name', vInput.crop_type ],
            ['Yield (kg/ha)', vInput.yield ]
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
        },
        margin: { right: 107 }
    });

    doc.autoTable({
        startY: finalY + 20,
        theme: 'grid',
        head: [
            [{ content: 'Plot', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }]
        ],
        body: [
            [{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Water supply', vInput.water_supply ],
            ['Climatic zone', vInput.climatic_zone ]
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
        },
        margin: { left: 107 }
    })
    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('Best fertilization', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#F4-tabla-1',
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

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('Nutrients balance', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#F4-tabla-2',
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
        html: '#F4-tabla-3',
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

// ====================================================

