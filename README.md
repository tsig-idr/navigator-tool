# Navigator Tool

The web-based Navigator Tool aims to perform modelling of nutrients recommendations, GHG emissions / removals and economic performance assessment (EPA), on a defined single crop and plot for a specified location, from a set of input data supplied by the user through an interface.

The all information of the project can be found on the [website](https://fastnavigator.eu). 

- [Getting Started](#getting-started)
    - [Running Navigator Tool](#running-navigator-tool)
        - [Compatibility](#compatibility)
            - [Node.js](#nodejs)
        - [Locally](#locally)
        - [Connect an API](#connect-an-api)
- [Goal](#goal)
    - [Actual state](#actual-state)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Interface](#interface)
- [Modules](#modules)
   - [NPK](#npk)
   - [GHG](#ghg)
   - [EPA](#ghg)

# Getting Started

The fastest and easiest way to get started is to run Navigator Tool locally.

## Running Navigator Tool

Before you start make sure you have installed:

- [NodeJS](https://www.npmjs.com/) that includes `npm`

### Compatibility

#### Node.js
Navigator Tool has been tested with the most recent releases of Node.js to ensure compatibility. 

| Version    | Latest Version | End-of-Life Date | Compatibility      |
|------------|----------------|------------------|--------------------|
| Node.js 12 | 12.22.1        | April 2022       | ✅ Fully compatible |
| Node.js 14 | 14.16.1        | April 2023       | ✅ Fully compatible |
| Node.js 15 | 15.14.0        | June 2021        | ✅ Fully compatible |


### Locally

```bash
$ git clone https://github.com/tsig-idr/navigator-tool
$ cd navigator-tool
$ npm install
$ npm run dev
```

### Connect an API

The Navigator Tool services are available in REST API format that can be requested from a Web client, cli, mobile device, etc., following the HTTP Request Methods protocol: GET and POST.

Web Services available are:

#### NPK

| URL                   | Line | HTTP Verb  | Funcionality                   | Body Example |
|-----------------------|------|------------|--------------------------------|--------------|
| /F1/SWB               | 1    | POST       | Computes simplified water balance for a daily basis | {
	"input": {
		"crop": "Trigo Blando",
		"soilDensity": 1.4,
		"soilDepth": 35,
		"soilStony": 0.15,
		"soilOrganicMaterial": 0.018,
		"soilDelta_N_NH4": 0.2,
		"soilNmin_0": 16,
		"soilDate_Nmin_0": "30/12/2014",
		"cropDate": "11/01/2015",
		"mineralizationSlowdown": 0.1,
		"waterNitrate": 15,
		"irrigation": true,
		"irrigationDose": 5,
		"root_max": 0.6,
		"Kcb_ini": 0.16,
		"Kcb_mid": 0.7,
		"Kcb_end": 0.65,
		"waterAvail": 100,
		"fw_0": 1,
		"REW":4,
		"TEW": 8,
		"De_0": 8,
		"cropYield": 9000,
		"cropExtractions": 33,
		"nitrificationPostDays": 7
	}
}
| /F1/SNB/daily         | 1    | POST       |                                |
| /F1/SNB/weekly        | 1    | POST       |                                |
| /F1/SNB/calendar      | 1    | POST       |                                |
| /F1/SNB/full          | 1    | POST       |                                |
| /F3/requirements      | 3    | POST       |                                |
| /F3/crops             | 3    | GET        |                                |
| /F3/crop/:cropID      | 3    | GET        |                                |
| /F3/soil-textures     | 3    | GET        |                                |
| /F3/fertilizers/all   | 3    | GET        |                                |
| /F3/climate-zones     | 3    | GET        |                                |



#### GHG

| URL                   | Line | HTTP Verb  | Funcionality                   |
|-----------------------|------|------------|--------------------------------|
| /G3/livestock         | 3    | POST       |                                |

#### EPA

| URL                   | Line | HTTP Verb  | Funcionality                   |
|-----------------------|------|------------|--------------------------------|
| /E3/epa               | 3    | POST       |                                |


# Goal

Develop a set of Web services the computing models of Fertilizer, F, GHG, G, and EPA, E, plus the internal associated databases, according to the different four lines of different complexity and corresponding data input. 

## Actual state

F1, F3, E3 running & tested, G3 (partial) are implemented. The modules are independent and without connections between them, a basic user interface is included for testing the models. 


# Architecture:
Navigator Tool works with the Express web application framework that can run Node.js. The system architecture is based on client server through REST web services. Communication with the tool's computational core is based on text files and requests in JSON format. 

![Image of Architecture](https://github.com/tsig-idr/navigator-tool/blob/main/.github/architecture_navigator_tool.png)

# Configuration

Navigator Tool contains the boot configuration variables in the .env file. Edit them only if necessary.

```
PORT=1345
HOST=localhost
APP_ID=myAppIdNavigatorTool
```

# Interface

Warning: This is not the final user interface of the Navigator Tool

Currently the interface is a prototype of a web interface developed in "vanilla". It is a simple interface aimed at programmers and technicians to interact with the Services API. . The interface allows the NPK, GHG and EPA models to be tested independently. In the top menu you can navigate to the active modules.

Web live: http://navigator-dev.teledeteccionysig.es

# Modules

## NPK 

Nutrient requirements calculation module: Nitrogen, Phosphorus and potassium, based on 4 lines of complexity.

* F1: Daily nutrient balance. Spatial and temporal variability. FATIMA/AgriSAT Sensor monitoring.
Parcel and crop characteristics.

* F3: Empirical models. ITAP. Crop cycle nutrient balance. parcel and crop characteristics.

## GHG 

The greenhouse gas emissions (E) at farm level are calculated based on the following equation: E = AD·EF where AD is the activity data and EF the emission factor.

* G3: The farmer provides additional qualitative information which are coupled with respective default emission factors. In addition, country specific emission factors are used which are derived from the National Inventory Reports (NIR). Qualitative information can be the method of management (e.g. geographic stratifications, no till practice, type of manure management, organic / conventional farming, fertilizer type, animal characterization, housing facilities (e.g. freestall barns with solid floors, barns with slatted floors)

## EPA 

Economic performance will consider the management of activities and take into account GHG emissions/removals, the use of fertilisers accounting, as well as all potential costs and revenues

* E3: Match with specific information (arising from on farm survey) about the nutrient, water requirements of crops and yield to assess a first proxy of efficiency (environmental and economic performance) of pilot farms. Data will be collected either using FADN (when available) or with a specific survey, which will include a visit of the farm, gathering of data with questionnaires, data analysis with dedicated tool, a report and recommendations followed by a business plan

