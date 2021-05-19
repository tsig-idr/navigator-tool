var form = document.querySelector('form');

form.querySelector('button').addEventListener('click', function () {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	fetch('/E3/epa', {
		method: 'POST',
		body: JSON.stringify(FormDataJson.formToJson(form)),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(response);
	}).then(function (data) {
		let td;
		for (const name in data.results) {
			(td = table.querySelector(`td[name="${name}"]`)) &&
				(td.innerHTML = data.results[name]);
		}
		table.classList.remove('d-none');
	}).catch(function (error) {
		console.warn('Something went wrong.', error);
	});
});
