const form = document.querySelector('form'),
	ul = form.querySelector('ul'),
	button = form.querySelector('button'),
	timestamp = window.localStorage.getItem('timestamp4F');

button.addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.toJson(form);
	data.input.crops = Object.values(data.input.crops);
	let fcrop, i;
	for (i = 0; i < data.input.crops.length; i++) {
		(fcrop = farm.crops.find(c => c.crop_type == data.input.crops[i].crop_type)) &&
			(data.input.crops[i] = {...fcrop, ...data.input.crops[i]});
	}
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
				(td.innerHTML = data.results[name] && data.results[name].toFixed());
		}
		table.classList.remove('d-none');
		window.localStorage.setItem('timestamp4G_crops', (new Date).toLocaleString());
		window.localStorage.setItem('farm', JSON.stringify(farm));
		form.querySelectorAll('a.btn-secondary').forEach(a => a.classList.remove('disabled'));
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
var farm, field, name;

(farm = window.localStorage.getItem('farm')) &&
	(farm = JSON.parse(farm)).crops &&
	farm.crops.forEach((crop, i) => {
		for (field in crop) {
			(name = `input[crops][${i}][${field}]`) in form && crop[field] !== '' &&
				(form[name].value = crop[field]);
		}
		'balance' in crop && 'output' in crop.balance &&
			['Nleaching', 'Nvolatilization'].forEach(name => {
				name in crop.balance.output &&
					(form[`input[crops][${i}][balance][output][${name}]`].value = parseFloat(crop.balance.output[name]).toFixed(2));
			});
		['fertilization', 'applied'].forEach(name => {
			if (name in crop && crop[name].length) {
				let li;
				crop[name].forEach(fertilizer => {
					ul.appendChild(li = document.createElement('li'));
					li.innerHTML = `${fertilizer.fertilizer_name}: ${parseFloat(fertilizer.amount).toFixed()} kg/ha`;
				});
			}
		});
	});
(button.disabled = !timestamp) &&
	(button.classList.add('d-none') || true) &&
	(form.querySelector('.alert-info').classList.add('d-none') || true)
||
	(form.querySelector('.alert-info i').innerHTML = timestamp) &&
	form.querySelector('.alert-warning').classList.add('d-none');