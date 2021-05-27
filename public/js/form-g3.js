var form = document.querySelector('form'),
	uid = '';

form.querySelector('button').addEventListener('click', () => {
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

document.querySelectorAll('[type="file"]').forEach(input => {
	input.addEventListener('change', ev => {
		var file = ev.target.files[0],
			reader;
		if (!file) {
			return false;
		}
		reader = new FileReader();
		reader.onload = ev => {
			fetch(`/files/G3/${input.name}.csv?uid=${uid}`, {
				method: 'POST',
				body: JSON.stringify({
					data: ev.target.result
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(res => res.json()).then(data => {
				form['input[uid]'].value = uid = data.uid;
			}).catch(error => {
				console.warn('Something went wrong.', error);
			});
		};
		reader.readAsText(file);
	});
});
