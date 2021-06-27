var form = document.querySelector('form'),
	ul = document.querySelector('ul'),
	resultsDiv = form.querySelector('#results'),
	resultsIds = ['requirements', 'fertilization'],
	requirementsFields = ['Ncf', 'Pcf', 'Kcf', 'P2O5cf', 'K2Ocf'],
	fertilizationFields = ['amount', 'cost', 'N', 'N_ur', 'P', 'K', 'S'],
	fertilizersFields = ['N', 'P', 'K', 'S', 'N_ur'],
	fertilizers = {},
	applied = [];

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
			cost: form.price.value*form.amount.value,
			amount: form.amount.value
		};
	ul.appendChild(li);
	li.appendChild(b);
	li.appendChild(button);
	b.innerHTML = `${name} (${form.amount.value} kg/ha) `;
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
	const data = FormDataJson.formToJson(form, new FormDataJsonOptions({includeDisabled: true}));
	data.input.fertilizers = data.fertilizers;
	data.input.applied = applied;
	data.input.prices = csv2json(form.file);
	data.fertilizers = data.applied = data.fertilizerID = data.amount = data.price = undefined;

	fetch('/F4/requirements', {
		method: 'POST',
		body: JSON.stringify(data, (k, v) => Array.isArray(v) && v.filter(e => e !== null) || v),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => {
		resultsIds.forEach(id => {
			const tbody = window[`${id}Tbody`];
			while (tbody.lastChild) {
				tbody.removeChild(tbody.lastChild);
			}
		});
		let i, j, crop, fertilizer, tr, td, value,
			totalFertilization = {}, applied_;
		for (i = 0; i < data.results.length && (crop = data.results[i]); i++) {
			requirementsTbody.appendChild(tr = document.createElement('tr'));
			requirementsFields.forEach(field => {
				tr.appendChild(td = document.createElement('td'));
				td.innerHTML = parseFloat(crop.nutrient_requirements[field]).toFixed(2);
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
					fertilizers == applied_ &&
						tr.classList.add('table-dark');
					tr.appendChild(td = document.createElement('td'));
					td.innerHTML = fertilizer.fertilizer_name;
					fertilizationFields.forEach(field => {
						tr.appendChild(td = document.createElement('td'));
						fertilizer[field] !== undefined &&
							(td.innerHTML = (value = parseFloat(fertilizer[field])).toFixed(2))
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
				td.innerHTML = totalFertilization[field].toFixed(2);
			});
		}
		resultsDiv.classList.remove('d-none');
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'water_supply':
			form['input[dose_irrigation]'].disabled = ev.target.value == '0';
			break;
		case 'fertilizerID':
			let fertilizer;
			(fertilizer = fertilizers[ev.target.value]) &&
				(form.price.value = fertilizer.price) &&
				fertilizersFields.forEach(field => {
					fertilizer[field] !== undefined &&
						(form[field].value = fertilizer[field])
					||
						(form[field].value = 0);
				});
			fertilizersFields.forEach(field => {
				form[field].disabled = fertilizer !== undefined || !ev.target.value;
			});
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
fetch('/F3/fertilizers/all').then(res => res.json()).then(data => {
	let i, elem,
		option;
	['fertilizers', 'fertilizerID'].forEach(name => {
		for (i = 0; i < data.results.length && (elem = data.results[i]); i++) {
			option = document.createElement('option');
			option.value = elem.fertilizerID;
			option.innerHTML = elem.fertilizer_name;
			form[name].appendChild(option); 
		}
	});
	document.multiselect('#fertilizers').selectAll();
	data.results.forEach(f => {
		fertilizers[f.fertilizerID] = {
			N: f.nitrogen.Ncf,
			P: f.phosphorus.Pcf,
			K: f.potassium.Kcf,
			N_ur: f.nitrogen.Ncf_ure,
			S: f.sulphur.Scf,
			price: f.price
		};
	});
}).catch(error => {
	console.warn('Something went wrong.', error);
});
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
}).catch(error => {
	console.warn('Something went wrong.', error);
});

fetch('/csv/F4/Fertilizers.csv').then(res => res.text()).then(data => form.file = data).catch(error => {
	console.warn('Something went wrong.', error);
});

function csv2json (csv) {
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
}