var form = document.querySelector('form');

form.querySelector('button').addEventListener('click', () => {
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
	}).then(res => res.json()).then(data => {
		let td;
		for (const name in data.results) {
			(td = table.querySelector(`td[name="${name}"]`)) &&
				(td.innerHTML = data.results[name]);
		}
		table.classList.remove('d-none');
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
