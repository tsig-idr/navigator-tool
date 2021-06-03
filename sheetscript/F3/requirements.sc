y = yield
crop_type = cropID
export_r_ = export_r/100
HI_est_ = HI_est/100
CV_ = CV/100

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0 - 0.84
t_80 = 0.84

CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'SoilData.csv'))
Nmineralization_SOM = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Nmineralization_SOM.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))
Clima = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Clima.csv'))
n_fix_per = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'n_fix_per.csv'))
Drainage = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Drainage.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Fertilizers.csv'))

dm_amendment = Nc_mineralization_amendment = 0
inorg_N_vol_applied = org_N_vol_applied = inorg_N_vol_planned = org_N_vol_planned = 0
N = N_final_losses = 0
n = LEN (fertilizers)
i = 0
while i < n then begin '{'
	row = GET (fertilizers, i)
	id = GET (row, 'fertilizerID')
	amount = GET (row, 'amount')
	clasification_fm = VLOOKUP (id; Fertilizers; 4)
	Ncf = IF_ERROR (VLOOKUP (id; Fertilizers; 13); 0)
	Nc_dm_amendment = IF_ERROR (VLOOKUP (id; Fertilizers; 14); 0)
	N_bf = IF_ERROR (VLOOKUP (id; Fertilizers; 15); 0)
	dm_amendment = IF_ERROR (VLOOKUP (id; Fertilizers; 21); 0)
	frecu_application_amendment = IF (id == 'dc' || id == 'bc' || id == 'sn' || id == 'pt'; 0.5; 1)
	Nc_mineralization_amendment = Nc_mineralization_amendment + N_bf*dm_amendment*amount*frecu_application_amendment
	inorg_N_vol_applied = inorg_N_vol_applied + IF (clasification_fm == 'Inorganic'; N_bf*amount; 0)
	org_N_vol_applied = org_N_vol_applied + IF (clasification_fm == 'Organic'; N_bf*amount; 0)
	N = N + IF (clasification_fm == 'Inorganic'; Ncf; Nc_dm_amendment)*amount
	N_final_losses = N_final_losses + N_bf*amount
	i = i + 1
'}' end

dm_h = VLOOKUP (crop_type; CropData; 11)/100
Nc_h = VLOOKUP (crop_type; CropData; 14)/100
Nc_r = VLOOKUP (crop_type; CropData; 24)/100
density_s = VLOOKUP (soil_texture; SoilData; 21)

Pc_h = VLOOKUP (crop_type; CropData; 15)/100
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
Pc_si = Pc_s_0*density_s*depth_s*10
P_exported = h_dm_med_50*Pc_h + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r_

P_sufficiency = 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin/P_nyears_min
P_minBM = (P_exported*P_STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*P_STL_STLtmin)/P_nyears_min
P_maxBM = (P_exported*P_STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*P_STL_STLtmax)/P_nyears_max
P_maintenance = P_exported

P2O5_sufficiency = 0
P2O5_minBM = P_minBM*2.293
P2O5_maxBM = P_maxBM*2.293
P2O5_maintenance = P_maintenance*2.293

Kc_h = VLOOKUP (crop_type; CropData; 16)/100
Kc_r = VLOOKUP (crop_type; CropData; 26)/100
Kc_s = 39.1*Kc_s_0*density_s*depth_s*10
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
K_exported = h_dm_med_50*Kc_h + r_dm_med_50*(1 - fmc_r)*Kc_r*export_r_

K_sufficiency = 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin/K_nyears_min
K_minBM = (K_exported*K_STL_2STLtmin + 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin)/K_nyears_min
K_maxBM = (K_exported*K_STL_2STLtmax + 10*density_s*depth_s*(Kc_s_thres_max - Kc_s)*fK*K_STL_STLtmax)/K_nyears_max
K_maintenance = K_exported

K2O_sufficiency = 0
K2O_minBM = K_minBM*1.205
K2O_maxBM = K_maxBM*1.205
K2O_maintenance = K_maintenance*1.205

factor_humidity = VLOOKUP (climatic_zone; Clima; 2)
Nc_mineralization_SOM = GET (GET (Nmineralization_SOM, MATCH (SOM; [0, 0.5, 1, 1.5, 2, 2.5]; 1)), MATCH (VLOOKUP (soil_texture; SoilData; 2); [1, 2, 3]))*factor_humidity
Nmineralization = Nc_mineralization_SOM + Nc_mineralization_amendment

