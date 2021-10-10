var form = document.querySelector('form');

form.querySelector('button').addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	let data = FormDataJson.toJson(form),
		row, 
		rows;
	data = {
		input: {...data.input, ...{infrastructures: {}, forests: []}}
	};
	form.querySelectorAll('[data-field]').forEach(div => {
		if (div.classList.contains('row')) {
			!(div.dataset.field in data.input.infrastructures) &&
				(data.input.infrastructures[div.dataset.field] = []);
			data.input.infrastructures[div.dataset.field].push(row = {});
			div.querySelectorAll('input,select').forEach(node => row[node.name] = node.value);
		}
		else {
			rows = [];
			div.querySelectorAll('.row:not(.row .row)').forEach(div => {
				rows.push(row = {});
				div.querySelectorAll('input,select').forEach(node => row[node.name] = node.value);
			});
			data.input[div.dataset.field] = rows;
		}
	});
	fetch('/G1/luc', {
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
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
document.querySelectorAll('a.btn').forEach(plusA => {
	plusA.addEventListener('click', () => {
		let div = plusA.parentNode.parentNode, div_, a;
		div.parentNode.insertBefore(div_ = div.cloneNode(true), div.nextSibling);
		div_.classList.add('mt-3');
		a = div_.querySelector('a');
		a.querySelector('i').classList.add('fa-minus');
		a.addEventListener('click', () => div.parentNode.removeChild(div_));
	});
});
