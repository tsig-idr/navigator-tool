y = yield
crop_type = crop
soil_texture = soil
export_r = residues/100
depth_s = depth
Pc_method = pc_method

fnr = 0.1
fmc_r = 0.15
P_crop_max = 100
K_crop_max = 275
t_50 = 0
t_20 = 0 - 0.84
t_80 = 0.84

CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'SoilData.csv'))
Pc_method_table = SP_CSV2ARRAY (CONCAT ('sheetscript/F3/', 'Pc_method_table.csv'))

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
Pc_si = pc_s*density_s*depth_s*10
Pc_s = Pc_si*VLOOKUP (Pc_method; Pc_method_table; 2)
Pc_s_thres_min = VLOOKUP (soil_texture; SoilData; 25)
Pc_s_thres_max = VLOOKUP (soil_texture; SoilData; 26)
STL_STLtmin = IF (Pc_s < Pc_s_thres_min; 1; 0)
STL_2STLtmin = IF (Pc_s > 2*Pc_s_thres_min; 0.5; 1)
P_crop_min_ = P_exported*STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*STL_STLtmin
P_crop_max_ = P_exported*STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*STL_STLtmax
P_nyears_min = IF (P_crop_min_ > P_crop_max; CEIL (P_crop_min_/P_crop_max); 1)
P_nyears_max = IF (P_crop_max_ > P_crop_max; CEIL (P_crop_max_/P_crop_max); 1)
STL_STLtmax = IF (Pc_s < Pc_s_thres_max; 1; 0)
STL_2STLtmax = IF (Pc_s > 2*Pc_s_thres_max; 0.5; 1)
P_exported = h_dm_med_50*Pc_h + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r

P_sufficiency = 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*STL_STLtmin/P_nyears_min
P_minBM = (P_exported*STL_2STLtmin + 10*density_s*depth_s*(Pc_s_thres_min - Pc_s)*STL_STLtmin)/P_nyears_min
P_maxBM = (P_exported*STL_2STLtmax + 10*density_s*depth_s*(Pc_s_thres_max - Pc_s)*STL_STLtmax)/P_nyears_max
P_maintenance = h_dm_med_50*Pc_h + r_dm_med_50*(1 - fmc_r)*Pc_r*export_r


K_sufficiency = 0
K_minBM = 0
K_maxBM = 0
K_maintenance = 0