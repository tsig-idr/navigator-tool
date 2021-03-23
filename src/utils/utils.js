const fs = require('fs');
const path = require('path');

/**** UTILS ******/
async function readFile(file) {

  const rawdata = fs.readFileSync(file);
  const objData = JSON.parse(rawdata);

  return objData;
}

function pathDirectoryFiles() {
  let absPath = path.resolve() + '/files';

  if (process.env.FILES_STORED_DIRECTORY) {
    absPath = process.env.FILES_STORED_DIRECTORY;
  }

  return absPath;
}

function absolutePathSource(lyr) {

  let abspath = path.resolve();
  const source = lyr.get('source');

  if (source.type === 'filesystem') {
    const base = pathDirectoryFiles();
    abspath = path.join(base, source.bucket, source.path);
  }

  return abspath;
}

function absolutePathBucket(lyr) {

  let abspath = path.resolve();
  const source = lyr.get('source');

  if (source.type === 'filesystem') {
    const base = pathDirectoryFiles();
    abspath = path.join(base, source.bucket, '/');
  }

  return abspath;
}

function epsgCode(epsg){
  if(epsg.toUpperCase().startsWith('EPSG:'))
    return epsg.substring(5, epsg.length);

  return epsg;
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function compare(arr1, arr2) {

  if (!arr1 || !arr2) return

  let result;

  arr1.forEach((e1, i) => arr2.forEach(e2 => {

    if (e1.length > 1 && e2.length) {
      result = compare(e1, e2);
    } else if (e1 !== e2) {
      result = false
    } else {
      result = true
    }
  })
  )

  return result
}

function checkRequiredParams(req, listParams) {

  const errors = []; 

  listParams.forEach(elem => {
      if (!req.query[elem] && !req.params[elem] && !req.body[elem])
        errors.push({ error: 'Required ' +elem+' parameter' })
  })
  
  return errors;
}

function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}


function tile2long(x, z) {
  return (x / Math.pow(2, z) * 360 - 180);
}

function tile2lat(y, z) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function tile2boundingBox(x, y, zoom) {
  const bb = {};
  bb.minx = tile2long(x, zoom);
  bb.maxy = tile2lat(y + 1, zoom);
  bb.maxx = tile2long(x + 1, zoom);
  bb.miny = tile2lat(y, zoom);

  return bb; //  [minx, maxy, maxx, miny]
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function isNumeric(x) {

  // check if the passed value is a number
  if(typeof x == 'number' && !isNaN(x)){
  
      // check if it is integer
      if (Number.isInteger(x)) {
        return true;
        //console.log(`${x} is integer.`);
      }
      else {
        return true;
        //console.log(`${x} is a float value.`);
      }
  
  } else {
      return false;
      //console.log(`${x} is not a number`);
  }
}

function parseToNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}



module.exports = {
  readFile: readFile,
  pathDirectoryFiles: pathDirectoryFiles,
  absolutePathBucket: absolutePathBucket,
  absolutePathSource: absolutePathSource,
  checkRequiredParams: checkRequiredParams,
  long2tile: long2tile,
  lat2tile: lat2tile,
  tile2long: tile2long,
  tile2lat: tile2lat,
  tile2boundingBox: tile2boundingBox,
  makeid: makeid,
  arrayCompare: compare,
  epsgCode: epsgCode,
  camelize: camelize,
  isNumeric: isNumeric,
  parseToNumeric: parseToNumeric

}
