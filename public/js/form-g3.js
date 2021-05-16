var form = (form = document.querySelector('form')),
	uid = '';

form.querySelector('button').addEventListener('click', function () {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	fetch('/G3/livestock', {
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
		let parts, 
			td;
		for (const name in data.results) {
			parts = name.split('from');
			(td = table.querySelector(`tr[name="${parts[1]}"]>td[name="${parts[0]}"]`)) &&
				(td.innerHTML = data.results[name]);
		}
		table.classList.remove('d-none');
	}).catch(function (error) {
		console.warn('Something went wrong.', error);
	});
});

document.querySelectorAll('[type="file"]').forEach(function (input) {
	input.addEventListener('change', function (ev) {
		var file = ev.target.files[0],
			reader;
		if (!file) {
			return false;
		}
		reader = new FileReader();
		reader.onload = function (ev) {
			fetch(`/files/G3/${input.name}.csv?uid=${uid}`, {
				method: 'POST',
				body: JSON.stringify({
					data: ev.target.result
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			}).then(function (data) {
				form['input[uid]'].value = uid = data.uid;
			}).catch(function (error) {
				console.warn('Something went wrong.', error);
			});
		};
		reader.readAsText(file);
	});
});
