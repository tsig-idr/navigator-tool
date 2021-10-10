var form = document.querySelector('form'),
	ul = document.querySelector('ul'),
	resultsDiv = form.querySelector('#results'),
	resultsIds = ['balance_input', 'balance_output', 'fertilization'],
	fertilizationFields = ['amount', 'cost', 'N', 'N_ur', 'P', 'K'],
	fertilizersFields = ['N', 'P', 'K', 'N_ur'],
	fertilizers = {},
	crops = {},
	soils = {},
	zones = {},
	applied = [],
	farm;

resultsIds.forEach(id => window[`${id}Tbody`] = form.querySelector(`#${id} tbody`));

form.querySelector('button.btn-dark').addEventListener('click', () => {
	[form.fertilizerID, form.amount].forEach(element => {
		!element.value &&
			(element.classList.add('border-danger') || true)
		||
			element.classList.remove('border-danger');
	});
	if (!form.fertilizerID.value || !form.amount.value) {
		return;
	}
	const li = document.createElement('li'),
		b = document.createElement('b'),
		button = document.createElement('button'),
		index = applied.length,
		name = form.fertilizerID.querySelector(':checked').innerHTML,
		fertilizer = {
			fertilizerID: form.fertilizerID.value,
			fertilizer_name: name,
			type: form.type.value,
			amount: form.amount.value,
			cost: form.price.value*form.amount.value,
			method: form.method.value,
			frequency: form.frequency.value
		};
	ul.appendChild(li);
	li.appendChild(b);
	li.appendChild(button);
	fertilizer.type == 'Organic' &&
		(b.innerHTML = `${name} (${form.frequency.value} ${form.method.value} ${form.amount.value} kg/ha) `)
	||
		(b.innerHTML = `${name} (${form.method.value} ${form.amount.value} kg/ha) `);
	button.className = 'btn fa fa-trash';
	button.addEventListener('click', ev => {
		ul.removeChild(ev.target.parentNode);
		applied[index] = null;
		ul.querySelectorAll('li').length == 1 &&
			ul.querySelector('.default').classList.remove('d-none');
	});
	fertilizersFields.forEach(field => {
		fertilizer[field] = form[field].value;
	});
	applied.push(fertilizer);
	ul.querySelector('.default').classList.add('d-none');
});
form.querySelector('button.btn-warning').addEventListener('click', () => {
	resultsDiv.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.toJson(form, {includeDisabled: true});
	data.input.fertilizers = data.fertilizers;
	data.input.applied = applied;
	data.input.prices = csv2json(form.file);
	data.fertilizers = data.fertilizerID = data.method = data.frequency = data.amount = data.price = data.type = undefined;
	fertilizersFields.forEach(field => {
		data[field] = undefined;
	});
	fetch('/F3/requirements?format=v', {
		method: 'POST',
		body: JSON.stringify(data, (k, v) => Array.isArray(v) && v.filter(e => e !== null) || v),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => {
		resultsIds.forEach(id => {
			const tbody = window[`${id}Tbody`];
			if (id == 'fertilization') {
				while (tbody.lastChild) {
					tbody.removeChild(tbody.lastChild);
				}
			}
			else {
				tbody.querySelectorAll('tr').forEach(tr => {
					while (tr.children.length > 1) {
						tr.removeChild(tr.lastChild);
					}
				});
			}
		});
		const cols = ['N', 'P', 'K', 'P2O5', 'K2O'];
		let i, j, k, crop, fertilizer, tr, td, value, total,
			totalFertilization = {}, applied_;
		for (i = 0; i < data.results.length && (crop = data.results[i]); i++) {
			['input', 'output'].forEach(type => {
				total = [0, 0, 0, 0, 0];
				for (j in crop.balance[type]) {
					tr = window[`balance_${type}Tbody`].querySelector(`[name=${j}]`);
					value = crop.balance[type][j];
					if (typeof value != 'object') {
						tr.appendChild(td = document.createElement('td'));
						td.innerHTML = (value = parseFloat(value)).toFixed();
						total[0]+= value;
					}
					else {
						for (k = 0; k < cols.length; k++) {
							tr.appendChild(td = document.createElement('td'));
							td.innerHTML = (value[cols[k]] = parseFloat(value[cols[k]])).toFixed();
							total[k]+= value[cols[k]]; 
						}
					}
				}
				tr = window[`balance_${type}Tbody`].querySelector('[name=total]');
				for (k = 0; k < cols.length; k++) {
					tr.appendChild(td = document.createElement('td'));
					td.innerHTML = total[k].toFixed();
				}
			});
			applied_ = [];
			applied.forEach(fertilizer => fertilizer && applied_.push({...fertilizer}));
			fertilizationFields.forEach(field => {
				totalFertilization[field] = 0;
				if (field == 'amount' || field == 'cost') {
					return;
				}
				for (j = 0, n = applied_.length; j < n; j++) {
					applied_[j] &&
						(applied_[j][field]*= applied_[j].amount/100); 
				}
			});
			[applied_, crop.fertilization].forEach(fertilizers => {
				for (j = 0, n = fertilizers.length; j < n; j++) {
					if (!(fertilizer = fertilizers[j])) {
						continue;
					}
					fertilizationTbody.appendChild(tr = document.createElement('tr'));
					tr.appendChild(td = document.createElement('td'));
					td.innerHTML = fertilizer.fertilizer_name;
					fertilizationFields.forEach(field => {
						tr.appendChild(td = document.createElement('td'));
						fertilizer[field] !== undefined &&
							(td.innerHTML = (value = parseFloat(fertilizer[field])).toFixed())
						||
							(td.innerHTML = ' - ') &&
							(value = 0);
						totalFertilization[field]+= value;
					});
				}
			});
			fertilizationTbody.appendChild(tr = document.createElement('tr'));
			tr.appendChild(td = document.createElement('td'));
			td.innerHTML = 'TOTAL';
			fertilizationFields.forEach(field => {
				tr.appendChild(td = document.createElement('td'));
				td.innerHTML = totalFertilization[field].toFixed();
			});
		}
		resultsDiv.classList.remove('d-none');
		window.localStorage.setItem('timestamp4F', (new Date).toLocaleString());
		window.localStorage.setItem('farm', JSON.stringify({
			crops: data.results
		}));
		form.querySelector('a.btn-secondary').classList.remove('disabled');
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'crop_type':
			form['input[crop_name]'].value = crops[ev.target.value].crop_name;
			form['input[HI_est]'].value = crops[ev.target.value].harvest.HI_est;
			form['input[Nc_h]'].value = crops[ev.target.value].harvest.Nc_h_typn;
			form['input[Pc_h]'].value = crops[ev.target.value].harvest.Pc_h;
			form['input[Kc_h]'].value = crops[ev.target.value].harvest.Kc_h;
			break;
		case 'soil_texture':
			form['input[CEC]'].value = soils[ev.target.value].CEC;
			break;
		case 'water_supply':
			form['input[type_irrigated]'].disabled = form['input[dose_irrigation]'].disabled = form['input[Nc_NO3_water]'].disabled = ev.target.value == '0';
			break;
		case 'climatic_zone':
			form['input[rain_a]'].value = zones[ev.target.value].rain_a;
			form['input[rain_w]'].value = zones[ev.target.value].rain_w;
			break;
		case 'fertilizerID':
			let fertilizer;
			(fertilizer = fertilizers[ev.target.value]) &&
				(form.type.value = fertilizer.type) &&
				(form.method.value = fertilizer.method) &&
				(form.price.value = fertilizer.price) &&
				fertilizersFields.forEach(field => {
					fertilizer[field] !== undefined &&
						(form[field].value = fertilizer[field].toFixed(2))
					||
						(form[field].value = 0);
				});
			fertilizersFields.forEach(field => {
				form[field].disabled = fertilizer !== undefined || !ev.target.value;
			});
			form.type.disabled = fertilizer !== undefined || !ev.target.value;
			break;
		case 'PK_strategy':
			ev.target.value == 'maintenance' &&
				(form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = true)
			||
				(form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = false);
			break;
		case 'prices':
			let file = ev.target.files[0],
				reader;
			if (!file) {
				return false;
			}
			reader = new FileReader();
			reader.onload = ev => form.file = ev.target.result;
			reader.readAsText(file);
		default:
			break;
	}
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
				K: f.potassium.Kcf,
				N_ur: f.nitrogen.Ncf_ure,
				S: f.sulphur.Scf,
				price: f.price,
				type: f.clasification,
				method: f.clasification == 'Organic' ? 'incorporated' : 'topdressing'
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
	
	let field, name;
	(farm = window.localStorage.getItem('farm')) &&
		(farm = JSON.parse(farm)).crops &&
		farm.crops.forEach(crop => {
			for (field in crop) {
				(name = `input[${field}]`) in form &&
					(form[name].value = crop[field]) && crop[field] !== '' &&
					field == 'PK_strategy' &&
						form[name].value == 'maintenance' &&
							(form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = true);
			}
		});
}).catch(error => {
	console.warn('Something went wrong.', error);
});
fetch('/F3/climate-zones').then(res => res.json()).then(data => data.results.forEach(z => zones[z.climate_zone] = z)).catch(error => {
	console.warn('Something went wrong.', error);
});
fetch('/csv/F3/Fertilizers.csv').then(res => res.text()).then(data => form.file = data).catch(error => {
	console.warn('Something went wrong.', error);
});

function csv2json (csv) {
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
}