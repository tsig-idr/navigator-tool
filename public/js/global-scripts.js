// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict'

	document.querySelector('html').setAttribute('translate', 'no');
	document.querySelectorAll('[data-toshow]').forEach(button => {
		const targets = document.querySelectorAll(button.dataset.toshow),
			complement = button.parentElement.querySelector('[data-tohide]');
		button.addEventListener('click', () => {
			button.classList.add('d-none');
			targets.forEach(target => {
				target.classList.remove('d-none');
			});
			complement.classList.remove('d-none');
		});
	});
	document.querySelectorAll('[data-tohide]').forEach(button => {
		const targets = document.querySelectorAll(button.dataset.tohide),
			complement = button.parentElement.querySelector('[data-toshow]');
		button.addEventListener('click', () => {
			button.classList.add('d-none');
			targets.forEach(target => {
				target.classList.add('d-none');
			});
			complement.classList.remove('d-none');
		});
	});
	fetch('/navbar.html').then(response => {
		return response.text()
	}).then(data => {
		document.querySelector('navbar').innerHTML = data;
		const saveA = document.querySelector('[data-save]');
		var modal = null;
		document.querySelectorAll('[type=file].d-none').forEach(input => {
			input.addEventListener('change', ev => {
				if (!ev.target.files[0]) {
					return false;
				}
				const reader = new FileReader();
				reader.onload = ev => {
					let project;
					if (input.name == 'json') {
						if (!(project = JSON.parse(ev.target.result))) {
							return;
						}
						if (typeof project.meta != 'object' || !project.meta.path) {
							return;
						}
						window.localStorage.setItem('farm', ev.target.result);
						window.location.pathname = project.meta.path;
						typeof setFarm == 'function' &&
							setFarm(project);
					}
					if (input.name == 'csv') {
						project = csv2json_(ev.target.result);
						if (!project.meta.path) {
							return;
						}
						window.localStorage.setItem('farm', JSON.stringify(project));
						window.location.pathname = project.meta.path;
						typeof setFarm == 'function' &&
							setFarm(project);
					}
					if (input.name == 'siar') {
						if (!(project = JSON.parse(ev.target.result))) {
							return;
						}
						if (typeof project.localizacion != 'object') {
							return;
						}
						fetch('/json/SIAR.json').then(res => res.json()).then(data => {
							let farm;
							project = harmonize4SIAR(project, data);
							(farm = window.localStorage.getItem('farm')) &&
								(farm = JSON.parse(farm)) &&
								(farm = {
									crops: [
										{...farm.crops[0], ...project.crops[0]}
									]
								})
							||
								(farm = project);
							window.localStorage.setItem('farm', JSON.stringify(farm));
							typeof setFarm == 'function' &&
								setFarm(farm);
							modal &&
								modal.dispose();
							modal = new bootstrap.Modal(document.getElementById('siar-modal'));
							modal.show();
						}).catch(error => {
							console.warn('Something went wrong.', error);
						});
					}
				};
				reader.readAsText(ev.target.files[0]);
			});
		});
		document.querySelectorAll('[data-load]').forEach(a => a.addEventListener('click', ev => ev.target.parentNode.querySelector('input').click()));
		document.querySelectorAll('[data-type]').forEach(a => a.addEventListener('click', ev => {
			const type = ev.target.dataset.type;
			const farm = JSON.parse(window.localStorage.getItem('farm'));
			let url;
			if (type == 'json') {
				farm.meta = {
					path: window.location.pathname,
					host: window.location.hostname,
					time: (new Date).toLocaleString(),
					version: '1.0'
				};
				url = URL.createObjectURL(new Blob([JSON.stringify(farm)], {
					type: 'application/json'
				}));
			}
			if (type == 'csv') {
				farm.path = window.location.pathname;
				farm.host = window.location.hostname;
				farm.time = (new Date).toLocaleString().split(',')[0];
				url = URL.createObjectURL(new Blob(['FIELD,VALUE\n'+json2csv_(farm)], {
					type: 'text/csv'
				}));
			}
			let a;
			document.body.appendChild(a = document.createElement('a'));
			a.href = url;
			a.download = 'myFarm.'+type;
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}));
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
				let html = el.innerHTML.trim();
				html.charAt(0) != '<' && (key = html) in dict &&
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
}

function texture4FaST (siar_texture) {
	switch (siar_texture) {
		case 'Arcillo Arenoso':
			return 'sandyClay';
		case 'Arcillo Limoso':
			return 'siltyClay';
		case 'Arcilloso':
			return 'clay';
		case 'Arenoso':
			return 'sand';
		case 'Arenoso Franco':
			return 'loamySand';
		case 'Franco':
		case 'Marga':
			return 'loam';
		case 'Franco Arcilloso':
			return 'clayLoam';
		case 'Franco Arcillo Arenoso':
			return 'sandyClayLoam';
		case 'Franco Arcillo Limoso':
			return 'siltyClayLoam';
		case 'Franco Arenoso':
			return 'sandyLoam';
		case 'Franco Limoso':
			return 'siltyLoam';
		default:
			return 'silt';
	}
}

function harmonize4SIAR (project, data) {
	const crops = [{}];
	if (typeof project.suelo == 'object') {
		if (project.suelo.textura) {
			crops[0].soil_texture = texture4FaST(project.suelo.textura);
			crops[0].soil_texture in data.textures &&
				(crops[0].CEC = data.textures[crops[0].soil_texture].CEC);
		}
		project.suelo.profundidad &&
			(crops[0].depth_s = parseFloat(project.suelo.profundidad).toFixed(2));
		project.suelo.pedregosidad &&
			(crops[0].stony = parseFloat(project.suelo.pedregosidad).toFixed(2));
	}
	if (typeof project.cultivo == 'object') {
		if (project.cultivo.nombre) {
			crops[0].crop_type = crop4FaST(project.cultivo.nombre);
			if (crops[0].crop_type in data.crops) {
				crops[0].crop_name = data.crops[crops[0].crop_type].crop_name;
				crops[0].HI_est = data.crops[crops[0].crop_type].harvest.HI_est;
				crops[0].Nc_h = data.crops[crops[0].crop_type].harvest.Nc_h_typn;
				crops[0].Pc_h = data.crops[crops[0].crop_type].harvest.Pc_h;
				crops[0].Kc_h = data.crops[crops[0].crop_type].harvest.Kc_h;
			}
		}
		project.cultivo.fecha_inicio_ciclo &&
			(crops[0].crop_startDate = project.cultivo.fecha_inicio_ciclo);
		if (typeof project.cultivo.etapas == 'object' && project.cultivo.etapas.length) {
			crops[0].FenoBBCH = [];
			for (let n = project.cultivo.etapas.length, i = n - 1, bbch = [9, 22, 39, 55, 89]; i >= 0; i--) {
				typeof project.cultivo.etapas[i] == 'object' && project.cultivo.etapas[i].fecha_fin &&
					crops[0].FenoBBCH.unshift([project.cultivo.etapas[i].fecha_fin, bbch[5 - (n - i)]]);
			}
			crops[0].crop_endDate = project.cultivo.etapas[3].fecha_fin;
		}
	}
	if (typeof project.riego == 'object') {
		project.riego.eficiencia &&
			(crops[0].efficiency = project.riego.eficiencia);
	}
	if (typeof project.necesidades_riego == 'object') {
		project.necesidades_riego.riego_neto_acumulado &&
			(crops[0].dose_irrigation = Math.round(project.necesidades_riego.riego_neto_acumulado));
		typeof project.necesidades_riego.riego_neto_diario == 'object' && project.necesidades_riego.riego_neto_diario.length &&
			(crops[0].Riegos = project.necesidades_riego.riego_neto_diario.map(row => [row.fecha, row.riego_neto]));
	}
	if (typeof project.datos_climaticos == 'object') {
		project.datos_climaticos.precipitacion_acumulada &&
			(crops[0].rain_a = Math.round(project.datos_climaticos.precipitacion_acumulada));
		typeof project.datos_climaticos.precipitacion_diaria == 'object' && project.datos_climaticos.precipitacion_diaria.length &&
			(crops[0].rain_w = Math.round(project.datos_climaticos.precipitacion_diaria.filter(row => {
				let parts;
				if (typeof row != 'object' || !row.fecha || (parts = row.fecha.split('-')).length != 3) {
					return false;
				}
				return (parts[1] < '03' || parts[1] == '03' && parts[2] <= '21')
					|| (parts[1] > '09' || parts[1] == '09' && parts[1] >= '22'); 
			}).reduce((acc, row) => acc + parseFloat(row.precipitacion), 0)));
	}
	return { crops };
}

function json2csv_(json) {
	csv = '';
	for (let key in json) {
		if (key == 'crops' && typeof json[key] == 'object') {
			let i;
			for (i = 0; i < json[key].length; i++) {
				csv += json2csv_(json[key][i])+'\n';
			}
		}
		if (typeof json[key] == 'string') {
			csv += key+','+json[key]+'\n';
		}
		if (typeof json[key] == 'number') {
			csv += key+','+json[key]+'\n';
		}
	}
	return csv;
}

function csv2json_(csv) {
	const lines = csv.split('\n'),
		json = {
			crops: [{}],
			meta: {
				path: null,
				host: null,
				time: null
			}
		};
	let i,
		key,
		val;
	for (i = 0; i < lines.length; i++) {
		[key, val] = lines[i].split(',');
		if (!key) {
			continue;
		}
		if (key in json.meta) {
			json.meta[key] = val;
		}
		else {
			json.crops[0][key] = val;
		}
	}
	return json;
}