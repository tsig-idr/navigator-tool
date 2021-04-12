
var nf3 = {
    forms: [document.getElementById('formPlotNavigatorF3'), document.getElementById('formFertilizersNavigatorF3') ],
    data: {
      "soil": {
        "soil_texture": "",
        "SOM": 0,
        "pH": 7.0,
        "CEC": 0,
        "vol_water_s": 0,
        "depth_s": 300,
        "Nc_s_initial" : 30,
        "Nc_end": 20
      },
      "plot": {
        "water_supply": 0,
        "type_irrigated": "trickle",
        "rain_a": 1000,
        "rain_w": 600,
        "dose_irrigation": 0,
        "Nc_NO3_water": 25
      },
      "crops": [
        {
          "crop_latin_name": "",
          "crop_name": "",
          "cropID": "",
          "CV": 0,
          "fmc_r": 0,
          "HI_est": 0,
          "Kc_h": 0,
          "Nc_h": 0,
          "Pc_h": 0,
          "yield": 0
        }
      ],
      "fertilization": {
        "type_fmanure": "",
        "dose_amendment": 10000,
        "Nc_DM": 0.99,
        "DM_amendment" : 20,
        "frequent_application": "annual",
        "type_f" : ""
      },
      "fertilizers" : [],
    },
    "results": {
      "crops": [], 
      "total_nutrients" : {}
    }
};

/*
* Cargador de datos combo de cultivos
*/
function _loadSelectCrops(){
  fetch('/nutrient-requirements/crops').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    var combo = document.getElementsByName("crops[0][cropID]")[0];

    const groups = data.results.reduce((groups, item) => {
      const group = (groups[item.group] || []);
      group.push(item);
      groups[item.group] = group;
      return groups;
    }, {});

    Object.keys(groups).forEach(key => {
      var optgroup = document.createElement("optgroup");
      optgroup.setAttribute("label",key+":");
      var groupList = groups[key];
      for(var j=0; j<groupList.length; j++){
        var elem = groupList[j];
        var option = document.createElement("option");
        option.appendChild( document.createTextNode(elem.crop_name) );
        // set value property of opt
        option.value = elem.cropID; 
        optgroup.appendChild(option); 
      }
      combo.appendChild(optgroup); 
    });

  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

function _loadSelectFertilizers(){
  fetch('/fertilizers/all').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    var combo = document.getElementsByName("fertilizers[0][fertilizerID]")[0];

    const groups = data.results.reduce((groups, item) => {
      const group = (groups[item.clasification] || []);
      group.push(item);
      groups[item.clasification] = group;
      return groups;
    }, {});

    Object.keys(groups).forEach(key => {
      var optgroup = document.createElement("optgroup");
      optgroup.setAttribute("label",key+":");
      var groupList = groups[key];
      for(var j=0; j<groupList.length; j++){
        var elem = groupList[j];
        var option = document.createElement("option");
        option.appendChild( document.createTextNode(elem.fertilizer_name) );
        // set value property of opt
        option.value = elem.fertilizerID; 
        optgroup.appendChild(option); 
      }
      combo.appendChild(optgroup); 
    });

  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

/*
* Cargador de datos combo de Tipos de suelo
*/
function _loadSelectSoilTextures(){
  fetch('/nutrient-requirements/soil-textures').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementsByName("soil[soil_texture]")[0];

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.name) );
      // set value property of opt
      option.value = elem.soil_texture; 
      combo.appendChild(option); 
    }

  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

function _loadSelectFertilizerType(){
  fetch('/nitrogen-balance/volatilization-fertilizer-types').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementById("volatilizationFertilizerType");

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.name) );
      // set value property of opt
      option.value = elem.key; 
      combo.appendChild(option); 
    }

  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

/*
function _loadSelectFertilizers(){
  fetch('/fertilizers/all').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementsByName("fertilizers[0][fertilizerID]")[0];

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.fertilizer_name) );
      // set value property of opt
      option.value = elem.fertilizerID; 
      combo.appendChild(option); 
    }

  }).catch(function (error) {
    console.warn('Something went wrong _loadSelectFertilizers.', error);
  });
}
*/

