const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function epa (input, outputnames) {
		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'E3', 'epa.sc'), 'utf8'),
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

	// De momento no se necesitan funciones adicionales para este modulo: se utiliza el motor estandar
	return engine;
}