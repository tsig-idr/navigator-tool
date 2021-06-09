var form = document.querySelector('form'),
	ul = document.querySelector('ul'),
	resultsDiv = form.querySelector('#results'),
	resultsIds = ['balance', 'requirements', 'fertilization'],
	balanceFields = {
		Ninputs_terms: ['Nmineralization', 'Nfixation', 'Nwater', 'NminInitial'],
		Noutputs_terms: ['Nleaching', 'Nuptake', 'Ndenitrification', 'NminPostharvest', 'Nvolatilization']
	},
	requirementsFields = ['Ncf_avg', 'Ncf_min', 'Ncf_max', 'Pcf', 'Kcf', 'P2O5cf', 'K2Ocf'],
	fertilizationFields = ['amount', 'cost', 'N', 'N_ur', 'P', 'K', 'S'],
	fertilizersFields = ['N', 'P', 'K', 'S', 'N_ur', 'type'],
	fertilizers = {},
	crops = {},
	soils = {},
	zones = {},
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
		fertilizer = {
			fertilizerID: form.fertilizerID.value,
			amount: form.amount.value,
			method: form.method.value
		};
	ul.appendChild(li);
	li.appendChild(b);
	li.appendChild(button);
	b.innerHTML = `${form.fertilizerID.querySelector(':checked').innerHTML} (${form.method.value} ${form.amount.value} kg/ha) `;
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
	const data = FormDataJson.formToJson(form);
	data.input.fertilizers = data.fertilizers;
	data.input.applied = applied;
	data.fertilizers = data.applied = data.fertilizerID = data.method = data.amount = undefined;

	fetch('/F3/requirements', {
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
			totalFertilization = {};
		for (i = 0; i < data.results.length && (crop = data.results[i]); i++) {
			balanceTbody.appendChild(tr = document.createElement('tr'));
			for (j in balanceFields) {
				balanceFields[j].forEach(field => {
					tr.appendChild(td = document.createElement('td'));
					td.innerHTML = parseFloat(crop.nutrient_requirements[j][field]).toFixed(2);
				});
			}
			requirementsTbody.appendChild(tr = document.createElement('tr'));
			requirementsFields.forEach(field => {
				tr.appendChild(td = document.createElement('td'));
				td.innerHTML = parseFloat(crop.nutrient_requirements[field]).toFixed(2);
			});
			fertilizationFields.forEach(field => totalFertilization[field] = 0);
			for (j = 0, n = crop.fertilization.length; j < n && (fertilizer = crop.fertilization[j]); j++) {
				fertilizationTbody.appendChild(tr = document.createElement('tr'));
				tr.appendChild(td = document.createElement('td'));
				td.innerHTML = fertilizer.fertilizer_name;
				fertilizationFields.forEach(field => {
					tr.appendChild(td = document.createElement('td'));
					td.innerHTML = (value = parseFloat(fertilizer[field])).toFixed(2);
					totalFertilization[field]+= value;
				});
			}
			fertilizationTbody.appendChild(tr = document.createElement('tr'));
			tr.appendChild(td = document.createElement('td'));
			td.innerHTML = 'TOTAL';
			fertilizationFields.forEach(field => {
				tr.appendChild(td = document.createElement('td'));
				td.innerHTML = totalFertilization[field].toFixed(2);
			});
		}
		resultsDiv.classList.remove('d-none');
		window.localStorage.setItem('timestamp', (new Date).toLocaleString());
		window.localStorage.setItem('crops', JSON.stringify(data.results));
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'crop':
			form['input[crop_name]'].value = crops[ev.target.value].crop_name;
			form['input[CV]'].value = crops[ev.target.value].CV;
			form['input[HI_est]'].value = crops[ev.target.value].harvest.HI_est;
			form['input[export_r]'].value = crops[ev.target.value].residues.residue_part;
			form['input[Nc_h]'].value = crops[ev.target.value].harvest.Nc_h_typn;
			form['input[Pc_h]'].value = crops[ev.target.value].harvest.Pc_h;
			form['input[Kc_h]'].value = crops[ev.target.value].harvest.Kc_h;
			break;
		case 'soil_texture':
			form['input[CEC]'].value = soils[ev.target.value].CEC;
			break;
		case 'water_supply':
			ev.target.value == '0' &&
				(form['input[type_irrigated]'].disabled = form['input[dose_irrigation]'].disabled = form['input[Nc_NO3_water]'].disabled = true)
			||
				(form['input[type_irrigated]'].disabled = form['input[dose_irrigation]'].disabled = form['input[Nc_NO3_water]'].disabled = false);
			break;
		case 'climatic_zone':
			form['input[rain_a]'].value = zones[ev.target.value].rain_a;
			form['input[rain_w]'].value = zones[ev.target.value].rain_w;
			break;
		case 'fertilizerID':
			let fertilizer;
			(fertilizer = fertilizers[ev.target.value]) &&
				(form.type.value = fertilizer.type) &&
				fertilizersFields.forEach(field => {
					fertilizer[field] !== undefined &&
						(form[field].value = fertilizer[field])
					||
						(form[field].value = 0);
				});
			fertilizersFields.forEach(field => {
				form[field].disabled = fertilizer !== undefined || !ev.target.value;
			});
			form.type.disabled = fertilizer !== undefined || !ev.target.value;
			break;
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
		data.results.forEach(f => fertilizers[f.fertilizerID] = {
			N: f.nitrogen.Ncf,
			P: f.phosphorus.Pcf,
			K: f.potassium.Kcf,
			N_ur: f.nitrogen.Ncf_ure,
			S: f.sulphur.Scf,
			type: f.clasification
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
		form['input[cropID]'].appendChild(optgroup); 
	}
	data.results.forEach(c => crops[c.cropID] = c);
	form['input[cropID]'].value = null;
}).catch(error => {
	console.warn('Something went wrong.', error);
});

fetch('/F3/climate-zones').then(res => res.json()).then(data => data.results.forEach(z => zones[z.climate_zone] = z)).catch(error => {
	console.warn('Something went wrong.', error);
});
