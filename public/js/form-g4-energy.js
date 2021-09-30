var form = document.querySelector('form');

form.querySelector('button').addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	const data = {
		input: {}
	};
	let rows, row,
		farm;
	form.querySelectorAll('[data-field]').forEach(div => {
		rows = [];
		div.querySelectorAll('.row').forEach(div => {
			rows.push(row = {});
			div.querySelectorAll('input,select').forEach(node => row[node.name] = node.value);
		});
		data.input[div.dataset.field] = rows;
	});
	(farm = window.localStorage.getItem('farm')) &&
		(farm = { ...JSON.parse(farm), ...data.input})
	||
		(farm = data.input);

	fetch('/G4/energy', {
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
		window.localStorage.setItem('timestamp4G_energy', (new Date).toLocaleString());
		window.localStorage.setItem('farm', JSON.stringify(farm));
	}).catch(error => {
		console.warn('Something went wrong.', error);
	});
});
document.querySelectorAll('a.btn').forEach(plusA => {
	plusA.addEventListener('click', () => {
		let div = plusA.parentNode.parentNode, a;
		div.parentNode.appendChild(div = div.cloneNode(true));
		div.classList.add('mt-3');
		a = div.querySelector('a');
		a.querySelector('i').classList.add('fa-minus');
		a.addEventListener('click', () => div.parentNode.removeChild(div));
	});
});
