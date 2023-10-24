var form = document.querySelector('form'),
	ul = document.querySelector('ul.list-unstyled'),
	tables = document.querySelectorAll('table[name]'),
	fertilizers = {},
	crops = {},
	soils = {},
	applications = [],
	farm,
	addButton,
	langNotReady = 3;

form.files = {
	'Clima': null,
	'Meteo': null,
	'NDVItipo': null,
	'NDVIreal': null,
	'Riegos': null,
	'FenoBBCH': null,
	'prices': null
};
form.querySelectorAll('button[name]').forEach(button => {
	button.addEventListener('click', () => {
		const table = document.querySelector(`table[name="${button.name}"]`);
		tables.forEach(table => {
			table.classList.add('d-none');
			table.parentNode.classList.add('d-none');
		});
		resultDiv.classList.add('d-none');
		form.classList.add('was-validated');
		if (!form.checkValidity()) {
			return false;
		}
		const data = FormDataJson.toJson(form, {includeDisabled: true}),
			element = button.querySelector('i'),
			input = data.input;
		element.classList.remove('fa-play');
		element.classList.add('fa-spinner');
		element.classList.add('fa-spin');
		data.input.fertilizers = data.fertilizers;
		data.input.applications = applications;
		data.fertilizers = data.fertilizerID = data.amount = data.date = data.N = data.P = data.K = undefined;
		for (const name in form.files) {
			form.files[name] &&
				(data.input[name] = csv2json(form.files[name]))
			||
				(data.input[name] = null);
		}
		button.name &&
			fetch(`/F1/${button.name}`, {
				method: 'POST',
				body: JSON.stringify(data, (k, v) => Array.isArray(v) && v.filter(e => e !== null) || v),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(res => res.json()).then(data => {
				resultDiv.classList.remove('d-none');
				document.location.href = '#chart';
				let tr, td, tbody, a,
					i, name;
				switch (button.name) {
					case 'SWB':
					case 'SNB/daily':
					case 'SNB/calendar':
						const tr_tmpl = table.querySelector('tr[name="template"]');
						table.removeChild(table.querySelector('tbody'));
						table.appendChild(tbody = document.createElement('tbody'));
						tbody.appendChild(tr_tmpl);
						for (i = 0; i < data.results.length; i++) {
							tr = tr_tmpl.cloneNode(true);
							for (name in data.results[i]) {
								(td = tr.querySelector(`td[name="${name}"]`)) &&
									(td.innerHTML = 
										(name == 'Fecha' || name == 'date' || name == 'fertilizer_name' || name == 'method') && 
											data.results[i][name]
										||
											data.results[i][name] && 
											parseFloat(data.results[i][name]).toFixed(button.name == 'SNB/calendar' ? 0 : 2));
							}
							tbody.appendChild(tr);
						}
						break;
					default:
						break;
				}
				table.classList.remove('d-none');
				table.parentNode.classList.remove('d-none');
				element.classList.remove('fa-spin');
				element.classList.remove('fa-spinner');
				element.classList.add('fa-play');
				window.localStorage.setItem('timestamp4F', (new Date).toLocaleString());
				window.localStorage.setItem('farm', JSON.stringify({
					crops: farm && merge(farm.crops, [input]) || [input]
				}));
				(a = document.querySelector('[data-save]')) &&
					(a.classList.add('active') || true) &&
					a.classList.remove('disabled');
			}).catch(error => {
				console.warn('Something went wrong.', error);
			});
	});
});
(addButton = form.querySelector('button.btn-dark')).addEventListener('click', () => {
	[form.fertilizerID, form.date].forEach(element => {
		!element.value &&
			(element.classList.add('border-danger') || true)
		||
			element.classList.remove('border-danger');
	});
	if (!form.fertilizerID.value || !form.date.value) {
		return;
	}
	const li = document.createElement('li'),
		b = document.createElement('b'),
		button = document.createElement('button'),
		index = applications.length,
		name = form.name || form.fertilizerID.querySelector(':checked').innerHTML,
		fertilizer = {
			type: form.type || form.fertilizerID.value,
			date: form.date.value,
			amount: form.amount.value,
			name: name,
		};
	form.name = form.type = '';
	ul.appendChild(li);
	li.appendChild(b);
	li.appendChild(button);
	b.innerHTML = `${form.date.value} <b>&rarr;</b> ${name} (${fertilizer.amount ? fertilizer.amount+' kg/ha' : 'optimized amount'}) `;
	button.className = 'btn fa fa-remove text-danger';
	button.addEventListener('click', ev => {
		ul.removeChild(ev.target.parentNode);
		applications[index] = null;
		ul.querySelectorAll('li').length == 1 &&
			ul.querySelector('.default').classList.remove('d-none');
	});
	['N', 'P', 'K'].forEach(field => {
		fertilizer[field] = form[field].value;
	});
	applications.push(fertilizer);
	ul.querySelector('.default').classList.add('d-none');
});
form.addEventListener('change', ev => {
	switch (ev.target.id) {
		case 'crop_type':
			form['input[HI_est]'].value = crops[ev.target.value].harvest.HI_est;
			form['input[Nc_h]'].value = crops[ev.target.value].harvest.Nc_h_typn;
			form['input[Pc_h]'].value = crops[ev.target.value].harvest.Pc_h;
			form['input[Kc_h]'].value = crops[ev.target.value].harvest.Kc_h;
			break;
		case 'soil_texture':
			form['input[CEC]'].value = soils[ev.target.value].CEC;
			break;
		case 'water_supply':
			form['input[type_irrigated]'].disabled = form['input[dose_irrigation]'].disabled = form['input[waterNitrate]'].disabled = ev.target.value == '0';
			break;
		case 'fertilizerID':
			let fertilizer;
			form.amount.disabled = false;
			(fertilizer = fertilizers[ev.target.value]) &&
				(['N', 'P', 'K'].forEach(field => {
					fertilizer[field] !== undefined &&
						(form[field].value = fertilizer[field].toFixed(2))
					||
						(form[field].value = 0);
				}) || true)
			||
				(form.amount.disabled = true) &&
				((form.amount.value = null) || true) &&
				['N', 'P', 'K'].forEach(field => {
					form[field].value = null;
				});
			break;
		case 'PK_strategy':
			form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = ev.target.value == 'maintenance';
			break;
		case 'NO3':
		case 'NH4':
			let NO3 = form['input[NO3]'].value,
				NH4 = form['input[NH4]'].value;
			form['input[Nc_s_initial]'].disabled = form['input[N_NH4]'].disabled = form['input[Nc_s_initial_unit]'].disabled = false;
			NO3 &&
				(form['input[Nc_s_initial]'].disabled = form['input[Nc_s_initial_unit]'].disabled = true) &&
				(form['input[Nc_s_initial]'].value = NO3) &&
				(form['input[Nc_s_initial_unit]'].value = 'ppm');
			NO3 && NH4 &&
				(form['input[Nc_s_initial]'].value = parseFloat(NH4) + parseFloat(NO3)) &&
				(form['input[N_NH4]'].disabled = true) &&
				(form['input[N_NH4]'].value = NH4/NO3);
			break;
		default:
			break;
	}
});
form.querySelectorAll('[type="file"]').forEach(input => {
	input.addEventListener('change', ev => {
		var file = ev.target.files[0],
			reader;
		if (!file) {
			return form.files.FenoBBCH = null;
		}
		reader = new FileReader();
		reader.onload = ev => form.files[input.name] = ev.target.result;
		reader.readAsText(file);
	});
});
[
	{
		names: ['input[soil_texture]'],
		route: '/F3/soil-textures',
		value: 'soil_texture',
		text: 'name' 
	}, {
		names: ['fertilizers', 'fertilizerID'],
		route: '/F3/fertilizers/all',
		value: 'fertilizerID',
		text: 'fertilizer_name' 
	}
].forEach(obj => fetch(obj.route).then(res => res.json()).then(data => {
	let option, i, elem;
	obj.names.forEach(name => {
		for (i = 0; i < data.results.length && (elem = data.results[i]); i++) {
			option = document.createElement('option');
			option.value = elem[obj.value];
			option.innerHTML = elem[obj.text];
			form[name].appendChild(option); 
		}
	});
	if (obj.value == 'fertilizerID') {
		data.results.forEach(f => {
			fertilizers[f.fertilizerID] = {
				N: f.nitrogen.Ncf,
				P: f.phosphorus.Pcf,
				K: f.potassium.Kcf
			};
		});
		document.multiselect('#fertilizers').selectAll();
	}
	else {
		data.results.forEach(s => soils[s.soil_texture] = s);
		form[obj.names[0]].value = null;
	}
	langNotReady--;
	!langNotReady &&
		translate('F1');
}).catch(error => {
	console.warn('Something went wrong.', error);
}));
fetch('/F3/crops').then(res => res.json()).then(data => {
	const groups = data.results.reduce((cs, c) => {
		!(c.group in cs) &&
			(cs[c.group] = []);
		cs[c.group].push(c);
		return cs;
	}, {});
	for (type in groups) {
		let optgroup = document.createElement('optgroup'), 
			option, i, crop;
		optgroup.setAttribute('label', type);
		for (i = 0; i < groups[type].length && (crop = groups[type][i]); i++) {
			option = document.createElement('option');
			option.value = crop.cropID;
			option.innerHTML = crop.crop_name;
			optgroup.appendChild(option); 
		}
		form['input[crop_type]'].appendChild(optgroup); 
	}
	form['input[crop_type]'].value = null;
	data.results.forEach(c => crops[c.cropID] = c);
	(farm = window.localStorage.getItem('farm')) &&
		(farm = JSON.parse(farm)) &&
		setFarm(farm);
	langNotReady--;
	!langNotReady &&
		translate('F1');
}).catch(error => {
	console.warn('Something went wrong.', error);
});
fetch('/csv/F1/Fertilizers.csv').then(res => res.text()).then(data => form.files.prices = data).catch(error => {
	console.warn('Something went wrong.', error);
});

function csv2json (csv) {
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').filter(line => line).map(line => line.split(';'));
}

function json2csv (json) {
	return json.map(row => row.join(';').replace(/\./g, ',')).join('\n');
}

function merge (a1, a2) {
	for (let i = 0; i < a2.length && i < a1.length; i++) {
		a2[i] = {...a1[i], ...a2[i]};
	}
	return a2;
}

function setFarm (farm) {
	let field, name;
	farm.crops &&
		farm.crops.forEach(crop => {
			for (field in crop) {
				if ((name = `input[${field}]`) in form) {
					form[name].value = crop[field];
					field in form.files &&
						typeof crop[field] === 'object' && crop[field] &&
							(form.files[field] = json2csv(crop[field])) &&
							(form[field].required = false);
				}
				switch (field) {
					case 'PK_strategy':
						form['input[Pc_s]'].disabled = form['input[Kc_s]'].disabled = form[name].value == 'maintenance';
						break;
					case 'water_supply':
						form['input[type_irrigated]'].disabled = form['input[dose_irrigation]'].disabled = form['input[waterNitrate]'].disabled = form[name].value == '0';
						break;
					default:
						break;
				}
			}
			crop.applications && crop.applications.length &&
				crop.applications.forEach(fert => {
					for (field in fert) {
						if (field in form && typeof form[field] == 'object') {
							form[field].value = fert[field];
						}
						else {
							form[field] = fert[field];
						}
					}
					addButton.click();
				});
		});
}



document.querySelectorAll('.chart li').forEach(function(li) {
	li.addEventListener('click', function() {
		this.classList.add('d-none');
	});
});
const userData = {
	input: {
		soil_texture:"sandyLoam",
		CEC:"75",
		depth_s:"0.45",
		pH:"7",
		stony:"0.00",
		SOM:"1.5",
		N_NH4:"0.2",
		Nc_s_initial:"29.995",
		Nc_s_initial_unit:"kg_ha",
		Pc_method:"olsen",
		Pc_s:"0.603",
		Pc_s_unit:"ppm",
		Kc_s:"0.004",
		Kc_s_unit:"ppm",
		crop_type:"BARLEY_6_ROW",
		PK_strategy:"maximum-yield",
		crop_startDate:"2015-01-01",
		crop_endDate:"2015-06-07",
		yield:"20000",
		Nc_h:"1.6",
		Pc_h:"0.42",
		Kc_h:"0.54",
		export_r:"100",
		HI_est:"40",
		CV:"20",
		climatic_zone:"atlantic",
		dose_irrigation:"346",
		efficiency:"82",
		water_supply:"1",
		type_irrigated:"sprinkler",
		waterNitrate:"15"
	}
};
var chart,
	datasetIndex,
	index,
	rows,
	dates;

fetch('http://127.0.0.1:1345/F1/SNB/daily', { //http://127.0.0.1:1345/F1/SWB
	method: 'POST',
	body: JSON.stringify(userData),
	headers: {
		'Content-type': 'application/json; charset=UTF-8'
	}
}).then(res => res.json()).then(data => setChart(data, series4snb, scales4snb));

const series4snb = [
	{
		label: 'N_rate',
		yAxisID: 'y1'
	},
	{
		label: 'N_mineral_soil',
		yAxisID: 'y1'
	},
	{
		label: 'N_extr',
		yAxisID: 'y1'
	},
	{
		label: 'Nl',
		yAxisID: 'y1'
	},
	{
		label: 'N_recom',
		yAxisID: 'y1'
	},				{
		label: 'BBCH',
		yAxisID: 'y2'
	}
];
const series4swb = [
	{
		label: 'Kc',
		yAxisID: 'y1'
	},
	{
		label: 'NDVI_interpolado',
		yAxisID: 'y1'
	},
	{
		label: 'ETc',
		yAxisID: 'y2'
	},
	{
		label: 'ETo',
		yAxisID: 'y2'
	},
	{
		label: 'Biomasa_acumulada',
		yAxisID: 'y3'
	},
	{
		label: 'Nuptake',
		yAxisID: 'y4'
	}
];
const scales4snb = {
	y1: {
		type: 'linear',
		display: true,
		position: 'left',
		ticks: {
			//callback: (val, idx, ticks) => idx == (ticks.length - 1) ? 'Kg/ha ' + val : val
			callback: val => val + ' Kg/ha'
		}
	},
	y2: {
		type: 'linear',
		display: true,
		position: 'right',
		grid: {
			drawOnChartArea: false
		}
	}
};
const scales4swb = {
	y1: {
		type: 'linear',
		display: true,
		position: 'left'
	},
	y2: {
		type: 'linear',
		display: true,
		position: 'right',
		grid: {
			drawOnChartArea: false
		}
	},
	y3: {
		type: 'linear',
		display: true,
		position: 'right',
		grid: {
			drawOnChartArea: false
		}
	},
	y5: {
		type: 'linear',
		display: true,
		position: 'left'
	}
};

function setChart(data, series, scales) {
	rows = data.results.filter(row => row.Fecha >= crop_startDate && row.Fecha <= crop_endDate);
	dates = rows.map(row => row.Fecha);
	series.forEach(serie => {
		serie.data = rows.map(row => row[serie.label]);
	});
	if (!chart) {
		chart = new Chart(canvas,
			{
				type: 'line',
				data: {
					labels: dates,
					datasets: series
				},
				options: {
					onClick: (ev, els) => {
						if (els && els.length) {
							index = els[0].index;
							datasetIndex = els[0].datasetIndex;
							variableForm.classList.remove('d-none');
							canvas.classList.add('faded');
							timeSpan.innerHTML = dates[index];
							variableLabel.innerHTML = chart.data.datasets[datasetIndex].label;
							rangeInput.min = chart.scales[chart.data.datasets[datasetIndex].yAxisID].min;
							rangeInput.max = chart.scales[chart.data.datasets[datasetIndex].yAxisID].max;
							rangeInput.style.accentColor = chart.data.datasets[datasetIndex].borderColor;
							variableInput.value = rangeInput.value = els[0].element.$context.parsed.y;
						}
					},
					scales: scales,
					plugins: {
						zoom: {
							pan: {
								enabled: true,
								mode: 'x',
								scaleMode: 'y'
							},
							zoom: {
								wheel: {
									enabled: true,
								},
								pinch: {
									enabled: true,
								},
								mode: 'x',
								scaleMode: 'y'
							}
						}
					}
				}
			}
		);
		series.forEach((serie, index) => {
			let input;
			controlForm.appendChild(input = document.createElement('input'));
			input.type = 'range';
			input.name = serie.label;
			input.min = chart.scales[serie.yAxisID].min;
			input.max = chart.scales[serie.yAxisID].max;
			input.step = 'any';
			input.value = serie.data[0];
			input.style.accentColor = chart.data.datasets[index].borderColor;
		});
	}
	else {
		chart.data.datasets = series;
		chart.update();
	}
};

function updateChart(ev) {
	canvas.classList.remove('faded');
	variableForm.classList.add('d-none');
	userData.input.chart = {};
	if (ev.target.parentNode == controlForm) {
		userData.input.chart.date = controlForm.date.value;
		chart.data.datasets.forEach(serie => {
			userData.input.chart[serie.label] = parseFloat(controlForm[serie.label].value);
		});
	}
	else {
		chart.data.datasets[datasetIndex].data[index] = variableInput.value;
		chart.update();
		userData.input.chart.date = dates[index];
		userData.input.chart[chart.data.datasets[datasetIndex].label] = parseFloat(variableInput.value);
	}
	fetch('http://127.0.0.1:1345/F1/SNB/daily', { //http://127.0.0.1:1345/F1/SWB
		method: 'POST',
		body: JSON.stringify(userData),
		headers: {
			'Content-type': 'application/json; charset=UTF-8'
		}
	}).then(res => res.json()).then(data => setChart(data, series4snb, scales4snb));
}
const crop_startDate = '2015-01-22';
const crop_endDate = '2015-06-22';

const canvas = document.querySelector('canvas');
const timeSpan = document.getElementById('time');
const resultDiv = document.getElementById('result');
const controlForm = document.querySelector('.chart>form.control');
const variableForm = document.querySelector('.chart>form:not(.control)');
const variableLabel = variableForm.querySelector('label[for=variable]');
const variableInput = document.getElementById('variable');
const rangeInput = variableForm.querySelector('input[type=range]');
variableInput.addEventListener('keypress', ev => {
	if (ev.key === 'Enter') {				
		ev.preventDefault();
		updateChart(ev);
	}
});
rangeInput.addEventListener('input', ev => {
	variable.value = ev.target.value;
});
variableForm.querySelector('button').addEventListener('click', updateChart);
controlForm.querySelector('button').addEventListener('click', updateChart);
controlForm.date.value = crop_startDate;