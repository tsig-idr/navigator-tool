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

#### NPK

| URL                   | Line | HTTP Verb | Funcionality |
|-----------------------|------|-----------|--------------|
| /F1/SWB               | 1    | POST      | Computes and returns a simplified water balance on a daily basis |
| /F1/SNB/daily         | 1    | POST      | Computes and returns a nitrogen balance on a daily basis |
| /F1/SNB/weekly        | 1    | POST      | Computes and returns a nitrogen balance on a weekly basis |
| /F1/SNB/calendar      | 1    | POST      | Computes and returns a calendar of fertilization, for which a daily nitrogen balance is computed as well but not returned |
| /F1/SNB/full          | 1    | POST      | Computes and returns a daily nitrogen balance, a weekly nitrogen balance, and a calendar of fertilization |
| /F3/requirements      | 3    | POST      | Computes and returns NPK requirements as well as the best fertilization to meet those requirements |
| /F3/crops             | 3    | GET       | Returns data of all the crops available in the system |
| /F3/crop/:cropID      | 3    | GET       | Returns data of the crop identified by "cropID" |
| /F3/soil-textures     | 3    | GET       | Returns data of all the soil textures available in the system |
| /F3/fertilizers/all   | 3    | GET       | Returns data of all the fertilizers available in the system |
| /F3/climate-zones     | 3    | GET       | Returns data of all the climitic zones available in the system |
| /F4/requiriments      | 4    | POST      | Computes and returns NPK requirements as well as the best fertilization to meet those requirements |

From above services, the ones belonging to **line 1** share the same input params which should be sent in the body of their POST requests. An example of JSON corresponding to such a body is as follows.
```JSON
{
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
```
For its part, the input params which should be sent in the body of the POST request for that one service belonging to **line 3** can be seen in this JSON:
```JSON
{
	"input": {
		"crop_type": "BARLEY_6_ROW",
		"soil_texture": "loam",
		"Pc_method": "olsen",
		"climatic_zone": "atlantic",
		"water_supply": "1",
		"type_irrigated": "sprinkler",
		"PK_strategy": "maximum-yield",
		"tilled": "yes",
		"export_r": 100,
		"depth_s": 0.5,
		"HI_est": 40,
		"Nc_h": 2.3,
		"Pc_h": 0.36,
		"Kc_h": 0.49,
		"Pc_s": 10,
		"Kc_s": 10,
		"yield": 10000,
		"pH": 8,
		"CEC": 100,
		"CV": 20,
		"SOM": 1.8,
		"Nc_s_initial": 4,
		"Nc_end": 5,
		"dose_irrigation": 4000 ,
		"Nc_NO3_water": 25,
		"rain_a": 800,
		"rain_w": 480
	}
}
```

And the input params which should be sent in the body of the POST request for that one service belonging to **line 4** can be seen in this JSON:
```JSON
{
	"input": {
		"crop_type": "BARLEY_6_ROW",
		"yield": 10000,
		"water_supply": "1",
		"climatic_zone": "atlantic",
	}
}
```

#### GHG

| URL                   | Line | HTTP Verb  | Funcionality                   |
|-----------------------|------|------------|--------------------------------|
| /G3/livestock         | 3    | POST       | Computes and returns the GHG emissions produced by the livestock of the farm |
| /G3/energy            | 3    | POST       | Computes and returns the GHG emissions produced by energy consumed/produced by the farm |
| /G3/luc               | 3    | POST       | Computes and returns the GHG emissions produced by any land use changes, natural infrastructures or forestry in the farm |
| /G3/crops             | 3    | POST       | Computes and returns the GHG emissions produced by crops production in the farm |

An example of the body request for the livestock URL is
```JSON
{
	"input": {
		"d_c_4000": "1",
		"d_c_6000": "1",
		"d_c_8000": "1",
		"d_c_10000": "1",
		"d_c_mature": "1",
		"d_c_calves": "1",
		"d_c_growing_1": "1",
		"d_c_growing_2": "1",
		"m_c_mature": "1",
		"m_c_calves": "1",
		"m_c_growing_1": "1",
		"m_c_growing_2": "1",
		"s_mature": "1",
		"s_growing": "1",
		"g_mature": "1",
		"g_growing": "1",
		"p_mature": "1",
		"p_growing": "1",
		"r_others": "1",
		"po_hen": "1",
		"po_broiler": "1",
		"po_other": "1",
		"p_mature_feed": "10",
		"p_growing_feed": "10",
		"po_hen_feed": "10",
		"po_broiler_feed": "10",
		"po_other_feed": "10"
	}
}
```

An example of the body request for the energy URL is
```JSON
{
    "input": {
        "electricity": [
            {
                "type": "Electricity EU average mix (≥110 kV)",
                "amount": "100"
            }
        ],
        "energy": [
            {
                "type": "Fuel oil",
                "amount": "100"
            }
        ],
        "biomass": [
            {
                "type": "Woodchips forestry residues",
                "amount": "100"
            }
        ],
        "fuels": [
            {
                "type": "Fuel oil",
                "amount": "100"
            }
        ]
    }
}
```

