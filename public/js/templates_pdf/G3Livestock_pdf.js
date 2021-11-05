window.informePDF = window.informePDF || {};
informePDF.G3Livestock = informePDF.G3Livestock || function (vInput) {
    var doc = new jsPDF();
    doc.setFont("calibri");
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    vInput = vInput || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf 
        // ====> Number of animals > Dairy cattle
        d_c_4000: 1, // Cows 4000 kg milk
        d_c_6000: 2, // Cows 6000 kg milk
        d_c_8000: 3, // Cows 8000 kg milk
        d_c_10000: 4, // Cows 10000 kg milk
        d_c_calves: 5, //Calves
        d_c_growing_1: 6, // Growing < 2 years
        d_c_growing_2: 7, // Growing > 2 years
        d_c_mature: 8, // Mature cattle
        // ====> Number of animals > Meat cattle
        m_c_calves: 11, // Calves
        m_c_mature: 12, // Mature cattle
        m_c_growing_1: 13, //  Growing < 2 years
        m_c_growing_2: 14, // Growing > 2 years
        // ====> Number of animals > Goats (milk and meat)
        g_growing: 9, // Growing
        g_mature: 10, // Mature
        // ====> Type of diet for animals > Dairy cattle
        d_c_calves_diet: "High grain diet", // Calves
        d_c_growing_1_diet: "High grain diet", // Growing cattle < 2 years
        d_c_growing_2_diet: "High grain diet", // Growing cattle > 2 years
        d_c_mature_diet: "High grain diet", // Mature cattle
        
        // =====> Type of diet for animals > Meat cattle
        m_c_calves_diet: "High grain diet", // Calves
        m_c_growing_1_diet: "High grain diet", // Growing cattle < 2 years
        m_c_growing_2_diet: "High grain diet", // Growing cattle > 2 years
        // =====> Number of animals > Pigs
        p_growing: 15, // Growing pigs
        p_mature: 16, //Mature pigs
         // =====> Number of animals > Poultry
        po_broiler: 17, // Broiler chicken
        po_hen: 18, // Hens
        po_other: 19, // Other poultry
        // =====> Number of animals >  Other rumiants
        r_others: 20, // Horses
        // =====> Number of animals > Sheep (milk and meat)
        s_growing: 21, // Growing
        s_mature: 22, // Mature
        // =====> Manure data 
        temp_av: 15,  // Average Temperature (°C)
        fileFeeds: "Feeds.csv",
        fileManure: "Manure.csv"

    }

    // -- Inputs --- <<<<<<
    doc.text('Inputs', 14, finalY + 15)
    doc.text('Type of diet for animals:', 14, finalY + 23)
    doc.setLineWidth(0.1);
    doc.setDrawColor(180, 180, 180);
    doc.line(14, finalY + 24, doc.internal.pageSize.width -14, finalY +24);
    doc.autoTable({
        startY: finalY + 25,
        theme: 'grid',
        head: [
            [{ content: 'Dairy cattle', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
           // [{ content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } }],
            ['Cows 4000 kg milk', vInput.d_c_4000, '', 'Mature cattle', vInput.d_c_mature ],
            ['Cows 6000 kg milk', vInput.d_c_6000, '', 'Calves', vInput.m_c_calves ],
            ['Cows 8000 kg milk', vInput.d_c_8000, '', 'Growing < 2 years', vInput.d_c_growing_1 ],
            ['Cows 10000 kg milk', vInput.d_c_10000, '', 'Growing > 2 years', vInput.d_c_growing_2  ]

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
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Meat cattle', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Mature cattle', vInput.m_c_mature ],
            ['Calves', vInput.m_c_calves ],
            ['Growing < 2 years', vInput.m_c_growing_1 ],
            ['Growing > 2 years', vInput.m_c_growing_2 ]
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
            [{ content: 'Poultry', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Hens', vInput.po_hen ],
            ['Broiler chicken', vInput.po_broiler ],
            ['Other poultry', vInput.po_other ]
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

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 10,
        theme: 'grid',
        head: [
            [{ content: 'Sheep (milk and meat)', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Mature', vInput.s_mature ],
            ['Growing', vInput.s_growing] 
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
            [{ content: 'Goats (milk and meat)', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Mature', vInput.g_mature  ],
            ['Growing', vInput.g_growing ]
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
           
        },
        margin: { left: 107 }
    })

    finalY = doc.lastAutoTable.finalY; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Pigs', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Mature pigs', vInput.p_mature ],
            ['Growing pigs', vInput.p_growing ]
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
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Other rumiants', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
           // [{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Horses', vInput.r_others ]
           
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
    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.text('Type of diet for animals:', 14, finalY + 15)
    doc.setLineWidth(0.1);
    doc.setDrawColor(180, 180, 180);
    doc.line(14, finalY + 16, doc.internal.pageSize.width -14, finalY +16);
    var finalY = doc.lastAutoTable.finalY + 15 || 10; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Dairy cattle', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
           // [{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Calves', vInput.d_c_calves_diet ],
            ['Growing cattle < 2 years', vInput.d_c_growing_1_diet ],
            ['Growing cattle > 2 years', vInput.d_c_growing_2_diet ],
            ['Mature cattle', vInput.d_c_mature_diet ]
           
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

    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Meat cattle', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
           // [{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Calves', vInput.m_c_calves_diet ],
            ['Growing cattle < 2 years', vInput.m_c_growing_1_diet ],
            ['Growing cattle > 2 years', vInput.m_c_growing_2_diet ]
           
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

    var finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.setLineWidth(0.1);
    doc.setDrawColor(180, 180, 180);
    doc.line(14, finalY + 8, doc.internal.pageSize.width -14, finalY +8 );
    
    var finalY = doc.lastAutoTable.finalY + 8 || 10; 
    doc.autoTable({
        startY: finalY + 5,
        theme: 'grid',
        head: [
            [{ content: 'Other data', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [41, 185, 128] } }]
        ],
        body: [
            //[{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }],
            ['Feed data', vInput.fileFeeds ],
            ['Manure data', vInput.fileManure ],
            ['Average Temperature (°C)', vInput.temp_av ]
           
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
    doc.addPage();
    finalY = 10; // se calcula donde empieza la siguiente tabla
    doc.text('GHG Emissions', 14, finalY + 15);
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#G3-livestock-tabla-1',
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

    

    // ================================================
    addHeaders(doc, 'G3 livestock');
    addFooters(doc);
    return doc
}