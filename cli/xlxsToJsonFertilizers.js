var XLSX = require('xlsx');
var fs = require('fs');


function readSheet () {
    const bookData = XLSX.readFile('files/fertilizerOptimizationV6.xlsx')
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
        return parseFloat(v)/1000;
    }else{
        return 0;
    }
        
    
}

function getValue(x){

    if (typeof x === 'string' || x instanceof String){
        
        try {
            var n = x.replace(/,/g,'.');
            n = n.replace(/%/g,'');
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

function getPercent(x){
    if (typeof x === 'string' || x instanceof String){
        var n = x.replace(",", ".");
        n = n.replace(/%/g,'');
        return parseFloat(n);
    }else if(typeof x == 'number' && !isNaN(x)){
        return parseFloat(x)*100;
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
                    "Ncf_ure" : getPercent(elem['Ncf_ure']),
                    "Ncf_NO3": getPercent(elem['Ncf_NO3']),
                    "Ncf_NH4": getPercent(elem['Ncf_NH4']),
                    "Ncf_CN2": getPercent(elem['Ncf_CN2']),
                    "Ncf": getPercent(elem['Ncf'])
                },
                "phosphorus": {
                    "Pcf": getPercent(elem['Pcf']),
                    "P2O5cf": getPercent(elem['P2O5cf'])
                },
                "potassium": {
                    "Kcf": getPercent(elem['Kcf']),
                    "K2Ocf": getPercent(elem['K2Ocf'])
                },
                "drymatter":{
                    "DM": getPercent(elem['dm_amendment'])
                },
                "MO": getPercent(elem['MO']),
                "sulphur": {
                    "Scf": getPercent(elem['Scf']),
                    "SO4cf": getPercent(elem['SO4cf']),
                    "SO3cf": getPercent(elem['SO3cf'])
                },
                "calcium": {
                    "Cacf": getPercent(elem['Cacf']),
                    "CAOcf": getPercent(elem['CAOcf']),
                },
                "magnesium": {
                    "Mgcf": getPercent(elem['Mgcf']),
                    "MgOcf": getPercent(elem['MgOcf'])
                },
                "sodium": {
                    "Nacf": getPercent(elem['Nacf'])
                },
                "chlorine" : {
                    "Clcf" : getPercent(elem['Clcf'])
                }
                
            };
            data_results.push(item);
            
        }
    }
        
    const jsonData = JSON.stringify(data_results);
    fs.writeFile('data/fertilizers-data-excel-v6.json', jsonData, 'utf8', function (err) {});
    
}

main();




