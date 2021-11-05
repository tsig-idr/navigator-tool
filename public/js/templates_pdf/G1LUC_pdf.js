/* global jsPDF */
/* global addHeaders, addFooters */
//// // @ts-check

function getDataInfraestructures(v) {
    const data = [];
    const getHead = (tx) => {
        return [{ content: tx, colSpan: 7, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255 } }];
    }
    const pushElem = (elm) => {
        if (((elm.width*1 && elm.length*1) || elm.surface*1) && elm.soc*1 && elm.increase*1) {
            data.push(['',elm.type, elm.width || '', elm.length || '', elm.surface || '', elm.soc || '', elm.increase || '']);
        }
    }
    
    data.push(getHead('trees'));
    v.infrastructures.trees.forEach(el => pushElem(el) );
    data.push(getHead('shrubby'));
    v.infrastructures.shrubby.forEach(el => pushElem(el) ); 
    data.push(getHead('orchards'));
    v.infrastructures.orchards.forEach(el => pushElem(el) ); 
    data.push(getHead('low'));
    v.infrastructures.low.forEach(el => pushElem(el) );
    console.log(data);
    return data;
}

function getDataForest(v) {
    const pushElem = (elm) => {
        if (elm.surface*1 && elm.soc*1 && elm.volume_t*1 ) {
            data.push([elm.surface, elm.soc, elm.volume_t]);
        }
    }
    const data = [];
    v.forests.forEach(el => pushElem(el) );
    return data;
}

window.informePDF = window.informePDF || {};
window.informePDF.G1LUC = window.informePDF.G1LUC || function (v) {
    const doc = new jsPDF();
    doc.setFont('calibri');
    let finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    v = v || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf
            forest2cropland: 2, // Forest to cropland
            forest2grassland: 2, // Forest to grassland
            grassland2cropland: 1, // Grassland to cropland
            grassland2forest: 1, // Grassland to forest
            cropland2grassland: 1, // Cropland to grassland
            cropland2forest: 1, // Cropland to forest
            infrastructures: {
                trees: [
                    { type: 'Grove < 0.5 ha', width: 1, length: 1, soc: 1, increase: 1 },
                    { type: 'Damaged hedgerow (L basis <1.5 m)', width: 2, length: 2, soc: 2, increase: 2 }
                ],
                shrubby: [
                    { type: 'Shrubby hedgerow', width: 3, length: 3, soc: 3, increase: 3 },
                    { type: 'Shrubby hedgerow', width: 4, length: 2, soc: 4, increase: 4 }
                ],
                orchards: [
                    { type: 'Orchards', surface: 5, soc: 5, increase: 5 },
                    { type: 'Vineyards', surface: 6, soc: 6, increase: 6 }
                ],
                low: [
                    { type: 'Young hedgerow (4-7 years)', width: 7, length: 7, soc: 7, increase: 7 },
                    { type: 'Grass strips', width: 8, length: 8, soc: 8, increase: 8 }
                ]
            },
            forests: [
                { surface: 2, soc: 2, volume_t: 2 },
                { surface: 4, soc: 4, volume_t: 4 }
            ]
    }

    // -- Inputs --- <<<<<<
    doc.setFontSize(14);
    doc.text('Inputs', 14, finalY + 20);

    doc.setFontSize(10);
    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [
                { content: '   ', styles: { fillColor: [255, 255, 255] } },
                { content: 'infrastructures', colSpan: 6, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } }
            ],
            [
                { content: '   ', styles: { fillColor: [255, 255, 255] } }, 
                'type', 'Width (m)',  'Length (m)', 'Surface (ha)', 'SOC (tC/ha)', 'Annual inc. (tC/ha)'
            ]
        ],
        body: getDataInfraestructures(v),
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
        }
    });

    finalY = doc.lastAutoTable.finalY; 
    
    doc.setFontSize(10);
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'forests', colSpan: 3, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } }],
            ['Surface (ha)', 'SOC (tC/ha)', 'Stock inc. (m³/ha year)']
        ],
        body: getDataForest(v),
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: {top: 0.5, right: 2, bottom: 0.5, left: 2},
        },
        bodyStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { left: 107 }
    });

    // finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        body: [
            ['Forest to cropland', v.forest2cropland],
            ['Grassland to cropland', v.grassland2cropland],
            ['Grassland to forest', v.grassland2forest],
            ['Cropland to grassland', v.cropland2grassland],
            ['Cropland to forest', v.cropland2forest]
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
                fontStyle: 'bold',
                cellWidth: 50
            }
        },
        margin: { right: 107 }
    })
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
        html: '#G1LUC-tabla-1',
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

    addHeaders(doc, 'G1 - LUC');
    addFooters(doc);
    return doc
}