/* global jsPDF */
/* global addHeaders, addFooters */
//// // @ts-check

window.informePDF = window.informePDF || {};
window.informePDF.G4Energy = window.informePDF.G4Energy || function (v) {
    const doc = new jsPDF();
    doc.setFont('calibri');
    let finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    v = v || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf
        electricity: [
            { type: 'Electricity EU average mix (≥110 kV)', amount: 2 },
            { type: 'Electricity EU average mix (10-20 kV)', amount: 4 }
        ],
        energy: [
            { type: 'Fuel oil', amount: 2 },
            { type: 'Hard coal', amount: 2 }
        ],
        biomass: [
            { type: 'Wood pellets forestry residues', amount: 1 },
            { type: 'Woodchips forestry residues', amount: 2 }
        ],
        fuels: [
            { type: 'Sunflower biodiesel', amount: 1 },
            { type: 'Fuel oil', amount: 1 }
        ]
    }

    const getData = (els) => {
        const pushElem = (elm) => {
            if (elm.amount*1) {
                data.push([elm.type, elm.amount]);
            }
        }
        const data = [];
        els.forEach(el => pushElem(el) );
        return data;
    }

    // -- Inputs --- <<<<<<
    doc.setFontSize(14);
    doc.text('Inputs', 14, finalY + 20);

    doc.setFontSize(10);
    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [ { content: 'Electricity', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } } ],
            [ 'type', 'Amount (kWh / year)' ]
        ],
        body: getData(v.electricity),
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2},
        },
        bodyStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: {
                fillColor: [255, 255, 255], // [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        },
        margin: { right: 107 }
    });

    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [ { content: 'Energy', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } } ],
            [ 'type', 'Amount (kWh / year)' ]
        ],
        body: getData(v.energy),
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2},
        },
        bodyStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: {
                fillColor: [255, 255, 255], // [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        },
        margin: { left: 107 }
    });

    finalY = doc.lastAutoTable.finalY; 
    
    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [ { content: 'Biomass', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } } ],
            [ 'type', 'Amount (kWh / year)' ]
        ],
        body: getData(v.biomass),
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2},
        },
        bodyStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: {
                fillColor: [255, 255, 255], // [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        },
        margin: { right: 107 }
    });

    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [ { content: 'Fuels', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } } ],
            [ 'type', 'Amount (kWh / year)' ]
        ],
        body: getData(v.fuels),
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2},
        },
        bodyStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: {
                fillColor: [255, 255, 255], // [150, 222, 188],
                textColor: 55,
                fontStyle: 'bold'
            }
        },
        margin: { left: 107 }
    });

    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<
    
    // doc.addPage();
    // finalY = 10; // se calcula donde empieza la siguiente tabla
    finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text('GHG Emissions', 14, finalY + 15);
    doc.setFontSize(12);
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#G4Energy-tabla-1',
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

    addHeaders(doc, 'G4 - Energy');
    addFooters(doc);
    return doc
}