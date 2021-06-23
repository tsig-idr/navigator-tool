const form = document.querySelector('form'),
	ul = form.querySelector('ul'),
	button = form.querySelector('button'),
	timestamp_c = window.localStorage.getItem('timestamp4G3_crops'),
	timestamp_e = window.localStorage.getItem('timestamp4G3_energy');

button.addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = FormDataJson.formToJson(form);
	data.amount = data.price = undefined;
	(data.input.crops = Object.values(data.input.crops)).forEach(crop => {
		crop.fertilization =  Object.values(crop.fertilization);
	});
	form.querySelectorAll('.d-none[data-field]').forEach(div => {
		data.input[div.dataset.field] &&
			(data.input[div.dataset.field] = Object.values(data.input[div.dataset.field]));
	});
	fetch('/E3/epa', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => {
		let td;
		for (const name in data.results) {
			(td = table.querySelector(`td[name="${name}"]`)) &&
				(td.innerHTML = data.results[name].toFixed(2));
		}
		table.classList.remove('d-none');
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
		if ('fertilization' in crop && crop.fertilization.length) {
			let names = ['fertilizerID', 'fertilizer_name', 'cost'];
			crop.fertilization.forEach((fertilizer, j) => {
				let li, input;
				ul.appendChild(li = document.createElement('li'));
				li.innerHTML = `${fertilizer.fertilizer_name}: ${fertilizer.cost.toFixed(2)} &euro;`;
				names.forEach(name => {
					li.appendChild(input = document.createElement('input'));
					input.type = 'hidden';
					input.name = `input[crops][${i}][fertilization][${j}][${name}]`;
					input.value = fertilizer[name];
				});
			});
		}
	});
farm &&
	form.querySelectorAll('.d-none[data-field]').forEach(div => {
		let names,
			input,
			div_;
		farm[div.dataset.field] &&
			(names = ['type', 'amount', 'price']) &&
			farm[div.dataset.field].forEach((row, i) => {
				if (!row.amount) {
					return;
				}
				div.parentNode.appendChild(div_ = div.cloneNode(true));
				names.forEach(name => {
					input = div_.querySelector(`[name=${name}]`);
					input.name = `input[${div.dataset.field}][${i}][${name}]`;
					input.value = row[name];
				});
				div_.classList.remove('d-none');
				div_.classList.add('mt-2');
			});
	});
(button.disabled = !timestamp_c || !timestamp_e) &&
	(button.classList.add('d-none') || true) &&
	(form.querySelectorAll('.alert-info').forEach(div => div.classList.add('d-none')) || true)
||
	(form.querySelector('.alert-info[name=crops] i').innerHTML = timestamp_c) &&
	(form.querySelector('.alert-info[name=energy] i').innerHTML = timestamp_e) &&
	form.querySelector('.alert-warning').classList.add('d-none');
