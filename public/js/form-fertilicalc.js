



  var urlService = '/nutrients/fertilicalc-npk';


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
      var cropname=  '<span title="' +  dataRow.crop + '">' +  dataRow.crop_latin_name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = cropname;
      row.insertCell(2).innerHTML = dataRow.crop_name;
      row.insertCell(3).innerHTML = dataRow.n_fert_min.toFixed(3);
      row.insertCell(4).innerHTML = dataRow.n_fert_max.toFixed(3);
      row.insertCell(5).innerHTML = dataRow.n_fert_avg.toFixed(3);
      row.insertCell(6).innerHTML = dataRow.p_fert.toFixed(3);
      row.insertCell(7).innerHTML = dataRow.k_fert.toFixed(3);
      row.insertCell(8).innerHTML = dataRow.p_fert_oxide.toFixed(3);
      row.insertCell(9).innerHTML = dataRow.k_fert_oxide.toFixed(3);
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


  function _sendForm(){
    var form = document.querySelector('#formFertilicalc');
    let json = FormDataJson.formToJson(form);
    let result = Object.entries(json.crops).map(( [k, v] ) => (v) );
    const crops = result.filter(v => v.crop);
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
  
 
  // Eventos:
  document.getElementById('addMoreCrops').addEventListener('click', function () {
    _addCrop();
  });

  document.getElementById('submitFertilicalc').addEventListener('click', function () {
     var element =  document.getElementById('NPKresults');
     element.classList.remove("d-none");
    _sendForm();
  });

  

