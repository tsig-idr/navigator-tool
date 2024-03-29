# Navigator Tool

The web-based Navigator Tool aims to perform modelling of nutrients recommendations, GHG emissions / removals and economic performance assessment (EPA), on a defined single crop and plot for a specified location, from a set of input data supplied by the user through an interface.


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

https://app.swaggerhub.com/apis-docs/tsig-idr/navigator-tool/0.0.1


# Goal

Develop a set of Web services the computing models of Fertilizer, F, GHG, G, and EPA, E, plus the internal associated databases, according to the different four lines of different complexity and corresponding data input. 

## Actual state

All lines of F, G and E have been completed based on the defined digital models.

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

Web live: http://tool.fastnavigator.eu

# Modules

## NPK 

Nutrient requirements calculation module: Nitrogen, Phosphorus and potassium, based on 4 lines of complexity.

* F1: Daily nutrient balance. Spatial and temporal variability. FATIMA/AgriSAT Sensor monitoring.
Parcel and crop characteristics.

* F2: Daily nutrient balance.

* F3: Empirical models. ITAP. Crop cycle nutrient balance. parcel and crop characteristics.

* F4: Same as F3 but with simplified user inputs.

## GHG 

The greenhouse gas emissions (E) at farm level are calculated based on the following equation: E = AD·EF where AD is the activity data and EF the emission factor.

## EPA 

Economic performance will consider the management of activities and take into account GHG emissions/removals, the use of fertilisers accounting, as well as all potential costs and revenues


# Language

The application is developed in English language, in the future multi-language support is foreseen.


