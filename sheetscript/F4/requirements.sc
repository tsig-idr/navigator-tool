y = yield
CV = 0.2
export_r = 1
PK_strategy = 'maintenance'
HI_est = VLOOKUP (crop_type; CropData; 9)/100
soil_texture = 'Loam'
SOM = 1.5
Tilled = 'No'
pH = 7
CEC = 100
depth_s = 0.3
Nc_s_initial = 30
Nc_s_end = 20
Pc_s_0 = 11
Pc_method = 'Olsen'
Kc_s_0 = 163
climatic_zone = 'southern'
rain_a = 500
rain_w = 300
Nc_NO3_water = 24

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0-0.84
t_80 = 0.84

CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'SoilData.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))

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

Nc_h = VLOOKUP (crop_type; CropData; 14)/100
h_dm_med_50 = y*dm_h*(1 + CV*t_50)
r_dm_med_50 = (h_dm_med_50*(1 - HI_est)/HI_est)
Nuptake = (h_dm_med_50*Nc_h + r_dm_med_50*Nc_r)*(1 + fnr)

factor_irrigation = 0.8
Nirrigation = IF (water_supply == '0'; 0; Nc_NO3_water*dose_irrigation*factor_irrigation*22.6/100000)

input = SUM (Nirrigation; Nc_s_initial)
output = SUM (Nuptake; Nc_s_end)
Ncrop = MAX (output - input; 0)

