SOC4forest = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4forest.csv'))
BCEF = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'BCEF.csv'))
SOC4LUC = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4LUC.csv'))
SOC4trees = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4trees.csv'))
SOC4shrubby = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4shrubby.csv'))
SOC4low = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4low.csv'))

incC = 0.1

CO2fromInfrastructures = CO2fromForests = 0
CO2AfromInfrastructures = CO2AfromForests = 0

trees = GET (infrastructures, 'trees')
orchards = GET (infrastructures, 'orchards')
shrubby = GET (infrastructures, 'shrubby')
low = GET (infrastructures, 'low')

n = LEN (trees)
i = 0
while i < n then begin '{'
	row = GET (trees, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'width'); 0)*IF_ERROR (GET (row, 'length'); 0)/10000
	soc = IF_ERROR (VLOOKUP (type; SOC4trees; 3); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + IF (soc; surface*soc*44/12; 0)
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*incC*44/12
	i = i + 1
'}' end
n = LEN (shrubby)
i = 0
while i < n then begin '{'
	row = GET (shrubby, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'width'); 0)*IF_ERROR (GET (row, 'length'); 0)/10000
	soc = IF_ERROR (VLOOKUP (type; SOC4shrubby; 3); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + IF (soc; surface*soc*44/12; 0)
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*incC*44/12
	i = i + 1
'}' end
n = LEN (orchards)
i = 0
while i < n then begin '{'
	row = GET (orchards, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'surface'); 0)
	soc = IF_ERROR (VLOOKUP (type; SOC4shrubby; 3); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + IF (surface && soc; surface*soc*44/12; 0)
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*incC*44/12
	i = i + 1
'}' end
n = LEN (low)
i = 0
while i < n then begin '{'
	row = GET (low, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'width'); 0)*IF_ERROR (GET (row, 'length'); 0)/10000
	soc = IF_ERROR (VLOOKUP (type; SOC4low; 3); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + IF (soc; surface*soc*44/12; 0)
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*incC*44/12
	i = i + 1
'}' end

n = LEN (forests)
i = 0
while i < n then begin '{'
	row = GET (forests, i)
	ecozone = GET (row, 'ecozone')
	age = GET (row, 'age')
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'surface'); 0)
	volume_t = GET (row, 'volume_t')
	volume_b = GET (row, 'volume_b')
	wood = IF_ERROR (GET (row, 'wood'); 0)
	bark = IF_ERROR (GET (row, 'bark'); 0)
	area = IF_ERROR (GET (row, 'area'); 0)
	lost = IF_ERROR (GET (row, 'lost'); 0)
	fullname_g = SUM (ecozone; ' '; age; ' '; type)
	soc = VLOOKUP (fullname_g; SOC4forest; 2)*surface
	biomassGain = VLOOKUP (fullname_g; SOC4forest; 3)*(1 + VLOOKUP (fullname_g; SOC4forest; 4))*VLOOKUP (fullname_g; SOC4forest; 5)*surface
	fullname_l = IF (LIKE (ecozone, 'Temperate'); SUM ('Temperate '; type; ' '; volume_t); SUM ('Boreal '; type; ' '; volume_b))
	biomassLoss_wood = wood*VLOOKUP (fullname_l; BCEF; 2)*(1 + bark + VLOOKUP (fullname_g; SOC4forest; 4))*VLOOKUP (fullname_g; SOC4forest; 5)
	biomassLoss_fuel = area*VLOOKUP (fullname_g; SOC4forest; 3)*(1 + VLOOKUP (fullname_g; SOC4forest; 4))*VLOOKUP (fullname_g; SOC4forest; 5)*lost	
	CO2fromForests = CO2fromForests + soc
	CO2AfromForests = CO2AfromForests + (biomassGain - biomassLoss_wood - biomassLoss_fuel)*44/12
	i = i + 1
'}' end

CO2fromForest2cropland = IF (forest2cropland; forest2cropland*VLOOKUP ('Conversion of forest to cropland'; SOC4LUC; 2)*44/12; 0)
CO2fromForest2grassland = IF (forest2grassland; forest2grassland*VLOOKUP ('Conversion of forest to grassland'; SOC4LUC; 2)*44/12; 0)
CO2fromGrassland2cropland = IF (grassland2cropland; grassland2cropland*VLOOKUP ('Conversion of grassland to cropland'; SOC4LUC; 2)*44/12; 0)
CO2fromGrassland2forest = IF (grassland2forest; grassland2forest*VLOOKUP ('Conversion of grassland to forest'; SOC4LUC; 2)*44/12; 0)
CO2fromCropland2grassland = IF (cropland2grassland; cropland2grassland*VLOOKUP ('Conversion of cropland to grassland'; SOC4LUC; 2)*44/12; 0)
CO2fromCropland2forest = IF (cropland2forest; cropland2forest*VLOOKUP ('Conversion of cropland to forest'; SOC4LUC; 2)*44/12; 0)
CO2fromLUC = SUM (CO2fromForest2cropland; CO2fromForest2grassland; CO2fromGrassland2cropland; CO2fromGrassland2forest; CO2fromCropland2grassland; CO2fromCropland2forest)
