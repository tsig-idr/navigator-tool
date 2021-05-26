const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {
// Kc_method, CEC, pH, Nc_h, Kc_h, Pc_h
	async function requeriments (input, outputnames) {
		!input &&
			(input = {
				cropID: 'BARLEY_6_ROW',
				soil_texture: 'loam',
				Pc_method: 'olsen',
				climatic_zone: 'atlantic',
				water_supply: '1',
				type_irrigated: 'sprinkler',
				PK_strategy: 'maximum-yield',
				tilled: 'no',
				yield: 10000,
				export_r: 100,
				depth_s: 0.5,
				HI_est: 40,
				CV: 20,
				Pc_s: 10,
				Kc_s: 0.026,
				SOM: 1.8,
				Nc_s_initial: 4,
				Nc_end: 5,
				dose_irrigation: 4000,
				Nc_NO3_water: 25,
				rain_a: 800,
				rain_w: 480,
			});
		!input.fertilizers &&
			(input.fertilizers = []);
		input.Pc_s_0 = input.Pc_s;
		input.Kc_s_0 = input.Kc_s;
		input.Nc_s_0 = input.Nc_s_initial;
		input.Nc_s_n = input.Nc_end;

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'F3', 'requirements.sc'), 'utf8'),
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

	// Transforma un archivo CSV hispano a un array de arrays
	engine.setFunction('user', 'SP_CSV2ARRAY', 1, filename => {
		if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
			return null;
		}
		const csv = fs.readFileSync(filename, 'utf8');
		return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
	});
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
						return i;
					}
				}
			}
			else {
				for (let i = 0; i < row.length; i++) {
					if (row[i] == v) {
						return i;
					}
				}
			}
		}
		return null;
	});
	return engine;
}