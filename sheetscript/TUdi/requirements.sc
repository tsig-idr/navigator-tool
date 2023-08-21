depth_c = 1
cn = VLOOKUP (soil_texture; SoilData; 32)
LI = PI*SI
PI = (rain_a - 10160/cn + 101.6)**2/(rain_a + 15240/cn - 152.4)
SI = ((2*rain_w)/rain_a)**(1/3)
Nleaching = Ncrop*(1 - EXP ((0-LI)/(depth_c*1000*VLOOKUP (soil_texture; SoilData; 16))))

N_graz_supply_total = NH3_volatilization_graz_total = N_graz_supply_netvolat_total = P2O5_graz_supply_total = K2O_graz_supply_total = C_graz_supply_total = 0
n = LEN (grazings)
i = 0
while i < n then begin '{'
	row = GET (grazings, i)
	grazing_type = GET (row, 'type')
	grazing_number_ha = GET (row, 'number_ha')
	grazing_days_yr = GET (row, 'days_yr')
	grazing_hours_day = GET (row, 'hours_day')
	weight =  VLOOKUP (grazing_type; Grazings; 1)
	dung_N = VLOOKUP (grazing_type; Grazings; 3)
	dung_P = VLOOKUP (grazing_type; Grazings; 4)
	dung_K = VLOOKUP (grazing_type; Grazings; 5)
	dung_C = VLOOKUP (grazing_type; Grazings; 6)
	TAN = VLOOKUP (grazing_type; Grazings; 7)
	EF = VLOOKUP (grazing_type; Grazings; 8)
	grazing_N = dung_N*weight*grazing_days_yr*(grazing_hours_day/24)*grazing_number_ha
	grazing_P = dung_P*weight*grazing_days_yr*(grazing_hours_day/24)*grazing_number_ha*2.29
	grazing_K = dung_K*weight*grazing_days_yr*(grazing_hours_day/24)*grazing_number_ha*1.21
	grazing_C = dung_C*weight*grazing_days_yr*(grazing_hours_day/24)*grazing_number_ha*1.21
	NH3_volatilization_graz = grazing_N*EF*TAN
	N_graz_supply_netvolat = grazing_N - NH3_volatilization_graz

	N_graz_supply_total = N_graz_supply_total + grazing_N
	NH3_volatilization_graz_total = NH3_volatilization_graz_total + NH3_volatilization_graz
	N_graz_supply_netvolat_total = N_graz_supply_netvolat_total + N_graz_supply_netvolat
	P2O5_graz_supply_total = P2O5_graz_supply_total + grazing_P
	K2O_graz_supply_total = K2O_graz_supply_total + grazing_K
	C_graz_supply_total = C_graz_supply_total + grazing_C
	i = i + 1
'}' end

N_man_supply_total = NH3volat_man_total = N_man_supply_netvolat_total = P2O5_man_supply_total = K2O_man_supply_total = C_manure_total = 0
n_ = LEN (manures)
i_ = 0
while i_ < n_ then begin '{'
	row = GET (manures, i_)
	manure_type = GET (row, 'type')
	manure_dose = GET (row, 'dose')
	manure_applic = GET (row, 'applic')
	c_N = VLOOKUP (manure_type; Manures; 3)
	c_P = VLOOKUP (manure_type; Manures; 4)
	c_K = VLOOKUP (manure_type; Manures; 5)
	c_C = VLOOKUP (manure_type; Manures; 6)
	TAN = VLOOKUP (manure_type; Manures; 8)
	EF_application = VLOOKUP (manure_type; Manures; 9)
	manure_N = manure_dose*1000*c_N
	manure_P = manure_dose*1000*c_P
	manure_K = manure_dose*1000*c_K
	manure_C = manure_dose*1000*c_C
	EF_BAT_man = VLOOKUP (manure_applic; Volatilisation; 2)
	NH3volat_man = manure_N*TAN*(EF_application*(1 - EF_BAT_man))
	N_man_supply_netvolat = manure_N - NH3volat_man

	N_man_supply_total = N_man_supply_total + manure_N
	NH3volat_man_total = NH3volat_man_total + NH3volat_man
	N_man_supply_netvolat_total = N_man_supply_netvolat_total + N_man_supply_netvolat
	P2O5_man_supply_total = P2O5_man_supply_total + manure_P
	K2O_man_supply_total = K2O_man_supply_total + manure_K
	C_manure_total = C_manure_total + manure_C
	i_ = i_ + 1
'}' end

