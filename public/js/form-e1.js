const form = document.querySelector('form'),
	ul = form.querySelector('ul'),
	button = form.querySelector('button'),
	timestamp_c = window.localStorage.getItem('timestamp4G_crops');

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
	const setTable = (data, round) => {
		let td;
		for (const name in data.results) {
			td = table.querySelector(`td[name="${name}"]`),
			td && round &&
				(td.innerHTML = data.results[name].toFixed(2))
			||
				td &&
					(td.innerHTML = data.results[name])
		}
		table.classList.remove('d-none');
	};
	fetch('/E1/epa', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => setTable(data, true)).catch(error => {
		console.warn('Something went wrong.', error);
	});
	fetch('/E2/epa', {
		method: 'POST',
		body: JSON.stringify(FormDataJson.formToJson(form)),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => {
		setTable(data);
		table.querySelectorAll(`td[data-value]`).forEach(td => {
			let val = table.querySelector(`td[name="${td.dataset.value}"]`).innerHTML,
				avg = table.querySelector(`td[name="${td.dataset.avg}"]`).innerHTML;
			val = (val - avg)/avg*100;
			td.innerHTML = (val > 0 ? '+' : '') + val.toFixed(2) + '%';
		});
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
(button.disabled = !timestamp_c) &&
	(button.classList.add('d-none') || true) &&
	(form.querySelectorAll('.alert-info').forEach(div => div.classList.add('d-none')) || true)
||
	(form.querySelector('.alert-info[name=crops] i').innerHTML = timestamp_c) &&
	form.querySelector('.alert-warning').classList.add('d-none');

var states,
	regions,
	tf8_groupings,
	economic_sizes;

const addOptions2select = (options, select) => {
	!Array.isArray(options) &&
		(options = Object.keys(options));
	options.forEach(value => {
		const option = document.createElement('option');
		option.value = option.innerHTML = value;
		select.appendChild(option);
	});
	select.value = null;
};
form.addEventListener('change', ev => {
	if (!ev.target.dataset.next) {
		return;
	}
	let options = window[`${ev.target.dataset.next}s`] = window[`${ev.target.id}s`][ev.target.value];	
	const select = form[`input[${ev.target.dataset.next}]`];
	while (select.firstChild) {
		select.removeChild(select.lastChild);
	}
	addOptions2select(options, select);
});
fetch('/json/FADN.json').then(res => res.json()).then(data => addOptions2select(states = data, form.querySelector('#state'))).catch(error => {
	console.warn('Something went wrong.', error);
});