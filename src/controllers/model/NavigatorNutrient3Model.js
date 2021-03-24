'use strict';
const path = require('path');
const fs = require('fs');

class NavigatorNutrient3Model {

  constructor() {
    this.pathDataSource = null;
    this.pathParamsData = null;
    //data:
    this.crops = [];
    this.parameters = {};

    this._init();

  }

   _init() {

    this.pathDataSource = path.join(path.resolve(), 'data', 'crops-data-excel.json');
    this.crops = JSON.parse(fs.readFileSync(this.pathDataSource, 'utf8'));

    this.pathDataSource = path.join(path.resolve(), 'data', 'n3-fertilicalc-params-data.json');
    this.parameters = JSON.parse(fs.readFileSync(this.pathDataSource, 'utf8'));

  }

  async getCrops() {
    return this.crops;
  }

  async getCropsByCropID(cropID){
    return this.crops.find(x => x.cropID === cropID);
  }

  async getParameters() {
    return this.parameters;
  }

  async getParmsStrategies(){
    return this.parameters.strategies;
  }

  async getParmsStrategy(strategy){

    const straNumber = parseInt(strategy)

    if (!Number.isInteger(straNumber) && (typeof strategy === 'string' || strategy instanceof String ))
      return this.parameters.strategies.find(x => x.title == strategy.toLowerCase());
    else
      return this.parameters.strategies.find(x => x.value == straNumber);
  }

  async getParmsTypeOfSoils(){
    return this.parameters.types_of_soil;
  }

  async getParmsTypeOfSoil(type){
    return this.parameters.types_of_soil.find(x => x.type == type);
  }

  async getParmsNutrients(){
    return this.parameters.nutrients;
  }

}

module.exports = NavigatorNutrient3Model;