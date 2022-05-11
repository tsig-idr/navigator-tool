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
n = LEN (fertilizers)
i = 0
while i < n then begin '{'
	row = GET (fertilizers, i)
	id = GET (row, 'fertilizerID')
	amount = GET (row, 'amount')
	clasification_fm = VLOOKUP (id; Fertilizers; 4)
	vol_c_i = IF_ERROR (VLOOKUP (id; Fertilizers; 6); 0)
	Ncf = IF_ERROR (VLOOKUP (id; Fertilizers; 13); 0)
	Nc_dm_amendment = IF_ERROR (VLOOKUP (id; Fertilizers; 14); 0)
	Nc_i = IF (clasification_fm == 'Inorganic'; Ncf; Nc_dm_amendment)
	method = VLOOKUP (id; Fertilizers_aux; 2)
	vol_losses = EXP (IF (method == 'incorporated'; 0-1.895; IF (method == 'topdressing'; 0-1.305; 0)) + vol_c_i)*vol_c
	N_bf_vol = Nc_i*(1 - vol_losses)
	deni_losses = 0
	N_bf_deni = Nc_i*(1 - deni_losses)
	N_bf = IF_ERROR (N_bf_vol*N_bf_deni/Nc_i; 0)
	frecu_application_amendment = 1.0
	Nc_mineralization_amendment = Nc_mineralization_amendment + N_bf*amount*frecu_application_amendment
	N_raw = N_bf*amount/(1 - vol_losses - deni_losses)
	N_losses_vol = N_raw*vol_losses
	N_total_losses_vol = N_total_losses_vol + N_losses_vol
	N_total_losses_deni = N_total_losses_deni + (N_raw - N_losses_vol)*deni_losses
	i = i + 1
'}' end
m = LEN (applied)
j = 0
while j < m then begin '{'
	row = GET (applied, j)
	id = GET (row, 'fertilizerID')
	amount = GET (row, 'amount')
	clasification_fm = GET (row, 'type')
	method = GET (row, 'method')
	frequency = GET (row, 'frequency')
	Nc_i = GET (row, 'N')/100
	vol_c_i = IF_ERROR (VLOOKUP (id; Fertilizers; 6); IF (clasification_fm == 'Organic'; 0.995; 0))
	vol_losses = EXP (IF (method == 'incorporated'; 0-1.895; IF (method == 'topdressing'; 0-1.305; 0)) + vol_c_i)*vol_c
	N_bf_vol = Nc_i*(1 - vol_losses)
	deni_losses = 0
	N_bf_deni = Nc_i*(1 - deni_losses)
	N_bf = IF_ERROR (N_bf_vol*N_bf_deni/Nc_i; 0)
	frecu_application_amendment = IF (clasification_fm == 'Inorganic'; 1.0; IF (frequency == 'annual'; 1.0; 0.5))
	Nc_mineralization_amendment = Nc_mineralization_amendment + N_bf*amount*frecu_application_amendment
	N_raw = N_bf*amount/(1 - vol_losses - deni_losses)
	N_losses_vol = N_raw*vol_losses
	N_total_losses_vol = N_total_losses_vol + N_losses_vol
	N_total_losses_deni = N_total_losses_deni + (N_raw - N_losses_vol)*deni_losses
	j = j + 1
'}' end

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

factor_irrigation = IF (type_irrigated == 'trickle'; 0.9; IF (type_irrigated == 'sprinkler'; 0.85; IF (type_irrigated == 'surface'; 0.7; 0)))
Nirrigation = IF (water_supply == '0'; 0; Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000)

cn = VLOOKUP (soil_texture; SoilData; 32)
LI = PI*SI
PI = (rain_a - 10160/cn + 101.6)**2/(rain_a + 15240/cn - 152.4)
SI = ((2*rain_w)/rain_a)**(1/3)
Nleaching = Nc_s_initial*(1 - EXP ((0-LI)/(depth_s*1000*VLOOKUP (soil_texture; SoilData; 16))))

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

