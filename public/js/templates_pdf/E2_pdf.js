window.informePDF = window.informePDF || {};
informePDF.E2 = informePDF.E2 || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf F4
         // ====> Plot i

        state: '(ES) Spain', // Member state
        region: '(555) Castilla-La Mancha', // Region
        tf8_grouping: '(3) Wine', // TF8 grouping
        economic_size: '(3) 25 000 - < 50 000 EUR', // Economic size


    }

    // -- Inputs --- <<<<<<
    doc.text('Inputs', 14, finalY + 15)
    
    doc.autoTable({
        startY: finalY + 20,
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


    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('EPA', 14, finalY + 15)
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#E2-tabla-1',
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
    addHeaders(doc, 'E2');
    addFooters(doc);
    return doc
}