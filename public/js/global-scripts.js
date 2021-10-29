// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict'

	fetch('/navbar.html').then(response => {
		return response.text()
	}).then(data => {
		document.querySelector('navbar').innerHTML = data;
		const input = document.querySelector('[type=file].d-none'),
			saveA = document.querySelector('[data-save]');
		input.addEventListener('change', ev => {
			if (!ev.target.files[0]) {
				return false;
			}
			const reader = new FileReader();
			reader.onload = ev => {
				const project = JSON.parse(ev.target.result);
				if (!project || !project.path) {
					return;
				}
				window.localStorage.setItem('farm', ev.target.result);
				window.location.pathname = project.path;
			};
			reader.readAsText(ev.target.files[0]);
		});
		document.querySelector('[data-load]').addEventListener('click', () => input.click());
		document.querySelector('[data-save]').addEventListener('click', () => {
			const farm = JSON.parse(window.localStorage.getItem('farm'));
			farm.path = window.location.pathname;
			const url = URL.createObjectURL(new Blob([JSON.stringify(farm)], {
				type: 'application/json'
			}));
			let a;
			document.body.appendChild(a = document.createElement('a'));
			a.href = url;
			a.download = 'myFarm.json';
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		});
		document.querySelectorAll('input,select').forEach(input => {
			input.addEventListener('change', () => {
				saveA.classList.add('disabled');
				saveA.classList.remove('active');
			});
		});
	});
	fetch('/footer.html').then(response => {
		return response.text()
	}).then(data => {
		document.querySelector('footer').innerHTML = data;
	});
})()