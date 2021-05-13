// ---- LEACHING
function _sendFormLeachingNR(){
    var form = document.querySelector('#formLeachingNR3');
    let json = FormDataJson.formToJson(form);
    
    fetch('/F3/leaching', {
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
      _createTableLeachingNR3Results(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
}

function _createTableLeachingNR3Results(data){

    var tblBody = document.querySelector('#tableLeachingNR3Results tbody');

    var dataRow = data.results;
    //Limpiar tabla:
    tblBody.innerHTML = '';
    var rowTotal = tblBody.insertRow(0);
    rowTotal.className = 'table-primary';
    rowTotal.insertCell(0).innerHTML = '>';
    rowTotal.insertCell(1).innerHTML = (dataRow.CN) ? dataRow.CN : '';
    rowTotal.insertCell(2).innerHTML = (dataRow.PI) ? dataRow.PI : '';
    rowTotal.insertCell(3).innerHTML = (dataRow.SI) ? dataRow.SI : '';
    rowTotal.insertCell(4).innerHTML = (dataRow.LI) ? dataRow.LI : '';
    rowTotal.insertCell(5).innerHTML = (dataRow.Nleached) ? dataRow.Nleached : '';



  }


// -- VOLATILIZATION

function _sendFormVolatilizationNR3(){
  var form = document.querySelector('#formVolatilizationNR3');
  let json = FormDataJson.formToJson(form);
  
  fetch('/F3/volatilization', {
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
    _createTableVolatilizationNR3Results(data);
  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}

function _createTableVolatilizationNR3Results(data){

  var tblBody = document.querySelector('#tableVolatilizationNR3Results tbody');

  var dataRow = data.results;
  //Limpiar tabla:
  tblBody.innerHTML = '';
  var row0 = tblBody.insertRow(0);
  //row0.className = 'table-primary';
  row0.insertCell(0).innerHTML = '>';
  row0.insertCell(1).innerHTML = (dataRow.params[0].key) ? dataRow.params[0].key : '';
  row0.insertCell(2).innerHTML = (dataRow.params[1].key) ? dataRow.params[1].key : '';
  row0.insertCell(3).innerHTML = (dataRow.params[2].key) ? dataRow.params[2].key : '';
  row0.insertCell(4).innerHTML = (dataRow.params[3].key) ? dataRow.params[3].key : '';
  row0.insertCell(5).innerHTML = (dataRow.params[4].key) ? dataRow.params[4].key : '';
  row0.insertCell(6).innerHTML = (dataRow.params[5].key) ? dataRow.params[5].key : '';
  row0.insertCell(7).innerHTML = '';
  
  var row1 = tblBody.insertRow(1);
  row1.className = 'table-primary';
  row1.insertCell(0).innerHTML = '>';
  row1.insertCell(1).innerHTML = (dataRow.params[0].value) ? dataRow.params[0].value : '';
  row1.insertCell(2).innerHTML = (dataRow.params[1].value) ? dataRow.params[1].value : '';
  row1.insertCell(3).innerHTML = (dataRow.params[2].value) ? dataRow.params[2].value : '';
  row1.insertCell(4).innerHTML = (dataRow.params[3].value) ? dataRow.params[3].value : '';
  row1.insertCell(5).innerHTML = (dataRow.params[4].value) ? dataRow.params[4].value : '';
  row1.insertCell(6).innerHTML = (dataRow.params[5].value) ? dataRow.params[5].value : '';
  row1.insertCell(7).innerHTML = dataRow.volatilizationCoefficient;


}

  function _loadSelectFertilizerType(){
    fetch('/F3/volatilization-fertilizer-types').then(function (response) {
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


// -- DESNITRIFICATION


function _sendFormDesnitrificationNR3(){
  var form = document.querySelector('#formDesnitrificationNR3');
  let json = FormDataJson.formToJson(form);
  
  fetch('/F3/desnitrification', {
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
    _createTableDesnitrificationNR3Results(data);
  }).catch(function (error) {
    console.warn('Something went wrong.', error);
  });
}



function _createTableDesnitrificationNR3Results(data){

  var tblBody = document.querySelector('#tableDesnitrificationNR3Results tbody');

  var dataRow = data.results;
  //Limpiar tabla:
  tblBody.innerHTML = '';
  var row0 = tblBody.insertRow(0);
  row0.className = 'table-primary';
  row0.insertCell(0).innerHTML = '>';
  row0.insertCell(1).innerHTML = (dataRow.case) ? dataRow.case : '';
  row0.insertCell(2).innerHTML = (dataRow.som) ? dataRow.som : '';
  row0.insertCell(3).innerHTML = (dataRow.waterSupply) ? dataRow.waterSupply : '';
  row0.insertCell(4).innerHTML = (dataRow.rateDrainage) ? dataRow.rateDrainage : '';
  row0.insertCell(5).innerHTML = (dataRow.desnitrification) ? dataRow.desnitrification : '';

}



  _loadSelectFertilizerType();




  // Eventos:


  document.getElementById('submitLeachingNR3').addEventListener('click', function () {
    var element =  document.getElementById('LeachingNR3Results');
    element.classList.remove("d-none");
    _sendFormLeachingNR();
 });

 document.getElementById('submitVolatilizationNR3').addEventListener('click', function () {
  var element =  document.getElementById('VolatilizationNR3Results');
  element.classList.remove("d-none");
  _sendFormVolatilizationNR3();
});

document.getElementById('submitDesnitrificationNR3').addEventListener('click', function () {
  var element =  document.getElementById('DesnitrificationNR3Results');
  element.classList.remove("d-none");
  _sendFormDesnitrificationNR3();
});

