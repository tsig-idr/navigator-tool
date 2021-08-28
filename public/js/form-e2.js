const form = document.querySelector('form');
var states,
	regions,
	tf8_groupings,
	economic_sizes;

form.querySelector('button').addEventListener('click', () => {
	const table = form.querySelector('table');
	table.classList.add('d-none');
	form.classList.add('was-validated');
	if (!form.checkValidity()) {
		return false;
	}
	fetch('/E2/epa', {
		method: 'POST',
		body: JSON.stringify(FormDataJson.formToJson(form)),
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