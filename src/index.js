
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

/* ---- Routers ---- */
const nutrientRequirementsRouter = require('./routes/l3-nutrient-requirements');
const fertilizersRouter = require('./routes/fertilizers');
const nitrogenBalanceRouter = require('./routes/l3-nitrogen-balance');
const l1Router = require('./routes/l1');
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
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use('/nutrient-requirements', nutrientRequirementsRouter());
app.use('/fertilizers', fertilizersRouter());
app.use('/nitrogen-balance', nitrogenBalanceRouter());
app.use('/l1', l1Router());

app.listen(SERVER_PORT, () => {
	console.log(`App listening on port ${SERVER_PORT}`);
});

