// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    fetch("/global/navbar.html")
      .then(response => {
        return response.text()
      })
      .then(data => {
        document.querySelector("navbar").innerHTML = data;
      });
    
    fetch("/global/footer.html")
      .then(response => {
        return response.text()
      })
      .then(data => {
        document.querySelector("footer").innerHTML = data;
      });
  
  
  })()