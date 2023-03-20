
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
				if (!project || typeof project.meta != 'object' || !project.meta.path) {
					return;
				}
				window.localStorage.setItem('farm', ev.target.result);
				window.location.pathname = project.meta.path;
			};
			reader.readAsText(ev.target.files[0]);
		});
		document.querySelector('[data-load]').addEventListener('click', () => input.click());
		document.querySelector('[data-save]').addEventListener('click', () => {
			const farm = JSON.parse(window.localStorage.getItem('farm'));
			farm.meta = {
				path: window.location.pathname,
				host: window.location.hostname,
				time: (new Date).toLocaleString(),
				version: '1.0'
			};
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
})();

var dict = null;

function translate (page) {
	const lang = (navigator.language ? navigator.language : navigator.userLanguage).split('-')[0];
	lang != 'en' &&
		fetch('/locales/'+page+'/'+lang+'.json').then(response => {
			return response.json()
		}).then(data => {
			let key;
			dict = data;
			document.querySelectorAll('*').forEach(el => {
				el.innerHTML.indexOf('<') == -1 && (key = el.innerHTML.trim()) in dict &&
					(el.innerHTML = dict[key]);
				el.placeholder && el.placeholder in dict &&
					(el.placeholder = dict[el.placeholder]);
			});
			document.querySelectorAll('[data-i18n]').forEach(el => {
				(key = el.innerHTML.trim()) in dict &&
					(el.innerHTML = dict[key]);
			});
		});
}