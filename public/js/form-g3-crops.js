var form = document.querySelector('form'),
	button = form.querySelector('button'),
	crops = window.localStorage.getItem('crops');

button.addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	fetch('/G3/crops', {
		method: 'POST',
		body: JSON.stringify(Object.assign(FormDataJson.formToJson(form)[0], crops[0])),
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
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
(button.disabled = !crops || !crops.length) &&
	(button.classList.add('d-none') || true)
||
	form.querySelector('.alert').classList.add('d-none');