SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'SoilData.csv'))
Drainage = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Drainage.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers_aux.csv'))
pH4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'pH4vol.csv'))
CEC4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CEC4vol.csv'))

vol_c = EXP (IF (water_supply == '0'; 0-0.045; 0) + VLOOKUP (pH; pH4vol; 2; 1) + VLOOKUP (CEC/10; CEC4vol; 2; 1) + 0-0.402)

drain_rate = VLOOKUP (soil_texture; SoilData; 5)
j = IF (water_supply == '1'; 1; 0)*5 + IF (drain_rate == 'Very high'; 1; IF (drain_rate == 'High'; 2; IF (drain_rate == 'Medium'; 3; IF (drain_rate == 'Low'; 4; 5))))
inorgDrain = GET (GET (Drainage, IF (tilled == 'no'; 6; 0) + IF (SOM >= 5; 3; IF (SOM >=2; 2; 1))), j)
orgDrain = IF (tilled == 'yes'; GET (GET (Drainage, 3 + IF (SOM >= 5; 3; IF (SOM >=2; 2; 1))), j); 0)

n = LEN (fertilizers)
i = 0
while i < n then begin '{'
	row = GET (fertilizers, i)
	id = GET (row, 'fertilizerID')
	clasification_fm = VLOOKUP (id; Fertilizers; 4)
	vol_c_i = IF_ERROR (VLOOKUP (id; Fertilizers; 6); 0)
	Ncf = IF_ERROR (VLOOKUP (id; Fertilizers; 13); 0)
	Nc_dm_amendment = IF_ERROR (VLOOKUP (id; Fertilizers; 14); 0)
	Nc_i = IF (clasification_fm == 'Inorganic'; Ncf; Nc_dm_amendment)
	method = VLOOKUP (id; Fertilizers_aux; 2)
	N_bf_vol = Nc_i*(1 - EXP (IF (method == 'incorporated'; 0-1.895; IF (method == 'topdressing'; 0-1.305; 0)) + vol_c_i)*vol_c)
	N_bf_deni = Nc_i*(1 - IF (clasification_fm == 'Inorganic'; inorgDrain; orgDrain))
	N_bf = IF_ERROR (N_bf_vol*N_bf_deni/Nc_i; 0)
	SET (row, 'Nbf', N_bf*100)
	i = i + 1
'}' end

updated_fertilizers = fertilizers