var XLSX = require('xlsx');
var fs = require('fs');


function readSheet () {
    const bookData = XLSX.readFile('files/studyFaSTM1excelv01.xlsx')
    if (bookData.SheetNames.length <= 0) {
     throw new Error(`studyFaSTM1excelv01 sheets`)
    }
    const sheetRaw = bookData.Sheets[bookData.SheetNames[9]]
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


function getValue(x){

    if (typeof x === 'string' || x instanceof String){
        
        try {
            if (parseFloat(x))
                return parseFloat(x.replace(/,/g,'.'));
    
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
for(var i=4; i<=npk_crops_json.length; i++){

    var elem = npk_crops_json[i];

    if(elem && elem['__EMPTY']){

        var cropID = elem['__EMPTY'];
        var group = getGroup(elem['__EMPTY_1']);
        var item = {
            "uri": 'navigatortool:crops:<_Crops:'+cropID+'_>',
            "cropID": cropID,
            "name": cropID,
            "latin_name": elem['__EMPTY_2'],
            "group": group,
            "harvest": {
                "harvested_part": getValue(elem['__EMPTY_4']),
                "DM_h": getValue(elem['__EMPTY_5']),
                "Nc_h_min": getValue(elem['__EMPTY_6']),
                "Nc_h_max": getValue(elem['__EMPTY_7']),
                "Nc_h_typn": getValue(elem['__EMPTY_8']),
                "Pc_h": getValue(elem['__EMPTY_9']), 
                "Kc_h": getValue(elem['__EMPTY_10']),
                "Ca_h": getValue(elem['__EMPTY_11']),
                "Mgc_h": getValue(elem['__EMPTY_12']),
                "Sc_h": getValue(elem['__EMPTY_13'])
            },
            "residues": {
                "residue_part": getValue(elem['__EMPTY_14']),
                "name": undefined,
                "DM_r": getValue(elem['__EMPTY_15']),
                "Nc_r_min": getValue(elem['__EMPTY_16']),
                "Nc_r_max": getValue(elem['__EMPTY_17']),
                "Nc_h_typn": getValue(elem['__EMPTY_18']),
                "Pc_r": getValue(elem['__EMPTY_19']),
                "Kc_r": getValue(elem['__EMPTY_20']),
                "Ca_r": getValue(elem['__EMPTY_21']),
                "Mgc_r": getValue(elem['__EMPTY_22']),
                "Sc_r": getValue(elem['__EMPTY_23'])
            }
            
        };
        listCrops.push(item);
        
    }
}
    
const jsonCrops = JSON.stringify(listCrops);
fs.writeFile('data/fertilicalc-crops-data-excel.json', jsonCrops, 'utf8', function (err) {});




