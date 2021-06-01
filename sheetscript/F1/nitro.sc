CSVAgro = [[]]
FenoT = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'FenoT.csv'))
FenoBBCH = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'BBCH.csv'))
Extracciones = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'Extracciones.csv'))
Mineral = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'Mineral.csv'))
MO = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'MO.csv'))
NDVIreali = LINTER4DATES (NDVIreal, 1)
NDVItipoi = LINTER4DATES (NDVItipo, 1)

agroasesor = 'no'
c_mineral = VLOOKUP (FLOOR (soilOrganicMaterial*100); MO; 2)
UFN = soilDepth*100*soilDensity*1000*(1 - soilStony)*soilNmin_0/1000000
extr_ha = cropExtractions*cropYield/1000

Fechas = GENNDATES(cropDate, n)
n = 200 + 1
m = LEN(FenoT)

ET0_acc_ = 0
n_days_Eto = 0
l = 1
k = 1
while k < n then begin '{'
	row = GET (FenoT, l)
	SET (row, 4, n_days_Eto)
	SET (FenoT, l, row)
	val = FLOAT(GET (row, 0))
	Fecha = GET (Fechas, k)
	ET0 = IF_ERROR (VLOOKUP (Fecha; Meteo; 13); IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 8); VLOOKUP (Fecha; Clima; 13)); 0))
	ET0_acc = ET0 + ET0_acc_
	ET0_acc_ = ET0_acc
	n_days_Eto = IF (ET0_acc >= val; 1; n_days_Eto + 1)
	l = IF (ET0_acc >= val; l + 1; l)
	k = IF (l < m; k + 1; n)
'}' end

