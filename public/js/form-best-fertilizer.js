var urlService = '/fertilizers/best';

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

       if(!Array.isArray(data))
        data = new Array(data);
        
      _createTableBestFertilizerResults(data);
    }).catch(function (error) {
      console.warn('Something went wrong.', error);
    });
}

function _createTableBestFertilizerResults(data){

    var tblBody = document.querySelector('#tableBestFertilizerResults tbody');

    //Limpiar tabla:
    tblBody.innerHTML = '';

    // cells creation
    for (var j = 0; j < data.length; j++) {
      var dataRow = data[j];
      // table row creation
      var row = tblBody.insertRow(j);
      var name=  '<span title="' +  dataRow.name + '">' +  dataRow.name + '</span>';
      row.insertCell(0).innerHTML = j +1;
      row.insertCell(1).innerHTML = name;
      row.insertCell(2).innerHTML = dataRow.N_nitr;
      row.insertCell(3).innerHTML = (dataRow.N_ammon) ? dataRow.N_ammon : '';
      row.insertCell(4).innerHTML = dataRow.N_total;
      row.insertCell(5).innerHTML = dataRow.P_total;
      row.insertCell(6).innerHTML = (dataRow.P2O5_total) ? dataRow.P2O5_total : '';
      row.insertCell(7).innerHTML = dataRow.K_total;
      row.insertCell(8).innerHTML = (dataRow.K2O_total) ? dataRow.K2O_total : '';
      row.insertCell(9).innerHTML = dataRow.price;
      row.insertCell(10).innerHTML = dataRow.cost;
    }
  }

  // Eventos:


  document.getElementById('submitBestFertilizer').addEventListener('click', function () {
     var element =  document.getElementById('BestFertilizerResults');
     element.classList.remove("d-none");
    _sendForm();
  });