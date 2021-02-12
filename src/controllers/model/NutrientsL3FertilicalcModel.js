'use strict';
const path = require('path');
const fs = require('fs');

class NutrientsL3FertilicalcModel {

  constructor() {
    this.pathDataSource = null;
    this.pathParamsData = null;
    //data:
    this.crops = [];
    this.parameters = {};

    this._init();

  }

   _init() {
    // fertilicalc-crops-data.json 
    this.pathDataSource = path.join(path.resolve(), 'data', 'fertilicalc-crops-data.json');
    this.crops = JSON.parse(fs.readFileSync(this.pathDataSource, 'utf8'));
    // fertilicalc-params-data.json
    this.pathDataSource = path.join(path.resolve(), 'data', 'fertilicalc-params-data.json');
    this.parameters = JSON.parse(fs.readFileSync(this.pathDataSource, 'utf8'));

  }

  async getCrops() {
    return this.crops;
  }

  async getCropsByCrop(crop){
    return this.crops.find(x => x.crop === crop);
  }

  async getParameters() {
    return this.parameters;
  }

  async getParmsStrategy(strategy){

    if (typeof strategy === 'string' || strategy instanceof String)
      return this.parameters.strategies.find(x => x.title == strategy.toLowerCase());
    else
      return this.parameters.strategies.find(x => x.value == strategy);
  }

  async getParmsTypeOfSoil(type){
    return this.parameters.types_of_soil.find(x => x.type == type);
  }

  async getParmsNutrients(){
    return this.parameters.nutrients;
  }

}

module.exports = NutrientsL3FertilicalcModel;