n_fix_code = VLOOKUP (crop_type; CropData; 7)
n_fix_per = IF (n_fix_code == 'Non_legume'; 0; VLOOKUP (CONCAT (n_fix_code; CONCAT (IF (SOM <= 3; '<=3'; '>3'); VLOOKUP (crop_type; CropData; 8))); n_fix_per; 2))
N_yield = y_dm*Nc_h
N_res = r_dm*Nc_r
r_dm = y_dm*(1 - HI_est_)/HI_est_
y_dm = yield*dm_h
Nfixation = IF (n_fix_code =='Non_legume'; 10; (1 + fnr)*(N_yield + N_res)*n_fix_per)

factor_irrigation = IF (type_irrigated == 'trickle'; 0.9; IF (type_irrigated == 'sprinkler'; 0.85; IF (type_irrigated == 'surface'; 0.7; 0)))
Nirrigation = IF (water_supply == '0'; 0; Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000)

Nc_s_initial = Nc_s_0*density_s*depth_s*10
Nc_s_end = Nc_s_n*density_s*depth_s*10

cn = VLOOKUP (soil_texture; SoilData; 32)
LI = PI*SI
PI = (rain_a - 10160/cn + 101.6)**2/(rain_a + 15240/cn - 152.4)
SI = ((2*rain_w)/rain_a)**(1/3)
Nleaching = Nc_s_initial*(1 - EXP((0 - LI)/(depth_s*1000*VLOOKUP (soil_texture; SoilData; 16))))

h_dm_med_50 = y*dm_h*(1 + CV_*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est_)/HI_est_)
h_dm_med_20 = y*dm_h*(1 + CV_*t_20)
h_dm_med_80 = y*dm_h*(1 + CV_*t_80)
Nuptake = (h_dm_med_50*Nc_h + r_dm_med_50*Nc_r)*(1 + fnr)
Nuptake_min = (h_dm_med_20*Nc_h + (h_dm_med_20*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)
Nuptake_max = (h_dm_med_80*Nc_h + (h_dm_med_80*(1 - HI_est_)/HI_est_)*Nc_r)*(1 + fnr)

drain_rate = VLOOKUP (soil_texture; SoilData; 5)
j = IF (water_supply == '1'; 1; 0)*5 + IF (drain_rate == 'Very high'; 1; IF (drain_rate == 'High'; 2; IF (drain_rate == 'Medium'; 3; IF (drain_rate == 'Low'; 4; 5))))
inorgDrain = GET (GET (Drainage, IF (tilled == 'no'; 6; 0) + IF (SOM >= 5; 3; IF (SOM >=2; 2; 1))), j)
orgDrain = IF (tilled == 'yes'; GET (GET (Drainage, 3 + IF (SOM >= 5; 3; IF (SOM >=2; 2; 1))), j); 0)
Ndenitrification = SUM (inorgDrain*(inorg_N_vol_applied + inorg_N_vol_planned); orgDrain*(org_N_vol_applied + org_N_vol_planned))
Ndenitrification_min = Ndenitrification*(SUM (Nleaching; Nuptake_min; Nc_s_end) - input_min)/(SUM (Nleaching; Nuptake; Nc_s_end) - input_min)
Ndenitrification_max = Ndenitrification*(SUM (Nleaching; Nuptake_max; Nc_s_end) - input_max)/(SUM (Nleaching; Nuptake; Nc_s_end) - input_max)

Nvolatilization = IF (n >= 1; N - N_final_losses; 10)
Nvolatilization_min = Nvolatilization*(SUM (Nleaching; Nuptake_min; Nc_s_end; Ndenitrification_min) - input_min)/(SUM (Nleaching; Nuptake; Nc_s_end; Ndenitrification) - input_min)
Nvolatilization_max = Nvolatilization*(SUM (Nleaching; Nuptake_max; Nc_s_end; Ndenitrification_max) - input_max)/(SUM (Nleaching; Nuptake; Nc_s_end; Ndenitrification) - input_max)

input_avg = input_min = input_max = SUM (Nmineralization; Nfixation; Nirrigation; Nc_s_initial)
output_avg = SUM (Nleaching; Nuptake; Nc_s_end; Ndenitrification; Nvolatilization)
output_min = SUM (Nleaching; Nuptake_min; Nc_s_end; Ndenitrification_min; Nvolatilization_min)
output_max = SUM (Nleaching; Nuptake_max; Nc_s_end; Ndenitrification_max; Nvolatilization_max)

Ncrop_avg = MAX (output_avg - input_avg; 0)
Ncrop_min = MAX (output_min - input_min; 0)
Ncrop_max = MAX (output_max - input_max; 0)



