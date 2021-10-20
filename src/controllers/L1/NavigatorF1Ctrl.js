const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function nitro (input, outputnames) {
		input.Pc_s_0 = input.Pc_s;
		input.Kc_s_0 = input.Kc_s;
		input.Nc_s_0 = input.Nc_s_initial;
		input.NO3 && input.NH4 &&
			(input.N_NH4 = input.NH4/input.NO3);
		!input.NDVIreal &&
			(input.NDVIreal = sp_csv2array('tmp/F1/default_NDVI_real.csv'));
		!input.NDVItipo &&
			(input.NDVItipo = sp_csv2array('tmp/F1/default_NDVI_tipo.csv'));
		!input.Clima &&
			(input.Clima = sp_csv2array('tmp/F1/default_Clima.csv'));
		!input.Meteo &&
			(input.Meteo = sp_csv2array('tmp/F1/default_Meteo.csv'));
		!input.Riegos &&
			(input.Riegos = sp_csv2array('tmp/F1/default_Riego.csv'));
		!input.FenoBBCH &&
			(input.FenoBBCH = []);
		!input.Pc_s_unit &&
			(input.Pc_s_unit = 'ppm');
		!input.Kc_s_unit &&
			(input.Kc_s_unit = 'ppm');
		!input.Nc_s_initial_unit &&
			(input.Nc_s_initial_unit = 'ppm');

		const engine = customEngine();
		let code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F1', 'swb.sc'), 'utf8'),
			output = await sheetscript.run(engine, code, input);
		code  = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F1', 'nitro.sc'), 'utf8');
		input = {...input, ...output};
		output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function swb (input, outputnames) {
		!input.applications &&
			(input.applications = []);
		input.startDate = input.crop_startDate;
		input.applications.forEach(application => {
			application.amount && application.date < input.startDate &&
				(input.startDate = application.date);
		});
		!input.NDVIreal &&
			(input.NDVIreal = sp_csv2array('tmp/F1/default_NDVI_real.csv'));
		!input.NDVItipo &&
			(input.NDVItipo = sp_csv2array('tmp/F1/default_NDVI_tipo.csv'));
		!input.Clima &&
			(input.Clima = sp_csv2array('tmp/F1/default_Clima.csv'));
		!input.Meteo &&
			(input.Meteo = sp_csv2array('tmp/F1/default_Meteo.csv'));
		!input.Riegos &&
			(input.Riegos = sp_csv2array('tmp/F1/default_Riego.csv'));

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F1', 'swb.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function resume (nitro) {
		return nitro.reduce((weeks, day) => {
			let index = weeks.findIndex(week => week && week.Sem === day.Sem);
			if (index < 0) {
				weeks.push({
					Sem: day.Sem,
					Fecha: day.Fecha,
					N_mineralizado: 0,
					N_agua: 0,
					N_fert_neto: 0,
					Nl: 0,
					N_extr_1: 0,
					N_extrA_1: -999999,
					N_recom: 0,
					Eto_acumulada: 0,
					BBCH_tipo: -9999,
					BBCH_real_et: -99999,
					NDVI_tipo_i: 0,
					NDVI_int: 0,
					Biomasa: 0,
					Eto_acumulada_real: 0,
				});
				index = weeks.length - 1;
			}
			const sum_vars = ['N_mineralizado', 'N_agua', 'N_fert_neto', 'Nl', 'N_extr_1'];
			const max_vars = ['N_extrA_1', 'N_recom', 'Eto_acumulada', 'BBCH_tipo', 'BBCH_real_et', 'NDVI_tipo_i', 'NDVI_int', 'Biomasa', 'Eto_acumulada_real'];
			let i;
			for (i = 0; i < sum_vars.length; i++) {
				weeks[index][sum_vars[i]]+= day[sum_vars[i]];
			}
			for (i = 0; i < max_vars.length; i++) {
				weeks[index][max_vars[i]] < day[max_vars[i]] &&
					(weeks[index][max_vars[i]] = day[max_vars[i]]);
			}
			return weeks;
		}, []);
	}

	async function data4fertilizers (input) {
		!input.fertilizers &&
			(input.fertilizers = []);

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F1', 'nbf.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, ['updated_fertilizers']);
		return output;
	}

	return {
		nitro: nitro,
		swb: swb,
		data4fertilizers: data4fertilizers,
		resume: resume
	}
}

function sp_csv2array (filename) {
	if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
		return null;
	}
	const csv = fs.readFileSync(filename, 'utf8');
	return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
}

