
  var urlService = '/F3/navigator-f3-npk';

  function _refreshListCrops(tblBody){
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

  function _createTableNPKrequirementsResults(data){

    var tblBody = document.querySelector('#tableNPKrequirements tbody');

    //Limpiar tabla:
    tblBody.innerHTML = '';

    // cells creation
    for (var j = 0; j < data.results.length; j++) {
      var dataRow = data.results[j];
      // table row creation
      var row = tblBody.insertRow(j);
      var cropname=  '<span title="' +  dataRow.cropID + '">' +  dataRow.crop_latin_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.crop_name;
      row.insertCell(3).innerHTML = dataRow.Ncf_min.toFixed(3);
      row.insertCell(4).innerHTML = dataRow.Ncf_max.toFixed(3);
      row.insertCell(5).innerHTML = dataRow.Ncf_avg.toFixed(3);
      row.insertCell(6).innerHTML = dataRow.Pcf.toFixed(3);
      row.insertCell(7).innerHTML = dataRow.Kcf.toFixed(3);
      row.insertCell(8).innerHTML = dataRow.P205cf.toFixed(3);
      row.insertCell(9).innerHTML = dataRow.K2Ocf.toFixed(3);
    }
  }

  function _addCrop() {

    var tblBody = document.querySelector('#tableNPKCrops tbody');
    var tblRow = document.querySelectorAll('tbody .trow')[0];
    var tblRowCell = tblRow.cloneNode(true); // Clonar fila


    var btn = document.createElement("button");
    btn.classList.add('btn', 'btn-primary', 'btn-sm');
    btn.innerHTML = '<i class="fa fa-trash"></i>';
    btn.addEventListener('click', deleteCrop);

    tblRowCell.cells[1].appendChild(btn);

    tblBody.appendChild(tblRowCell);

    _refreshListCrops(tblBody);
  }

  function deleteCrop(event){
    var target = event.target;
    var tblTr = target.closest('tr');//parent of "target"
    target.removeEventListener("click", deleteCrop); 
    tblTr.remove();

  }

  function onChangeCrop(selectObject){

    fetch('/F3/crop/' + selectObject.value).then(function (response) {
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


  function _sendForm(){
    var form = document.querySelector('#formFertilicalc');
    let json = FormDataJson.formToJson(form);
    let result = Object.entries(json.crops).map(( [k, v] ) => (v) );
    const crops = result.filter(v => v.cropID);
    json.crops = crops;


    fetch(urlService, {
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
      _createTableNPKrequirementsResults(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }
  
  function _loadSelectCrops(){
    fetch('/F3/crops').then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(function (data) {
      
      var combo = document.getElementsByName("crops[0][cropID]")[0];

      for(var i=0; i<data.results.length; i++){
        var elem = data.results[i];
        var option = document.createElement("option");
        option.appendChild( document.createTextNode(elem.crop_name) );
        // set value property of opt
        option.value = elem.cropID; 
        combo.appendChild(option); 
      }

    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
  }
 
  // Eventos:
  document.getElementById('addMoreCrops').addEventListener('click', function () {
    _addCrop();
  });

  document.getElementById('submitFertilicalc').addEventListener('click', function () {
     var element =  document.getElementById('NPKresults');
     element.classList.remove("d-none");
    _sendForm();
  });

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      var elem = document.getElementById('submitFertilicalc');
      elem.addEventListener('click', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    _loadSelectCrops();

  

