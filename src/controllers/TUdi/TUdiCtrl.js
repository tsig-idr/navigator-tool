const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function requeriments (input, outputnames) {
		undefined  === input.fertilizers &&
			(input.fertilizers = []);
		undefined  === input.manures &&
			(input.manures = []);
		undefined  === input.prev_manures &&
			(input.prev_manures = []);
		undefined  === input.grazings &&
			(input.grazings = []);
		undefined  === input.N_atm &&
			(input.N_atm = null);
		undefined  === input.prev_export_r &&
			(input.prev_export_r = null);
		undefined  === input.prev_yield &&
			(input.prev_yield = null);
		undefined  === input.dm_h &&
			(input.dm_h = null);
		undefined  === input.Nc_h &&
			(input.Nc_h = null);
		undefined  === input.Pc_h &&
			(input.Pc_h = null);
		undefined  === input.Kc_h &&
			(input.Kc_h = null);
		undefined  === input.Nc_r &&
			(input.Nc_r = null);
		undefined  === input.Pc_r &&
			(input.Pc_r = null);
		undefined  === input.Kc_r &&
			(input.Kc_r = null);
		undefined  === input.Cc_h &&
			(input.Cc_h = null);
		undefined  === input.Cc_r &&
			(input.Cc_r = null);
		undefined  === input.prev_dm_h &&
			(input.prev_dm_h = null);
		undefined  === input.HI_est &&
			(input.HI_est = null);
		undefined  === input.prev_HI_est &&
			(input.prev_HI_est = null);
		undefined  === input.yield_wc &&
			(input.yield_wc = null);
		undefined  === input.type_irrigation &&
			(input.type_irrigation = null);
		undefined  === input.dose_irrigation &&
			(input.dose_irrigation = null);
		undefined  === input.Nc_NO3_water &&
			(input.Nc_NO3_water = null);
		undefined  === input.avg_T &&
			(input.avg_T = null);
		undefined  === input.rain_a &&
			(input.rain_a = null);
		undefined  === input.rain_w &&
			(input.rain_w = null);
		undefined  === input.ET0 &&
			(input.ET0 = null);
		undefined  === input.prev_yield_wc &&
			(input.prev_yield_wc = null);

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'TUdi', 'requirements.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	return {
		requeriments: requeriments
	}
}

function customEngine () {

	const engine = sheetscript.newStdEngine();

	engine.setFunction('user', 'STD_CSV2ARRAY', 1, filename => {
		if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
			return null;
		}
		const csv = fs.readFileSync(filename, 'utf8');
		return csv.replace(/\r/g, '').split('\n').map(line => line.split(','));
	});
	// Transforma un archivo CSV hispano a un array de arrays
	engine.setFunction('user', 'SP_CSV2ARRAY', 1, filename => {
		if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
			return null;
		}
		const csv = fs.readFileSync(filename, 'utf8');
		return csv.split('\n').map(line => {
			line = line.replace(/\r|\./g, '');
			let cols = line.split(';'),
				i;
			for (i = 1; i < cols.length; i++) {
				cols[i] = cols[i].replace(/,/g, '.');
			}
			return cols;
		});
	});
	// Equivalente a la replace 
	engine.setFunction('user', 'REPLACE', 3, (subject, search, replament) => subject.replace(search, replament));
	// Devuelve el maximo de los argumentos
	engine.setFunction('user', 'MAX', 1, function () {
		return Math.max(...arguments);
	});
	// Equivalente a la BUSCARV de Excel
	engine.setFunction('user', 'VLOOKUP', 3, (v, table, index, ranged = false) => {
		if (index && typeof table == 'object' && table.length) {
			if (ranged) {
				v = parseFloat(v);
				for (let i = table.length - 1; i >= 0; i--) {
					if (typeof table[i] == 'object' && table[i].length && parseFloat(table[i][0]) <= v) {
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
	// Equivalente a la EXP de Excel
	engine.setFunction('user', 'EXP', 1, n => Math.pow(Math.E, n));
	// Equivalente a la COINCIDIR de Excel
	engine.setFunction('user', 'MATCH', 2, (v, row, ranged = false) => {
		if (typeof row == 'object' && row.length) {
			if (ranged) {
				v = parseFloat(v);
				for (let i = row.length - 1; i >= 0; i--) {
					if (parseFloat(row[i]) <= v) {
						return i + 1;
					}
				}
			}
			else {
				for (let i = 0; i < row.length; i++) {
					if (row[i] == v) {
						return i + 1;
					}
				}
			}
		}
		return null;
	});
	return engine;
}
