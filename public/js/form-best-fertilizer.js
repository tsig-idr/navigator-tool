var urlService = '/fertilizers/optimization';

function _sendForm(){
    var form = document.querySelector('#formBestFertilizer');
    let json = FormDataJson.formToJson(form);
    
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
      //if(!Array.isArray(data))
      // data = new Array(data);
      _createTableBestFertilizerResults(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
}

function _createTableBestFertilizerResults(data){

    var tblBody = document.querySelector('#tableBestFertilizerResults tbody');

    var results = data.results;
    //Limpiar tabla:
    tblBody.innerHTML = '';

    // cells creation
    for (var j = 0; j < results.length; j++) {
      var dataRow = results[j];
      // table row creation
      var row = tblBody.insertRow(j);
      var name=  '<span title="' +  dataRow.name + '">' +  dataRow.name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = name;
      row.insertCell(2).innerHTML = dataRow.amount;
      row.insertCell(3).innerHTML = (dataRow.N) ? dataRow.N : '';
      row.insertCell(4).innerHTML = (dataRow.P) ? dataRow.P : '';
      row.insertCell(5).innerHTML = (dataRow.K) ? dataRow.K : '';
      row.insertCell(6).innerHTML = (dataRow.S) ? dataRow.S : '';
      row.insertCell(7).innerHTML = (dataRow.N_ur) ? dataRow.N_ur : '';
      row.insertCell(8).innerHTML = dataRow.cost;
    }

    var dataTotal = data.total;
    var rowTotal = tblBody.insertRow(results.length);
    rowTotal.className = 'table-primary';
    rowTotal.insertCell(0).innerHTML = '>';
    rowTotal.insertCell(1).innerHTML = 'TOTAL:';
    rowTotal.insertCell(2).innerHTML = dataTotal.amount;
    rowTotal.insertCell(3).innerHTML = (dataTotal.N) ? dataTotal.N : '';
    rowTotal.insertCell(4).innerHTML = (dataTotal.P) ? dataTotal.P : '';
    rowTotal.insertCell(5).innerHTML = (dataTotal.K) ? dataTotal.K : '';
    rowTotal.insertCell(6).innerHTML = (dataTotal.S) ? dataTotal.S : '';
    rowTotal.insertCell(7).innerHTML = (dataTotal.N_ur) ? dataTotal.N_ur : '';
    rowTotal.insertCell(8).innerHTML = dataTotal.cost;



  }

  // Eventos:


  document.getElementById('submitBestFertilizer').addEventListener('click', function () {
     var element =  document.getElementById('BestFertilizerResults');
     element.classList.remove("d-none");
    _sendForm();
  });