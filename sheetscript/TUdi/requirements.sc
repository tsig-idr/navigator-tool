CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'SoilData.csv'))
Nmineralization_SOM = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Nmineralization_SOM.csv'))
Manures = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Manures.csv'))
Grazings = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Grazings.csv'))
Volatilisation = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Volatilisation.csv'))
Clima = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Clima.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Fertilizers.csv'))
EFs = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'EFs.csv'))
BATs = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'BATs.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'Pc_method_table.csv'))
N_fix_per = STD_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'n_fix_per.csv'))
irrigation_factors = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'irrigation_factors.csv'))
PK_status_1 = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'PK_status_1.csv'))
PK_status_2 = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'PK_status_2.csv'))
PK_status_3 = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'PK_status_3.csv'))
PK_status_4 = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'PK_status_4.csv'))
PK_status_5 = SP_CSV2ARRAY (CONCAT ('sheetscript/TUdi/', 'PK_status_5.csv'))

avg_T = VLOOKUP (climatic_zone; Clima; 5)

N_graz_supply_total = NH3_volatilization_graz_total = N_graz_supply_netvolat_total = P2O5_graz_supply_total = K2O_graz_supply_total = C_graz_supply_total = 0
n = LEN (grazings)
i = 0
while i < n then begin '{'
	row = GET (grazings, i)
	grazing_type = GET (row, 'type')
	grazing_number_ha = GET (row, 'number_ha')
	grazing_days_yr = GET (row, 'days_yr')
	grazing_hours_day = GET (row, 'hours_day')
	weight =  VLOOKUP (grazing_type; Grazings; 2)
	dung_N = IF_ERROR (GET (row, 'N'); VLOOKUP (grazing_type; Grazings; 3))
	dung_P = IF_ERROR (GET (row, 'P'); VLOOKUP (grazing_type; Grazings; 4))
	dung_K = IF_ERROR (GET (row, 'K'); VLOOKUP (grazing_type; Grazings; 5))
	dung_C = IF_ERROR (GET (row, 'C'); VLOOKUP (grazing_type; Grazings; 6))
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
	manure_applic = REPLACE (GET (row, 'applic'), '.', ',')
	c_N = IF_ERROR (GET (row, 'N'); VLOOKUP (manure_type; Manures; 3))
	c_P = IF_ERROR (GET (row, 'P'); VLOOKUP (manure_type; Manures; 4))
	c_K = IF_ERROR (GET (row, 'K'); VLOOKUP (manure_type; Manures; 5))
	c_C = IF_ERROR (GET (row, 'C'); VLOOKUP (manure_type; Manures; 6))
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
	prev_c_N = IF_ERROR (GET (row, 'N'); VLOOKUP (prev_manure_type; Manures; 3))
	legacyN = IF_ERROR (VLOOKUP (prev_manure_type; Manures; 7); 0)
	prev_manure_supply = prev_manure_dose*1000*prev_c_N/100
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
	index = IF (avg_T < 15 && pH <= 7; 2; IF (avg_T < 15 && pH > 7; 3; IF (avg_T > 15 && avg_T < 25 && pH <= 7; 4; IF (avg_T > 15 && avg_T < 25 && pH > 7; 5; IF (avg_T > 25 && pH <= 7; 6; IF (avg_T > 25 && pH > 7; 7; 0))))))
	vol_group = VLOOKUP (fert_type; Fertilizers; 4)
	vol_c = IF (index > 0; VLOOKUP (vol_group; EFs; index); 0)
	Ncf = IF_ERROR (GET (row, 'N'); IF_ERROR (VLOOKUP (fert_type; Fertilizers; 6); 0))
	P2O5cf = IF_ERROR (GET (row, 'P'); IF_ERROR (VLOOKUP (fert_type; Fertilizers; 7); 0))
	K2Ocf = IF_ERROR (GET (row, 'K'); IF_ERROR (VLOOKUP (fert_type; Fertilizers; 8); 0))
	Ccf = IF_ERROR (GET (row, 'C'); IF_ERROR (VLOOKUP (fert_type; Fertilizers; 9); 0))
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

