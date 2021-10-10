CZ = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'CZ.csv'))
Crops = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'Crops.csv'))
EF_rew = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_rew.csv'))
EF_soil = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_soil.csv'))
EF_fert = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_fert.csv'))
EF_pest = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_pest.csv'))
EF_fuel = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_fuel.csv'))
EF_seed = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'EF_seed.csv'))
Soils = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'Soils.csv'))
SOC4soil = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'SOC4soil.csv'))
FIref = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'FI.csv'))
ILref = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'InputLevel.csv'))
FMGref = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'FMG.csv'))
FLUref = STD_CSV2ARRAY (CONCAT ('sheetscript/G4/', 'FLU.csv'))
CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))

Trees = ['ALMOND', 'APPLE', 'APRICOT', 'AVOCADO', 'CHERRY', 'FIG', 'GRAPE_TABLE', 'GRAPE_WINE', 'GRAPEFRUIT', 'HAZELNUT', 'KIWI', 'LEMON', 'OLIVE', 'ORANGE', 'PEACH', 'PEAR', 'PLUM', 'POMEGRANATE', 'QUINCE', 'WALNUT']

EF_L = 0.0075
EF_V = 0.01
EF_SOC_crop = 7.9
EF_SOC_grass = 5.175
EF_DOC_tem = 0.31
EF_DOC_bor = 0.12

CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

zone = VLOOKUP (climate; CZ; 3)
soil_dom = VLOOKUP (soil; Soils; 2)
SOC_ST = VLOOKUP (climate; SOC4soil; MATCH (soil_dom; GET (SOC4soil, 0)))

CH4total = N2Ototal = CO2fromFertilization = CO2fromPesticides = CO2fromSeeds = CO2fromMachinery = 0
C_em = DOC_em = A_SOC = 0

