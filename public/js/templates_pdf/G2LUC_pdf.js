/* global jsPDF */
/* global addHeaders, addFooters */
//// // @ts-check

function getDataInfraestructures(v) {
    const data = [];
    const getHead = (tx) => {
        return [{ content: tx, colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255 } }];
    }
    const pushElem = (elm) => {
        if ((elm.width*1 && elm.length*1) || elm.surface*1) {
            data.push(['',elm.type, elm.width || '', elm.length || '', elm.surface || '']);
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
    return data;
}

const f_Age = {
    '>20y': '> 20 years',
    '<20y': '< 20 years'
}
const f_volume = {											
    '0': '0',
	'<20': '< 20',
    '21-40': '21 - 40',
    '41-100': '41 - 100',
    '21-50': '21 - 50',
    '51-100': '51 - 100',
    '101-200': '101 - 200',
    '>100': '> 100',
    '>200': '> 200'
}

function getDataForest(v) {
    const pushElem = (l) => {
        // if (elm.surface*1 && elm.soc*1 && elm.volume_t*1 ) {
        data.push([l.ecozone, f_Age[l.age], l.type, f_volume[l.volume_t], f_volume[l.volume_b], l.surface, l.wood, l.bark, l.lost, l.area]);
        //}
    }
    const data = [];
    v.forests.forEach(el => pushElem(el) );
    return data;
}

window.informePDF = window.informePDF || {};
window.informePDF.G2LUC = window.informePDF.G2LUC || function (v) {
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
                { type: 'Grove < 0.5 ha', width: 1, length: 1 },
                { type: 'Damaged hedgerow (L basis <1.5 m)', width: 2, length: 2 }
            ],
            shrubby: [
                { type: 'Shrubby hedgerow', width: 1, length: 1 },
                { type: 'Bank with shrub', width: 2, length: 2 }
            ],
            orchards: [
                { type: 'Vineyards', surface: 1 },
                { type: 'Orchards', surface: 2 }
            ],
            low: [
                { type: 'Grass strips', width: 1, length: 1 },
                { type: 'Young hedgerow (0-3 years)', width: 2, length: 2 }
            ]
        },
        forests: [
            {
                ecozone: 'Temperate continental', age: '>20y', type: 'coniferous', volume_t: '41-100', volume_b: '<20',
                surface: 1, wood: 2, bark: 2, lost: 2, area: 3 
            },
            {
                ecozone: 'Temperate continental', age: '>20y', type: 'coniferous', volume_t: '41-100', volume_b: '<20',
                surface: 2, wood: 3, bark: 3, lost: 3, area: 4
            }
        ]
    };

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
                { content: 'infrastructures', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } }
            ],
            [
                { content: '   ', styles: { fillColor: [255, 255, 255] } }, 
                'type', 'Width (m)',  'Length (m)', 'Surface (ha)'
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
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
                [{ content: 'Land use change', colSpan: 6, styles: {halign: 'center', fontStyle: 'bold', fontSize: 12 }}]
        ],
        body: [
            [ 
                'Grassland to cropland', v.grassland2cropland, 
                'Cropland to grassland', v.cropland2grassland, 
                'Forest to cropland', v.forest2cropland 
            ],
            [   
                'Grassland to forest', v.grassland2forest, 
                'Cropland to forest', v.cropland2forest, 
                'Forest to grassland', v.forest2grassland
            ],
        ],
        styles: {
            font: 'calibri',
            lineColor: [255, 255, 255],
            lineWidth: 0.1,
            cellPadding: 1
        },
        columnStyles: {
            0: { fillColor: [150, 222, 188], textColor: 55, fontStyle: 'bold' },
            2: { fillColor: [150, 222, 188], textColor: 55, fontStyle: 'bold' },
            4: { fillColor: [150, 222, 188], textColor: 55, fontStyle: 'bold' }
        }
    });

    finalY = doc.lastAutoTable.finalY; 

    doc.setFontSize(10);
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'forests', colSpan: 10, styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } }],
            ['Ecozone', 'Age', 'Type', 'Stock temperate (m³/y)', 'Stock boreal (m³/y)', 'Surface (ha)', 
            'Wood harvest over bark (m³/y)', 'Bark in wood (t/t)', 'Biomass lost (%)', 'Area of disturbances (ha/yr)']
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
        }
    });

    // finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
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
        html: '#G2LUC-tabla-1',
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

    addHeaders(doc, 'G2 - LUC');
    addFooters(doc);
    return doc
}