yield_wc_ = IF_ERROR (yield_wc; 1 - VLOOKUP (crop_type; CropData; 11)/100)
dm_h_ = 1 - yield_wc_
HI_est_ = IF_ERROR (HI_est; VLOOKUP (crop_type; CropData; 9))/100
Nc_h_ = IF_ERROR (Nc_h; VLOOKUP (crop_type; CropData; 12))/100
Nc_r_ = IF_ERROR (Nc_r; VLOOKUP (crop_type; CropData; 21))/100
Pc_h_ = IF_ERROR (Pc_h; VLOOKUP (crop_type; CropData; 13))/100
Pc_r_ = IF_ERROR (Pc_r; VLOOKUP (crop_type; CropData; 22))/100
Kc_h_ = IF_ERROR (Kc_h; VLOOKUP (crop_type; CropData; 14))/100
Kc_r_ = IF_ERROR (Kc_r; VLOOKUP (crop_type; CropData; 23))/100
Cc_h_ = IF_ERROR (Cc_h; VLOOKUP (crop_type; CropData; 15))/100
Cc_r_ = IF_ERROR (Cc_r; VLOOKUP (crop_type; CropData; 24))/100
h_dm = y*dm_h_
r_dm = h_dm*(1 - HI_est_)/HI_est_
Nc_up_h = h_dm*Nc_h_ + r_dm*Nc_r_
Pc_up_h = h_dm*Pc_h_ + r_dm*Pc_r_
Kc_up_h = h_dm*Kc_h_ + r_dm*Kc_r_
Cc_up_h = h_dm*Cc_h_ + r_dm*Cc_r_
Nc_ex_h = h_dm*Nc_h_
Pc_ex_h = h_dm*Pc_h_
Kc_ex_h = h_dm*Kc_h_
Cc_ex_h = h_dm*Cc_h_
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
P_fert_c = IF (Pc_status == 'very low' || Pc_status == 'low'; 1; IF (Pc_status == 'medium'; 0.75; IF (Pc_status == 'high'; 0.5; 0)))
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
K_fert_c = IF (Kc_status == 'very low' || Kc_status == 'low'; 1; IF (Kc_status == 'medium'; 0.75; IF (Kc_status == 'high'; 0.5; 0)))
prev_y = IF_ERROR (prev_yield; 0)*1000
prev_green = IF (prev_greenmanure == 'yes'; 1; 0)
prev_dm_h_ = IF_ERROR (prev_dm_h; VLOOKUP (prev_crop_type; CropData; 11))/100
prev_export_r_ = IF_ERROR (prev_export_r; 100)
prev_HI_est_ = IF_ERROR (prev_HI_est; VLOOKUP (prev_crop_type; CropData; 9))/100
prev_Nc_h = VLOOKUP (prev_crop_type; CropData; 12)/100
prev_Nc_r = VLOOKUP (prev_crop_type; CropData; 21)/100
prev_Pc_h = VLOOKUP (prev_crop_type; CropData; 13)/100
prev_Pc_r = VLOOKUP (prev_crop_type; CropData; 22)/100
prev_Kc_h = VLOOKUP (prev_crop_type; CropData; 14)/100
prev_Kc_r = VLOOKUP (prev_crop_type; CropData; 23)/100
prev_Cc_h = VLOOKUP (prev_crop_type; CropData; 15)/100
prev_Cc_r = VLOOKUP (prev_crop_type; CropData; 24)/100
prevPc_up_r = IF (prev_greenmanure == 'yes' || prev_crop_type == ''; 0; prev_r_dm_med*prev_Pc_r)
prevKc_up_r = IF (prev_greenmanure == 'yes' || prev_crop_type == ''; 0; prev_r_dm_med*prev_Kc_r)
prevCc_up_r = IF (prev_crop_type == ''; 0; prev_r_dm_med*prev_Cc_r)
prev_h_dm_med = prev_y*prev_dm_h_
prev_r_dm_med = prev_h_dm_med*(1 - prev_HI_est_)/prev_HI_est_*(1 - prev_export_r_/100)
prev_n_fix_code = VLOOKUP (prev_crop_type; CropData; 7)
prev_cycle_crop = IF (prev_n_fix_code == 'Non_legume'; 0; VLOOKUP (prev_crop_type; CropData; 8))
prev_concatenation = CONCAT (CONCAT (prev_n_fix_code; IF (soilN <= 0.2; '<=0.2'; '>0.2')); prev_cycle_crop)
prev_n_fix_per = IF_ERROR (VLOOKUP (prev_concatenation; N_fix_per; 2); 0)
prevNc_up_r = IF (prev_crop_type == ''; 0; IF (prev_greenmanure == 'yes'; (prev_h_dm_med*prev_Nc_h + prev_r_dm_med*prev_Nc_r)*prev_n_fix_per; prev_r_dm_med*prev_Nc_r))

depth_c = 1
rain_a = VLOOKUP (climatic_zone; Clima; 3)
rain_w = VLOOKUP (climatic_zone; Clima; 4)
cn = VLOOKUP (soil_texture; SoilData; 32)
LI = PI*SI
PI = (rain_a - 10160/cn + 101.6)**2/(rain_a + 15240/cn - 152.4)
SI = ((2*rain_w)/rain_a)**(1/3)
Nleaching = MAX (N_bal; 0)*(1 - EXP ((0-LI)/(depth_c*1000*VLOOKUP (soil_texture; SoilData; 16))))

