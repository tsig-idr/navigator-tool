const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

/* ---- Routers ---- */

const npkNutrientsRouter = require('./routes/npk-nutrients');


/* ----------------- */

dotenv.config();

const SERVER_PORT = process.env.PORT || 1339;
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

//app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.urlencoded());
app.use(bodyParser.json({
  limit: '200mb'
})); //app.use(express.json());


// Rutas de ejemplo para probar el acceso fuera de Parse y el acceso a datos
app.use('/nutrients', npkNutrientsRouter());


app.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}`);
});