row_ = [0]
i_days_Eto = 0
nitro4days = NEW()
results = []
Eto_acumulada_ = 0
Eto_acumulada_real_ = 0
Eto_acumulada_elegida_ = 0
Prec_efec_Acc_ = 0
Riego_Efec_ = 0
Riego_Acc_ = 0
N_extrA_ = 0
N_extrA_1_ = 0
row = GET (Fertiliza, 1)
Nh_ = UFN + IF_ERROR(GET (row, 2)/100*GET (row, 7)*GET (row, 6)*GET (row, 5); 0)
N_NO3_ = 0
N_mineralizado_A_ = 0
N_agua_A_ = 0
Nl_A_ = 0
j = 0
i = 1
while i < n then begin '{'
	Fecha = GET (Fechas, i)
	i = i + 1

	SWB4day = GET (SWB4days, Fecha)

	nitro4day = NEW()

	SET (nitro4day, 'Fecha', Fecha)

	Jp = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 3); GET (SWB4day; 'J')); ' ')
	SET (nitro4day, 'Jp', Jp)

	Etapa = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 2); ' '); ' ')
	SET (nitro4day, 'Etapa', Etapa)

	Eto_tipo = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 8); VLOOKUP (Fecha; Clima; 13)); 0)
	SET (nitro4day, 'Eto_tipo', Eto_tipo)

	Eto_acumulada = Eto_tipo + Eto_acumulada_
	SET (nitro4day, 'Eto_acumulada', Eto_acumulada)

	Eto_real = IF_ERROR (VLOOKUP (Fecha; Meteo; 13); 0 - 999)
	SET (nitro4day, 'Eto_real', Eto_real)

	Eto_acumulada_real = IF (Eto_real == 0 - 999; 0 - 999; Eto_real + Eto_acumulada_real_)
	SET (nitro4day, 'Eto_acumulada_real', Eto_acumulada_real)

	Eto_elegida = IF (Eto_real == 0 - 999; Eto_tipo; Eto_real)
	SET (nitro4day, 'Eto_elegida', Eto_elegida)

	Eto_acumulada_elegida = Eto_elegida + Eto_acumulada_elegida_
	SET (nitro4day, 'Eto_acumulada_elegida', Eto_acumulada_elegida)

	ET0 = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 8); VLOOKUP (Fecha; Meteo; 13)); 0)
	SET (nitro4day, 'ET0', ET0)

	Kcb = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 13); GET (SWB4day; 'Kcb')); 0)
	SET (nitro4day, 'Kcb', Kcb)

	h = 0
	SET (nitro4day, 'h', h)

	Ke = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 26); GET (SWB4day, 'Ke')); 0)
	SET (nitro4day, 'Ke', Ke)

	Kc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 29); GET (SWB4day, 'Kc')); 0)
	SET (nitro4day, 'Kc', Kc)

	ETc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 30); GET (SWB4day, 'ETc')); 0)
	SET (nitro4day, 'ETc', ETc)

	Prec_efec = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 12); GET (SWB4day, 'P_RO')); 0)
	SET (nitro4day, 'Prec_efec', Prec_efec)

	Riego_neces = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 35); GET (SWB4day; 'Riego_neto_necesario')); 0)
	SET (nitro4day, 'Riego_neces', Riego_neces)

	DP = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 37); GET (SWB4day; 'DP')); 0)
	SET (nitro4day, 'DP', DP)

	Riego_Efec = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 36); GET (SWB4day; 'Riego_neto_necesario')); 0)
	SET (nitro4day, 'Riego_Efec', Riego_Efec)

	t = IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 16); IF_ERROR (VLOOKUP (Fecha; Meteo; 2); VLOOKUP (Fecha; Clima; 2)))
	SET (nitro4day, 't', t)

	Etc_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 42); GET (SWB4day; 'ETc_adj_ac')); 0)
	SET (nitro4day, 'Etc_Acc', Etc_Acc)

	Prec_efec_Acc = Prec_efec + Prec_efec_Acc_
	SET (nitro4day, 'Prec_efec_Acc', Prec_efec_Acc)

	Riego_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 43); Riego_Efec_ + Riego_Acc_); 0)
	SET (nitro4day, 'Riego_Acc', Riego_Acc)

	Tm = t
	SET (nitro4day, 'Tm', Tm)

	IT = Tm
	SET (nitro4day, 'IT', IT)

	J = Jp
	SET (nitro4day, 'J', J)

	Sem = IF (ISOWEEKNUMBER (Fecha) < 40; ISOWEEKNUMBER (Fecha); ISOWEEKNUMBER (Fecha) - 53)
	SET (nitro4day, 'Sem', Sem)

	N_extrA = IF (IT > VLOOKUP (crop; Extracciones; 3) && IT < VLOOKUP (crop; Extracciones; 5); (IT - VLOOKUP (crop; Extracciones; 3))*soilDelta_N_NH4; 0)
	SET (nitro4day, 'N_extrA', N_extrA)

	N_extr = MAX(N_extrA - N_extrA_; 0)
	SET (nitro4day, 'N_extr', N_extr)

	val = FLOAT(GET (row_, 0))
	j = IF (Eto_acumulada_elegida >= val; j + 1; j)
	row = IF (j < m; GET (FenoT, j); [99999, 0, 0, 0, 0])
	row_ = row
	n_days_Eto = GET (row, 4)
	i_days_Eto = IF (Eto_acumulada_elegida >= val; 1; i_days_Eto + 1)

	ExtracR_N = IF (n_days_Eto > 0; GET (row, 2)/n_days_Eto; 0)
	ExtracR_N_Kg = ExtracR_N*extr_ha
	N_extr_1 = IF_ERROR (0 - ExtracR_N_Kg; 0)
	SET (nitro4day, 'N_extr_1', N_extr_1)

	N_mineralizado = IF (N_extr_1 == 0; VLOOKUP (Tm; Mineral; 2; 1)*Tm*c_mineral*mineralizationSlowdown; VLOOKUP (Tm; Mineral; 2; 1)*Tm*c_mineral)
	SET (nitro4day, 'N_mineralizado', N_mineralizado)

	N_agua = (Riego_neces + Riego_Efec)*waterNitrate*14/(100*62)
	SET (nitro4day, 'N_agua', N_agua)

	N_fert_neto = IF_ERROR(VLOOKUP (Fecha; Fertiliza; 3)/100*VLOOKUP (Fecha; Fertiliza; 8)*VLOOKUP (Fecha; Fertiliza; 7)*VLOOKUP (Fecha; Fertiliza; 6); 0)
	SET (nitro4day, 'N_fert_neto', N_fert_neto)

	N_fert_bruto = IF_ERROR (N_fert_neto/VLOOKUP (Fecha; Fertiliza; 6); 0)
	SET (nitro4day, 'N_fert_bruto', N_fert_bruto)

	BBCH = GET (row, 1)
	SET (nitro4day, 'BBCH', BBCH)

	Nl = (0 - DP)*N_NO3_/100
	SET (nitro4day, 'Nl', Nl)

	N_extrA_1 = N_extrA_1_ + N_extr_1
	SET (nitro4day, 'N_extrA_1', N_extrA_1)

	Nh = Nh_ + SUM(N_mineralizado; N_agua; N_fert_neto) + SUM(Nl; N_extr_1)
	SET (nitro4day, 'Nh', Nh)

	N_recom = GET (row, 3)
	SET (nitro4day, 'N_recom', N_recom)

	N_NO3 = Nh*1000000/(soilDepth*100*soilDensity*1000*(1 - soilStony)*(1 + soilDelta_N_NH4))
	SET (nitro4day, 'N_NO3', N_NO3)

	Nmin_medido = IF_ERROR (HLOOKUP (Fecha; [[soilDate_Nmin_0], [UFN]]; 2); 0 - 100)
	SET (nitro4day, 'Nmin_medido', Nmin_medido)

	T_Nf_recomendado = IF (Nh > N_recom; 0; 1)
	SET (nitro4day, 'T_Nf_recomendado', T_Nf_recomendado)

	N_mineralizado_A = N_mineralizado + N_mineralizado_A_
	SET (nitro4day, 'N_mineralizado_A', N_mineralizado_A)

	N_agua_A = N_agua + N_agua_A_
	SET (nitro4day, 'N_agua_A', N_agua_A)

	Nl_A = Nl + Nl_A_
	SET (nitro4day, 'Nl_A', Nl_A)

	BBCH_tipo = IF (i_days_Eto == n_days_Eto; GET (row, 1); 0 - 9999)
	SET (nitro4day, 'BBCH_tipo', BBCH_tipo)

	BBCH_graf = IF (BBCH_tipo > 0; 1.4; 0 - 999)
	SET (nitro4day, 'BBCH_graf', BBCH_graf)

	BBCH_real_et = IF_ERROR (VLOOKUP (Fecha; FenoBBCH; 2); 0 - 99999)
	SET (nitro4day, 'BBCH_real_et', BBCH_real_et)

	BBCH_real = IF (BBCH_real_et > 1; 1.4; 0 - 99999)
	SET (nitro4day, 'BBCH_real', BBCH_real)

	NDVI_tipo = IF_ERROR (VLOOKUP (Fecha; NDVItipo; 2); '')
	SET (nitro4day, 'NDVI_tipo', NDVI_tipo)

	NDVI_tipo_i = IF_ERROR (VLOOKUP (Fecha; NDVItipoi; 2); '')
	SET (nitro4day, 'NDVI_tipo_i', NDVI_tipo_i)

	NDVI_real = IF_ERROR (VLOOKUP (Fecha; NDVIreal; 2); '')
	SET (nitro4day, 'NDVI_real', NDVI_real)

	NDVI_int = IF_ERROR (VLOOKUP (Fecha; NDVIreali; 2); '')
	SET (nitro4day, 'NDVI_int', NDVI_int)

	Biomasa = IF_ERROR (GET (SWB4day, 'Biomasa_acumulada'); '')
	SET (nitro4day, 'Biomasa', Biomasa)

	Nuptake = IF_ERROR (GET (SWB4day, 'Nuptakediario'); '')
	SET (nitro4day, 'Nuptake', Nuptake)

	SET (nitro4days, Fecha, nitro4day)

	PUSH(results, nitro4day)

	Eto_acumulada_ = Eto_acumulada
	Eto_acumulada_real_ = Eto_acumulada_real
	Eto_acumulada_elegida_ = Eto_acumulada_elegida
	Prec_efec_Acc_ = Prec_efec_Acc
	Riego_Efec_ = Riego_Efec
	Riego_Acc_ = Riego_Acc
	N_extrA_ = N_extrA
	N_extrA_1_ = N_extrA_1
	Nh_ = Nh
	N_NO3_ = N_NO3
	N_mineralizado_A_ = N_mineralizado_A
	N_agua_A_ = N_agua_A
	Nl_A_ = Nl_A
