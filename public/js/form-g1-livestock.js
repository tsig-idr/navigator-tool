var form = document.querySelector('form');

form.files = {};
form.querySelector('button').addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	table.parentNode.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.toJson(form);
	for (const name in form.files) {
		data.input[name] = csv2json(form.files[name]);
	}
	fetch('/G1/livestock', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => {
		let parts, 
			td;
		for (const name in data.results) {
			parts = name.split('from');
			(td = table.querySelector(`tr[name="${parts[1]}"]>td[name="${parts[0]}"]`)) &&
				(td.innerHTML = data.results[name] && data.results[name].toFixed(2));
		}
		table.classList.remove('d-none');
		table.parentNode.classList.remove('d-none');
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
document.querySelectorAll('[type="file"]').forEach(input => {
	input.addEventListener('change', ev => {
		var file = ev.target.files[0],
			reader;
		if (!file) {
			return false;
		}
		reader = new FileReader();
		reader.onload = ev => form.files[input.name] = ev.target.result;
		reader.readAsText(file);
	});
});

function csv2json (csv) {
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
}