var form = document.querySelector('form'),
	tables = form.querySelectorAll('table'),
	uid = '';

form.querySelectorAll('button').forEach(button => {
	button.addEventListener('click', ev => {
		const table = form.querySelector(`table[name="${ev.target.name}"]`);
		tables.forEach(table => {
			table.classList.add('d-none');
		});
		form.classList.add('was-validated');
		if (!form.checkValidity()) {
			return false;
		}
		ev.target.name &&
			fetch(`/F1/${ev.target.name}`, {
				method: 'POST',
				body: JSON.stringify(FormDataJson.formToJson(form)),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(res => res.json()).then(data => {
				let tr, td, tbody,
					i, name;
				switch (ev.target.name) {
					case 'SWB':
					case 'SNB/weekly':
						const tr_tmpl = table.querySelector('tr[name="template"]');
						table.removeChild(table.querySelector('tbody'));
						table.appendChild(tbody = document.createElement('tbody'));
						tbody.appendChild(tr_tmpl);
						for (i = 0; i < data.results.length; i++) {
							tr = tr_tmpl.cloneNode(true);
							for (name in data.results[i]) {
								(td = tr.querySelector(`td[name="${name}"]`)) &&
									(td.innerHTML = 
										(name == 'Fecha' || name == 'Sem') && 
											data.results[i][name]
										||
											parseFloat(data.results[i][name]).toFixed(2));
							}
							tbody.appendChild(tr);
						}
						break;
					case 'SNB/calendar':
						let parts;
						for (name in data.results) {
							parts = name.split('_');
							(td = table.querySelector(`tr[name="${parts[0]}"]>td[name="${parts.slice(1).join('_')}"]`)) &&
								(td.innerHTML = parseFloat(data.results[name]).toFixed(2));
						}
						break;
					default:
						break;
				}
				table.classList.remove('d-none');
			}).catch(error => {
				console.warn('Something went wrong.', error);
			});
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
			fetch(`/files/F1/${input.name}.csv?uid=${uid}`, {
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
