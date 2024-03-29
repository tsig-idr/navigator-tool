
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

/* ---- Routers ---- */
const F1Router = require('./routes/F1').router;
const F2Router = require('./routes/F2').router;
const F3Router = require('./routes/F3').router;
const F4Router = require('./routes/F4').router;
const G1Router = require('./routes/G1').router;
const G2Router = require('./routes/G2').router;
const G3Router = require('./routes/G3').router;
const G4Router = require('./routes/G4').router;
const E1Router = require('./routes/E1').router;
const E2Router = require('./routes/E2').router;
const FGERouter = require('./routes/FGE').router;
const TUdiRouter = require('./routes/TUdi').router;
const SIARRouter = require('./routes/SIAR').router;
/* ----------------- */

dotenv.config();

const SERVER_PORT = process.env.PORT || 1345;
const SERVER_HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.APP_ID || 'myAppIdNAVIGATORTool';
const MASTER_KEY = process.env.MASTER_KEY;
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/nvtool';
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const FILES_STORED_DIRECTORY = process.env.FILES_STORED_DIRECTORY;

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({
	extended: true
}));
app.use(express.json({
	limit: '50mb'
}));
app.use('/F1', F1Router());
app.use('/F2', F2Router());
app.use('/F3', F3Router());
app.use('/F4', F4Router());
app.use('/G1', G1Router());
app.use('/G2', G2Router());
app.use('/G3', G3Router());
app.use('/G4', G4Router());
app.use('/E1', E1Router());
app.use('/E2', E2Router());
app.use('/FGE', FGERouter());
app.use('/TUdi', TUdiRouter());
app.use('/SIAR', SIARRouter());

app.listen(SERVER_PORT, () => {
	console.log(`App listening on port ${SERVER_PORT}`);
});

