E = 2.718281828459045
CSVAgro = [[]]
Curve4organic = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Curve4organic.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Fertilizers_aux.csv'))
CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'SoilData.csv'))
ClimaticData = SP_CSV2ARRAY( CONCAT ('sheetscript/F1/', 'ClimaticData.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))
FenoT = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'FenoT.csv'))
Extracciones = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Extracciones.csv'))
Mineral = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Mineral.csv'))
MO = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'MO.csv'))
IT4BBCH = STD_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'IT4BBCH.csv'))
NDVIreali = LINTER4DATES (NDVIreal)
NDVItipoi = LINTER4DATES (NDVItipo)

ppm = density_s*depth_s*10
Nc_s_initial = Nc_s_0*IF (Nc_s_initial_unit == 'kg_ha'; 1; IF (Nc_s_initial_unit == 'ppm'; ppm; IF (Nc_s_initial_unit == 'pct'; 10000*ppm; IF (Nc_s_initial_unit == 'meq_100'; 620*ppm; IF (Nc_s_initial_unit == 'meq_kg'; 6200*ppm; IF (Nc_s_initial_unit == 'meq_l'; 62*ppm; 1))))))
Pc_si = Pc_s_0*IF (Pc_s_unit == 'kg_ha'; 1/ppm; IF (Pc_s_unit == 'ppm'; 1; IF (Pc_s_unit == 'pct'; 10000; IF (Pc_s_unit == 'meq_100'; 316.5; IF (Pc_s_unit == 'meq_kg'; 3165; IF (Pc_s_unit == 'meq_l'; 31.65; 1))))))
Kc_s = Kc_s_0*IF (Kc_s_unit == 'kg_ha'; 1/ppm; IF (Kc_s_unit == 'ppm'; 1; IF (Kc_s_unit == 'pct'; 10000; IF (Kc_s_unit == 'meq_100'; 391; IF (Kc_s_unit == 'meq_kg'; 3910; IF (Kc_s_unit == 'meq_l'; 39.1; 1))))))