prev_manure_supply_total = prev_manure_legacyN_total = 0
n__ = LEN (prev_manures)
i__ = 0
while i__ < n__ then begin '{'
	row = GET (prev_manures, i__)
	prev_manure_type = GET (row, 'type')
	prev_manure_dose = GET (row, 'dose')
	prev_c_N = VLOOKUP (prev_manure_type; Manures; 3)
	legacyN = VLOOKUP (prev_manure_type; Manures; 7)
	prev_manure_supply = prev_manure_dose*1000*prev_c_N
	prev_manure_legacyN = prev_manure_supply*legacyN

	prev_manure_supply_total = prev_manure_supply_total + prev_manure_supply
	prev_manure_legacyN_total = prev_manure_legacyN_total + prev_manure_legacyN
	i__ = i__ + 1
'}' end

N_min_supply_total = NH3volat_min_total = N_min_supply_netvolat_total = P2O5_min_supply_total = K2O_min_supply_total = C_min_total = 0
n___ = LEN (fertilizers)
i___ = 0
while i___ < n___ then begin '{'
	row = GET (fertilizers, i___)
	fert_type = GET (row, 'type')
	fert_dose = GET (row, 'dose')
	fert_applic = GET (row, 'applic')
	avg_T = VLOOKUP (climatic_zone; Clima; 5)
	index = IF (avg_T < 15 && pH <= 7; 2; IF (avg_T < 15 && pH > 7; 3; IF (avg_T > 15 && avg_T < 25 && pH <= 7; 4; IF (avg_T > 15 && avg_T < 25 && pH > 7; 5; IF (avg_T > 25 && pH <= 7; 6; IF (avg_T > 25 && pH > 7; 7; 0))))))
	vol_group = VLOOKUP (climatic_zone; Fertilizers; 5)
	vol_c = IF (index > 0; VLOOKUP (vol_group; EFs; index); 0)
	Ncf = IF_ERROR (VLOOKUP (fert_type; Fertilizers; 11); 0)
	P2O5cf = IF_ERROR (VLOOKUP (fert_type; Fertilizers; 13); 0)
	K2Ocf = IF_ERROR (VLOOKUP (fert_type; Fertilizers; 15); 0)
	Ccf = IF_ERROR (VLOOKUP (fert_type; Fertilizers; 25); 0)
	N_min = Ncf*fert_dose
	EF_BAT_min = IF_ERROR (VLOOKUP (fert_applic; BATs; 2); 0)
	NH3volat_min = N_min*(vol_c/1000)*(1 - EF_BAT_min/100)
	N_min_supply_netvolat = N_min - NH3volat_min
	P2O5_min = P2O5cf*fert_dose
	K2O_min = K2Ocf*fert_dose
	C_min = Ccf*fert_dose

	N_min_supply_total = N_min_supply_total + N_min
	NH3volat_min_total = NH3volat_min_total + NH3volat_min
	N_min_supply_netvolat_total = N_min_supply_netvolat_total + N_min_supply_netvolat
	P2O5_min_supply_total = P2O5_min_supply_total + P2O5_min
	K2O_min_supply_total = K2O_min_supply_total + K2O_min
	C_min_total = C_min_total + C_min
	i___ = i___ + 1
'}' end

