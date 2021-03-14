const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function nitro (input) {

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'nitro.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, ['nitro4day']);
		return output;
	}

	async function swb (input) {

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'swb.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input);
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

	// Genera un listado de N fechas a partir de una determinada
	engine.setFunction('user', 'GENNDATES', 2, (start, n) => {
		const t_0 = new Date(start).getTime(),
			t_day = 1000*60*60*24,
			dates = [],
			formatDate = function (date) {
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
	return engine;
}