var form = document.querySelector('form'),
	ul = document.querySelector('ul.list-unstyled'),
	tables = form.querySelectorAll('table'),
	fertilizers = {},
	crops = {},
	soils = {},
	applications = [];

form.files = {};
form.querySelectorAll('button[name]').forEach(button => {
	button.addEventListener('click', ev => {
		const table = form.querySelector(`table[name="${ev.target.name}"]`);
		tables.forEach(table => {
			table.classList.add('d-none');
		});
		form.classList.add('was-validated');
		if (!form.checkValidity()) {
			return false;
		}
		const data = FormDataJson.formToJson(form, new FormDataJsonOptions({includeDisabled: true})),
			element = ev.target.querySelector('i');
		element.classList.remove('fa-play');
		element.classList.add('fa-spinner');
		element.classList.add('fa-spin');
		data.input.fertilizers = data.fertilizers;
		data.input.applications = applications;
		data.fertilizers = data.fertilizerID = data.amount = data.date = data.N = data.P = data.K = undefined;
		for (const name in form.files) {
			data.input[name] = csv2json(form.files[name]);
		}
		ev.target.name &&
			fetch(`/F2/${ev.target.name}`, {
				method: 'POST',
				body: JSON.stringify(data, (k, v) => Array.isArray(v) && v.filter(e => e !== null) || v),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(res => res.json()).then(data => {
				let tr, td, tbody,
					i, name;
				switch (ev.target.name) {
					case 'SWB':
					case 'SNB/daily':
					case 'SNB/calendar':
						const tr_tmpl = table.querySelector('tr[name="template"]');
						table.removeChild(table.querySelector('tbody'));
						table.appendChild(tbody = document.createElement('tbody'));
						tbody.appendChild(tr_tmpl);
						for (i = 0; i < data.results.length; i++) {
							tr = tr_tmpl.cloneNode(true);
							for (name in data.results[i]) {
								(td = tr.querySelector(`td[name="${name}"]`)) &&
									(td.innerHTML = 
										(name == 'Fecha' || name == 'date' || name == 'fertilizer_name' || name == 'method') && 
											data.results[i][name]
										||
											data.results[i][name] && 
											parseFloat(data.results[i][name]).toFixed(ev.target.name == 'SNB/calendar' ? 0 : 2));
							}
							tbody.appendChild(tr);
						}
						break;
					default:
						break;
				}
				table.classList.remove('d-none');
				element.classList.remove('fa-spin');
				element.classList.remove('fa-spinner');
				element.classList.add('fa-play');
			}).catch(error => {
				console.warn('Something went wrong.', error);
			});
	});
});
form.querySelector('button.btn-dark').addEventListener('click', () => {
	[form.fertilizerID, form.date].forEach(element => {
		!element.value &&
			(element.classList.add('border-danger') || true)
		||
			element.classList.remove('border-danger');
	});
	if (!form.fertilizerID.value || !form.date.value) {
		return;
	}
	const li = document.createElement('li'),
		b = document.createElement('b'),
		button = document.createElement('button'),
		index = applications.length,
		name = form.fertilizerID.querySelector(':checked').innerHTML,
		fertilizer = {
			type: form.fertilizerID.value,
			date: form.date.value,
			amount: form.amount.value,
			name: name,
		};
	ul.appendChild(li);
	li.appendChild(b);
	li.appendChild(button);
	b.innerHTML = `${form.date.value} <b>&rarr;</b> ${name} (${fertilizer.amount ? fertilizer.amount+' kg/ha' : 'optimized amount'}) `;
	button.className = 'btn fa fa-remove text-danger';
	button.addEventListener('click', ev => {
		ul.removeChild(ev.target.parentNode);
		applications[index] = null;
		ul.querySelectorAll('li').length == 1 &&
			ul.querySelector('.default').classList.remove('d-none');
	});
	['N', 'P', 'K'].forEach(field => {
		fertilizer[field] = form[field].value;
	});
	applications.push(fertilizer);
	ul.querySelector('.default').classList.add('d-none');
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'crop_type':
			form['input[HI_est]'].value = crops[ev.target.value].harvest.HI_est;
			form['input[Nc_h]'].value = crops[ev.target.value].harvest.Nc_h_typn;
			form['input[Pc_h]'].value = crops[ev.target.value].harvest.Pc_h;
			form['input[Kc_h]'].value = crops[ev.target.value].harvest.Kc_h;
			break;
		case 'soil_texture':
			form['input[CEC]'].value = soils[ev.target.value].CEC;
			break;
		case 'dose_irrigation':
			form['input[waterNitrate]'].disabled = !ev.target.value || ev.target.value == '0';
			break;
		case 'fertilizerID':
			let fertilizer;
			form.amount.disabled = false;
			(fertilizer = fertilizers[ev.target.value]) &&
				(['N', 'P', 'K'].forEach(field => {
					fertilizer[field] !== undefined &&
						(form[field].value = fertilizer[field].toFixed(2))
					||
						(form[field].value = 0);
				}) || true)
			||
				(form.amount.disabled = true) &&
				((form.amount.value = null) || true) &&
				['N', 'P', 'K'].forEach(field => {
					form[field].value = null;
				});
			break;
		case 'PK_strategy':
			ev.target.value == 'maintenance' &&
				(form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = true)
			||
				(form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = false);
			break;
		default:
			break;
	}
});
form.querySelectorAll('[type="file"]').forEach(input => {
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
[
	{
		names: ['input[soil_texture]'],
		route: '/F3/soil-textures',
		value: 'soil_texture',
		text: 'name' 
	}, {
		names: ['fertilizers', 'fertilizerID'],
		route: '/F3/fertilizers/all',
		value: 'fertilizerID',
		text: 'fertilizer_name' 
	}
].forEach(obj => fetch(obj.route).then(res => res.json()).then(data => {
	let option, i, elem;
	obj.names.forEach(name => {
		for (i = 0; i < data.results.length && (elem = data.results[i]); i++) {
			option = document.createElement('option');
			option.value = elem[obj.value];
			option.innerHTML = elem[obj.text];
			form[name].appendChild(option); 
		}
	});
	if (obj.value == 'fertilizerID') {
		data.results.forEach(f => {
			fertilizers[f.fertilizerID] = {
				N: f.nitrogen.Ncf,
				P: f.phosphorus.Pcf,
				K: f.potassium.Kcf
			};
		});
		document.multiselect('#fertilizers').selectAll();
	}
	else {
		data.results.forEach(s => soils[s.soil_texture] = s);
		form[obj.names[0]].value = null;
	}
}).catch(error => {
	console.warn('Something went wrong.', error);
}));
fetch('/F3/crops').then(res => res.json()).then(data => {
	const groups = data.results.reduce((cs, c) => {
		!(c.group in cs) &&
			(cs[c.group] = []);
		cs[c.group].push(c);
		return cs;
	}, {});
	for (type in groups) {
		let optgroup = document.createElement('optgroup'), 
			option, i, crop;
		optgroup.setAttribute('label', type);
		for (i = 0; i < groups[type].length && (crop = groups[type][i]); i++) {
			option = document.createElement('option');
			option.value = crop.cropID;
			option.innerHTML = crop.crop_name;
			optgroup.appendChild(option); 
		}
		form['input[crop_type]'].appendChild(optgroup); 
	}
	form['input[crop_type]'].value = null;
	data.results.forEach(c => crops[c.cropID] = c);
}).catch(error => {
	console.warn('Something went wrong.', error);
});
fetch('/csv/F2/Fertilizers.csv').then(res => res.text()).then(data => form.files.prices = data).catch(error => {
	console.warn('Something went wrong.', error);
});

function csv2json (csv) {
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
}