Nuptake = (h_dm_med_50*Nc_h_ + r_dm_med_50*Nc_r)*(1 + fnr)
Nuptake_min = (h_dm_med_20*Nc_h_ + (h_dm_med_20*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)
Nuptake_max = (h_dm_med_80*Nc_h_ + (h_dm_med_80*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)

agroasesor = 'no'
c_mineral = VLOOKUP (SOM; MO; 2, 1)
UFN = IF (Nc_s_initial_unit == 'ppm'; depth_s*100*100*density_s*1000*(1 - stony)*Nc_s_0/1000000; Nc_s_initial)

mineralIni = '9999-12-31'
mineralEnd = crop_endDate

Fechas = GENNDATES (ADD2DATE (startDate, 0 - 1), n)

Tbasemin = IF_ERROR (FLOAT (VLOOKUP (crop_type; IT4BBCH; 7)); 0 - 100)
Tbasemax = IF_ERROR (FLOAT (VLOOKUP (crop_type; IT4BBCH; 8)); 100)
IT_09 = IF_ERROR (VLOOKUP (crop_type; IT4BBCH; 2); 0)
IT_22 = IF_ERROR (VLOOKUP (crop_type; IT4BBCH; 3); 0)
IT_39 = IF_ERROR (VLOOKUP (crop_type; IT4BBCH; 4); 0)
IT_55 = IF_ERROR (VLOOKUP (crop_type; IT4BBCH; 5); 0)
IT_89 = IF_ERROR (VLOOKUP (crop_type; IT4BBCH; 6); 0)

Fecha_ = date_09 = date_22 = date_39 = date_55 = date_89 = crop_endDate
i = 1
IT = 0
while i < n then begin '{'
	Fecha = GET (Fechas, i)
	i = i + 1
	Tm = FLOAT (IF_ERROR (VLOOKUP (Fecha; Meteo; 2); VLOOKUP (Fecha; Clima; 2)))
	IT = IF (Fecha > crop_startDate; IF (Tm < Tbasemin; IT + Tbasemin; IF (Tm > Tbasemax; IT + Tbasemax; IT + Tm)); '')
	date_09 = IF (date_09 == crop_endDate && IT >= IT_09; Fecha_; date_09)
	date_22 = IF (date_22 == crop_endDate && IT >= IT_22; Fecha_; date_22)
	date_39 = IF (date_39 == crop_endDate && IT >= IT_39; Fecha_; date_39)
	date_55 = IF (date_55 == crop_endDate && IT >= IT_55; Fecha_; date_55)
	date_89 = IF (date_89 == crop_endDate && IT >= IT_89; Fecha_; date_89)
	Fecha_ = Fecha
'}' end

FenoBBCH_ = [[crop_startDate, 0]]
PUSH (FenoBBCH_, [date_09, 09])
PUSH (FenoBBCH_, [date_22, 22])
PUSH (FenoBBCH_, [date_39, 39])
PUSH (FenoBBCH_, [date_55, 55])
PUSH (FenoBBCH_, [date_89, 89])

UNSHIFT (FenoBBCH, [crop_startDate, 0])
PUSH (FenoBBCH, [crop_endDate, 89])

m = LEN (FenoT)
feno_n = LEN (FenoBBCH)

extr = 0
k = 0
l = 0
c = 0
while k < m - 1 && l < feno_n - 1 && c < 100 then begin '{'
	row = GET (FenoT, k)
	vt_ = FLOAT (GET (row, 0))
	extr_ = FLOAT (GET (row, 1))
	row = GET (FenoT, k + 1)
	vt = FLOAT (GET (row, 0))
	row = GET (FenoBBCH, l + 1)
	date = GET (row, 0)
	vr = FLOAT (GET (row, 1))
	row = GET (FenoBBCH, l)
	date_ = GET (row, 0)
	vr_ = FLOAT (GET (row, 1))
	factor = (MIN (vt; vr) - MAX (vt_; vr_))/(vt - vt_)
	extr = extr + extr_*factor
	n_days = MAX (DATESDIF (date, date_); 1)
	SET (row, 2, extr/n_days)
	SET (FenoBBCH, l, row)
	extr = IF (vr > vt; extr; 0)
	k = IF (vt <= vr; k + 1; k)
	l = IF (vr <= vt; l + 1; l)
	c = c + 1
'}' end

extr = 0
k = 0
l = 0
c = 0
while k < m - 1 && l < 5 && c < 100 then begin '{'
	row = GET (FenoT, k)
	vt_ = FLOAT (GET (row, 0))
	extr_ = FLOAT (GET (row, 1))
	row = GET (FenoT, k + 1)
	vt = FLOAT (GET (row, 0))
	row = GET (FenoBBCH_, l + 1)
	date = GET (row, 0)
	vr = FLOAT (GET (row, 1))
	row = GET (FenoBBCH_, l)
	date_ = GET (row, 0)
	vr_ = FLOAT (GET (row, 1))
	factor = (MIN (vt; vr) - MAX (vt_; vr_))/(vt - vt_)
	extr = extr + extr_*factor
	n_days = MAX (DATESDIF (date, date_); 1)
	SET (row, 2, extr/n_days)
	SET (FenoBBCH_, l, row)
	extr = IF (vr > vt; extr; 0)
	k = IF (vt <= vr; k + 1; k)
	l = IF (vr <= vt; l + 1; l)
	c = c + 1
'}' end

Nuptakediario_ = 0
nitro4days = NEW()
Eto_acumulada_ = 0
Eto_acumulada_real_ = 0
Eto_acumulada_elegida_ = 0
Prec_efec_Acc_ = 0
Riego_Efec_ = 0
Riego_Acc_ = 0
N_extrA_ = 0
N_extrA_1_ = 0
Nh_ = UFN
N_NO3_ = 0
N_mineralizado_A_ = 0
N_agua_A_ = 0
Nl_A_ = 0
N_mineral_soil_ = Nh_
N_final = 0
IT = 0
c_a = 0
c_b = 0
n = IF (VLOOKUP (crop_type; CropData; 8) == 'Annual'; 365; 1825) + 1
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

	Eto_acumulada_elegida = IF (Fecha >= crop_startDate; Eto_elegida + Eto_acumulada_elegida_; 0)
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

	Riego_neces = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 36); GET (SWB4day; 'Riego_neto_necesario')); 0)
	SET (nitro4day, 'Riego_neces', Riego_neces)

	DP = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 38); GET (SWB4day; 'DP')); 0)
	SET (nitro4day, 'DP', DP)

	Riego_Efec = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 37); GET (SWB4day; 'Riego_neto_necesario')); 0)
	SET (nitro4day, 'Riego_Efec', Riego_Efec)

	t = IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 16); IF_ERROR (VLOOKUP (Fecha; Meteo; 2); VLOOKUP (Fecha; Clima; 2)))
	SET (nitro4day, 't', t)

	Etc_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 42); GET (SWB4day; 'ETc_adj_ac')); 0)
	SET (nitro4day, 'Etc_Acc', Etc_Acc)

	Prec_efec_Acc = Prec_efec + Prec_efec_Acc_
	SET (nitro4day, 'Prec_efec_Acc', Prec_efec_Acc)

	Riego_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 43); Riego_Efec_ + Riego_Acc_); 0)
	SET (nitro4day, 'Riego_Acc', Riego_Acc)

	Tm = FLOAT(t)
	SET (nitro4day, 'Tm', Tm)

	Tm = IF (Tm < Tbasemin; Tbasemin; Tm)
	Tm = IF (Tm > Tbasemax; Tbasemax; Tm)
	SET (nitro4day, 'Tm', Tm)
	IT = IF (Fecha > crop_startDate; IT + Tm; '')
	SET (nitro4day, 'IT', IT)

	J = Jp
	SET (nitro4day, 'J', J)

	Sem = IF (ISOWEEKNUMBER (Fecha) < 40; ISOWEEKNUMBER (Fecha); ISOWEEKNUMBER (Fecha) - 53)
	SET (nitro4day, 'Sem', Sem)

	Nuptakediario = IF_ERROR (GET (SWB4day, 'Nuptakediario'); '')
	SET (nitro4day, 'Nuptake', Nuptakediario)

	Nuptakediario_ = Nuptakediario_ + Nuptakediario

	BBCH = IF_ERROR (VLOOKUP (Fecha; IF (feno_n > 2; FenoBBCH; FenoBBCH_); 2; 1); '')
	SET (nitro4day, 'BBCH', BBCH)

	ExtracR_N = IF_ERROR (VLOOKUP (Fecha; FenoBBCH_; 3; 1); 0)
	ExtracR_N_Kg = ExtracR_N*Nuptake
	N_extr = IF_ERROR (0 - ExtracR_N_Kg; 0)
	SET (nitro4day, 'N_extr', N_extr)

	N_extrA = N_extrA_ + N_extr
	SET (nitro4day, 'N_extrA', N_extrA)

	ExtracR_N = IF_ERROR (VLOOKUP (Fecha; FenoBBCH; 3; 1); 0)
	ExtracR_N_Kg = ExtracR_N*Nuptake
	N_extr_1 = IF_ERROR (0 - ExtracR_N_Kg; 0)
	SET (nitro4day, 'N_extr_1', N_extr_1)

	N_extrA_1 = N_extrA_1_ + N_extr_1
	SET (nitro4day, 'N_extrA_1', N_extrA_1)

	N_extr_ = IF (feno_n > 2; N_extr_1; N_extr)
	SET (nitro4day, 'N_extr_', N_extr_)

	N_mineralizado = IF (N_extr_ == 0; FLOAT (VLOOKUP (Tm; Mineral; 2; 1))*Tm*c_mineral*mineralizationSlowdown/100; FLOAT (VLOOKUP (Tm; Mineral; 2; 1))*Tm*c_mineral)
	SET (nitro4day, 'N_mineralizado', N_mineralizado)

	N_agua = (Riego_neces + Riego_Efec)*waterNitrate*14/(100*62)
	SET (nitro4day, 'N_agua', N_agua)

	Nl = (0 - DP)*N_NO3_/100
	SET (nitro4day, 'Nl', Nl)

	fertilizer = GET (planning_done, Fecha) || []
	fertilizer_ = GET (planning_todo, Fecha) || []

	mineralIni = IF (GET (fertilizer, 'classification') == 'Organic'; Fecha; mineralIni)
	mineralEnd = IF (GET (fertilizer_, 'method') == 'topdressing' && Fecha < mineralEnd; Fecha; mineralEnd)

	N_fert_neto = IF (GET (fertilizer, 'date') == Fecha; GET (fertilizer, 'Nbf')/100*GET (fertilizer, 'amount'); 0)
	SET (nitro4day, 'N_fert_neto', N_fert_neto)

	N_final = IF (mineralIni == Fecha; N_fert_neto; N_final)
	name = GET (fertilizer, 'name')
	c_a = IF (mineralIni == Fecha; IF_ERROR (FLOAT (VLOOKUP (name; Curve4organic; 3)); 0); c_a)
	c_b = IF (mineralIni == Fecha; IF_ERROR (FLOAT (VLOOKUP (name; Curve4organic; 4)); 0); c_b)
	t_i = DATE2INT (Fecha)
	t_0 = t_i - 1
	t_n = t_i + 1
	curve = (c_b*(t_n - t_i) + c_a*(0 - t_0*LN (t_n - t_0) + t_0*LN (t_i - t_0) - t_i*LN (t_i - t_0) + t_n*LN (t_n - t_0) + t_i - t_n))*N_final/100

	N_curve = IF (Fecha >= mineralIni && Fecha < mineralEnd; curve; 0)
	SET (nitro4day, 'N_curve', N_curve)

	N_recom = IF_ERROR (VLOOKUP (BBCH; FenoT; 3; 1); 0)
	SET (nitro4day, 'N_recom', N_recom)

	N_mineral_soil = N_mineral_soil_ + SUM (N_mineralizado; N_agua) + SUM (Nl; N_extr_) + N_curve
	SET (nitro4day, 'N_mineral_soil', N_mineral_soil)

	N_rate = N_recom - N_mineral_soil
	SET (nitro4day, 'N_rate', N_rate)

	SET (fertilizer_, 'amount', IF_ERROR (IF (N_rate > 0; N_rate; 0)*100/IF_ERROR (GET (fertilizer_, 'Nbf'); 0); 0))

	N_fert = IF (N_rate > 0 && GET (fertilizer_, 'date') == Fecha; N_rate; N_fert_neto)
	SET (nitro4day, 'N_fert', N_fert)

	N_deni = 0.34*E**(0.012*N_rate)
	SET (nitro4day, 'N_deni', N_deni)

	N_mineral_soil_fert = N_mineral_soil + N_fert - N_deni
	SET (nitro4day, 'N_mineral_soil_fert', N_mineral_soil_fert)

	Nh = Nh_ + SUM (N_mineralizado; N_agua) + SUM (Nl; N_extr_) + N_curve
	SET (nitro4day, 'Nh', Nh)

	N_NO3 = N_mineral_soil_fert*1000000/(depth_s*100*100*density_s*1000*(1 - stony)*(1 + N_NH4))
	SET (nitro4day, 'N_NO3', N_NO3)

	T_Nf_recomendado = IF (Nh > N_recom; 0; 1)
	SET (nitro4day, 'T_Nf_recomendado', T_Nf_recomendado)

	N_mineralizado_A = N_mineralizado + N_mineralizado_A_
	SET (nitro4day, 'N_mineralizado_A', N_mineralizado_A)

	N_agua_A = N_agua + N_agua_A_
	SET (nitro4day, 'N_agua_A', N_agua_A)

	Nl_A = Nl + Nl_A_
	SET (nitro4day, 'Nl_A', Nl_A)

	BBCH_tipo = IF_ERROR (VLOOKUP (Fecha; IF (feno_n > 2; FenoBBCH; FenoBBCH_); 2); 0 - 9999)
	SET (nitro4day, 'BBCH_tipo', BBCH_tipo)

	BBCH_graf = IF (BBCH_tipo > 0; 1.4; 0 - 999)
	SET (nitro4day, 'BBCH_graf', BBCH_graf)

	BBCH_real_et = IF_ERROR (VLOOKUP (Fecha; FenoBBCH; 2); 0 - 99999)
	BBCH_real_et = IF (BBCH_real_et == 0; 0 - 99999; BBCH_real_et)
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

	SET (nitro4days, Fecha, nitro4day)

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
	N_mineral_soil_ = N_mineral_soil
