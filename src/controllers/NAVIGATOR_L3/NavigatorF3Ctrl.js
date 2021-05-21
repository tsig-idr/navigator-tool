const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function requeriments (input, outputnames) {
		!input &&
			(input = {
				uid: 'default',
				crop: 'BARLEY_6_ROW',
				soil: 'Loam',
				pc_method: 'Olsen',
				yield: 10000,
				residues: 100,
				depth: 0.5,
				cv: 0.2,
				pc_s: 10
			});
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
	return engine;
}