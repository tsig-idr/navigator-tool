SOC4LUC = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4LUC.csv'))
SOC4trees = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4trees.csv'))
SOC4shrubby = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4shrubby.csv'))
SOC4low = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'SOC4low.csv'))

incC = 0.1
Cstock = 0.475
conversion = 0.502

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
	soc = IF_ERROR (GET (row, 'soc'); 0)
	increase = IF_ERROR (GET (row, 'increase'); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + surface*soc*44/12
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*increase*44/12
	i = i + 1
'}' end
n = LEN (shrubby)
i = 0
while i < n then begin '{'
	row = GET (shrubby, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'width'); 0)*IF_ERROR (GET (row, 'length'); 0)/10000
	soc = IF_ERROR (GET (row, 'soc'); 0)
	increase = IF_ERROR (GET (row, 'increase'); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + surface*soc*44/12
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*increase*44/12
	i = i + 1
'}' end
n = LEN (orchards)
i = 0
while i < n then begin '{'
	row = GET (orchards, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'surface'); 0)
	soc = IF_ERROR (GET (row, 'soc'); 0)
	increase = IF_ERROR (GET (row, 'increase'); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + surface*soc*44/12
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*increase*44/12
	i = i + 1
'}' end
n = LEN (low)
i = 0
while i < n then begin '{'
	row = GET (low, i)
	type = GET (row, 'type')
	surface = IF_ERROR (GET (row, 'width'); 0)*IF_ERROR (GET (row, 'length'); 0)/10000
	soc = IF_ERROR (GET (row, 'soc'); 0)
	increase = IF_ERROR (GET (row, 'increase'); 0)
	CO2fromInfrastructures = CO2fromInfrastructures + surface*soc*44/12
	CO2AfromInfrastructures = CO2AfromInfrastructures + surface*increase*44/12
	i = i + 1
'}' end

n = LEN (forests)
i = 0
while i < n then begin '{'
	row = GET (forests, i)
	surface = IF_ERROR (GET (row, 'surface'); 0)
	soc = GET (row, 'soc')
	volume_t = GET (row, 'volume_t')
	CO2fromForests = CO2fromForests + soc*surface*44/12
	CO2AfromForests = CO2AfromForests + volume_t*surface*Cstock*conversion*44/12
	i = i + 1
'}' end

CO2fromForest2cropland = IF (forest2cropland; forest2cropland*VLOOKUP ('Conversion of forest to cropland'; SOC4LUC; 2)*44/12; 0)
CO2fromForest2grassland = IF (forest2grassland; forest2grassland*VLOOKUP ('Conversion of forest to grassland'; SOC4LUC; 2)*44/12; 0)
CO2fromGrassland2cropland = IF (grassland2cropland; grassland2cropland*VLOOKUP ('Conversion of grassland to cropland'; SOC4LUC; 2)*44/12; 0)
CO2fromGrassland2forest = IF (grassland2forest; grassland2forest*VLOOKUP ('Conversion of grassland to forest'; SOC4LUC; 2)*44/12; 0)
CO2fromCropland2grassland = IF (cropland2grassland; cropland2grassland*VLOOKUP ('Conversion of cropland to grassland'; SOC4LUC; 2)*44/12; 0)
CO2fromCropland2forest = IF (cropland2forest; cropland2forest*VLOOKUP ('Conversion of cropland to forest'; SOC4LUC; 2)*44/12; 0)
CO2fromLUC = SUM (CO2fromForest2cropland; CO2fromForest2grassland; CO2fromGrassland2cropland; CO2fromGrassland2forest; CO2fromCropland2grassland; CO2fromCropland2forest)