'}' end

nitrification = VLOOKUP (climatic_zone; ClimaticData; 5)
results = []
N_fertA = 0
i = 1
while i < n then begin '{'
	Fecha = GET (Fechas, i)
	i = i + 1
	nitro4day = GET (nitro4days, Fecha)
	fertilizer_ = GET (planning_todo, Fecha) || []
	nextdate = GET (fertilizer_, 'nextdate')
	nitro4day_ = nextdate && GET (nitro4days, IF (nextdate == crop_endDate; crop_endDate; ADD2DATE (nextdate, nitrification))) || []
	N_rate_ = GET (nitro4day_, 'N_rate') - N_fertA
	SET (nitro4day, 'N_rate_', N_rate_)
	N_fert_neto = GET (nitro4day, 'N_fert_neto')
	N_fert = IF (N_rate_ > 0; N_rate_; N_fert_neto)
	SET (nitro4day, 'N_fert', N_fert)
	N_fertA = N_fertA + N_fert
	SET (fertilizer_, 'amount', IF_ERROR (IF (N_rate_ > 0; N_rate_; 0)*100/IF_ERROR (GET (fertilizer_, 'Nbf'); 0); 0))
	N_mineral_soil = GET (nitro4day, 'N_mineral_soil')
	N_mineral_soil = N_mineral_soil + N_fertA
	SET (nitro4day, 'N_mineral_soil', N_mineral_soil)
	N_rate = GET (nitro4day, 'N_rate')
	N_rate = N_rate - N_fertA
	SET (nitro4day, 'N_rate', N_rate)


	PUSH (results, nitro4day)
