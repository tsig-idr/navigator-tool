const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function nitro (input, outputnames) {

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'nitro.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function swb (input, outputnames) {

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'swb.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	return {
		nitro: nitro,
		swb: swb
	}
}

function customEngine () {

	const engine = sheetscript.newStdEngine();

	/* Aqui las nuevas funciones que vayamos necesitando... */

	// Genera un listado de N fechas (en formato hispano) a partir de una determinada
	engine.setFunction('user', 'GENNDATES', 2, (start, n) => {
		(start = start.split('/')) &&
		(start = `${start[2]}/${start[1]}/${start[0]}`);
		const t_0 = new Date(start).getTime(),
			t_day = 1000*60*60*24,
			dates = [],
			formatDate = date => {
				var day = date.getDate();
					month = date.getMonth() + 1;
				day < 10 &&
					(day = `0${day}`);
				month < 10 &&
					(month = `0${month}`);
				return `${day}/${month}/${date.getFullYear()}`;
			};
		for (let i = 0, t;  i < n; i++) {
			t = t_0 + i*t_day;
			dates.push(formatDate(new Date(t)));
		}
		return dates;
	});
	// Convierte un listado de tuplas (fecha, valor) interpolando al dia 
	engine.setFunction('user', 'LINTER4DATES', 1, (tuples, spanish) => {
		if (typeof tuples != 'object' || !tuples.length || tuples.length < 2 || typeof tuples[0] != 'object' || !tuples[0].length || tuples[0].length < 2) {
			return tuples;
		}
		const t_day = 1000*60*60*24,
			formatTime = t => {
				var date = new Date(t),
					day = date.getDate();
					month = date.getMonth() + 1;
				day < 10 &&
					(day = `0${day}`);
				month < 10 &&
					(month = `0${month}`);
				return `${day}/${month}/${date.getFullYear()}`;
			};
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
	engine.setFunction('user', 'SP_CSV2ARRAY', 1, filename => {
		const csv = fs.readFileSync(path.join(path.resolve(), filename), 'utf8');
		return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
	});
	// Transforma un archivo CSV estandar a un array de arrays
	engine.setFunction('user', 'STD_CSV2ARRAY', 1, filename => {
		const csv = fs.readFileSync(path.join(path.resolve(), filename), 'utf8');
		return csv.replace(/\r/g, '').split('\n').map(line => line.split(','));
	});
	// Equivalente a la BUSCARV de Excel
	engine.setFunction('user', 'VLOOKUP', 3, (v, table, index) => {
		if (index && typeof table == 'object' && table.length) {
			for (let i = 0; i < table.length; i++) {
				if (typeof table[i] == 'object' && table[i].length && table[i][0] == v) {
					return table[i][index - 1];
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
		date = date.split('/');
		date = new Date(`${date[2]}/${date[1]}/${date[0]}`);
		date.setUTCDate(date.getUTCDate() + 4 - date.getUTCDay() || 7);
		return Math.ceil(((date - new Date(Date.UTC(date.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
	});
	// Devuelve el dia de la fecha representada por s
	engine.setFunction('user', 'DAY', 1, s => parseInt(s.split('/')[0]));
	// Devuelve el mes de la fecha representada por s
	engine.setFunction('user', 'MONTH', 1, s => parseInt(s.split('/')[1]));
	// Devuelve el anyo de la fecha representada por s
	engine.setFunction('user', 'YEAR', 1, s => parseInt(s.split('/')[2]));
	// Devuelve el residuo de n/d
	engine.setFunction('user', 'MOD', 2, (n, d) => n - d*Math.floor(n/d));
	// Devuelve el maximo de los argumentos
	engine.setFunction('user', 'MAX', 1, function () {
		return Math.max(...arguments);
	});
	// Devuelve el minimo de los argumentos
	engine.setFunction('user', 'MIN', 1, function () {
		return Math.min(...arguments);
	});
	return engine;
}