CZ = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'CZ.csv'))
Crops = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'Crops.csv'))
EF_rew = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'EF_rew.csv'))
EF_soil = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'EF_soil.csv'))
EF_fert = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'EF_fert.csv'))
EF_pest = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'EF_pest.csv'))
EF_fuel = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'EF_fuel.csv'))
ManagementChange = STD_CSV2ARRAY (CONCAT ('sheetscript/G1/', 'ManagementChange.csv'))
Com_start = 0.0008359550561798
Man_start = 0.00036
Res_start = 0.00124
EF_L = 0.0075
EF_V = 0.01
EF_SOC_crop = 7.9
EF_SOC_grass = 5.175
EF_DOC_tem = 0.31
EF_DOC_bor = 0.12
CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298
Trees = ['ALMOND', 'APPLE', 'APRICOT', 'AVOCADO', 'CHERRY', 'FIG', 'GRAPE_TABLE', 'GRAPE_WINE', 'GRAPEFRUIT', 'HAZELNUT', 'KIWI', 'LEMON', 'OLIVE', 'ORANGE', 'PEACH', 'PEAR', 'PLUM', 'POMEGRANATE', 'QUINCE', 'WALNUT']

zone = VLOOKUP (climate; CZ; 3)

CH4total = N2Ototal = CO2fromFertilization = CO2fromPesticides = CO2fromSeeds = CO2fromMachinery = 0
C_DOC_em = CO2_em = 0

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
	chang_till = GET (crop, 'chang_till')
	per_till = GET (crop, 'per_till')
	chang_cov = GET (crop, 'chang_cov')
	per_cov = GET (crop, 'per_cov')
	chang_com = GET (crop, 'chang_com')
	per_com = GET (crop, 'per_com')
	am_com = GET (crop, 'am_com')
	chang_man = GET (crop, 'chang_man')
	per_man = GET (crop, 'per_man')
	am_man = GET (crop, 'am_man')
	chang_res = GET (crop, 'chang_res')
	per_res = GET (crop, 'per_res')
	am_res = GET (crop, 'am_res')
	drain_rate = GET (crop, 'drain_rate')
	drained = drain_rate <> 'Very low' && drain_rate <> 'Low'
	organic = SOM > 30
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
		N2OEF = IF_ERROR (VLOOKUP (fertilizer_name; EF_fert; 2); 0.01)
		N2OfromFertilization = N2OfromFertilization + area*amount*N2OEF*44/28
		CO2EF = IF_ERROR (VLOOKUP (fertilizer_name; EF_fert; 3); 0)
		CO2fromFertilization = CO2fromFertilization + area*amount*CO2EF/1000
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
	CO2fromSeeds = CO2fromSeeds + seeds*area*VLOOKUP_NONSTRICT (crop_type; Crops; 8)
	CO2fromMachinery = CO2fromMachinery + area*consumption*IF_ERROR (VLOOKUP (combustible; EF_fuel; 7); 0)

	C_em_dnr = IF (drained && organic && rewetted == 'no'; area*IF (MATCH (crop_type; Trees); EF_SOC_grass; EF_SOC_crop); 0)
	C_em_r = IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 2); 0)
	DOC_em_dnr = IF (drained && organic && rewetted == 'no'; area*IF (zone == 'temperate'; EF_DOC_tem; IF (zone == 'boreal'; EF_DOC_bor; 0)); 0)
	DOC_em_r = IF (organic && rewetted == 'yes'; area*VLOOKUP (zone; EF_rew; 3); 0)
	C_DOC_em = C_DOC_em + (C_em_dnr + DOC_em_dnr + C_em_r + DOC_em_r)*44/12*1000
	tillage = IF (moist_reg == 'moist'; VLOOKUP (chang_till; ManagementChange; 2); VLOOKUP (chang_till; ManagementChange; 3))
	C_tillage = IF (per_till < 20; 1 + (1/20)*(tillage - 1); 1)
	cover = IF (moist_reg == 'moist'; VLOOKUP (chang_cov; ManagementChange; 2); VLOOKUP (chang_cov; ManagementChange; 3))
	C_cover = IF (per_cov < 20; 1 + (1/20)*(cover - 1); 1)
	C_compost = IF (chang_com == 'no change'; 1; IF (chang_com == 'started incorporating'; 1 + am_com*Com_start/1000; 1/(1 + am_com*Com_start/1000)))
	C_manure = IF (chang_man == 'no change'; 1; IF (chang_man == 'started incorporating'; 1 + am_man*Man_start/1000; 1/(1 + am_man*Man_start/1000)))
	C_residues = IF (chang_res == 'no change'; 1; IF (chang_res == 'started incorporating'; 1 + am_res*Res_start/1000; 1/(1 + am_res*Res_start/1000)))
	OF = C_tillage*C_cover*C_compost*C_manure*C_residues
	CO2_em = CO2_em + (0 - 1)*(OF - 1)*soil_C*area*44/12
	i = i + 1
'}' end

CO2fromGround = C_DOC_em
N2OfromGround = N2Ototal
CH4fromGround = CH4total
CO2eqfromGround = CO2fromGround*CO2_GWP + N2OfromGround*N2O_GWP + CH4fromGround*CH4_GWP
CO2fromSustances = CO2fromFertilization + CO2fromPesticides + CO2fromSeeds
CO2eqfromSustances = CO2fromSustances*CO2_GWP
CO2eqfromMachinery = CO2fromMachinery*CO2_GWP
CO2fromSOC = CO2_em 
CO2eqfromSOC = CO2fromSOC*CO2_GWP