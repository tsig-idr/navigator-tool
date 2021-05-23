y = yield
crop_type = crop
soil_texture = soil
export_r = residues/100
depth_s = depth
climate_zone = zone
Nc_s_initial = Nc_s_0

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

h_dm_med_50 = y*dm_h*(1 + cv*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est)/HI_est)
h_dm_med_20 = y*dm_h*(1 + cv*t_20)
h_dm_med_80 = y*dm_h*(1 + cv*t_80)
Nuptake = (h_dm_med_50*Nc_h + r_dm_med_50*Nc_r)*(1 + fnr)
Nuptake_min = (h_dm_med_20*Nc_h + (h_dm_med_20*(1 - HI_est)/HI_est)*Nc_r)*(1 + fnr)
Nuptake_max = (h_dm_med_80*Nc_h + (h_dm_med_80*(1 - HI_est)/HI_est)*Nc_r)*(1 + fnr)

dm_h = VLOOKUP (crop_type; CropData; 11)/100
HI_est = VLOOKUP (crop_type; CropData; 9)/100
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
P_exported = h_dm_med_50*Pc_h + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r

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
Kc_s = 39.1*Kc_s_0*VLOOKUP (soil_texture; SoilData; 21)*depth_s*10
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

K_sufficiency = 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin/K_nyears_min
K_minBM = (K_exported*K_STL_2STLtmin + 10*density_s*depth_s*(Kc_s_thres_min - Kc_s)*fK*K_STL_STLtmin)/K_nyears_min
K_maxBM = (K_exported*K_STL_2STLtmax + 10*density_s*depth_s*(Kc_s_thres_max - Kc_s)*fK*K_STL_STLtmax)/K_nyears_max
K_maintenance = K_exported

K2O_sufficiency = 0
K2O_minBM = K_minBM*1.205
K2O_maxBM = K_maxBM*1.205
K2O_maintenance = K_maintenance*1.205

factor_humidity = VLOOKUP (climate_zone; Clima; 2)
Nc_mineralization_SOM = GET (GET (Nmineralization_SOM, MATCH (SOM; [0, 0.5, 1, 1.5, 2, 2.5]; 1) + 1), MATCH (VLOOKUP (soil_texture; SoilData; 2); [1, 2, 3]) + 1)*factor_humidity
Nc_mineralization_amendment = 0
Nmineralization = Nc_mineralization_SOM + Nc_mineralization_amendment

n_fix_code = VLOOKUP (crop_type; CropData; 7)
n_fix_per = IF (n_fix_code == 'Non_legume'; 0; VLOOKUP (CONCAT (n_fix_code; CONCAT (IF (SOM <= 3; '<=3'; '>3'); VLOOKUP (crop_type; CropData; 8))); n_fix_per; 2))
N_yield = y_dm*Nc_h
N_res = r_dm*Nc_r
r_dm = y_dm*(1 - HI_est)/HI_est
y_dm = yield*dm_h
Nfixation = IF (n_fix_code =='Non_legume'; 10; (1 + fnr)*(N_yield + N_res)*n_fix_per)

factor_irrigation = IF (type_irrigated == 'Trickle'; 0.9; IF (type_irrigated == 'Sprinkler'; 0.85; IF (type_irrigated == 'Surface'; 0.7; 0)))
Nirrigation = IF (water_supply == 'Rainfed'; 0; Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000)

Nc_s_initial = Nc_s_0*VLOOKUP (soil_texture; SoilData; 21)*depth_s*10

