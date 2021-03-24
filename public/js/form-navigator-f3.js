
var nf3 = {
    forms: [document.getElementById('formPlotNavigatorF3'), document.getElementById('formFertilizersNavigatorF3') ],
    data: {
      "plot": {
        "CEC": 0,
        "Kc_s": 0,
        "Pc_s": 0,
        "pH": 7.0,
        "PK_strategy": 4,
        "soil_type": "siltyLoam",
        "SOM": 0,
        "water_supply": 0
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
      "fertilizers" : [],
    },
    "results": {
      "nutrient_requirements": [], // Resultados de necesidades
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
/*
* Cargador de datos de combo de PK Strategy
*/
function _loadSelectPKStrategy(){
  fetch('/nutrient-requirements/pkstrategies').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementsByName("plot[PK_strategy]")[0];

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.description) );
      // set value property of opt
      option.value = elem.value; 
      if(elem.value === 4)
        option.selected = true;
      combo.appendChild(option); 
    }

  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

/*
* Cargador de datos combo de Tipos de suelo
*/
function _loadSelectTypeOfSoils(){
  fetch('/nutrient-requirements/soil/types').then(function (response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(function (data) {
    
    var combo = document.getElementsByName("plot[soil_type]")[0];

    for(var i=0; i<data.results.length; i++){
      var elem = data.results[i];
      var option = document.createElement("option");
      option.appendChild( document.createTextNode(elem.name) );
      // set value property of opt
      option.value = elem.type; 
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

function _loadSelectFertilizers(){
  fetch('/fertilizers').then(function (response) {
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
    for (var j = 0; j < data.results.length; j++) {
      var dataRow = data.results[j];
      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.yield;
      //row.insertCell(3).innerHTML = dataRow.Ncf_min.toFixed(3);
      //row.insertCell(4).innerHTML = dataRow.Ncf_max.toFixed(3);
      row.insertCell(3).innerHTML = (dataRow.Ncf_avg)  ? dataRow.Ncf_avg.toFixed(3) : '-';
      row.insertCell(4).innerHTML = (dataRow.Pcf)  ? dataRow.Pcf.toFixed(3) : '-';
      row.insertCell(5).innerHTML = (dataRow.Kcf)  ? dataRow.Kcf.toFixed(3) : '-';
      row.insertCell(6).innerHTML = (dataRow.P205cf)  ? dataRow.P205cf.toFixed(3) : '-';
      row.insertCell(7).innerHTML = (dataRow.K2Ocf)  ? dataRow.K2Ocf.toFixed(3) : '-';
    }
  }

  function _createTableNutrientsRequirements(){

    var tblBody = document.querySelector('#tableNutrientsRequirements tbody');
    tblBody.innerHTML = '';
    // cells creation

    for (var j = 0; j < nf3.results.length; j++) {
      var dataRow = nf3.results[j]; //Crop data

      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.nutrient_requirements.yield;
      row.insertCell(3).innerHTML = (dataRow.nutrient_requirements.Ncf_avg)  ? dataRow.nutrient_requirements.Ncf_avg.toFixed(3) : '0';
      row.insertCell(4).innerHTML = (dataRow.nutrient_requirements.Pcf)  ? dataRow.nutrient_requirements.Pcf.toFixed(3) : '0';
      row.insertCell(5).innerHTML = (dataRow.nutrient_requirements.Kcf)  ? dataRow.nutrient_requirements.Kcf.toFixed(3) : '0';
      row.insertCell(6).innerHTML = (dataRow.nutrient_requirements.P205cf)  ? dataRow.nutrient_requirements.P205cf.toFixed(3) : '0';
      row.insertCell(7).innerHTML = (dataRow.nutrient_requirements.K2Ocf)  ? dataRow.nutrient_requirements.K2Ocf.toFixed(3) : '0';


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
			cost: 0
		};

    // cells creation
    var num_row=0;
    for (var j = 0; j < nf3.results.length; j++) {
      var dataRow = nf3.results[j]; //Crop data
      
      for(var f = 0; f < dataRow.fertilization.length; f++){
        var dataRowFer = dataRow.fertilization[f];
        // table row creation
        var row = tblBody.insertRow(num_row);
        var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_name + '</span>';
        row.insertCell(0).innerHTML = j +1;
        row.insertCell(1).innerHTML = cropname;
        var fertilizername=  '<span title="' +  dataRowFer.fertilizerID + '">' +  dataRowFer.fertilizer_name + '</span>';
        row.insertCell(2).innerHTML = fertilizername;
        row.insertCell(3).innerHTML = (dataRowFer.N)  ? dataRowFer.N.toFixed(3) : '0';
        row.insertCell(4).innerHTML = (dataRowFer.N_ur)  ? dataRowFer.N_ur.toFixed(3) : '0';
        row.insertCell(5).innerHTML = (dataRowFer.P)  ? dataRowFer.P.toFixed(3) : '0';
        row.insertCell(6).innerHTML = (dataRowFer.K)  ? dataRowFer.K.toFixed(3) : '0';
        row.insertCell(7).innerHTML = (dataRowFer.S)  ? dataRowFer.S.toFixed(3) : '0';
        row.insertCell(8).innerHTML = (dataRowFer.amount)  ? dataRowFer.amount.toFixed(2) : '0';
        row.insertCell(9).innerHTML = (dataRowFer.cost)  ? dataRowFer.cost.toFixed(2) : '0';

        aggregated.amount += dataRowFer.amount;
        aggregated.N += dataRowFer.N;
        aggregated.P += dataRowFer.P;
        aggregated.K += dataRowFer.K;
        aggregated.S += dataRowFer.S;
        aggregated.N_ur += dataRowFer.N_ur;
        aggregated.cost += dataRowFer.cost;

        num_row++;
      }
    }

    var row = tblBody.insertRow(num_row);
    row.className = 'table-primary';
    row.insertCell(0).innerHTML = '#';
    row.insertCell(1).innerHTML = 'TOTAL:';
    row.insertCell(2).innerHTML = '>';
    row.insertCell(3).innerHTML = (aggregated.N)  ? aggregated.N.toFixed(3) : '0';
    row.insertCell(4).innerHTML = (aggregated.N_ur)  ? aggregated.N_ur.toFixed(3) : '0';
    row.insertCell(5).innerHTML = (aggregated.P)  ? aggregated.P.toFixed(3) : '0';
    row.insertCell(6).innerHTML = (aggregated.K)  ? aggregated.K.toFixed(3) : '0';
    row.insertCell(7).innerHTML = (aggregated.S)  ? aggregated.S.toFixed(3) : '0';
    row.insertCell(8).innerHTML = (aggregated.amount)  ? aggregated.amount.toFixed(2) : '0';
    row.insertCell(9).innerHTML = (aggregated.cost)  ? aggregated.cost.toFixed(2) : '0';

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
    
      var selectElement = form.querySelector('input[name="crops['+idrow+'][fmc_r]"]');
      selectElement.value = item.residues.fmc_r || 100;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Nc_h]"]');
      selectElement.value = item.harvest.Nc_h_typn;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Pc_h]"]');
      selectElement.value = item.harvest.Pc_h;

      var selectElement = form.querySelector('input[name="crops['+idrow+'][Kc_h]"]');
      selectElement.value = item.harvest.Kc_h;
      
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }

  function onChangeFertilizer(selectObject){

    fetch('/fertilizers/' + selectObject.value).then(function (response) {
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

  function _sendFormNPKRequirementsF3(){
    var form = document.querySelector('#formPlotNavigatorF3');
    let json = FormDataJson.formToJson(form);
    let result = Object.entries(json.crops).map(( [k, v] ) => (v) );
    const crops = result.filter(v => v.cropID);
    json.crops = crops;


    fetch('/nutrient-requirements/navigator-f3-npk', {
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
      nf3.results.nutrient_requirements = data.results;
      _createTableNPKrequirementsResults(document.querySelector('#tableNPKrequirements tbody'), data);
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

    fetch('/nutrient-requirements/navigator-f3-npk-fertilization', {
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
      nf3.results = data.results;
      _refreshTableFertilization();
      //_refreshTableNLossed();
      _createTableNutrientsRequirements();

    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });

    console.log(nf3);
    //Enviar datos al servicio
  }
  
  

 
  // Eventos:
  document.getElementById('addMoreCrops').addEventListener('click', function () {
    _addRowCrop();
  });

  document.getElementById('addFertilizer').addEventListener('click', function () {
    _addRowFertilizer();
  });

  document.getElementById('btnBestFertilizer').addEventListener('click', function () {
    var nutrients = nf3.results.nutrient_requirements;
    if(nutrients.length > 0){
      var totalNutrients = {
        N:  nutrients.reduce((a, b) => +a + +b.Ncf_avg, 0),
        P:  nutrients.reduce((a, b) => +a + +b.Pcf, 0),
        K:  nutrients.reduce((a, b) => +a + +b.Kcf, 0),
        S:  nutrients.reduce((a, b) => +a + +b.Scf, 0),
        N_ur :  nutrients.reduce((a, b) => +a + +b.Ncf_ure, 0),
      }
      nf3.results.total_nutrients = totalNutrients;
      _getBestFertilizers(totalNutrients);
    }
  });

  
  document.getElementById('calculateNPKrequirements').addEventListener('click', function () {
    if(nf3.forms[0].checkValidity()){
      var element =  document.getElementById('NPKresults');
      var element2 =  document.getElementById('step2');
      var element3 =  document.getElementById('stepLaunch');
      element.classList.remove("d-none");
      element2.classList.remove("d-none");
      element3.classList.remove("d-none");
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
    _loadSelectPKStrategy();
    _loadSelectTypeOfSoils();
    _loadSelectFertilizers();
    //_loadSelectFertilizerType();

  

