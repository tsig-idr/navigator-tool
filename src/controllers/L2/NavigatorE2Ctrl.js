const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function epa (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'E2', 'epa.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input, outputnames);
		return output;
	}

	return {
		epa: epa
	}
}

function customEngine () {
	const engine = sheetscript.newStdEngine();

	// Transforma un archivo CSV estandar a un array de arrays
	engine.setFunction('user', 'STD_CSV2ARRAY', 1, filename => {
		if (!fs.existsSync(filename = path.join(path.resolve(), filename))) {
		return null;
		}
		const csv = fs.readFileSync(filename, 'utf8');
		return csv.replace(/\r/g, '').split('\n').map(line => line.split(','));
	});
	return engine;
}