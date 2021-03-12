const path = require('path');
const fs = require('fs');
const sheetscript = require('sheetscript');

module.exports = function () {

	async function nitro (input) {

		const code = fs.readFileSync(path.join(path.resolve(), 'sheetscript', 'nitro.sc'), 'utf8'),
			engine = customEngine(),
			output = await sheetscript.run(engine, code, input);
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

	// Aqui las nuevas funciones que vayamos necesitando...
	engine.setFunction('user', 'CSV2ARRAY', 1, filename => {
		const csv = fs.readFileSync(path.join(path.resolve(), filename), 'utf8');
		return csv.replace('\r', '').split('\n').map(line => line.split(';'));
	});
	engine.setFunction('user', 'GENDATES', 2, (start, n) => {
		const t_0 = new Date(start).getTime(),
			t_day = 1000*60*60*24,
			dates = [];
		for (let i = 0, t;  i < n; i++) {
			t = t_0 + i*t_day;
			dates.push(new Date(t).toDateString());
		}
		return dates;
	});
	return engine;
}