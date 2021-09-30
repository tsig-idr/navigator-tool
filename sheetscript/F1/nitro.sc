E = 2.718281828459045
CSVAgro = [[]]
Curve4organic = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Curve4organic.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'Fertilizers_aux.csv'))
CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'SoilData.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))
FenoT = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'FenoT.csv'))
Extracciones = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'Extracciones.csv'))
Mineral = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'Mineral.csv'))
MO = SP_CSV2ARRAY(CONCAT('sheetscript/F1/', 'MO.csv'))
NDVIreali = LINTER4DATES (NDVIreal)
NDVItipoi = LINTER4DATES (NDVItipo)

Nuptake = (h_dm_med_50*Nc_h_ + r_dm_med_50*Nc_r)*(1 + fnr)
Nuptake_min = (h_dm_med_20*Nc_h_ + (h_dm_med_20*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)
Nuptake_max = (h_dm_med_80*Nc_h_ + (h_dm_med_80*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)

agroasesor = 'no'
c_mineral = VLOOKUP (SOM; MO; 2, 1)
UFN = depth_s*100*100*density_s*1000*(1 - stony)*Nc_s_initial/1000000

mineralIni = '9999-12-31'
mineralEnd = crop_endDate

Fechas = GENNDATES (ADD2DATE (startDate, 0 - 1), n)
n = 200 + 1
m = LEN (FenoT)

ET0_acc_ = 0
n_days_Eto = 0
l = 1
k = 1
while k < n then begin '{'
	row = GET (FenoT, l)
	SET (row, 4, n_days_Eto)
	SET (FenoT, l, row)
	val = FLOAT (GET (row, 0))
	Fecha = GET (Fechas, k)
	ET0 = IF (Fecha >= crop_startDate; IF_ERROR (VLOOKUP (Fecha; Meteo; 13); IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (Fecha; CSVAgro; 8); VLOOKUP (Fecha; Clima; 13)); 0)); 0)
	ET0_acc = ET0 + ET0_acc_
	ET0_acc_ = ET0_acc
	n_days_Eto = IF (Fecha >= crop_startDate; IF (ET0_acc >= val; 1; n_days_Eto + 1); 0)
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
Nh_ = UFN
N_NO3_ = 0
N_mineralizado_A_ = 0
N_agua_A_ = 0
Nl_A_ = 0
N_mineral_soil_ = Nh_
N_final = 0
c_a = 0
c_b = 0
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

	Tm = t
	SET (nitro4day, 'Tm', Tm)

	IT = Tm
	SET (nitro4day, 'IT', IT)

	J = Jp
	SET (nitro4day, 'J', J)

	Sem = IF (ISOWEEKNUMBER (Fecha) < 40; ISOWEEKNUMBER (Fecha); ISOWEEKNUMBER (Fecha) - 53)
	SET (nitro4day, 'Sem', Sem)

	N_extrA = IF (IT > VLOOKUP (crop_type; Extracciones; 3) && IT < VLOOKUP (crop_type; Extracciones; 5); (IT - VLOOKUP (crop_type; Extracciones; 3))*N_NH4; 0)
	SET (nitro4day, 'N_extrA', N_extrA)

	N_extr = MAX (N_extrA - N_extrA_; 0)
	SET (nitro4day, 'N_extr', N_extr)

	val = FLOAT (GET (row_, 0))
	j = IF (Eto_acumulada_elegida >= val; j + 1; j)
	row = IF (j < m; GET (FenoT, j); [99999, 0, 0, 0, 0])
	row_ = row
	n_days_Eto = GET (row, 4)
	i_days_Eto = IF (Eto_acumulada_elegida >= val; 1; i_days_Eto + 1)

	ExtracR_N = IF (n_days_Eto > 0; GET (row, 2)/n_days_Eto; 0)
	ExtracR_N_Kg = ExtracR_N*Nuptake
	N_extr_1 = IF_ERROR (0 - ExtracR_N_Kg; 0)
	SET (nitro4day, 'N_extr_1', N_extr_1)

	N_mineralizado = IF (N_extr_1 == 0; FLOAT (VLOOKUP (Tm; Mineral; 2; 1))*Tm*c_mineral*mineralizationSlowdown/100; FLOAT (VLOOKUP (Tm; Mineral; 2; 1))*Tm*c_mineral)
	SET (nitro4day, 'N_mineralizado', N_mineralizado)

	N_agua = (Riego_neces + Riego_Efec)*waterNitrate*14/(100*62)
	SET (nitro4day, 'N_agua', N_agua)

	BBCH = GET (row, 1)
	SET (nitro4day, 'BBCH', BBCH)

	Nl = (0 - DP)*N_NO3_/100
	SET (nitro4day, 'Nl', Nl)

	N_extrA_1 = N_extrA_1_ + N_extr_1
	SET (nitro4day, 'N_extrA_1', N_extrA_1)

	fertilizer = GET (planning_done, Fecha) || []
	fertilizer_ = GET (planning_todo, Fecha) || []

	mineralIni = IF (GET (fertilizer, 'classification') == 'Organic'; Fecha; mineralIni)
	mineralEnd = IF (GET (fertilizer_, 'method') == 'topdressing' && Fecha < mineralEnd; Fecha; mineralEnd)

	N_fert_neto = IF (GET (fertilizer, 'date') == Fecha; GET (fertilizer, 'Nbf')/100*GET (fertilizer, 'amount'); 0)

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

	N_recom = GET (row, 3)
	SET (nitro4day, 'N_recom', N_recom)

	N_mineral_soil = N_mineral_soil_ + SUM (N_mineralizado; N_agua) + SUM (Nl; N_extr_1) + N_curve
	SET (nitro4day, 'N_mineral_soil', N_mineral_soil)

	N_rate = N_recom - N_mineral_soil
	SET (nitro4day, 'N_rate', N_rate)

	SET (fertilizer_, 'amount', IF_ERROR (IF (N_rate > 0; N_rate; 0)*100/IF_ERROR (GET (fertilizer_, 'Nbf'); 0); 0))

	N_fert_neto = IF (N_rate > 0 && GET (fertilizer_, 'date') == Fecha; N_rate; N_fert_neto)
	SET (nitro4day, 'N_fert_neto', N_fert_neto)

	N_deni = 0.34*E**(0.012*N_rate)
	SET (nitro4day, 'N_deni', N_deni)

	Nh = Nh_ + SUM (N_mineralizado; N_agua; N_fert_neto) + SUM (Nl; N_extr_1)
	SET (nitro4day, 'Nh', Nh)

	N_NO3 = Nh*1000000/(depth_s*100*100*density_s*1000*(1 - stony)*(1 + N_NH4))
	SET (nitro4day, 'N_NO3', N_NO3)

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

	Nuptakediario = IF_ERROR (GET (SWB4day, 'Nuptakediario'); '')
	SET (nitro4day, 'Nuptake', Nuptakediario)

	SET (nitro4days, Fecha, nitro4day)

	PUSH (results, nitro4day)

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

dm_h = VLOOKUP (crop_type; CropData; 8)/100
Nc_r = VLOOKUP (crop_type; CropData; 21)/100
density_s = VLOOKUP (soil_texture; SoilData; 21)

Pc_r = VLOOKUP (crop_type; CropData; 22)/100
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
Pc_si = Pc_s_0*1
P_exported = h_dm_med_50*Pc_h_ + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r_

P_sufficiency = 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin/P_nyears_min
P_minBM = (P_exported*P_STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin)/P_nyears_min
P_maxBM = (P_exported*P_STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*P_STL_STLtmax)/P_nyears_max
P_maintenance = P_exported

P2O5_sufficiency = 0
P2O5_minBM = P_minBM*2.293
P2O5_maxBM = P_maxBM*2.293
P2O5_maintenance = P_maintenance*2.293

Kc_r = VLOOKUP (crop_type; CropData; 23)/100
Kc_s = Kc_s_0*1
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