'}' end

presowing_day = [0, 0, 0, 0, UFN, GET (GET (FenoT, 0), 3)]
topdressing1_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 2), 0), nitrificationPostDays))
topdressing2_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 3), 0), nitrificationPostDays))
topdressing3_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 4), 0), nitrificationPostDays))
topdressing4_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 5), 0), nitrificationPostDays))
topdressing5_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 6), 0), nitrificationPostDays))
final_day = GET (nitro4days, SP_ADD2DATE(GET (GET (Fertiliza, 7), 0), nitrificationPostDays))

presowing_N_extrA_1 = GET (topdressing1_day, 'N_extrA_1') - GET (presowing_day, 0)
topdressing1_N_extrA_1 = GET (topdressing2_day, 'N_extrA_1') - GET (topdressing1_day, 'N_extrA_1')
topdressing2_N_extrA_1 = GET (topdressing3_day, 'N_extrA_1') - GET (topdressing2_day, 'N_extrA_1')
topdressing3_N_extrA_1 = GET (topdressing4_day, 'N_extrA_1') - GET (topdressing3_day, 'N_extrA_1')
topdressing4_N_extrA_1 = GET (topdressing5_day, 'N_extrA_1') - GET (topdressing4_day, 'N_extrA_1')
topdressing5_N_extrA_1 = GET (final_day, 'N_extrA_1') - GET (topdressing5_day, 'N_extrA_1')

