var XLSX = require('xlsx');
var fs = require('fs');


function readSheet () {
    const bookData = XLSX.readFile('files/studyFaSTM1excelv01-2.xlsx')
    if (bookData.SheetNames.length <= 0) {
     throw new Error(`studyFaSTM1excelv01 sheets`)
    }
    const sheetRaw = bookData.Sheets[bookData.SheetNames[8]]
    return XLSX.utils.sheet_to_json(sheetRaw)
}

function getGroup(name){

    if(name === 'Cereals & pseudocereals')
        return 'CEREALS_PSEUDOCEREALS';
    if(name === 'Sugar, oil & fiber crops')
        return 'SUGAR_OIL_FIBER_CROPS';
    if(name === 'Legumes')
        return 'LEGUMES';
    if(name === 'Forages')
        return 'FORAGES';
    if(name === 'Horticultural crops')
        return 'HORTICULTURAL_CROPS';
    if(name === 'Fruit trees, vines and shrubs')
        return 'FRUIT_TREES_VINES_AND_SHRUBS';
    if(name === 'Roots, tubers & bulbs')
        return 'ROOTS_TUBERS_BULBS';

    return "GENERAL"
        
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getValue(x){

    if (typeof x === 'string' || x instanceof String){
        
        try {
            var n = x.replace(/,/g,'.');
            if (isNumeric(n)){
                return parseFloat(n);
            }else{
                return x.toLowerCase();
            }
    
        } catch (error) {
            return x.toLowerCase();
        }
        
    }else if(typeof x == 'number' && !isNaN(x)){
        return parseFloat(x);
    }else{
        return undefined;
    }
}

var npk_crops_json = readSheet();

var listCrops = new Array();
for(var i=5; i<=npk_crops_json.length; i++){

    var elem = npk_crops_json[i];

    if(elem && elem['cropID']){

        var cropID = elem['cropID'];
        var group = getGroup(elem['group']);
        var item = {
            "uri": 'navigatortool:crops:<_Crops:'+cropID+'_>',
            "cropID": cropID,
            "crop_name": elem['crop_name'],
            "crop_latin_name": elem['crop_latin_name'],
            "crop_cycle": elem['crop_cycle'],
            "group": group,
            "CV": "20",
            "harvest": {
                "harvested_part": getValue(elem['harvested_part']),
                "HI_est": getValue(elem['HI_est']),
                "fcm_r": getValue(elem['fcm_r']),
                "DM_h": getValue(elem['DM_h']),
                "Nc_h_min": getValue(elem['Nc_h_min']),
                "Nc_h_max": getValue(elem['Nc_h_max']),
                "Nc_h_typn": getValue(elem['Nc_h_typn']),
                "Pc_h": getValue(elem['Pc_h']), 
                "Kc_h": getValue(elem['Kc_h']),
                "Ca_h": getValue(elem['Ca_h']),
                "Mgc_h": getValue(elem['Mgc_h']),
                "Sc_h": getValue(elem['Sc_h'])
            },
            "residues": {
                "residue_part": getValue(elem['residue_part']),
                "fmc_r": getValue(elem['fmc_r']),
                "name": undefined,
                "DM_r": getValue(elem['DM_r']),
                "Nc_r_min": getValue(elem['Nc_r_min']),
                "Nc_r_max": getValue(elem['Nc_r_max']),
                "Nc_r_typn": getValue(elem['Nc_r_typn']),
                "Pc_r": getValue(elem['Pc_r']),
                "Kc_r": getValue(elem['Kc_r']),
                "Ca_r": getValue(elem['Ca_r']),
                "Mgc_r": getValue(elem['Mgc_r']),
                "Sc_r": getValue(elem['Sc_r'])
            }
            
        };
        listCrops.push(item);
        
    }
}
    
const jsonCrops = JSON.stringify(listCrops);
fs.writeFile('data/crops-data-excel.json', jsonCrops, 'utf8', function (err) {});




