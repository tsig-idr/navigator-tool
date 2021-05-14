
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

/* ---- Routers ---- */
const filesRouter = require('./routes/files');
const F1Router = require('./routes/F1');
const F3Router = require('./routes/F3');
const G3Router = require('./routes/G3');
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
app.use(express.json());

app.use('/files', filesRouter());
app.use('/F1', F1Router());
app.use('/F3', F3Router());
app.use('/G3', G3Router());

app.listen(SERVER_PORT, () => {
	console.log(`App listening on port ${SERVER_PORT}`);
});

