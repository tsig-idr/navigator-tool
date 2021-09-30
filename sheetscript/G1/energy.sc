CO24electricity = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'CO24electricity.csv'))
CO24energy = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'CO24energy.csv'))
CO24biomass = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'CO24biomass.csv'))
CO24fuels = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'CO24fuels.csv'))

CO2fromElectricity = CO2fromEnergy = CO2fromBiomass = CO2fromFuels = 0

n = LEN (electricity)
i = 0
while i < n then begin '{'
	row = GET (electricity, i)
	type = GET (row, 'type')
	amount = GET (row, 'amount')
	CO2EF = IF_ERROR (VLOOKUP (type; CO24electricity; 4); 0)
	CO2fromElectricity = CO2fromElectricity + amount*CO2EF
	i = i + 1
'}' end

n = LEN (energy)
i = 0
while i < n then begin '{'
	row = GET (energy, i)
	type = GET (row, 'type')
	amount = GET (row, 'amount')
	CO2EF = IF_ERROR (VLOOKUP (type; CO24energy; 4); 0)
	CO2fromEnergy = CO2fromEnergy + amount*CO2EF
	i = i + 1
'}' end

n = LEN (biomass)
i = 0
while i < n then begin '{'
	row = GET (biomass, i)
	type = GET (row, 'type')
	amount = GET (row, 'amount')
	CO2EF = IF_ERROR (VLOOKUP (type; CO24biomass; 5); 0)
	CO2fromBiomass = CO2fromBiomass + amount*CO2EF
	i = i + 1
'}' end

n = LEN (fuels)
i = 0
while i < n then begin '{'
	row = GET (fuels, i)
	type = GET (row, 'type')
	amount = GET (row, 'amount')
	CO2EF = IF_ERROR (VLOOKUP (type; CO24fuels; 7); 0)
	CO2fromFuels = CO2fromFuels + amount*CO2EF
	i = i + 1
'}' end

CO2fromAll = SUM (CO2fromElectricity; CO2fromEnergy; CO2fromBiomass; CO2fromFuels)