presowing_N_mineralizado_A = GET (topdressing1_day, 'N_mineralizado_A') - GET (presowing_day, 1)
topdressing1_N_mineralizado_A = GET (topdressing2_day, 'N_mineralizado_A') - GET (topdressing1_day, 'N_mineralizado_A')
topdressing2_N_mineralizado_A = GET (topdressing3_day, 'N_mineralizado_A') - GET (topdressing2_day, 'N_mineralizado_A')
topdressing3_N_mineralizado_A = GET (topdressing4_day, 'N_mineralizado_A') - GET (topdressing3_day, 'N_mineralizado_A')
topdressing4_N_mineralizado_A = GET (topdressing5_day, 'N_mineralizado_A') - GET (topdressing4_day, 'N_mineralizado_A')
topdressing5_N_mineralizado_A = GET (final_day, 'N_mineralizado_A') - GET (topdressing5_day, 'N_mineralizado_A')

presowing_N_agua_A = GET (topdressing1_day, 'N_agua_A') - GET (presowing_day, 2)
topdressing1_N_agua_A = GET (topdressing2_day, 'N_agua_A') - GET (topdressing1_day, 'N_agua_A')
topdressing2_N_agua_A = GET (topdressing3_day, 'N_agua_A') - GET (topdressing2_day, 'N_agua_A')
topdressing3_N_agua_A = GET (topdressing4_day, 'N_agua_A') - GET (topdressing3_day, 'N_agua_A')
topdressing4_N_agua_A = GET (topdressing5_day, 'N_agua_A') - GET (topdressing4_day, 'N_agua_A')
topdressing5_N_agua_A = GET (final_day, 'N_agua_A') - GET (topdressing5_day, 'N_agua_A')

presowing_Nl_A = GET (topdressing1_day, 'Nl_A') - GET (presowing_day, 3)
topdressing1_Nl_A = GET (topdressing2_day, 'Nl_A') - GET (topdressing1_day, 'Nl_A')
topdressing2_Nl_A = GET (topdressing3_day, 'Nl_A') - GET (topdressing2_day, 'Nl_A')
topdressing3_Nl_A = GET (topdressing4_day, 'Nl_A') - GET (topdressing3_day, 'Nl_A')
topdressing4_Nl_A = GET (topdressing5_day, 'Nl_A') - GET (topdressing4_day, 'Nl_A')
topdressing5_Nl_A = GET (final_day, 'Nl_A') - GET (topdressing5_day, 'Nl_A')

presowing_N_fert = GET (GET (Fertiliza, 1), 2)/100*GET (GET (Fertiliza, 1), 7)*GET (GET (Fertiliza, 1), 6)*GET (GET (Fertiliza, 1), 5)
topdressing1_N_fert = GET (GET (Fertiliza, 2), 2)/100*GET (GET (Fertiliza, 2), 7)*GET (GET (Fertiliza, 2), 6)*GET (GET (Fertiliza, 2), 5)
topdressing2_N_fert = GET (GET (Fertiliza, 3), 2)/100*GET (GET (Fertiliza, 3), 7)*GET (GET (Fertiliza, 3), 6)*GET (GET (Fertiliza, 3), 5)
topdressing3_N_fert = GET (GET (Fertiliza, 4), 2)/100*GET (GET (Fertiliza, 4), 7)*GET (GET (Fertiliza, 4), 6)*GET (GET (Fertiliza, 4), 5)
topdressing4_N_fert = GET (GET (Fertiliza, 5), 2)/100*GET (GET (Fertiliza, 5), 7)*GET (GET (Fertiliza, 5), 6)*GET (GET (Fertiliza, 5), 5)
topdressing5_N_fert = GET (GET (Fertiliza, 6), 2)/100*GET (GET (Fertiliza, 6), 7)*GET (GET (Fertiliza, 6), 6)*GET (GET (Fertiliza, 6), 5)

presowing_Nh = GET (presowing_day, 4)
topdressing1_Nh = GET (topdressing1_day, 'Nh')
topdressing2_Nh = GET (topdressing2_day, 'Nh')
topdressing3_Nh = GET (topdressing3_day, 'Nh')
topdressing4_Nh = GET (topdressing4_day, 'Nh')
topdressing5_Nh = GET (topdressing5_day, 'Nh')

