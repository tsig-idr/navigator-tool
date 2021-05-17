const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function livestock (input, outputnames) {
		!input &&
			(input = {
				uid: 'default',
				d_c_4000: 1,
				d_c_6000: 1,
				d_c_8000: 1,
				d_c_10000: 1,
				d_c_calves: 1,
				d_c_growing_1: 1,
				d_c_growing_2: 1,
				d_c_mature: 1,
				m_c_mature: 1,
				m_c_calves: 1,
				m_c_growing_1: 1,
				m_c_growing_2: 1,
				s_mature: 1,
				s_growing: 1,
				g_mature: 1,
				g_growing: 1,
				r_others: 1,
				p_mature: 1,
				p_growing: 1,
				po_hen: 1,
				po_broiler: 1,
				po_other: 1,
				p_mature_feed: 0.1,
				p_growing_feed: 0.1,
				po_hen_feed: 0.1,
				po_broiler_feed: 0.1,
				po_other_feed: 0.1
			});
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'G3', 'livestock.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	return {
		livestock: livestock
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