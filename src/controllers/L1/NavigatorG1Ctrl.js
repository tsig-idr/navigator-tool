const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function livestock (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'G1', 'livestock.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function crops (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'G1', 'crops.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function luc (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'G1', 'luc.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	async function energy (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'G1', 'energy.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	return {
		livestock: livestock,
		crops: crops,
		luc: luc,
		energy: energy
	}
}

function customEngine () {

	const engine = sheetscript.newStdEngine();

	// Similiar a IF_ERROR pero con arrays 
	engine.setFunction('user', 'IF_VOID', 2, (list, replacement) => !list.length && replacement || list);
	// Transforma un archivo CSV estandar a un array de arrays
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
		return csv.replace(/\r|\./g, '').replace(/,/g, '.').split('\n').map(line => line.split(';'));
	});
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
	// Variante de VLOOKUP que relaja el criterio de matching
	engine.setFunction('user', 'VLOOKUP_NONSTRICT', 3, (v, table, index) => {
		if (index && typeof table == 'object' && table.length) {
			for (let i = 0, a, b, j, k; i < table.length; i++) {
				if (typeof table[i] == 'object' && table[i].length) {
					a = table[i][0].toLowerCase().split(' ');
					b = v.toLowerCase().split(' ');
					for (j = 0; j < a.length; j++) {
						for (k = 0; k < b.length; k++) {
							if (a[j] == b[k]) {
								return table[i][index - 1];
							}
						}
					}
				}
			}
		}
		return null;
	});
	return engine;
}