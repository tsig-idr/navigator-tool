E = 2.718281828459045
y = yield
CV = 0.2
export_r = 1
n_fix_code = VLOOKUP (crop_type; CropData; 7)
HI_est = VLOOKUP (crop_type; CropData; 9)/100
PK_strategy = 'maintenance'
soil_texture = 'loam'
SOM = 1.5
tilled = 'no'
pH = 7
CEC = VLOOKUP (soil_texture; SoilData; 33)
depth_s = 0.5
Nc_s_initial = 30
Nc_s_end = 20
Pc_s_0 = 11
Pc_method = 'olsen'
Kc_s_0 = 163
rain_a = 500
rain_w = 300
dose_irrigation = VLOOKUP (crop_type; CropIrrigation; 2)
Nc_NO3_water = 25
Nc_h = VLOOKUP (crop_type; CropData; 14)/100

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0-0.84
t_80 = 0.84

CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'CropData.csv'))
CropIrrigation = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'CropIrrigation.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'SoilData.csv'))
Nmineralization_SOM = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Nmineralization_SOM.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Pc_method_table.csv'))
Clima = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Clima.csv'))
n_fix_per = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'n_fix_per.csv'))
Drainage = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Drainage.csv'))
Fertilizers = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Fertilizers.csv'))
Fertilizers_aux = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'Fertilizers_aux.csv'))
pH4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'pH4vol.csv'))
CEC4vol = SP_CSV2ARRAY (CONCAT ('sheetscript/F4/', 'CEC4vol.csv'))

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

Pc_h = VLOOKUP (crop_type; CropData; 15)/100
Pc_r = VLOOKUP (crop_type; CropData; 25)/100
Pc_s = Pc_s_0*VLOOKUP (Pc_method; Pc_method_table; 2)
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
P_exported = h_dm_med_50*Pc_h + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r

P_maintenance = P_exported
P2O5_maintenance = P_maintenance*2.293

Kc_h = VLOOKUP (crop_type; CropData; 16)/100
Kc_r = VLOOKUP (crop_type; CropData; 26)/100
Kc_s = Kc_s_0
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
K_exported = h_dm_med_50*Kc_h + r_dm_med_50*(1 - fmc_r)*Kc_r*export_r

K_minBM = (K_exported*K_STL_2STLtmin + 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin)/K_nyears_min
K_maintenance = K_exported
K2O_maintenance = K_maintenance*1.205

factor_humidity_= IF_ERROR (factor_humidity; IF_ERROR (VLOOKUP (climatic_zone; Clima; 2); 1.0))
Nc_mineralization_SOM = GET (GET (Nmineralization_SOM, MATCH (SOM; [0, 0.5, 1, 1.5, 2, 2.5]; 1)), MATCH (VLOOKUP (soil_texture; SoilData; 2); [1, 2, 3]))*factor_humidity_
Nmineralization = Nc_mineralization_SOM

n_fix_code = VLOOKUP (crop_type; CropData; 7)
n_fix_per = IF (n_fix_code == 'Non_legume'; 0; VLOOKUP (CONCAT (n_fix_code; CONCAT (IF (SOM <= 3; '<=3'; '>3'); VLOOKUP (crop_type; CropData; 8))); n_fix_per; 2))
N_yield = y_dm*Nc_h
N_res = r_dm*Nc_r
r_dm = y_dm*(1 - HI_est)/HI_est
y_dm = yield*dm_h
Nfixation = IF (n_fix_code =='Non_legume'; 10; (1 + fnr)*(N_yield + N_res)*n_fix_per)

factor_irrigation = 0.8
Nirrigation = IF (water_supply == '0'; 0; Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000)

cn = VLOOKUP (soil_texture; SoilData; 32)
LI = PI*SI
PI = (rain_a - 10160/cn + 101.6)**2/(rain_a + 15240/cn - 152.4)
SI = ((2*rain_w)/rain_a)**(1/3)
Nleaching = Nc_s_initial*(1 - EXP ((0-LI)/(depth_s*1000*VLOOKUP (soil_texture; SoilData; 16))))

h_dm_med_50 = y*dm_h*(1 + CV*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est)/HI_est)
Nuptake = (h_dm_med_50*Nc_h + r_dm_med_50*Nc_r)*(1 + fnr)

Ndenitrification = 0.34*E**(0.012*Ncrop)

Nvolatilization = N_total_losses_vol

input = SUM (Nmineralization; Nfixation; Nirrigation; Nc_s_initial)
output = SUM (Nleaching; Nuptake; Nc_s_end)
Ncrop = MAX (output - input; 0)
