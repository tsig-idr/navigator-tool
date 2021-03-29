var XLSX = require('xlsx');
var fs = require('fs');


function readSheet () {
    const bookData = XLSX.readFile('files/fertilizerOptimizationV5.xlsx')
    if (bookData.SheetNames.length <= 0) {
     throw new Error(`fertilizerOptimization sheets`)
    }
    const sheetRaw = bookData.Sheets[bookData.SheetNames[0]]
    return XLSX.utils.sheet_to_json(sheetRaw)
}

function getGroup(name){

    if(name === '-')
        return 'GENERAL';
    return name;
        
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getPrice(v){
    if(isNumeric(v)){
        return parseFloat(v);
    }else{
        return 0;
    }
        
    
}

function getValue(x){

    if (typeof x === 'string' || x instanceof String){
        
        try {
            var n = x.replace(/,/g,'.');
            var n = x.replace(/%/g,'');
            if (isNumeric(n)){
                return parseFloat(n);
            }else if (x === "-"){
                return 0;
            }else{
                return x;
            }
    
        } catch (error) {
            return x;
        }
        
    }else if(typeof x == 'number' && !isNaN(x)){
        return parseFloat(x);
    }else{
        return undefined;
    }
}


function main(){

    var data_json = readSheet();

    var data_results = new Array();
    for(var i=2; i<=data_json.length; i++){
    
        var elem = data_json[i];

        if(elem && elem['Fertilizer_ID']){
    
            var itemID = elem['Fertilizer_ID'];
            var item = {
                "uri": 'navigatortool:fertilizer:<_Fertilizer:'+itemID+'_>',
                "fertilizerID": itemID,
                "fertilizerKey": getValue(elem['Acronym']),
                "fertilizer_name": elem['type_fm'],
                "price": getPrice(elem['price']),
                "clasification": getGroup(elem['clasification_fm']),
                "volatilization": {
                    "vlt_group":  getGroup(elem['vol_group']),
                    "vlt_coef": getValue(elem['vola_coeff'])
                },
                "nitrogen": {
                    "Ncf_ure" : getValue(elem['Ncf_ure']),
                    "Ncf_NO3": getValue(elem['Ncf_NO3']),
                    "Ncf_NH4": getValue(elem['Ncf_NH4']),
                    "Ncf_CN2": getValue(elem['Ncf_CN2']),
                    "Ncf": getValue(elem['Ncf'])
                },
                "phosphorus": {
                    "Pcf": getValue(elem['Pcf']),
                    "P2O5cf": getValue(elem['P2O5cf'])
                },
                "potassium": {
                    "Kcf": getValue(elem['Kcf']),
                    "K2Ocf": getValue(elem['K2Ocf'])
                },
                "drymatter":{
                    "DM": getValue(elem['dm_amendment'])
                },
                "MO": getValue(elem['MO']),
                "sulphur": {
                    "Scf": getValue(elem['Scf']),
                    "SO4cf": getValue(elem['SO4cf']),
                    "SO3cf": getValue(elem['SO3cf'])
                },
                "calcium": {
                    "Cacf": getValue(elem['Cacf']),
                    "CAOcf": getValue(elem['CAOcf']),
                },
                "magnesium": {
                    "Mgcf": getValue(elem['Mgcf']),
                    "MgOcf": getValue(elem['MgOcf'])
                },
                "sodium": {
                    "Nacf": getValue(elem['Nacf'])
                },
                "chlorine" : {
                    "Clcf" : getValue(elem['Clcf'])
                }
                
            };
            data_results.push(item);
            
        }
    }
        
    const jsonData = JSON.stringify(data_results);
    fs.writeFile('data/fertilizers-data-excel.json', jsonData, 'utf8', function (err) {});
    
}

main();




