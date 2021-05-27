var form = document.querySelector('form'),
	crops = {}, 
	zones = {};

form.querySelector('button').addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
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
		let td;
		for (const name in data.results) {
			(td = table.querySelector(`td[name="${name}"]`)) &&
				(td.innerHTML = data.results[name]);
		}
		table.classList.remove('d-none');
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'crop':
			form['input[CV]'].value = crops[ev.target.value].CV;
			form['input[HI_est]'].value = crops[ev.target.value].harvest.HI_est;
			form['input[export_r]'].value = crops[ev.target.value].residues.residue_part;
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
	},
	{
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
	obj.name == 'fertilizers' &&
		document.multiselect('#fertilizers').selectAll();
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
}).catch(error => {
	console.warn('Something went wrong.', error);
});

fetch('/F3/climate-zones').then(res => res.json()).then(data => data.results.forEach(z => zones[z.climate_zone] = z)).catch(error => {
	console.warn('Something went wrong.', error);
});
