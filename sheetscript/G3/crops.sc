CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

T23 = 0.0075
T24 = 0.01
T101 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T101.csv'))
EF4ferts = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'EF4ferts.csv'))
EF4soils = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'EF4soils.csv'))
CropsRef = STD_CSV2ARRAY (CONCAT ('sheetscript/G3/', 'CropsRef.csv'))
CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))

n = LEN (crops)
i = 0
while i < n then begin '{'
	crop = GET (crops, i)
	cropID = GET (crop, 'cropID')
	area = GET (crop, 'area')
	yield = GET (crop, 'yield')
	crop_name = VLOOKUP (cropID; CropData; 3)
	Noutputs_terms = GET (GET (crop, 'nutrient_requirements'), 'Noutputs_terms')
	Nleaching = GET (Noutputs_terms, 'Nleaching')
	Nvolatilization = GET (Noutputs_terms, 'Nvolatilization')
	fertilization = GET (crop, 'fertilization')
	m = LEN (fertilization)
	j = N2OfromFertilization = 0
	while j < m then begin '{'
		fertilizer = GET (fertilization, j)
		fertilizerID = GET (fertilizer, 'fertilizerID')
		fertilizer_name = GET (fertilizer, 'fertilizer_name')
		amount = GET (fertilizer, 'amount')
		clasification_fm = VLOOKUP (fertilizerID; Fertilizers; 4)
		N2OEF = IF (clasification_fm == 'Organic'; VLOOKUP ('Organic fertilizer'; EF4soils; 2); IF_ERROR (VLOOKUP (fertilizer_name; EF4ferts; 2); VLOOKUP ('Others N mineral fertilisers'; EF4ferts; 2)))
		N2OfromFertilization = N2OfromFertilization + amount*area*N2OEF*44/28
		j = j + 1
	'}' end
	N2OfromLeaching = area*T23*44/28*Nleaching
	N2OfromVolatilization = area*T24*44/28*Nvolatilization
	N2OfromSoil = area*VLOOKUP ('Organic soil'; EF4soils; 2)*44/28
	c_residues_A = VLOOKUP_NONSTRICT (crop_name; CropsRef; 13)
	c_residues_B = VLOOKUP_NONSTRICT (crop_name; CropsRef; 14)
	underground_biomass = VLOOKUP_NONSTRICT (crop_name; CropsRef; 15)
	f_renew = 1
	f_remove = 0
	N_res_ab = VLOOKUP_NONSTRICT (crop_name; CropsRef; 16)
	N_res_bel = VLOOKUP_NONSTRICT (crop_name; CropsRef; 17)
	dry_matter = VLOOKUP_NONSTRICT (crop_name; CropsRef; 9)
	residue_dry_matter = c_residues_A*(yield*dry_matter) + c_residues_B
	Nresidues_above = area*N_res_ab*residue_dry_matter*(1 - f_remove)*f_renew
	N2OfromOverground = Nresidues_above*1000*VLOOKUP ('Crop residues'; EF4soils; 2)*44/28
	Nresidues_below = area*N_res_bel*underground_biomass*(yield*dry_matter + (c_residues_A*yield*dry_matter + c_residues_B))*f_renew
	N2OfromUnderground = Nresidues_below*1000*VLOOKUP ('Crop residues'; EF4soils; 2)*44/28
	Nresidues = Nresidues_above + Nresidues_below
	N2OfromResidues = N2OfromOverground + N2OfromUnderground
	N2Ototal = SUM (N2OfromFertilization; N2OfromLeaching; N2OfromVolatilization; N2OfromResidues; N2OfromSoil)

	i = i + 1
'}' end