factor_humidity = IF_ERROR (VLOOKUP (climatic_zone; Clima; 2); 1.0)
N_SOM = GET (GET (Nmineralization_SOM, MATCH (SOM; [0, 0.5, 1, 1.5, 2, 2.5]; 1)), MATCH (VLOOKUP (soil_texture; SoilData; 2); [1, 2, 3]))
Nc_mineralization_SOM = N_SOM*factor_humidity
Nmineralization = Nc_mineralization_SOM

n_fix_code = VLOOKUP (crop_type; CropData; 7)
cycle_crop = IF (n_fix_code == 'Non_legume'; 0; VLOOKUP (crop_type; CropData; 8))
concatenation = CONCAT (CONCAT (n_fix_code; IF (soilN <= 0.2; '<=0.2'; '>0.2')); cycle_crop)
n_fix_per = IF_ERROR (VLOOKUP (concatenation; N_fix_per; 2); 0)
N_yield = y_dm*Nc_h_
N_res = r_dm*Nc_r_
dm_r = VLOOKUP (crop_type; CropData; 20)/100
y_dm = h_dm
fnr = 0.25
Nc_fixation = (1 + fnr)*(N_yield + N_res)*n_fix_per

factor_irrigation = VLOOKUP (type_irrigation; irrigation_factors; 2)/100
Nc_irrigation = IF_ERROR (Nc_NO3_water*dose_irrigation*factor_irrigation*0.226/1000; 0)

amountN_fer = N_min_supply_total
amountN_man = N_man_supply_netvolat_total
amountN_gra = N_graz_supply_netvolat_total
amountN_npk = prevNc_up_r
amountN_min = Nc_mineralization_SOM
amountN_flo = amountN_fer
EF_fer = IF (clima_type == 'wet'; 0.016; 0.005)
EF_man = IF (clima_type == 'wet'; 0.006; 0.005)
EF_gra = IF (clima_type == 'wet'; 0.006; 0.002)
EF_npk = IF (clima_type == 'wet'; 0.006; 0.002)
EF_min = IF (clima_type == 'wet'; 0.006; 0.002)
EF_flo = IF (crop_type == 'RICE'; 0.05; 0)
clima_type = VLOOKUP (climatic_zone; Clima; 7)
Ndenitrification = EF_fer*amountN_fer + EF_man*amountN_man + EF_gra*amountN_gra + EF_npk*amountN_npk + EF_min*amountN_min + EF_flo*amountN_flo

INPUT_N = SUM (Nmineralization; prevNc_up_r; N_man_supply_total + N_graz_supply_total; N_min_supply_total; prev_manure_legacyN_total; Nc_fixation; Nc_irrigation)
OUTPUT_N = SUM (Nc_up_h; Ndenitrification; NH3volat_man_total + NH3_volatilization_graz_total + NH3volat_min_total)
INPUT_P2O5 = SUM (prevPc_up_r; P2O5_man_supply_total + P2O5_graz_supply_total; P2O5_min_supply_total)
OUTPUT_P2O5 = SUM (Pc_up_h; 0)
INPUT_K2O = SUM (prevKc_up_r; K2O_man_supply_total + K2O_graz_supply_total; K2O_min_supply_total)
OUTPUT_K2O = SUM (Kc_up_h; 0)

N_req = MAX (OUTPUT_N - INPUT_N; 0)
P_req = MAX (OUTPUT_P2O5 - INPUT_P2O5; 0)
K_req = MAX (OUTPUT_K2O - INPUT_K2O; 0)
N_bal = INPUT_N - OUTPUT_N
P_bal = INPUT_P2O5 - OUTPUT_P2O5
K_bal = INPUT_K2O - OUTPUT_K2O
N_eff = Nc_ex_h/(N_man_supply_total + N_graz_supply_total + N_min_supply_total)
P_eff = Pc_ex_h/(P2O5_man_supply_total + P2O5_graz_supply_total + P2O5_min_supply_total)
K_eff = Kc_ex_h/(K2O_man_supply_total + K2O_graz_supply_total + K2O_min_supply_total)
C_applied = C_manure_total + C_graz_supply_total + (Cc_up_h - Cc_ex_h) + prevCc_up_r + C_min_total
N2O_emission = Ndenitrification
NH3_volatilisation = NH3volat_man_total + NH3_volatilization_graz_total + NH3volat_min_total
NO3_leaching = Nleaching