function _loadSelectOrganicFertilizers(){
  fetch('/fertilizers/organics').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementsByName("fertilization[type_fmanure]")[0];

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.fertilizer_name) );
      // set value property of opt
      option.value = elem.fertilizerID; 
      combo.appendChild(option); 
    }

  }).catch(function (error) {
    console.warn('Something went wrong _loadSelectOrganicFertilizers.', error);
  });
}


  function _refreshTableNPKCrops(tblBody){
    var rowlength = tblBody.rows.length;
    //Reasignar index:
    for(var i=0; i< rowlength; i++){
      tblBody.rows[i].cells[0].innerHTML = i +1;
      tblBody.rows[i].setAttribute('data-row', i);
      for(var j=0; j< tblBody.rows[i].cells.length; j++){
        var inputs = tblBody.rows[i].querySelectorAll('input');
        var selects = tblBody.rows[i].querySelectorAll('select');
         // Input
        for(var z=0; z < inputs.length; z++){
         
          var elem_iname = inputs[z].getAttribute("name");
          var n = elem_iname.indexOf("]") ;
          var iname_att = elem_iname.substring(n + 1, elem_iname.length);

          var new_iname_att = "crops["+i+"]" + iname_att;
          inputs[z].setAttribute("name", new_iname_att);

        }
        // Select
        for(var s=0; s < selects.length; s++){
         
          var elem_sname = selects[s].getAttribute("name");
          var n = elem_sname.indexOf("]");
          var sname_att = elem_sname.substring(n + 1, elem_sname.length);

          var new_sname_att = "crops["+i+"]" + sname_att;
          selects[s].setAttribute("name", new_sname_att);
        }
      }
    }
  }

  function _refreshTableFertilizers(tblBody){
    var rowlength = tblBody.rows.length;
    //Reasignar index:
    for(var i=0; i< rowlength; i++){
      tblBody.rows[i].cells[0].innerHTML = i +1;
      tblBody.rows[i].setAttribute('data-row', i);
      for(var j=0; j< tblBody.rows[i].cells.length; j++){
        var inputs = tblBody.rows[i].querySelectorAll('input');
        var selects = tblBody.rows[i].querySelectorAll('select');
         // Input
        for(var z=0; z < inputs.length; z++){
         
          var elem_iname = inputs[z].getAttribute("name");
          var n = elem_iname.indexOf("]") ;
          var iname_att = elem_iname.substring(n + 1, elem_iname.length);

          var new_iname_att = "fertilizers["+i+"]" + iname_att;
          inputs[z].setAttribute("name", new_iname_att);

        }
        // Select
        for(var s=0; s < selects.length; s++){
         
          var elem_sname = selects[s].getAttribute("name");
          var n = elem_sname.indexOf("]");
          var sname_att = elem_sname.substring(n + 1, elem_sname.length);

          var new_sname_att = "fertilizers["+i+"]" + sname_att;
          selects[s].setAttribute("name", new_sname_att);
        }
      }
    }
  }

  /* ------------ DINAMIC TABLES ------------- */

  function _createTableNPKrequirementsResults(tblBody, data){

    //var tblBody = document.querySelector('#tableNPKrequirements tbody');
    tblBody.innerHTML = '';
    // cells creation
    for (var j = 0; j < data.length; j++) {
      var dataRow = data[j];
      var dataNPKRow = dataRow.nutrient_requirements;
      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.yield;
      row.insertCell(3).innerHTML = (dataNPKRow.Ncf_avg)  ?  Math.round(dataNPKRow.Ncf_avg) : '-';
      row.insertCell(4).innerHTML = (dataNPKRow.Ncf_min)  ? Math.round(dataNPKRow.Ncf_min) : '-';
      row.insertCell(5).innerHTML = (dataNPKRow.Ncf_max)  ?  Math.round(dataNPKRow.Ncf_max) : '-';
      row.insertCell(6).innerHTML = (dataNPKRow.Pcf)  ?  Math.round(dataNPKRow.Pcf) : '-';
      row.insertCell(7).innerHTML = (dataNPKRow.Kcf)  ?  Math.round(dataNPKRow.Kcf) : '-';
      row.insertCell(8).innerHTML = (dataNPKRow.P205cf)  ?  Math.round(dataNPKRow.P205cf) : '-';
      row.insertCell(9).innerHTML = (dataNPKRow.K2Ocf)  ?  Math.round(dataNPKRow.K2Ocf) : '-';

      
    }
  }

  function _createTableBalanceIO(tblBody, data){
    tblBody.innerHTML = '';
    // cells creation
    for (var j = 0; j < data.results.length; j++) {
      var dataRow = data.results[j];
      var dataNPKRow = dataRow.nutrient_requirements;
      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = (dataNPKRow.Ninputs_terms.Nmineralization) ?  Math.round(dataNPKRow.Ninputs_terms.Nmineralization) : '0' ;
      row.insertCell(3).innerHTML = (dataNPKRow.Ninputs_terms.Nfixation)  ?  Math.round(dataNPKRow.Ninputs_terms.Nfixation) : '0';
      row.insertCell(4).innerHTML = (dataNPKRow.Ninputs_terms.Nwater)  ?  Math.round(dataNPKRow.Ninputs_terms.Nwater) : '0';
      row.insertCell(5).innerHTML = (dataNPKRow.Ninputs_terms.NminInitial)  ?  Math.round(dataNPKRow.Ninputs_terms.NminInitial) : '0';
      row.insertCell(6).innerHTML = (dataNPKRow.Noutputs_terms.Nleaching)  ?  Math.round(dataNPKRow.Noutputs_terms.Nleaching) : '0';
      row.insertCell(7).innerHTML = (dataNPKRow.Noutputs_terms.Nuptake)  ?  Math.round(dataNPKRow.Noutputs_terms.Nuptake) : '0';
      row.insertCell(8).innerHTML = (dataNPKRow.Noutputs_terms.Ndesnitrification)  ?  Math.round(dataNPKRow.Noutputs_terms.Ndesnitrification) : '0';
      row.insertCell(9).innerHTML = (dataNPKRow.Noutputs_terms.NminPostharvest)  ?  Math.round(dataNPKRow.Noutputs_terms.NminPostharvest) : '0';
      row.insertCell(10).innerHTML = (dataNPKRow.Noutputs_terms.Nvolatilization)  ?  Math.round(dataNPKRow.Noutputs_terms.Nvolatilization) : '0';
    }
  }

  function _createTableNutrientsRequirements(){

    var tblBody = document.querySelector('#tableNutrientsRequirements tbody');
    tblBody.innerHTML = '';
    // cells creation

    for (var j = 0; j < nf3.results.crops.length; j++) {
      var dataRow = nf3.results.crops[j]; //Crop data
      var dataNPKRow = dataRow.nutrient_requirements;
      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.yield;
      row.insertCell(3).innerHTML = (dataNPKRow.Ncf_avg)  ?  Math.round(dataNPKRow.Ncf_avg) : '0';
      row.insertCell(4).innerHTML = (dataNPKRow.Ncf_min)  ?  Math.round(dataNPKRow.Ncf_min) : '0';
      row.insertCell(5).innerHTML = (dataNPKRow.Ncf_max)  ?  Math.round(dataNPKRow.Ncf_max) : '0';
      row.insertCell(6).innerHTML = (dataNPKRow.Pcf)  ?  Math.round(dataNPKRow.Pcf) : '0';
      row.insertCell(7).innerHTML = (dataNPKRow.Kcf)  ?  Math.round(dataNPKRow.Kcf) : '0';
      row.insertCell(8).innerHTML = (dataNPKRow.P205cf)  ?  Math.round(dataNPKRow.P205cf) : '0';
      row.insertCell(9).innerHTML = (dataNPKRow.K2Ocf)  ?  Math.round(dataNPKRow.K2Ocf) : '0';
    }
  }





  function _refreshTableFertilization(){

    var tblBody = document.querySelector('#tableFertilization tbody');
    tblBody.innerHTML = '';

    const aggregated = {
			amount: 0,
			N: 0,
			P: 0,
			K: 0,
			S: 0,
			N_ur: 0,
			cost: 0,
      vol: 0
		};

    // cells creation
    var num_row=0;
    for (var j = 0; j < nf3.results.crops.length; j++) {
      var dataRow = nf3.results.crops[j]; //Crop data
      
      for(var f = 0; f < dataRow.fertilization.length; f++){
        var dataRowFer = dataRow.fertilization[f];
        // table row creation
        var row = tblBody.insertRow(num_row);
        var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
        row.insertCell(0).innerHTML = j +1;
        row.insertCell(1).innerHTML = cropname;
        var fertilizername=  '<span title="' +  dataRowFer.fertilizerID + '">' +  dataRowFer.fertilizer_name + '</span>';
        row.insertCell(2).innerHTML = fertilizername;
        row.insertCell(3).innerHTML = (dataRowFer.amount)  ? dataRowFer.amount.toFixed(2) : '0';
        row.insertCell(4).innerHTML = (dataRowFer.cost)  ? dataRowFer.cost.toFixed(2) : '0';
        row.insertCell(5).innerHTML = (dataRowFer.N)  ? dataRowFer.N.toFixed(2) : '0';
        row.insertCell(6).innerHTML = (dataRowFer.N_ur)  ? dataRowFer.N_ur.toFixed(2) : '0';
        row.insertCell(7).innerHTML = (dataRowFer.P)  ? dataRowFer.P.toFixed(2) : '0';
        row.insertCell(8).innerHTML = (dataRowFer.K)  ? dataRowFer.K.toFixed(2) : '0';
        row.insertCell(9).innerHTML = (dataRowFer.S)  ? dataRowFer.S.toFixed(2) : '0';
        row.insertCell(10).innerHTML = (dataRowFer.volatilization.total)  ?  dataRowFer.volatilization.total.toFixed(2) : '0';
       

        aggregated.amount += dataRowFer.amount;
        aggregated.N += dataRowFer.N;
        aggregated.P += dataRowFer.P;
        aggregated.K += dataRowFer.K;
        aggregated.S += dataRowFer.S;
        aggregated.N_ur += dataRowFer.N_ur;
        aggregated.cost += dataRowFer.cost;
        aggregated.vol += dataRowFer.volatilization.total;

        num_row++;
      }
    }

    var row = tblBody.insertRow(num_row);
    row.className = 'table-primary';
    row.insertCell(0).innerHTML = '#';
    row.insertCell(1).innerHTML = 'TOTAL:';
    row.insertCell(2).innerHTML = '>';
    row.insertCell(3).innerHTML = (aggregated.amount)  ? aggregated.amount.toFixed(2) : '0';
    row.insertCell(4).innerHTML = (aggregated.cost)  ? aggregated.cost.toFixed(2) : '0';
    row.insertCell(5).innerHTML = (aggregated.N)  ? aggregated.N.toFixed(2) : '0';
    row.insertCell(6).innerHTML = (aggregated.N_ur)  ? aggregated.N_ur.toFixed(2) : '0';
    row.insertCell(7).innerHTML = (aggregated.P)  ? aggregated.P.toFixed(2) : '0';
    row.insertCell(8).innerHTML = (aggregated.K)  ? aggregated.K.toFixed(2) : '0';
    row.insertCell(9).innerHTML = (aggregated.S)  ? aggregated.S.toFixed(2) : '0';
    row.insertCell(10).innerHTML = (aggregated.vol)  ? aggregated.vol.toFixed(2) : '0';


    row.cells.item(5).style.color = (Math.round(aggregated.N) < Math.round(nf3.results.total_nutrients.N)) ? 'red': 'green';
    row.cells.item(7).style.color = (Math.round(aggregated.P) < Math.round(nf3.results.total_nutrients.P)) ? 'red': 'green';
    row.cells.item(8).style.color = (Math.round(aggregated.K) < Math.round(nf3.results.total_nutrients.K)) ? 'red': 'green';
    row.cells.item(9).style.color = (Math.round(aggregated.S) < Math.round(nf3.results.total_nutrients.S)) ? 'red': 'green';


  }

  function _refreshTableNLossed(){

    var tblBody = document.querySelector('#tableNLossed tbody');
    tblBody.innerHTML = '';
    // cells creation
    for (var j = 0; j < nf3.results.length; j++) {
      var dataRow = nf3.results[j]; //Crop data

        // table row creation
        var row = tblBody.insertRow(j);
        var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
        row.insertCell(0).innerHTML = j +1;
        row.insertCell(1).innerHTML = cropname;
        row.insertCell(2).innerHTML = (dataRow.acidification) ? dataRow.acidification : '-';
        row.insertCell(3).innerHTML = dataRow.volatilization;
        row.insertCell(4).innerHTML = dataRow.desnitrification;
        row.insertCell(5).innerHTML = (dataRow.leaching) ? dataRow.leaching : '-';
        row.insertCell(6).innerHTML = (dataRow.N_losses) ? dataRow.N_losses : '-';
        row.insertCell(7).innerHTML = '-';
      
    }
  }




  function _addRowCrop() {

    var tblBody = document.querySelector('#tableNPKCrops tbody');
    var tblRow = document.querySelectorAll('#tableNPKCrops tbody .trow')[0];
    var tblRowCell = tblRow.cloneNode(true); // Clonar fila


    var btn = document.createElement("button");
    btn.classList.add('btn', 'btn-danger', 'btn-sm');
    btn.innerHTML = '<i class="fa fa-trash"></i>';
    btn.addEventListener('click', deleteRowCrop);

    tblRowCell.cells[1].appendChild(btn);

    tblBody.appendChild(tblRowCell);

    _refreshTableNPKCrops(tblBody);
  }

  function _addRowFertilizer() {

    var tblBody = document.querySelector('#tableFertilizerToApply tbody');
    var tblRow = document.querySelectorAll('#tableFertilizerToApply tbody .trow')[0];
    var tblRowCell = tblRow.cloneNode(true); // Clonar fila


    var btn = document.createElement("button");
    btn.classList.add('btn', 'btn-danger', 'btn-sm');
    btn.innerHTML = '<i class="fa fa-trash"></i>';
    btn.addEventListener('click', deleteRowFertilizer);

    tblRowCell.cells[1].appendChild(btn);

    tblBody.appendChild(tblRowCell);

    _refreshTableFertilizers(tblBody);
  }

  function _cleanAllRowFertilizer(){
    var tblBody = document.querySelector('#tableFertilizerToApply tbody');
    var tblNewBody = document.createElement('tbody');
    var tblRow = document.querySelectorAll('#tableFertilizerToApply tbody .trow')[0];

    tblNewBody.appendChild(tblRow);
    tblBody.parentNode.replaceChild(tblNewBody, tblBody);


  }

  function deleteRowCrop(event){
    var target = event.target;
    var tblTr = target.closest('tr');//parent of "target"
    target.removeEventListener("click", deleteRowCrop); 
    tblTr.remove();

  }

  function deleteRowFertilizer(event){
    var target = event.target;
    var tblTr = target.closest('tr');//parent of "target"
    target.removeEventListener("click", deleteRowFertilizer); 
    tblTr.remove();
    //var tblBody = document.querySelector('#tableFertilizerToApply tbody');
    //_refreshTableFertilizers(tblBody);

  }

  function onChangeCrop(selectObject){

    fetch('/nutrient-requirements/crop/' + selectObject.value).then(function (response) {
      if (response.ok) {
        return response.json();
      }
        return Promise.reject(response);
      }).then(function (data) {
       //TODO: Modifica los datos de la fila:
      var rowElement = selectObject.parentElement.parentElement;
      var idrow = rowElement.getAttribute('data-row');

      var form = document.forms[0];
      var item = data.results;
      var selectElement = form.querySelector('input[name="crops['+idrow+'][CV]"]');
      selectElement.value = item.CV || 20;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][HI_est]"]');
      selectElement.value = item.harvest.HI_est;
    
      //var selectElement = form.querySelector('input[name="crops['+idrow+'][fmc_r]"]');
      //selectElement.value = item.residues.fmc_r || 100;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Nc_h]"]');
      selectElement.value = item.harvest.Nc_h_typn;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Pc_h]"]');
      selectElement.value = item.harvest.Pc_h || 0;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Kc_h]"]');
      selectElement.value = item.harvest.Kc_h || 0;
      
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }

  function onChangeFertilizer(selectObject){

    fetch('/fertilizers/fertilizer/' + selectObject.value).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
       //TODO: Modifica los datos de la fila:
      var rowElement = selectObject.parentElement.parentElement;
      var idrow = rowElement.getAttribute('data-row');

      var form = document.forms[1]; //formFertilizersNavigatorF3
      var item = data.results;
  
      var selectElement = form.querySelector('input[name="fertilizers['+idrow+'][fertilizer_name]"]');
      selectElement.value = item.fertilizer_name;
    
      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][fertilizer_key]"]');
      selectElement.value = item.fertilizer_key;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][price]"]');
      selectElement.value = item.price;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][N_req]"]');
      selectElement.value = item.nitrogen.Ncf || 0;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][lim_N_ur]"]');
      selectElement.value = item.nitrogen.Ncf_ure || 0;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][P_req]"]');
      selectElement.value = item.phosphorus.Pcf || 0;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][K_req]"]');
      selectElement.value = item.potassium.Kcf || 0;

      selectElement = form.querySelector('input[name="fertilizers['+idrow+'][S_req]"]');
      selectElement.value = item.sulphur.Scf || 0;
      
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
  });


    
  }

  function onChangeWaterSypply(selectObject) {
    var typeIrrigatedElement = document.getElementById('type_irrigated');
    var doseIrrigationElement = document.getElementById('dose_irrigation');
    var NcNO3WaterElement = document.getElementById('Nc_NO3_water');
    
    if(parseInt(selectObject.value) === 1 ){
      typeIrrigatedElement.disabled = false;
      doseIrrigationElement.disabled = false;
      NcNO3WaterElement.disabled = false;
    }else{
      typeIrrigatedElement.disabled = true;
      doseIrrigationElement.disabled = true;
      NcNO3WaterElement.disabled = true;
    }
  }

  function onChangePKStrategy(selectObject) {

    var cropKchElement = document.getElementsByName('crops[0][Kc_h]')[0];
    var cropPchElement = document.getElementsByName('crops[0][Pc_h]')[0];
    if(selectObject.value === "maintenance"){
      cropKchElement.disabled = true;
      cropKchElement.value = "";
      cropPchElement.disabled = true;
      cropPchElement.value = "";
    }else{
      cropKchElement.disabled = false;
      cropPchElement.disabled = false;
    }
  }



  function onChangeClimaticZone(selectObject){

    fetch('/nutrient-requirements/climate-zone/' + selectObject.value).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      
      var item = data.results;
      document.getElementById('rain_a').value= item.rain_a;
      document.getElementById('rain_w').value= item.rain_w;
     
      
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
  }); 
  }

  function onChangeSoilTexture(selectObject){

    fetch('/nutrient-requirements/soil-texture/' + selectObject.value).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      
      var item = data.results;
      document.getElementById('Pc_s').value= item.Pc_s_thres.Pc_s_thres_avg;
      document.getElementById('Kc_s').value= item.Kc_s_thres.Kc_s_thres_avg;
      document.getElementById('cec').value= item.CEC;
      
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
  }); 
  }

  function onChangeApplyOrganicFertilizer(selectObject){
    if(selectObject.checked){
      document.getElementById('type_fmanure').disabled = false;
    }else{
      document.getElementById('type_fmanure').disabled = true;
    }
      
  }

  function _sendFormNPKRequirementsF3(){
    var form = document.querySelector('#formPlotNavigatorF3');
    let json = FormDataJson.formToJson(form);
    let result = Object.entries(json.crops).map(( [k, v] ) => (v) );
    const crops = result.filter(v => v.cropID);
    json.crops = crops;


    fetch('/nutrient-requirements/navigator-n3-requeriments', {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      nf3.results.crops = [];
      data.results.forEach(element => {
        nf3.results.crops.push(element);
      });
      _updateTotalNutrientsRequeriments();
      _createTableNPKrequirementsResults(document.querySelector('#tableNPKrequirements tbody'), data.results);
      _createTableBalanceIO(document.querySelector('#tableBalanceIO tbody'), data)

      console.log(nf3.results)
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }

  function _getBestFertilizers(json){

    fetch('/fertilizers/optimization', {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      _loadComboFertilizer(data);
      //_createTableBestFertilizerResults(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }

  function _loadComboFertilizer(data){

    _cleanAllRowFertilizer();
    
    for(var z=0; z < data.results.length; z++){
      if(z!=0){
        _addRowFertilizer()
      }
      var combo = nf3.forms[1].querySelector('select[name="fertilizers['+z+'][fertilizerID]"]');
      combo.value = data.results[z].fertilizerID;
      onChangeFertilizer(combo);
    }
  }

  function _sendFormNavigatorF3(){
    // recuperar todos los datos del formulario (actualizar nf3.data)
    nf3.data = FormDataJson.formToJson(nf3.forms[0]);
    var f1 = FormDataJson.formToJson(nf3.forms[1]);
    
    nf3.data.fertilizers = Object.keys(f1.fertilizers).map(function(key) {return f1.fertilizers[key];});

    fetch('/nutrient-requirements/navigator-n3-requeriments-fertilizers', {
      method: 'POST',
      body: JSON.stringify(nf3.data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      nf3.results.crops = [];
      data.results.forEach(element => {
        nf3.results.crops.push(element);
      });
      _updateTotalNutrientsRequeriments();
      _createTableNPKrequirementsResults(document.querySelector('#tableNutrientsRequirements tbody'), nf3.results.crops);
      //_createTableNutrientsRequirements();
      _refreshTableFertilization();
      //_refreshTableNLossed();
     

    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });

    console.log(nf3);
    //Enviar datos al servicio
  }
  
  

 
  // Eventos:


  document.getElementById('addFertilizer').addEventListener('click', function () {
    _addRowFertilizer();
  });

  document.getElementById('btnBestFertilizer').addEventListener('click', function () {
    _updateTotalNutrientsRequeriments();
      _getBestFertilizers(nf3.results.total_nutrients);
  });

  function _updateTotalNutrientsRequeriments(){
    var crops = nf3.results.crops;
    var totalNutrients = { N: 0, P: 0,  K: 0, S: 0, N_ur: 0 };
    crops.forEach(item => {
      var nutrients = item.nutrient_requirements;
      totalNutrients = {
        N:  totalNutrients.N + nutrients.Ncf_avg,
        P:  totalNutrients.N + nutrients.Pcf,
        K:  totalNutrients.N + nutrients.Kcf,
        S:  totalNutrients.N + nutrients.Scf,
        N_ur :  totalNutrients.N + nutrients.Ncf_ure
      }
    })
   
    nf3.results.total_nutrients = totalNutrients;
  }

  
  document.getElementById('calculateNPKrequirements').addEventListener('click', function () {
    if(nf3.forms[0].checkValidity()){
      var element =  document.getElementById('NPKresults');
      var element2 =  document.getElementById('step2');
      var element3 =  document.getElementById('stepLaunch');
      var element4 =  document.getElementById('NBalanceInputsOutputs');
      element.classList.remove("d-none");
      element2.classList.remove("d-none");
      element3.classList.remove("d-none");
      element4.classList.remove("d-none");
     _sendFormNPKRequirementsF3();
    }
       
      
  });

  nf3.forms[1].addEventListener('click', function () {
    var elem = document.getElementById("btnLaunchF3");
    if(nf3.forms[0].checkValidity() && nf3.forms[1].checkValidity()){
      elem.disabled = false;
    }else{
      elem.disabled = true;
    }
      
  });

  document.getElementById('btnLaunchF3').addEventListener('click', function () {
    if(nf3.forms[0].checkValidity() && nf3.forms[1].checkValidity()){
      _sendFormNavigatorF3();
      var element =  document.getElementById('step3');
      element.classList.remove("d-none");
      
    }
  });
  

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      var elem = document.getElementById('calculateNPKrequirements');
      elem.addEventListener('click', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    _loadSelectCrops();
    _loadSelectSoilTextures();
    _loadSelectFertilizers();
   // _loadSelectOrganicFertilizers();
    //_loadSelectFertilizerType();

  

