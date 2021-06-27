const form = document.querySelector('form'),
	ul = form.querySelector('ul'),
	button = form.querySelector('button'),
	timestamp = window.localStorage.getItem('timestamp4F3');

button.addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.formToJson(form);
	let fcrop;
	(data.input.crops = Object.values(data.input.crops)).forEach(crop => {
		(fcrop = farm.crops.find(c => c.cropID == crop.cropID)) &&
			(crop.fertilization = fcrop.fertilization) &&
			(crop.nutrient_requirements = fcrop.nutrient_requirements) &&
			(crop.dose_irrigation = fcrop.dose_irrigation);
	});
	farm = {...farm, ...data.input};

	fetch('/G3/crops', {
		method: 'POST',
		body: JSON.stringify(data),
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
		window.localStorage.setItem('timestamp4G3_crops', (new Date).toLocaleString());
		window.localStorage.setItem('farm', JSON.stringify(farm));
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
var farm, field, name;

(farm = window.localStorage.getItem('farm')) &&
	(farm = JSON.parse(farm)).crops &&
	farm.crops.forEach((crop, i) => {
		for (field in crop) {
			(name = `input[crops][${i}][${field}]`) in form &&
				(form[name].value = crop[field]);
		}
		'nutrient_requirements' in crop && 'Noutputs_terms' in crop.nutrient_requirements &&
			['Nleaching', 'Nvolatilization'].forEach(name => {
				name in crop.nutrient_requirements.Noutputs_terms &&
					(form[`input[crops][${i}][nutrient_requirements][Noutputs_terms][${name}]`].value = crop.nutrient_requirements.Noutputs_terms[name]);
			});
		if ('fertilization' in crop && crop.fertilization.length) {
			let li;
			crop.fertilization.forEach((fertilizer, j) => {
				ul.appendChild(li = document.createElement('li'));
				li.innerHTML = `${fertilizer.fertilizer_name}: ${fertilizer.amount.toFixed(2)} kg/ha`;
			});
		}
	});
(button.disabled = !timestamp) &&
	(button.classList.add('d-none') || true) &&
	(form.querySelector('.alert-info').classList.add('d-none') || true)
||
	(form.querySelector('.alert-info i').innerHTML = timestamp) &&
	form.querySelector('.alert-warning').classList.add('d-none');