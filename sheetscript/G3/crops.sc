CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

T23 = 0.0075
T24 = 0.01

T4 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T4.csv'))
T11 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T11.csv'))
T12 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T12.csv'))
T13 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T13.csv'))
T14 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T14.csv'))
T15 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T15.csv'))
T20 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T20.csv'))
T35 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T35.csv'))
T101 = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'T101.csv'))
CO24manufFerts = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'CO24manufFerts.csv'))
CO24pesticides = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'CO24pesticides.csv'))
N2O4ferts = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'N2O4ferts.csv'))
N2O4soils = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'N2O4soils.csv'))
CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))

soil_dom = VLOOKUP (soil; T4; 2)
SOC_ST = VLOOKUP (climate; T20; MATCH (soil_dom; GET (T20, 0)))

CH4total = N2Ototal = CO2fromFertilization = CO2fromPesticides = CO2fromSeeds = CO2fromMachinery = SOC_total = L_organic = 0
n = LEN (crops)
i = 0
while i < n then begin '{'
	crop = GET (crops, i)
	crop_type = GET (crop, 'crop_type')
	area = GET (crop, 'area')
	yield = GET (crop, 'yield')
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
	drain_rate = GET (crop, 'drain_rate')
	drained = drain_rate <> 'Very low' && drain_rate <> 'Low'
	organic = SOM > 30
	crop_name = VLOOKUP (crop_type; CropData; 3)
	crop_group = VLOOKUP (crop_type; CropData; 2)
	output = GET (GET (crop, 'balance'), 'output')
	Nleaching = GET (output, 'Nleaching')
	Nvolatilization = GET (output, 'Nvolatilization')
	fertilization = GET (crop, 'fertilization')
	m = LEN (fertilization)
	j = N2OfromFertilization = 0
	while j < m then begin '{'
		fertilizer = GET (fertilization, j)
		fertilizerID = GET (fertilizer, 'fertilizerID')
		fertilizer_name = GET (fertilizer, 'fertilizer_name')
		amount = GET (fertilizer, 'amount')
		clasification_fm = VLOOKUP (fertilizerID; Fertilizers; 4)
		N2OEF = IF (clasification_fm == 'Organic'; VLOOKUP ('Organic fertilizer'; N2O4soils; 2); IF_ERROR (VLOOKUP (fertilizer_name; N2O4ferts; 2); VLOOKUP ('Others N mineral fertilisers'; N2O4ferts; 2)))
		N2OfromFertilization = N2OfromFertilization + area*amount*N2OEF*44/28
		CO2EF = IF (clasification_fm == 'Organic'; VLOOKUP ('Potassium fertilisers'; CO24manufFerts; 3); IF_ERROR (VLOOKUP (fertilizer_name; CO24manufFerts; 3); VLOOKUP ('Nitrogen fertilisers'; CO24manufFerts; 3)))
		CO2fromFertilization = CO2fromFertilization + area*amount*CO2EF
		j = j + 1
	'}' end
	N2OfromLeaching = area*T23*44/28*Nleaching
	N2OfromVolatilization = area*T24*44/28*Nvolatilization
	N2OfromSoil = IF (drained && organic; area*VLOOKUP ('Organic soil'; N2O4soils; 2)*44/28; 0)
	c_residues_A = VLOOKUP_NONSTRICT (crop_type; T101; 13)
	c_residues_B = VLOOKUP_NONSTRICT (crop_type; T101; 14)
	underground_biomass = VLOOKUP_NONSTRICT (crop_type; T101; 15)
	f_renew = 1
	f_remove = IF (residues == 'incorporated'; 0; 1)
	N_res_ab = VLOOKUP_NONSTRICT (crop_type; T101; 16)
	N_res_bel = VLOOKUP_NONSTRICT (crop_type; T101; 17)
	dry_matter = VLOOKUP_NONSTRICT (crop_type; T101; 9)
	residue_dry_matter = c_residues_A*(yield*dry_matter) + c_residues_B
	Nresidues_above = area*N_res_ab*residue_dry_matter*(1 - f_remove)*f_renew
	N2OfromOverground = Nresidues_above*1000*VLOOKUP ('Crop residues'; N2O4soils; 2)*44/28
	Nresidues_below = area*N_res_bel*underground_biomass*(yield*dry_matter + (c_residues_A*yield*dry_matter + c_residues_B))*f_renew
	N2OfromUnderground = Nresidues_below*1000*VLOOKUP ('Crop residues'; N2O4soils; 2)*44/28
	Nresidues = Nresidues_above + Nresidues_below
	N2OfromResidues = N2OfromOverground + N2OfromUnderground
	N2Ototal = N2Ototal + SUM (N2OfromFertilization; N2OfromLeaching; N2OfromVolatilization; N2OfromResidues; N2OfromSoil)
	CO2fromHerbicides = area*herb*VLOOKUP ('herbicides'; CO24pesticides; 5)
	CO2fromInsecticides = area*fung*VLOOKUP ('insecticides'; CO24pesticides; 5)
	CO2fromFungicides = area*insect*VLOOKUP ('fungicides'; CO24pesticides; 5)
	CO2fromOther = area*otreat*VLOOKUP ('other treatments'; CO24pesticides; 5)
	CO2fromPesticides = CO2fromPesticides + SUM (CO2fromHerbicides; CO2fromInsecticides; CO2fromFungicides; CO2fromOther)
	CO2fromSeeds = CO2fromSeeds + seeds*area*VLOOKUP_NONSTRICT (crop_type; T101; 20)
	CO2fromMachinery = CO2fromMachinery + area*consumption*VLOOKUP (combustible; T35; 15)
	SOC_ST_i = IF (organic; 0; SOC_ST)
	name_FLU = SUM (IF (crop_name == 'Rice'; 'paddy rice'; 'annual crop'); ' '; temp_reg; ' '; moist_reg)
	FLU = IF (crop_group == 'Fruit trees, vines and shrubs'; 1; VLOOKUP (name_FLU; T11; 2))
	name_FMG = SUM (IF (tilled == 'no'; 'no tillage'; 'full tillage'); ' '; temp_reg; ' '; moist_reg)
	FMG = IF (crop_group == 'Fruit trees, vines and shrubs'; 1; VLOOKUP (name_FMG; T12; 2))
	name_inputLevel = SUM (residues; ' '; spread; ' '; removed)
	inputLevel = VLOOKUP (name_inputLevel; T13; 2)
	name_FI = SUM (inputLevel; ' '; temp_reg; ' '; moist_reg)
	FI = IF (crop_group == 'Fruit trees, vines and shrubs'; 1; VLOOKUP (name_FI; T14; 2))
	SOC = SOC_ST_i*FLU*FMG*FI
	SOC_total = SOC_total + SOC*area
	L_organic = L_organic + IF (organic && drained; area*VLOOKUP (temp_reg; T15; 2); 0)
	i = i + 1
'}' end

N2OfromAll = N2OfromGround = N2Ototal
CH4fromAll = CH4fromGround = CH4total
CO2fromSOC = SOC_total
CO2fromL = L_organic
CO2fromSustances = CO2fromFertilization + CO2fromPesticides + CO2fromSeeds
CO2eqfromGround = N2Ototal*N2O_GWP + CH4total*CH4_GWP
CO2eqfromSustances = CO2fromSustances*CO2_GWP
CO2eqfromMachinery = CO2fromMachinery*CO2_GWP
CO2eqfromSOC = CO2fromSOC*CO2_GWP
CO2eqfromL = CO2fromL*CO2_GWP
CO2fromAll = CO2total = CO2fromSustances + CO2fromMachinery + CO2fromSOC + CO2fromL
CO2eqfromAll = CO2eqfromGround + CO2total*CO2_GWP