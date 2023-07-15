
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict'

	document.querySelector('html').setAttribute('translate', 'no');

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
				if (!project) {
					return;
				}
				if (input.name == 'fast') {
					if (typeof project.meta != 'object' || !project.meta.path) {
						return;
					}
					window.localStorage.setItem('farm', ev.target.result);
					window.location.pathname = project.meta.path;
				}
				if (input.name == 'siar') {
					if (typeof project.localizacion != 'object') {
						return;
					}
					let farm;
					project = harmonize4SIAR(project);
					(farm = window.localStorage.getItem('farm')) &&
						(farm = JSON.parse(farm)) &&
						(farm = {...farm.crops[0], ...project.crops[0]})
					||
						(farm = project);
					window.localStorage.setItem('farm', farm);
					typeof setFarm == 'function' &&
						setFarm(farm);
				}
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
		fetch('/locales/'+page+'/'+lang+'.json?t='+(new Date).getTime()).then(response => {
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

function crop4FaST (siar_crop) {
	if (siar_crop.startsWith('Maíz dulce')) {
		return 'SWEET_CORN_DRY';
	}
	switch (siar_crop.split(' ')[0]) {
		case 'Ajo':
			return 'GARLIC';
		case 'Alfalfa':
			return 'ALFALFA_GREEN_FLOWERING';
		case 'Almendro':
			return 'ALMOND';
		case 'Avena':
			return 'OAT';
		case 'Cebada':
			return 'BARLEY_6_ROW';
		case 'Cebolla':
			return 'ONION';
		case 'Maíz':
			return 'CORN_GRAIN';
		case 'Olivo':
			return 'OLIVE';
		case 'Patata':
			return 'POTATO';
		case 'Pistacho':
			return 'HORTICULTURAL_CROPS';
		case 'Trigo':
			return 'WHEAT_BREAD_SOFT';
		case 'Vid':
			return 'GRAPE_WINE';
		default:
			return 'HORTICULTURAL_CROPS';
	}
};

function harmonize4SIAR (project) {
	crops = [{}];
	if (typeof project.suelo == 'object') {
		project.suelo.textura &&
			(crops[0].soil_texture = project.suelo.textura);
		project.suelo.profundidad &&
			(crops[0].depth_s = project.suelo.profundidad);
		project.suelo.pedregosidad &&
			(crops[0].stony = project.suelo.pedregosidad);
	}
	if (typeof project.cultivo == 'object') {
		project.cultivo.nombre &&
			(crops[0].crop_type = crop4FaST(project.cultivo.nombre));
		project.cultivo.fecha_inicio_ciclo &&
			(crops[0].crop_startDate = project.cultivo.fecha_inicio_ciclo);
		typeof project.cultivo.etapas == 'object' && project.cultivo.etapas.length == 4 && typeof project.cultivo.etapas[3] == 'object' &&
			(crops[0].crop_endDate = project.cultivo.etapas[3].fecha_fin);
	}
	if (typeof project.necesidades_riego == 'object') {
		project.necesidades_riego.riego_neto_acumulado &&
			(crops[0].dose_irrigation = project.necesidades_riego.riego_neto_acumulado);
		typeof project.necesidades_riego.riego_neto_diario == 'object' && project.necesidades_riego.riego_neto_diario.length &&
			(crops[0].Riegos = project.necesidades_riego.riego_neto_diario.map(row => row.fecha + ';' + row.riego_neto.replace(/\./g, ',')).join('\n'));
	}
	if (typeof project.datos_climaticos == 'object') {
		project.datos_climaticos.precipitacion_acumulada &&
			(crops[0].rain_a = project.datos_climaticos.precipitacion_acumulada);
		typeof project.datos_climaticos.precipitacion_diaria == 'object' && project.datos_climaticos.precipitacion_diaria.length &&
			(crops[0].rain_w = project.datos_climaticos.precipitacion_diaria.filter(row => {
				let parts;
				if (typeof row != 'object' || !row.fecha || (parts = row.fecha.split('-')).length != 3) {
					return false;
				}
				return (parts[1] < '03' || parts[1] == '03' && parts[2] <= '21')
					|| (parts[1] > '09' || parts[1] == '09' && parts[1] >= '22'); 
			}).reduce((acc, row) => acc + parseFloat(row.precipitacion), 0));
	}
	return { crops };
}