function customEngine () {

	const engine = sheetscript.newStdEngine();

	// Equivalente a la EXP de Excel
	engine.setFunction('user', 'EXP', 1, n => Math.pow(Math.E, n));
	// Devuelve el logaritmo natural
	engine.setFunction('user', 'LN', 1, n => Math.log(n));
	// Devuelve el entero que Excel asocia a una fecha
	engine.setFunction('user', 'DATE2INT', 1, date => (new Date(date).getTime() - new Date('1900-01-01').getTime())/(1000*24*60*60) + 2);
	// Genera un listado de N fechas (en formato hispano) a partir de una fecha determinada
	engine.setFunction('user', 'GENNDATES', 2, (start, n) => {
		const t_0 = new Date(start).getTime(),
			t_day = 1000*60*60*24,
			dates = [];
		for (let i = 0, t; i < n; i++) {
			t = t_0 + i*t_day;
			dates.push(new Date(t).toISOString().split('T')[0]);
		}
		return dates;
	});
	// Similiar a IF_ERROR pero con arrays 
	engine.setFunction('user', 'IF_VOID', 2, (list, replacement) => !list.length && replacement || list);
	// Transforma un listado de tuplas (fecha, valor) interpolando al dia 
	engine.setFunction('user', 'LINTER4DATES', 1, (tuples, spanish) => {
		if (typeof tuples != 'object' || !tuples.length || tuples.length < 2 || typeof tuples[0] != 'object' || !tuples[0].length || tuples[0].length < 2) {
			return tuples;
		}
		const t_day = 1000*60*60*24,
			formatTime = t => new Date(t).toISOString().split('T')[0];
		let i, m, t, t_b, v, v_b,
			t_a = tuples[0][0],
			v_a = parseFloat(tuples[0][1]),
			newtuples = [];
		spanish &&
			(t_a = t_a.split('/')) &&
			(t_a = `${t_a[2]}/${t_a[1]}/${t_a[0]}`);
		t_a = new Date(t_a).getTime();
		for (i = 0; i < tuples.length - 1; i++) {
			if (typeof tuples[i] != 'object' || !tuples[i].length || tuples[i].length < 2) {
				return tuples;
			}
			t_b = tuples[i + 1][0];
			spanish &&
				(t_b = t_b.split('/')) &&
				(t_b = `${t_b[2]}/${t_b[1]}/${t_b[0]}`);
			m = t_day*((v_b = parseFloat(tuples[i + 1][1])) - v_a)/((t_b = new Date(t_b).getTime()) - t_a);
			for (t = t_a, v = v_a; t < t_b; t+= t_day) {
				newtuples.push([formatTime(t), v]);
				v+= m;
			}
			t_a = t_b;
			v_a = v_b;
		}
		newtuples.push([formatTime(t_a), v_a]);
		return newtuples;
	});
	// Transforma un archivo CSV hispano a un array de arrays
	engine.setFunction('user', 'SP_CSV2ARRAY', 1, sp_csv2array);
	// Transforma un archivo CSV estandar a un array de arrays
	engine.setFunction('user', 'STD_CSV2ARRAY', 1, filename => {
		if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
			return null;
		}
		const csv = fs.readFileSync(filename, 'utf8');
		return csv.replace(/\r/g, '').split('\n').map(line => line.split(','));
	});
	// Equivalente a la BUSCARV de Excel
	engine.setFunction('user', 'VLOOKUP', 3, (v, table, index, ranged = false) => {
		if (index && typeof table == 'object' && table.length) {
			if (ranged) {
				!isNaN(v) &&
					(v = parseFloat(v));
				for (let i = table.length - 1, e; i >= 0; i--) {
					!isNaN(e = table[i][0]) &&
						(e = parseFloat(e));
					if (typeof table[i] == 'object' && table[i].length && e <= v) {
						return table[i][index - 1];
					}
				}
			}
			else {
				for (let i = 0; i < table.length; i++) {
					if (typeof table[i] == 'object' && table[i].length && table[i][0] == v) {
						return table[i][index - 1];
					}
				}
			}
		}
		return null;
	});
	// Equivalente a la BUSCARH de Excel
	engine.setFunction('user', 'HLOOKUP', 3, (v, table, index) => {
		if (index && typeof table == 'object' && table.length && index - 1 < table.length && typeof table[0] == 'object' && table[0].length) {
			for (let j = 0; j < table[0].length; j++) {
				if (table[0][j] == v) {
					return table[index - 1][j];
				}
			}
		}
		return null;
	});
	// Devuelve el numero de semana ISO para una fecha en formato hispano
	engine.setFunction('user', 'ISOWEEKNUMBER', 1, date => {
		date = new Date(date);
		date.setUTCDate(date.getUTCDate() + 4 - date.getUTCDay() || 7);
		return Math.ceil(((date - new Date(Date.UTC(date.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
	});
	// Devuelve el dia de la fecha representada por s
	engine.setFunction('user', 'DAY', 1, s => parseInt(s.split('-')[2]));
	// Devuelve el mes de la fecha representada por s
	engine.setFunction('user', 'MONTH', 1, s => parseInt(s.split('-')[1]));
	// Devuelve el anyo de la fecha representada por s
	engine.setFunction('user', 'YEAR', 1, s => parseInt(s.split('-')[0]));
	// Devuelve el residuo de n/d
	engine.setFunction('user', 'MOD', 2, (n, d) => n - d*Math.floor(n/d));
	// Transforma el string s en un numero real
	engine.setFunction('user', 'FLOAT', 1, s => parseFloat(s));
	// Devuelve el maximo de los argumentos
	engine.setFunction('user', 'MAX', 1, function () {
		return Math.max(...arguments);
	});
	// Devuelve el minimo de los argumentos
	engine.setFunction('user', 'MIN', 1, function () {
		return Math.min(...arguments);
	});
	// Suma n dias a la fecha d y devuelve la nueva fecha
	engine.setFunction('user', 'ADD2DATE', 2, (d, n) => {
		const date = new Date(d);
		date.setDate(date.getDate() + parseInt(n));
		return date.toISOString().split('T')[0];
	});
	// Devuelve la diferencia en dias entre dos fechas
	engine.setFunction('user', 'DATESDIF', 2, (d1, d2) => {
		return (new Date(d1) - new Date(d2))/(1000*60*60*24);
	});
	// Incorpora un elemento al inicio del array
	engine.setFunction('user', 'UNSHIFT', 2, (v, e) => {
		return v.unshift(e);
	});
	return engine;
}