n = LEN (crops)
i = 0
while i < n then begin '{'
	crop = GET (crops, i)
	crop_type = GET (crop, 'crop_type')
	area = GET (crop, 'area')
	yield = GET (crop, 'yield')/1000
	herb = GET (crop, 'herb')
	fung = GET (crop, 'fung')
	insect = GET (crop, 'insect')
	otreat = GET (crop, 'otreat')
	seeds = GET (crop, 'seeds')
	consumption = GET (crop, 'consumption')
	combustible = GET (crop, 'combustible')
	residues = GET (crop, 'residues')
	spread = GET (crop, 'spread')
	removed = GET (crop, 'removed')
	SOM = GET (crop, 'SOM')
	tilled = GET (crop, 'tilled')
	rewetted = GET (crop, 'rewetted')
	export_r = GET (crop, 'export_r')
	drain_rate = GET (crop, 'drain_rate')
	drained = drain_rate <> 'Very low' && drain_rate <> 'Low'
	organic = SOM > 30
	crop_name = VLOOKUP (crop_type; CropData; 3)
	output = GET (GET (crop, 'balance'), 'output')
	Nleaching = GET (output, 'Nleaching')
	Nvolatilization = GET (output, 'Nvolatilization')
	N2OfromFertilization = 0
	fertilization = GET (crop, 'fertilization')
	m = LEN (fertilization)
	j = 0
	while j < m then begin '{'
		fertilizer = GET (fertilization, j)
		fertilizer_name = GET (fertilizer, 'fertilizer_name')
		amount = GET (fertilizer, 'N')
		N2OEF = IF_ERROR (VLOOKUP (fertilizer_name; EF_fert; 9); 0.01)
		N2OfromFertilization = N2OfromFertilization + area*amount*N2OEF*44/28
		CO2EF = IF_ERROR (VLOOKUP (fertilizer_name; EF_fert; 6); 0)
		CO2fromFertilization = CO2fromFertilization + area*amount*CO2EF
		j = j + 1
	'}' end
	applied = GET (crop, 'applied')
	m = LEN (applied)
	j = 0
	while j < m then begin '{'
		fertilizer = GET (applied, j)
		amount = GET (fertilizer, 'amount')*GET (fertilizer, 'N')/100
		N2OEF = IF_ERROR (VLOOKUP ('Organic fertilizer'; EF_soil; 2); 0.01)
		N2OfromFertilization = N2OfromFertilization + area*amount*N2OEF*44/28
		j = j + 1
	'}' end
	CH4total = CH4total + IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 4); 0)
	N2OfromLeaching = area*EF_L*44/28*Nleaching
	N2OfromVolatilization = area*EF_V*44/28*Nvolatilization
	N2OfromSoil = IF (drained && organic && rewetted == 'no'; area*VLOOKUP ('Organic soil cropland'; EF_soil; 2)*44/28; 0)
	c_residues_A = VLOOKUP_NONSTRICT (crop_type; Crops; 2)
	c_residues_B = VLOOKUP_NONSTRICT (crop_type; Crops; 3)
	f_renew = 1
	f_remove = IF (residues == 'incorporated'; 0; export_r/100)
	N_res_ab = VLOOKUP_NONSTRICT (crop_type; Crops; 5)
	N_res_bel = VLOOKUP_NONSTRICT (crop_type; Crops; 6)
	dry_matter = VLOOKUP_NONSTRICT (crop_type; Crops; 7)
	residue_dry_matter = c_residues_A*(yield*dry_matter) + c_residues_B
	Nresidues_above = area*N_res_ab*residue_dry_matter*(1 - f_remove)*f_renew
	underground_biomass = VLOOKUP_NONSTRICT (crop_type; Crops; 4)
	Nresidues_below = area*N_res_bel*underground_biomass*(yield*dry_matter + (c_residues_A*yield*dry_matter + c_residues_B))*f_renew
	N2OfromOverground = Nresidues_above*1000*VLOOKUP ('Crop residues'; EF_soil; 2)*44/28
	N2OfromUnderground = Nresidues_below*1000*VLOOKUP ('Crop residues'; EF_soil; 2)*44/28
	N2OfromResidues = N2OfromOverground + N2OfromUnderground
	N2Ototal = N2Ototal + SUM (N2OfromFertilization; N2OfromLeaching; N2OfromVolatilization; N2OfromResidues; N2OfromSoil)
	CO2fromHerbicides = area*herb*VLOOKUP ('herbicides'; EF_pest; 5)
	CO2fromInsecticides = area*fung*VLOOKUP ('insecticides'; EF_pest; 5)
	CO2fromFungicides = area*insect*VLOOKUP ('fungicides'; EF_pest; 5)
	CO2fromOther = area*otreat*VLOOKUP ('other treatments'; EF_pest; 5)
	CO2fromPesticides = CO2fromPesticides + SUM (CO2fromHerbicides; CO2fromInsecticides; CO2fromFungicides; CO2fromOther)
	CO2fromSeeds = CO2fromSeeds + seeds*area*VLOOKUP (crop_type; EF_seed; 2)
	CO2fromMachinery = CO2fromMachinery + area*consumption*IF_ERROR (VLOOKUP (combustible; EF_fuel; 7); 0)
	SOC_ST_i = IF (organic; 0; SOC_ST)
	name_FLU = SUM (IF (crop_name == 'Rice'; 'paddy rice'; 'annual crop'); ' '; temp_reg; ' '; moist_reg)
	FLU = VLOOKUP (name_FLU; FLUref; 2)
	name_FMG = SUM (IF (tilled == 'no'; 'no tillage'; 'full tillage'); ' '; temp_reg; ' '; moist_reg)
	FMG = VLOOKUP (name_FMG; FMGref; 2)
	name_worst_FMG = SUM ('full tillage '; temp_reg; ' '; moist_reg)
	worst_FMG = VLOOKUP (name_worst_FMG; FMGref; 2)
	name_inputLevel = SUM (residues; ' '; spread; ' '; removed)
	inputLevel = VLOOKUP (name_inputLevel; ILref; 2)
	name_FI = SUM (inputLevel; ' '; temp_reg; ' '; moist_reg)
	FI = VLOOKUP (name_FI; FIref; 2)
	name_worst_FI = SUM ('low '; temp_reg; ' '; moist_reg)
	worst_FI = VLOOKUP (name_worst_FI; FIref; 2)
	SOC = SOC_ST_i*FLU*FMG*FI
	worst_SOC = SOC_ST_i*FLU*worst_FMG*worst_FI
	A_SOC = A_SOC + (SOC - worst_SOC)/20*area*44/12*1000
	C_em_crop = IF (drained && organic && rewetted == 'no'; area*EF_SOC_crop; IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 2); 0))
	C_em_tree = IF (drained && organic && rewetted == 'no'; area*EF_SOC_grass; IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 2); 0))
	C_em = C_em + IF_ERROR (IF (MATCH (crop_type; Trees); C_em_tree; C_em_crop); 0)
	DOC_em = DOC_em + IF (drained && organic && rewetted == 'no'; area*IF (zone == 'temperate'; EF_DOC_tem; IF (zone == 'boreal'; EF_DOC_bor; 0)); IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 3); 0))
	i = i + 1
'}' end

CO2fromGround = C_em + DOC_em
N2OfromGround = N2Ototal
CH4fromGround = CH4total
CO2eqfromGround = CO2fromGround*CO2_GWP + N2OfromGround*N2O_GWP + CH4fromGround*CH4_GWP
CO2fromSustances = CO2fromFertilization + CO2fromPesticides + CO2fromSeeds
CO2eqfromSustances = CO2fromSustances*CO2_GWP
CO2eqfromMachinery = CO2fromMachinery*CO2_GWP
CO2fromSOC = A_SOC 
CO2eqfromSOC = CO2fromSOC*CO2_GWP

CO2eqtonfromGround = CO2eqfromGround/(area*yield)
CO2eqtonfromSustances = CO2eqfromSustances/(area*yield)
CO2eqtonfromMachinery = CO2eqfromMachinery/(area*yield)
CO2eqtonfromSOC = CO2eqfromSOC/(area*yield)
CO2eqhafromGround = CO2eqfromGround/area
CO2eqhafromSustances = CO2eqfromSustances/area
CO2eqhafromMachinery = CO2eqfromMachinery/area
CO2eqhafromSOC = CO2eqfromSOC/area