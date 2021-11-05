/* global jsPDF */
/* global addHeaders, addFooters */
//// // @ts-check
window.informePDF = window.informePDF || {};
window.informePDF.G2Livestock = window.informePDF.G2Livestock || function (v) {
    const doc = new jsPDF();
    doc.setFont('calibri');
    let finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    // ================================================

    v = v || { // Esta variable debe ser definida en Fast como entrada para la generación del pdf
        // =====> Dariy cattle ======
        // Cows 4000 kg milk
        d_c_4000: 1, // Average number
        d_c_4000_milk: 11000, // Milk per year (kg/yr)
        d_c_4000_lact_d: 305, // Lactating days
        d_c_4000_BW_av: 610, // Average body weight (kg)
        // Cows 6000 kg milk
        d_c_6000: 1,
        d_c_6000_BW_av: 650,
        d_c_6000_lact_d: 305,
        d_c_6000_milk: 6000,
        // Cows 8000 kg milk
        d_c_8000: 1,
        d_c_8000_BW_av: 700,
        d_c_8000_lact_d: 305,
        d_c_8000_milk: 8000,
        // Cows 10000 kg milk
        d_c_10000: 1,
        d_c_10000_BW_av: 750,
        d_c_10000_lact_d: 305,
        d_c_10000_milk: 10000,
        // Mature cattle
        d_c_mature: 1,
        d_c_mature_BW_av: 50,
        // Calves
        d_c_calves: 1,
        d_c_calves_BW_av: 250,
        // Growing < 2 years
        d_c_growing_1: 1,
        d_c_growing_1_BW_av: 550,
        // Growing > 2 years
        d_c_growing_2: 1,
        d_c_growing_2_BW_av: 775,
        // =====> Meat cattle =====
        // Mature cattle
        m_c_mature: 1,
        m_c_mature_BW_av: 775,
        // Calves
        m_c_calves: 1,
        m_c_calves_BW_av: 50,
        // Growing < 2 years
        m_c_growing_1: 1,
        m_c_growing_1_BW_av: 250,
        // Growing > 2 years
        m_c_growing_2: 1,
        m_c_growing_2_BW_av: 550,
        // =====> Sheep =====
        // Mature cattle
        s_mature: 1,
        s_mature_BW_av: 65,
        // Growing cattle
        s_growing: 1,
        s_growing_BW_av: 35,
        // =====> Goats =====
        // Mature cattle
        g_mature: 1,
        g_mature_BW_av: 70,
        // Growing cattle
        g_growing: 1,
        g_growing_BW_av: 35,
        // =====> Other ruminants =====
        // Horses
        r_others: 1,
        r_others_BW_av: 500,
        // =====> Pigs =====
        // Mature pigs
        p_mature: 1,
        // Growing pigs
        p_growing: 1,
        // =====> Poultry =====
        // Hens
        po_hen: 1,
        // Broiler chicken
        po_broiler: 1,
        // Other poultry
        po_other: 1,
        // =====> 
        fileFeeds: 'feeds.csv', // Feed data
        fileManure: 'manure.csv', // Manure data
        temp_av: 15 // Average Temperature (°C)
    }

    // -- Inputs --- <<<<<<
    doc.setFontSize(14);
    doc.text('Inputs', 14, finalY + 15);
    doc.setFontSize(10);
    doc.autoTable({
        startY: finalY + 20,
        theme: 'grid',
        head: [
            [
                { content: '', styles: { fillColor: [255, 255, 255] } },
                'Average number',
                'Milk per year (kg/yr)',
                'Lactating days',
                'Average body weight (kg)'
            ]
        ],
        body: [
            [{ content: 'Dariy cattle', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255 } }],
            ['Cows 4000 kg milk', v.d_c_4000, v.d_c_4000_milk, v.d_c_4000_lact_d, v.d_c_4000_BW_av],
            ['Cows 6000 kg milk', v.d_c_6000, v.d_c_6000_milk, v.d_c_6000_lact_d, v.d_c_6000_BW_av],
            ['Cows 8000 kg milk', v.d_c_8000, v.d_c_8000_milk, v.d_c_8000_lact_d, v.d_c_8000_BW_av],
            ['Cows 10000 kg milk', v.d_c_10000, v.d_c_10000_milk, v.d_c_10000_lact_d, v.d_c_10000_BW_av],
            ['Mature cattle', v.d_c_mature, '', '', v.d_c_mature_BW_av],
            ['Calves', v.d_c_calves, '', '', v.d_c_calves_BW_av],
            ['Growing < 2 years', v.d_c_growing_1, '', '', v.d_c_growing_1_BW_av],
            ['Growing > 2 years', v.d_c_growing_2, '', '', v.d_c_growing_2_BW_av],
            [{ content: 'Meat cattle', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.m_c_mature, '', '', v.m_c_mature_BW_av],
            ['Calves', v.m_c_calves, '', '', v.m_c_calves_BW_av],
            ['Growing < 2 years', v.m_c_growing_1, '', '', v.m_c_growing_1_BW_av],
            ['Growing > 2 years', v.m_c_growing_2, '', '', v.m_c_growing_2_BW_av],
            [{ content: 'Sheep', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.s_mature, '', '', v.s_mature_BW_av],
            ['Growing cattle', v.s_growing, '', '', v.s_growing_BW_av],
            [{ content: 'Goats', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.g_mature, '', '', v.g_mature_BW_av],
            ['Growing cattle', v.g_growing, '', '', v.g_growing_BW_av],
            [{ content: 'Other ruminants', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Horses', v.r_others, '', '', v.r_others_BW_av],
            [{ content: 'Pigs', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature pigs', v.p_mature, '', '', ''],
            ['Growing pigs', v.p_growing, '', '', ''],
            [{ content: 'Poultry', colSpan: 5, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Hens', v.po_hen, '', '', ''],
            ['Broiler chicken', v.po_broiler, '', '', ''],
            ['Other poultry', v.po_other, '', '', ''],
        ],
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
        body: [
            ['Feed data', v.fileFeeds],
            ['Manure data', v.fileManure],
            ['Average Temperature (°C)', v.temp_av]
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
        margin: { right: 100 }
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
        html: '#G2Livestock-tabla-1',
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

    addHeaders(doc, 'G2 - Livestock');
    addFooters(doc);
    return doc
}