'}' end

planning_done_ = planning_done
planning_todo_ = planning_todo

y = yield
export_r_ = export_r/100
HI_est_ = HI_est/100
CV_ = CV/100

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0-0.84
t_80 = 0.84

Nc_h_ = Nc_h/100
Pc_h_ = Pc_h/100
Kc_h_ = Kc_h/100

dm_h = VLOOKUP (crop_type; CropData; 11)/100
Nc_r = VLOOKUP (crop_type; CropData; 24)/100
density_s = VLOOKUP (soil_texture; SoilData; 21)

Pc_r = VLOOKUP (crop_type; CropData; 25)/100
Pc_s = Pc_si*VLOOKUP (Pc_method; Pc_method_table; 2)
Pc_s_thres_min = VLOOKUP (soil_texture; SoilData; 25)
P_STL_STLtmin = IF (Pc_s < Pc_s_thres_min; 1; 0)
P_STL_2STLtmin = IF (Pc_s > 2*Pc_s_thres_min; 0.5; 1)
P_crop_min_ = P_exported*P_STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin
P_nyears_min = IF (P_crop_min_ > P_crop_max; CEIL (P_crop_min_/P_crop_max); 1)
Pc_s_thres_max = VLOOKUP (soil_texture; SoilData; 26)
P_crop_max_ = P_exported*P_STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*P_STL_STLtmax
P_nyears_max = IF (P_crop_max_ > P_crop_max; CEIL (P_crop_max_/P_crop_max); 1)
P_STL_STLtmax = IF (Pc_s < Pc_s_thres_max; 1; 0)
P_STL_2STLtmax = IF (Pc_s > 2*Pc_s_thres_max; 0.5; 1)
P_exported = h_dm_med_50*Pc_h_ + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r_