y = yield*1000
dm_h = VLOOKUP (crop_type; CropData; 11)/100
HI_est = VLOOKUP (crop_type; CropData; 9)/100
Nc_h = VLOOKUP (crop_type; CropData; 14)/100
Nc_r = VLOOKUP (crop_type; CropData; 25)/100
Pc_h = VLOOKUP (crop_type; CropData; 15)/100
Pc_r = VLOOKUP (crop_type; CropData; 26)/100
Kc_h = VLOOKUP (crop_type; CropData; 16)/100
Kc_r = VLOOKUP (crop_type; CropData; 27)/100
Cc_h = VLOOKUP (crop_type; CropData; 17)/100
Cc_r = VLOOKUP (crop_type; CropData; 28)/100
h_dm = y*dm_h
r_dm = h_dm*(1 - HI_est)/HI_est
Nc_up_h = h_dm*Nc_h + r_dm*Nc_r
Pc_up_h = h_dm*Pc_h + r_dm*Pc_r
Kc_up_h = h_dm*Kc_h + r_dm*Kc_r
Cc_up_h = h_dm*Cc_h + r_dm*Cc_r
Nc_ex_h = h_dm*Nc_h
Pc_ex_h = h_dm*Pc_h
Kc_ex_h = h_dm*Kc_h
Cc_ex_h = h_dm*Cc_h
Pc_s = Pc_s_0*VLOOKUP (Pc_method; Pc_method_table; 2)
Kc_s = Kc_s_0/CEC
P1l = VLOOKUP (soil_texture; PK_status_1; 3)
P2l = VLOOKUP (soil_texture; PK_status_2; 3)
P3l = VLOOKUP (soil_texture; PK_status_3; 3)
P4l = VLOOKUP (soil_texture; PK_status_4; 3)
P5l = VLOOKUP (soil_texture; PK_status_5; 3)
P1u = VLOOKUP (soil_texture; PK_status_1; 4)
P2u = VLOOKUP (soil_texture; PK_status_2; 4)
P3u = VLOOKUP (soil_texture; PK_status_3; 4)
P4u = VLOOKUP (soil_texture; PK_status_4; 4)
P5u = VLOOKUP (soil_texture; PK_status_5; 4)
P1e = VLOOKUP (soil_texture; PK_status_1; 2)
P2e = VLOOKUP (soil_texture; PK_status_2; 2)
P3e = VLOOKUP (soil_texture; PK_status_3; 2)
P4e = VLOOKUP (soil_texture; PK_status_4; 2)
P5e = VLOOKUP (soil_texture; PK_status_5; 2)
Pc_status = IF (Pc_s > P1l && Pc_s <= P1u; P1e; IF (Pc_s > P2l && Pc_s <= P2u; P2e; IF (Pc_s > P3l && Pc_s <= P3u; P3e; IF (Pc_s > P4l && Pc_s <= P4u; P4e; IF (Pc_s > P5l && Pc_s <= P5u; P5e; '')))))
K1l = VLOOKUP (soil_texture; PK_status_1; 7)
K2l = VLOOKUP (soil_texture; PK_status_2; 7)
K3l = VLOOKUP (soil_texture; PK_status_3; 7)
K4l = VLOOKUP (soil_texture; PK_status_4; 7)
K5l = VLOOKUP (soil_texture; PK_status_5; 7)
K1u = VLOOKUP (soil_texture; PK_status_1; 8)
K2u = VLOOKUP (soil_texture; PK_status_2; 8)
K3u = VLOOKUP (soil_texture; PK_status_3; 8)
K4u = VLOOKUP (soil_texture; PK_status_4; 8)
K5u = VLOOKUP (soil_texture; PK_status_5; 8)
K1e = VLOOKUP (soil_texture; PK_status_1; 6)
K2e = VLOOKUP (soil_texture; PK_status_2; 6)
K3e = VLOOKUP (soil_texture; PK_status_3; 6)
K4e = VLOOKUP (soil_texture; PK_status_4; 6)
K5e = VLOOKUP (soil_texture; PK_status_5; 6)
Kc_status = IF (Kc_s > K1l && Kc_s <= K1u; K1e; IF (Kc_s > K2l && Kc_s <= K2u; K2e; IF (Kc_s > K3l && Kc_s <= K3u; K3e; IF (Kc_s > K4l && Kc_s <= K4u; K4e; IF (Kc_s > K5l && Kc_s <= K5u; K5e; '')))))


SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'SoilData.csv'))
Manures = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Manures.csv'))
Grazings = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Grazings.csv'))
Volatilisation = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Volatilisation.csv'))
Clima = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Clima.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Fertilizers.csv'))
EFs = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'EFs.csv'))
BATs = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'BATs.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))













ppm = density_s*depth_s*10
Nc_s_initial = Nc_s_0*IF (Nc_s_initial_unit == 'kg_ha'; 1; IF (Nc_s_initial_unit == 'ppm'; ppm; IF (Nc_s_initial_unit == 'pct'; 10000*ppm/100; IF (Nc_s_initial_unit == 'meq_100'; 620*ppm; IF (Nc_s_initial_unit == 'meq_kg'; 6200*ppm; IF (Nc_s_initial_unit == 'meq_l'; 62*ppm; 1))))))
Nc_s_end = Nc_s_n*IF (Nc_end_unit == 'kg_ha'; 1; IF (Nc_end_unit == 'ppm'; ppm; IF (Nc_end_unit == 'pct'; 10000*ppm/100; IF (Nc_end_unit == 'meq_100'; 620*ppm; IF (Nc_end_unit == 'meq_kg'; 6200*ppm; IF (Nc_end_unit == 'meq_l'; 62*ppm; 1))))))
Pc_si = Pc_s_0*IF (Pc_s_unit == 'kg_ha'; 1/ppm; IF (Pc_s_unit == 'ppm'; 1; IF (Pc_s_unit == 'pct'; 10000/100; IF (Pc_s_unit == 'meq_100'; 316.5; IF (Pc_s_unit == 'meq_kg'; 3165; IF (Pc_s_unit == 'meq_l'; 31.65; 1))))))
Kc_s = Kc_s_0*IF (Kc_s_unit == 'kg_ha'; 1/ppm; IF (Kc_s_unit == 'ppm'; 1; IF (Kc_s_unit == 'pct'; 10000/100; IF (Kc_s_unit == 'meq_100'; 391; IF (Kc_s_unit == 'meq_kg'; 3910; IF (Kc_s_unit == 'meq_l'; 39.1; 1))))))

