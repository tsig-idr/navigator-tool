Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers_aux.csv'))
pH4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'pH4vol.csv'))
CEC4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CEC4vol.csv'))

vol_c = EXP (IF (water_supply == '0'; 0-0.045; 0) + VLOOKUP (pH; pH4vol; 2; 1) + VLOOKUP (CEC/10; CEC4vol; 2; 1) + 0-0.402)

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
	N_bf = Nc_i*(1 - EXP (IF (method == 'incorporated'; 0-1.895; IF (method == 'topdressing'; 0-1.305; 0)) + vol_c_i)*vol_c)
	SET (row, 'Nbf', N_bf*100)
	SET (row, 'method', method)
	SET (row, 'classification', clasification_fm)
	SET (row, 'name', VLOOKUP (id; Fertilizers; 2))
	i = i + 1
'}' end

bestfert = []
SET (bestfert, 'method', 'topdressing')
SET (bestfert, 'fertilizerID', '#')
PUSH (fertilizers, bestfert)

updated_fertilizers = fertilizers