P_sufficiency = 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin/P_nyears_min
P_minBM = (P_exported*P_STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin)/P_nyears_min
P_maxBM = (P_exported*P_STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*P_STL_STLtmax)/P_nyears_max
P_maintenance = P_exported

P2O5_sufficiency = 0
P2O5_minBM = P_minBM*2.293
P2O5_maxBM = P_maxBM*2.293
P2O5_maintenance = P_maintenance*2.293

Kc_r = VLOOKUP (crop_type; CropData; 26)/100
Kc_s_thres_min = VLOOKUP (soil_texture; SoilData; 28)
K_STL_STLtmin = IF (Kc_s < Kc_s_thres_min; 1; 0)
K_STL_2STLtmin = IF (Kc_s > 2*Kc_s_thres_min; 0.5; 1)
K_crop_min_ = K_exported*K_STL_2STLtmin + 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin
K_nyears_min = IF (K_crop_min_ > K_crop_max; CEIL (K_crop_min_/K_crop_max); 1)
Kc_s_thres_max = VLOOKUP (soil_texture; SoilData; 29)
K_STL_STLtmax = IF (Kc_s < Kc_s_thres_max; 1; 0)
K_STL_2STLtmax = IF (Kc_s > 2*Kc_s_thres_max; 0.5; 1)
K_crop_max_ = K_minBM*K_STL_2STLtmax + 10*density_s*depth_s*(Kc_s_thres_max - Kc_s)*fK*K_STL_STLtmax
K_nyears_max = IF (K_crop_max_ > K_crop_max; CEIL (K_crop_max_/K_crop_max); 1)
fK = VLOOKUP (soil_texture; SoilData; 24) 
K_exported = h_dm_med_50*Kc_h_ + r_dm_med_50*(1 - fmc_r)*Kc_r*export_r_

K_sufficiency = 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin/K_nyears_min
K_minBM = (K_exported*K_STL_2STLtmin + 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin)/K_nyears_min
K_maxBM = (K_exported*K_STL_2STLtmax + 10*density_s*depth_s*(Kc_s_thres_max - Kc_s)*fK*K_STL_STLtmax)/K_nyears_max
K_maintenance = K_exported

K2O_sufficiency = 0
K2O_minBM = K_minBM*1.205
K2O_maxBM = K_maxBM*1.205
K2O_maintenance = K_maintenance*1.205

h_dm_med_50 = y*dm_h*(1 + CV_*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est_)/HI_est_)
h_dm_med_20 = y*dm_h*(1 + CV_*t_20)
h_dm_med_80 = y*dm_h*(1 + CV_*t_80)