E = 2.718281828459045
y = yield
export_r_ = export_r/100
HI_est_ = HI_est/100
CV_ = CV/100
Nc_h_ = Nc_h/100
Pc_h_ = Pc_h/100
Kc_h_ = Kc_h/100

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0-0.84
t_80 = 0.84

CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'SoilData.csv'))
Nmineralization_SOM = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Nmineralization_SOM.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))
Clima = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Clima.csv'))
n_fix_per = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'n_fix_per.csv'))
Drainage = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Drainage.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers_aux.csv'))
pH4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'pH4vol.csv'))
CEC4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CEC4vol.csv'))

vol_c = EXP (IF (water_supply == '0'; 0-0.045; 0) + VLOOKUP (pH; pH4vol; 2; 1) + VLOOKUP (CEC/10; CEC4vol; 2; 1) + 0-0.402)

Nc_mineralization_amendment = 0
N_total_losses_vol = N_total_losses_deni = 0



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

factor_humidity = IF_ERROR (VLOOKUP (climatic_zone; Clima; 2); 1.0)
Nc_mineralization_SOM = GET (GET (Nmineralization_SOM, MATCH (SOM; [0, 0.5, 1, 1.5, 2, 2.5]; 1)), MATCH (VLOOKUP (soil_texture; SoilData; 2); [1, 2, 3]))*factor_humidity
Nmineralization = Nc_mineralization_SOM

n_fix_code = VLOOKUP (crop_type; CropData; 7)
n_fix_per = IF (n_fix_code == 'Non_legume'; 0; VLOOKUP (CONCAT (n_fix_code; CONCAT (IF (SOM <= 3; '<=3'; '>3'); VLOOKUP (crop_type; CropData; 8))); n_fix_per; 2))
N_yield = y_dm*Nc_h_
N_res = r_dm*Nc_r
r_dm = y_dm*(1 - HI_est_)/HI_est_
y_dm = yield*dm_h
Nfixation = IF (n_fix_code =='Non_legume'; 10; (1 + fnr)*(N_yield + N_res)*n_fix_per)

factor_irrigation = efficiency/100*IF (type_irrigated == 'trickle'; 0.9; IF (type_irrigated == 'sprinkler'; 0.85; IF (type_irrigated == 'surface'; 0.7; 0)))
Nirrigation = IF (water_supply == '0'; 0; Nc_NO3_water*dose_irrigation*10*factor_irrigation*22.6/100000)




h_dm_med_50 = y*dm_h*(1 + CV_*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est_)/HI_est_)
h_dm_med_20 = y*dm_h*(1 + CV_*t_20)
h_dm_med_80 = y*dm_h*(1 + CV_*t_80)
Nuptake = (h_dm_med_50*Nc_h_ + r_dm_med_50*Nc_r)*(1 + fnr)
Nuptake_min = (h_dm_med_20*Nc_h_ + (h_dm_med_20*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)
Nuptake_max = (h_dm_med_80*Nc_h_ + (h_dm_med_80*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)

Ndenitrification = 0.34*E**(0.012*Ncrop_avg)
Ndenitrification_min = Ndenitrification*(SUM (Nleaching; Nuptake_min; Nc_s_end) - input_min)/(SUM (Nleaching; Nuptake; Nc_s_end) - input_min)
Ndenitrification_max = Ndenitrification*(SUM (Nleaching; Nuptake_max; Nc_s_end) - input_max)/(SUM (Nleaching; Nuptake; Nc_s_end) - input_max)

Nvolatilization = N_total_losses_vol
Nvolatilization_min = Nvolatilization*(SUM (Nleaching; Nuptake_min; Nc_s_end; Ndenitrification_min) - input_min)/(SUM (Nleaching; Nuptake; Nc_s_end; Ndenitrification) - input_min)
Nvolatilization_max = Nvolatilization*(SUM (Nleaching; Nuptake_max; Nc_s_end; Ndenitrification_max) - input_max)/(SUM (Nleaching; Nuptake; Nc_s_end; Ndenitrification) - input_max)

input_avg = input_min = input_max = SUM (Nmineralization; Nfixation; Nirrigation; Nc_s_initial)
output_avg = SUM (Nleaching; Nuptake; Nc_s_end)
output_min = SUM (Nleaching; Nuptake_min; Nc_s_end)
output_max = SUM (Nleaching; Nuptake_max; Nc_s_end)

Ncrop_avg = MAX (output_avg - input_avg; 0)
Ncrop_min = MAX (output_min - input_min; 0)
Ncrop_max = MAX (output_max - input_max; 0)

