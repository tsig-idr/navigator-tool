var form = document.querySelector('form'),
	resultsDiv = form.querySelector('#results'),
	resultsIds = ['balance', 'requirements', 'fertilization'],
	balanceFields = {
		Ninputs_terms: ['Nmineralization', 'Nfixation', 'Nwater', 'NminInitial'],
		Noutputs_terms: ['Nleaching', 'Nuptake', 'Ndenitrification', 'NminPostharvest', 'Nvolatilization']
	},
	requirementsFields = ['Ncf_avg', 'Ncf_min', 'Ncf_max', 'Pcf', 'Kcf', 'P2O5cf', 'K2Ocf'],
	fertilizationFields = ['amount', 'cost', 'N', 'N_ur', 'P', 'K', 'S'],
	crops = {},
	soils = {},
	zones = {};

resultsIds.forEach(id => window[`${id}Tbody`] = form.querySelector(`#${id} tbody`));

form.querySelector('button').addEventListener('click', () => {
	resultsDiv.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.formToJson(form);
	data.input.fertilizers = data.fertilizers;
	fetch('/F3/requirements', {
		method: 'POST',
		body: JSON.stringify(data),
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
		default:
			break;
	}
});
[
	{
		name: 'input[soil_texture]',
		route: '/F3/soil-textures',
		value: 'soil_texture',
		text: 'name' 
	}, {
		name: 'fertilizers',
		route: '/F3/fertilizers/all',
		value: 'fertilizerID',
		text: 'fertilizer_name' 
	}
].forEach(obj => fetch(obj.route).then(res => res.json()).then(data => {
	let option, i, elem;
	for (i = 0; i < data.results.length && (elem = data.results[i]); i++) {
		option = document.createElement('option');
		option.value = elem[obj.value];
		option.innerHTML = elem[obj.text];
		form[obj.name].appendChild(option); 
	}
	if (obj.name == 'fertilizers') {
		document.multiselect('#fertilizers').selectAll();
	}
	else {
		data.results.forEach(s => soils[s.soil_texture] = s);
		form['input[soil_texture]'].value = null;
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
