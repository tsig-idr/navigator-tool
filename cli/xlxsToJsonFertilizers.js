var XLSX = require('xlsx');
var fs = require('fs');


function readSheet () {
    const bookData = XLSX.readFile('files/fertilizerOptimizationV4.xlsx')
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

        if(elem && elem['__EMPTY_1']){
    
            var itemID = elem['__EMPTY_1'];
            var group = getGroup(elem['__EMPTY_2']);
            var item = {
                "uri": 'navigatortool:fertilizer:<_Fertilizer:'+itemID+'_>',
                "fertilizerID": itemID,
                "fertilizerKey": getValue(elem['__EMPTY']),
                "fertilizer_name": elem['__EMPTY_2'],
                "price": elem['__EMPTY_5'],
                "volatilization": {
                    "vlt_group":  getGroup(elem['__EMPTY_3']),
                    "vlt_coef": getValue(elem['__EMPTY_4'])
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