An example of the body request for the luc URL is
```JSON
{
    "input": {
        "forest2cropland": "200",
        "forest2grassland": "200",
        "grassland2cropland": "200",
        "grassland2forest": "200",
        "cropland2grassland": "200",
        "cropland2forest": "200",
        "infrastructures": {
            "trees": [
                {
                    "country": "Belgium",
                    "type": "Grove < 0,5 ha",
                    "quality": "average",
                    "width": "100",
                    "length": "100"
                }
            ],
            "shrubby": [
                {
                    "country": "Belgium",
                    "type": "Shrubby hedgerow",
                    "quality": "average",
                    "width": "100",
                    "length": "100"
                }
            ],
            "orchards": [
                {
                    "country": "Belgium",
                    "type": "Vineyard (vine stock)",
                    "surface": "10000"
                }
            ],
            "low": [
                {
                    "country": "Belgium",
                    "type": "Grass strips",
                    "quality": "average",
                    "width": "100",
                    "length": "100"
                }
            ]
        },
        "forests": [
            {
                "ecozone": "Temperate continental",
                "age": ">20y",
                "type": "coniferous",
                "volume_t": "41-100",
                "volume_b": "<20",
                "surface": "200",
                "wood": "",
                "bark": "433",
                "lost": "10",
                "area": "34"
            },
            {
                "ecozone": "Boreal tundra",
                "age": ">20y",
                "type": "broadleaf",
                "volume_t": "21-40",
                "volume_b": "51-100",
                "surface": "200",
                "wood": "",
                "bark": "433",
                "lost": "10",
                "area": "34"
            }
        ]
    }
}
```

An example of the body request for the crops URL is
```JSON
{
    "input": {
        "crops": [
            {
                "cropID": "MILLET_FINGER",
                "crop_name": "Millet (finger)",
                "area": "200",
                "yield": "9",
                "SOM": "1.8",
                "tilled": "yes",
                "drain_rate": "Low",
                "combustible": "Diesel",
                "consumption": "1",
                "residues": "incorporated",
                "spread": "yes",
                "removed": "no",
                "seeds": "30",
                "herb": "0",
                "fung": "0",
                "insect": "0",
                "otreat": "0",
                "nutrient_requirements": {
                    "Noutputs_terms": {
                        "Nleaching": "10.919485976111996",
                        "Nvolatilization": "48.10751231421483"
                    }
                },
                "fertilization": [
                    {
                        "fertilizerID": "ps",
                        "fertilizer_name": "Poultry slurry",
                        "amount": "33577.401056999995"
                    }
                ]
            }
        ],
        "climate": "warm temperate dry",
        "temp_reg": "temperate boreal",
        "moist_reg": "dry",
        "soil": "Arenosol"
    }
}
```

#### EPA

| URL                   | Line | HTTP Verb  | Funcionality                   |
|-----------------------|------|------------|--------------------------------|
| /E3/epa               | 3    | POST       | Computes and returns a set of economic variables for the farm |

An example of the body request is
```JSON
{
  "input": {
    "SC": "123546",
    "OCS": "9624",
    "HWC": "20949",
    "MWC": "6478",
    "TGV": "208638"
  }
}
```

# Goal

Develop a set of Web services the computing models of Fertilizer, F, GHG, G, and EPA, E, plus the internal associated databases, according to the different four lines of different complexity and corresponding data input. 

## Actual state

F3 running & tested meanwhile F1, F4, G3 and E3 just running. The modules are independent and without connections between them, a basic user interface is included for testing the models. 


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

* F4: Same as F3 but with simplified user inputs.

## GHG 

The greenhouse gas emissions (E) at farm level are calculated based on the following equation: E = AD·EF where AD is the activity data and EF the emission factor.

* G3: The farmer provides additional qualitative information which are coupled with respective default emission factors. In addition, country specific emission factors are used which are derived from the National Inventory Reports (NIR). Qualitative information can be the method of management (e.g. geographic stratifications, no till practice, type of manure management, organic / conventional farming, fertilizer type, animal characterization, housing facilities (e.g. freestall barns with solid floors, barns with slatted floors)

## EPA 

Economic performance will consider the management of activities and take into account GHG emissions/removals, the use of fertilisers accounting, as well as all potential costs and revenues

* E3: Match with specific information (arising from on farm survey) about the nutrient, water requirements of crops and yield to assess a first proxy of efficiency (environmental and economic performance) of pilot farms. Data will be collected either using FADN (when available) or with a specific survey, which will include a visit of the farm, gathering of data with questionnaires, data analysis with dedicated tool, a report and recommendations followed by a business plan