presowing_Balance = SUM(presowing_N_extrA_1, presowing_N_mineralizado_A, presowing_N_agua_A, presowing_Nl_A, presowing_N_fert, presowing_Nh)
topdressing1_Balance = SUM(topdressing1_N_extrA_1, topdressing1_N_mineralizado_A, topdressing1_N_agua_A, topdressing1_Nl_A, topdressing1_N_fert, topdressing1_Nh)
topdressing2_Balance = SUM(topdressing2_N_extrA_1, topdressing2_N_mineralizado_A, topdressing2_N_agua_A, topdressing2_Nl_A, topdressing2_N_fert, topdressing2_Nh)
topdressing3_Balance = SUM(topdressing3_N_extrA_1, topdressing3_N_mineralizado_A, topdressing3_N_agua_A, topdressing3_Nl_A, topdressing3_N_fert, topdressing3_Nh)
topdressing4_Balance = SUM(topdressing4_N_extrA_1, topdressing4_N_mineralizado_A, topdressing4_N_agua_A, topdressing4_Nl_A, topdressing4_N_fert, topdressing4_Nh)
topdressing5_Balance = SUM(topdressing5_N_extrA_1, topdressing5_N_mineralizado_A, topdressing5_N_agua_A, topdressing5_Nl_A, topdressing5_N_fert, topdressing5_Nh)

presowing_N_recom = GET (presowing_day, 5)
topdressing1_N_recom = GET (topdressing1_day, 'N_recom')
topdressing2_N_recom = GET (topdressing2_day, 'N_recom')
topdressing3_N_recom = GET (topdressing3_day, 'N_recom')
topdressing4_N_recom = GET (topdressing4_day, 'N_recom')
topdressing5_N_recom = GET (topdressing5_day, 'N_recom')

presowing_N_neto = MAX(0 - presowing_Balance + topdressing1_N_recom; 0)
topdressing1_N_neto = MAX(0 - topdressing1_Balance + topdressing2_N_recom; 0)
topdressing2_N_neto = MAX(0 - topdressing2_Balance + topdressing3_N_recom; 0)
topdressing3_N_neto = MAX(0 - topdressing3_Balance + topdressing4_N_recom; 0)
topdressing4_N_neto = MAX(0 - topdressing4_Balance + topdressing5_N_recom; 0)
topdressing5_N_neto = MAX(0 - topdressing5_Balance + GET (final_day, 'N_recom'); 0)

presowing_N_bruto = presowing_N_neto/GET (GET (Fertiliza, 1), 5)
topdressing1_N_bruto = topdressing1_N_neto/GET (GET (Fertiliza, 2), 5)
topdressing2_N_bruto = topdressing2_N_neto/GET (GET (Fertiliza, 3), 5)
topdressing3_N_bruto = topdressing3_N_neto/GET (GET (Fertiliza, 4), 5)
topdressing4_N_bruto = topdressing4_N_neto/GET (GET (Fertiliza, 5), 5)
topdressing5_N_bruto = topdressing5_N_neto/GET (GET (Fertiliza, 6), 5)

presowing_Fertilizante = CEIL (presowing_N_bruto*10/GET (GET (Fertiliza, 1), 2); 0)*10
topdressing1_Fertilizante = CEIL (topdressing1_N_bruto*10/GET (GET (Fertiliza, 2), 2); 0)*10
topdressing2_Fertilizante = CEIL (topdressing2_N_bruto*10/GET (GET (Fertiliza, 3), 2); 0)*10
topdressing3_Fertilizante = CEIL (topdressing3_N_bruto*10/GET (GET (Fertiliza, 4), 2); 0)*10
topdressing4_Fertilizante = CEIL (topdressing4_N_bruto*10/GET (GET (Fertiliza, 5), 2); 0)*10
topdressing5_Fertilizante = CEIL (topdressing5_N_bruto*10/GET (GET (Fertiliza, 6), 2); 0)*10

presowing_UFN = CEIL (presowing_N_bruto/5; 0)*5
topdressing1_UFN = CEIL (topdressing1_N_bruto/5; 0)*5
topdressing2_UFN = CEIL (topdressing2_N_bruto/5; 0)*5
topdressing3_UFN = CEIL (topdressing3_N_bruto/5; 0)*5
topdressing4_UFN = CEIL (topdressing4_N_bruto/5; 0)*5
topdressing5_UFN = CEIL (topdressing5_N_bruto/5; 0)*5

