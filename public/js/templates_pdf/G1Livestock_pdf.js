/* global jsPDF */
/* global addHeaders, addFooters */
//// // @ts-check
window.informePDF = window.informePDF || {};
window.informePDF.G1Livestock = window.informePDF.G1Livestock || function (v) {
    const doc = new jsPDF('landscape');
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
        d_c_4000_N_exc: 0, // N excretion (kg N/yr)
        d_c_4000_VS_exc: 3.82352, // VS excretion (kg VS/ ay)
        d_c_4000_MY: 0, // MY (kg CH4/kg DMI)
        // Cows 6000 kg milk
        d_c_6000: 1,
        d_c_6000_BW_av: 650,
        d_c_6000_MY: 0,
        d_c_6000_N_exc: 113,
        d_c_6000_VS_exc: 0,
        d_c_6000_lact_d: 305,
        d_c_6000_milk: 6000,
        // Cows 8000 kg milk
        d_c_8000: 1,
        d_c_8000_BW_av: 700,
        d_c_8000_MY: 0,
        d_c_8000_N_exc: 113,
        d_c_8000_VS_exc: 0,
        d_c_8000_lact_d: 305,
        d_c_8000_milk: 8000,
        // Cows 10000 kg milk
        d_c_10000: 1,
        d_c_10000_BW_av: 750,
        d_c_10000_MY: 0,
        d_c_10000_N_exc: 124.5825,
        d_c_10000_VS_exc: 0,
        d_c_10000_lact_d: 305,
        d_c_10000_milk: 10000,
        // Mature cattle
        d_c_mature: 1,
        d_c_mature_BW_av: 50,
        d_c_mature_MY: 0,
        d_c_mature_N_exc: 6,
        d_c_mature_VS_exc: 0,
        // Calves
        d_c_calves: 1,
        d_c_calves_BW_av: 250,
        d_c_calves_MY: 0,
        d_c_calves_N_exc: 35,
        d_c_calves_VS_exc: 0,
        // Growing < 2 years
        d_c_growing_1: 1,
        d_c_growing_1_BW_av: 550,
        d_c_growing_1_MY: 0,
        d_c_growing_1_N_exc: 61,
        d_c_growing_1_VS_exc: 0,
        // Growing > 2 years
        d_c_growing_2: 1,
        d_c_growing_2_BW_av: 775,
        d_c_growing_2_MY: 0,
        d_c_growing_2_N_exc: 103,
        d_c_growing_2_VS_exc: 0,
        // =====> Meat cattle =====
        // Mature cattle
        m_c_mature: 1,
        m_c_mature_BW_av: 775,
        m_c_mature_MY: 0,
        m_c_mature_N_exc: 103,
        m_c_mature_VS_exc: 3.40450410958904,
        // Calves
        m_c_calves: 1,
        m_c_calves_BW_av: 50,
        m_c_calves_MY: 0,
        m_c_calves_N_exc: 6,
        m_c_calves_VS_exc: 0,
        // Growing < 2 years
        m_c_growing_1: 1,
        m_c_growing_1_BW_av: 250,
        m_c_growing_1_MY: 0,
        m_c_growing_1_N_exc: 35,
        m_c_growing_1_VS_exc: 0,
        // Growing > 2 years
        m_c_growing_2: 1,
        m_c_growing_2_BW_av: 550,
        m_c_growing_2_MY: 0,
        m_c_growing_2_N_exc: 61,
        m_c_growing_2_VS_exc: 0,
        // =====> Sheep =====
        // Mature cattle
        s_mature: 1,
        s_mature_BW_av: 65,
        s_mature_MY: 0,
        s_mature_N_exc: 14.04,
        s_mature_VS_exc: 3.40450410958904,
        // Growing cattle
        s_growing: 1,
        s_growing_BW_av: 35,
        s_growing_MY: 0,
        s_growing_N_exc: 7.02,
        s_growing_VS_exc: 0,
        // =====> Goats =====
        // Mature cattle
        g_mature: 1,
        g_mature_BW_av: 70,
        g_mature_MY: 0,
        g_mature_N_exc: 14.04,
        g_mature_VS_exc: 3.40450410958904,
        // Growing cattle
        g_growing: 1,
        g_growing_BW_av: 35,
        g_growing_MY: 0,
        g_growing_N_exc: 7.02,
        g_growing_VS_exc: 0,
        // =====> Other ruminants =====
        // Horses
        r_others: 1,
        r_others_BW_av: 500,
        r_others_MY: 0,
        r_others_N_exc: 44,
        r_others_VS_exc: 1.0475397260274,
        // =====> Pigs =====
        // Mature pigs
        p_mature: 1,
        p_mature_MY: 0,
        p_mature_N_exc: 44,
        p_mature_VS_exc: 0,
        // Growing pigs
        p_growing: 1,
        p_growing_MY: 0,
        p_growing_N_exc: 44,
        p_growing_VS_exc: 6.07573041095891,
        // =====> Poultry =====
        // Hens
        po_hen: 1,
        po_hen_MY: 0,
        po_hen_N_exc: 0.713,
        po_hen_VS_exc: 3.40450410958904,
        // Broiler chicken
        po_broiler: 1,
        po_broiler_MY: 0,
        po_broiler_N_exc: 0.777,
        po_broiler_VS_exc: 0,
        // Other poultry
        po_other: 1,
        po_other_MY: 0,
        po_other_N_exc: 0.718,
        po_other_VS_exc: 0,
        // =====> 
        additive: 'no', // Is a feed additive for methane reduction used in cattle production?
        methane_r: 30, // Level of methane reduction (%)
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
                'Average body weight (kg)',
                'N excretion (kg N/yr)',
                'VS excretion (kg VS/ ay)',
                'MY (kg CH4/kg DMI)'
            ]
        ],
        body: [
            [{ content: 'Dariy cattle', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255 } }],
            ['Cows 4000 kg milk', v.d_c_4000, v.d_c_4000_milk, v.d_c_4000_lact_d, v.d_c_4000_BW_av, v.d_c_4000_N_exc, v.d_c_4000_VS_exc, v.d_c_4000_MY],
            ['Cows 6000 kg milk', v.d_c_6000, v.d_c_6000_milk, v.d_c_6000_lact_d, v.d_c_6000_BW_av, v.d_c_6000_N_exc, v.d_c_6000_VS_exc, v.d_c_6000_MY],
            ['Cows 8000 kg milk', v.d_c_8000, v.d_c_8000_milk, v.d_c_8000_lact_d, v.d_c_8000_BW_av, v.d_c_8000_N_exc, v.d_c_8000_VS_exc, v.d_c_8000_MY],
            ['Cows 10000 kg milk', v.d_c_10000, v.d_c_10000_milk, v.d_c_10000_lact_d, v.d_c_10000_BW_av, v.d_c_10000_N_exc, v.d_c_10000_VS_exc, v.d_c_10000_MY],
            ['Mature cattle', v.d_c_mature, '', '', v.d_c_mature_BW_av, v.d_c_mature_N_exc, v.d_c_mature_VS_exc, v.d_c_mature_MY],
            ['Calves', v.d_c_calves, '', '', v.d_c_calves_BW_av, v.d_c_calves_N_exc, v.d_c_calves_VS_exc, v.d_c_calves_MY],
            ['Growing < 2 years', v.d_c_growing_1, '', '', v.d_c_growing_1_BW_av, v.d_c_growing_1_N_exc, v.d_c_growing_1_VS_exc, v.d_c_growing_1_MY],
            ['Growing > 2 years', v.d_c_growing_2, '', '', v.d_c_growing_2_BW_av, v.d_c_growing_2_N_exc, v.d_c_growing_2_VS_exc, v.d_c_growing_2_MY],
            [{ content: 'Meat cattle', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.m_c_mature, '', '', v.m_c_mature_BW_av, v.m_c_mature_N_exc, v.m_c_mature_VS_exc, v.m_c_mature_MY],
            ['Calves', v.m_c_calves, '', '', v.m_c_calves_BW_av, v.m_c_calves_N_exc, v.m_c_calves_VS_exc, v.m_c_calves_MY],
            ['Growing < 2 years', v.m_c_growing_1, '', '', v.m_c_growing_1_BW_av, v.m_c_growing_1_N_exc, v.m_c_growing_1_VS_exc, v.m_c_growing_1_MY],
            ['Growing > 2 years', v.m_c_growing_2, '', '', v.m_c_growing_2_BW_av, v.m_c_growing_2_N_exc, v.m_c_growing_2_VS_exc, v.m_c_growing_2_MY],
            [{ content: 'Sheep', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.s_mature, '', '', v.s_mature_BW_av, v.s_mature_N_exc, v.s_mature_VS_exc, v.s_mature_MY],
            ['Growing cattle', v.s_growing, '', '', v.s_growing_BW_av, v.s_growing_N_exc, v.s_growing_VS_exc, v.s_growing_MY],
            [{ content: 'Goats', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature cattle', v.g_mature, '', '', v.g_mature_BW_av, v.g_mature_N_exc, v.g_mature_VS_exc, v.g_mature_MY],
            ['Growing cattle', v.g_growing, '', '', v.g_growing_BW_av, v.g_growing_N_exc, v.g_growing_VS_exc, v.g_growing_MY],
            [{ content: 'Other ruminants', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Horses', v.r_others, '', '', v.r_others_BW_av, v.r_others_N_exc, v.r_others_VS_exc, v.r_others_MY],
            [{ content: 'Pigs', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Mature pigs', v.p_mature, '', '', '', v.p_mature_N_exc, v.p_mature_VS_exc, v.p_mature_MY],
            ['Growing pigs', v.p_growing, '', '', '', v.p_growing_N_exc, v.p_growing_VS_exc, v.p_growing_MY],
            [{ content: 'Poultry', colSpan: 8, styles: { fillColor: [150, 222, 188], fontSize: 12, fontStyle: 'bold', textColor: 255  } }],
            ['Hens', v.po_hen, '', '', '', v.po_hen_N_exc, v.po_hen_VS_exc, v.po_hen_MY],
            ['Broiler chicken', v.po_broiler, '', '', '', v.po_broiler_N_exc, v.po_broiler_VS_exc, v.po_broiler_MY],
            ['Other poultry', v.po_other, '', '', '', v.po_other_N_exc, v.po_other_VS_exc, v.po_other_MY],
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

    doc.addPage(null, 'landscape');

    finalY = 10; // se calcula donde empieza la siguiente tabla
    doc.autoTable({
        startY: finalY + 20,
        theme: 'grid',
        body: [
            ['Is a feed additive for methane reduction used in cattle production?', v.additive],
            ['Level of methane reduction (%)', v.methane_r],
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
        margin: { right: 150 }
    })
    // -- Inputs --- >>>>>>

    // -- Outputs -- <<<<<<
    finalY = doc.lastAutoTable.finalY || 10; // se calcula donde empieza la siguiente tabla
    doc.setFontSize(14);
    doc.text('GHG Emissions', 14, finalY + 15);
    doc.setFontSize(12);
    doc.autoTable({
        startY: finalY + 20,
        //useCss: true,
        html: '#G1Livestock-tabla-1',
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

    addHeaders(doc, 'G1 - Livestock');
    addFooters(doc);
    return doc
}