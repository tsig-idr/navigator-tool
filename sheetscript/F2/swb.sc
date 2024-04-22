CropData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'CropData.csv'))
SoilData = SP_CSV2ARRAY (CONCAT ('sheetscript/F1/', 'SoilData.csv'))

Kcb_ini = VLOOKUP (crop_type; CropData; 30)
Kcb_mid = VLOOKUP (crop_type; CropData; 31)
Kcb_end = VLOOKUP (crop_type; CropData; 32)
root_max = IF_ERROR (VLOOKUP (crop_type; CropData; 33); 0.5)
waterAvail = VLOOKUP (soil_texture; SoilData; 16)*1000

fw_i = IF (type_irrigated == 'trickle'; 0.7; 1.0) 
REW = VLOOKUP (soil_texture; SoilData; 34)
TEW = VLOOKUP (soil_texture; SoilData; 37)
De_0 = 8
fw_0 = 1

NDVI_ini = (Kcb_ini + 0.1)/1.44
NDVI_mid = (Kcb_mid + 0.1)/1.44
NDVI_end = (Kcb_end + 0.1)/1.44
date_ini = ADD2DATE (crop_startDate, (DATE2INT (crop_endDate) - DATE2INT (crop_startDate))*0.2)
date_mid = ADD2DATE (crop_startDate, (DATE2INT (crop_endDate) - DATE2INT (crop_startDate))*0.5)
date_end = ADD2DATE (crop_startDate, (DATE2INT (crop_endDate) - DATE2INT (crop_startDate))*0.8)
NDVIreal = NDVItipo = [[crop_startDate, NDVI_ini], [date_ini, NDVI_ini], [date_mid, NDVI_mid], [date_end, NDVI_mid], [crop_endDate, NDVI_end]]
NDVI_real = LINTER4DATES (IF_VOID (NDVIreal; [[]]))
NDVI_tipo = LINTER4DATES (IF_VOID (NDVItipo; [[]]))
root_min = 0.2
Lini = 31
Ldev = 38
Lmid = 33
Llate = 29
JPlant = TRUNC (275*MONTH (crop_startDate)/9 - 31 + DAY (crop_startDate)) + IF (MONTH (crop_startDate) > 2; 0 - 2; 0) + IF (MOD (YEAR (crop_startDate); 4) == 0; 1; 0)
JDev = JPlant + Lini
JMid = JDev + Ldev
JLate = JMid + Lmid
JHarv = JLate + Llate
Kc_veg = 1.15
Kc_soil = 1
cf_Kr = 0.15
dose_max = 15
irr_cut = 236

dose_irrigation_ = dose_irrigation/10

fechas = GENNDATES (ADD2DATE (startDate, 0 - 1), n + 1)
SWB4days = NEW()

fecha = GET (fechas, 1)
date = GET (chart, 'date')
_NDVI = GET (chart, 'NDVI_interpolado')
_ETo = GET (chart, 'ETo')
_Kc = GET (chart, 'Kc')
_ETc = GET (chart, 'ETc')
_Nuptake = GET (chart, 'Nuptake')
_Biomasa_acumulada = GET (chart, 'Biomasa_acumulada')
NDVI_interpolado_ = IF_ERROR (VLOOKUP (GET (fechas, 0); NDVI_real; 2); VLOOKUP (GET (fechas, 0); NDVI_tipo; 2))
NDVI_interpolado = IF_ERROR (VLOOKUP (fecha; NDVI_real; 2); VLOOKUP (fecha; NDVI_tipo; 2))
fc_ = 0
fw_ = 0
De_final_ = 0
Profundidad_radicular_ = 0
RAW_ = 0
Riego_neto_necesario_ = 0
ETc_adj_ac_ = 0
Final_agotamiento_corregido_ = 0
Biomasa_acumulada_ = 0
Nuptake_ = 0

n = IF (VLOOKUP (crop_type; CropData; 8) == 'Annual'; MAX (365; DATESDIF (crop_endDate, crop_startDate)); MAX (1825; DATESDIF (crop_endDate, crop_startDate))) + 2
i = 1
while i < n then begin '{'
	i = i + 1
	_fecha = GET (fechas, i)

	SWB4day = NEW()

	month = MONTH (fecha)
	day = DAY (fecha)
	year = YEAR (fecha)

	SET (SWB4day, 'Fecha', fecha)

	NDVI_interpolado = IF (ISNAN (_NDVI) || fecha <> date; NDVI_interpolado; _NDVI)

	J = FLOOR (275*month/9 - 30 + day) + IF (month > 2; 0 - 2; 0) + IF (MOD (year; 4) == 0; IF (month > 2; 1; 0); 0)
	SET (SWB4day, 'J', J)

	P_RO = IF_ERROR (VLOOKUP (fecha; Meteo; 12); VLOOKUP (fecha; Clima; 12))
	SET (SWB4day, 'P_RO', P_RO)

	Kcb = MIN (Kc_veg; NDVI_interpolado*1.44 - 0.1)
	SET (SWB4day, 'Kcb', Kcb)

	_NDVI_interpolado = IF_ERROR (VLOOKUP (_fecha; NDVI_real; 2); VLOOKUP (_fecha; NDVI_tipo; 2))
	SET (SWB4day, 'NDVI_interpolado', NDVI_interpolado)

	ETo = IF (ISNAN (_ETo) || fecha <> date; IF_ERROR (VLOOKUP (fecha; Meteo; 13); VLOOKUP (fecha; Clima; 13)); _ETo)
	SET (SWB4day, 'ETo', ETo)

	Req_neto_riego = IF (Riego_neto_necesario_ > 0; Riego_neto_necesario_/fw_0; 0)
	SET (SWB4day, 'Req_neto_riego', Req_neto_riego)

	fc = MAX (fc_; 1.19*NDVI_interpolado - 0.16)
	SET (SWB4day, 'fc', fc)

	fw = IF (Req_neto_riego > 0; fw_i; IF (P_RO > 0; 1; IF (i > 2; fw_; fw_0)))
	SET (SWB4day, 'fw', fw)

	few = MIN (1 - fc; fw)
	SET (SWB4day, 'few', few)

	De_inicio = MAX (IF (i > 2; De_final_; De_0) - P_RO - Req_neto_riego; 0)
	SET (SWB4day, 'De_inicio', De_inicio)

	Kr = MAX (IF (De_inicio < REW; IF (ETo > REW; REW/ETo; 1); MIN (REW/ETo; ((TEW - De_inicio)*cf_Kr)/(TEW - REW))); 0)
	SET (SWB4day, 'Kr', Kr)

	Kc_max = fc*Kc_veg + (1 - fc)*Kc_soil
	SET (SWB4day, 'Kc_max', Kc_max)

	Ke = MIN (Kr*(Kc_max - Kcb); few*Kc_max)
	SET (SWB4day, 'Ke', Ke)

	E = Ke*ETo
	SET (SWB4day, 'E', E)

	DPe = MAX (P_RO + Req_neto_riego - De_final_; 0)
	SET (SWB4day, 'DPe', DPe)

	De_final = IF (i > 2; De_final_; De_0) - P_RO - Req_neto_riego + E/few + DPe
	SET (SWB4day, 'De_final', E/few)

	Kc = IF (ISNAN (_Kc) || fecha <> date; Kcb + Ke; _Kc)
	SET (SWB4day, 'Kc', Kc)

	ETc = IF (ISNAN (_ETc) || fecha <> date; Kc*ETo; _ETc)
	SET (SWB4day, 'ETc', ETc)

	Profundidad_radicular = MIN (root_max; MAX(root_min; MAX ((Kcb - Kcb_ini)/(Kcb_mid - Kcb_ini)*(root_max - root_min) + root_min; Profundidad_radicular_)))
	SET (SWB4day, 'Profundidad_radicular', Profundidad_radicular)

	RAW = MAX (IF (J < JDev; 65; 65)/100*Profundidad_radicular*waterAvail; RAW_)
	SET (SWB4day, 'RAW', RAW)

	Final_agotamiento = IF (i > 2; Final_agotamiento_corregido_ - P_RO - Riego_neto_necesario_ + ETc; De_0 - P_RO + ETc)
	SET (SWB4day, 'Final_agotamiento', Final_agotamiento)

	Riego_neto_necesario = IF_ERROR (VLOOKUP (fecha; Riegos; 2); IF (water_supply == '1'; IF (J > 120 && NDVI_interpolado < 0.45; 0; IF (Final_agotamiento_corregido_ + ETc >= RAW; MIN (Final_agotamiento_corregido_; dose_irrigation_); 0)); 0))
	SET (SWB4day, 'Riego_neto_necesario', Riego_neto_necesario)

	DP = MAX (IF (i > 2; P_RO + Riego_neto_necesario_ - ETc - Final_agotamiento_corregido_; ETo - few - De_0); 0)
	SET (SWB4day, 'DP', DP)

	Ks = MAX (0; IF (Final_agotamiento > RAW; (Profundidad_radicular*waterAvail - Final_agotamiento)/(Profundidad_radicular*waterAvail - RAW); 1))
	SET (SWB4day, 'Ks', Ks)

	Kc_adj = Ke + Kcb*Ks
	SET (SWB4day, 'Kc_adj', Kc_adj)

	ETc_adj = Kc_adj*ETo
	SET (SWB4day, 'ETc_adj', ETc_adj)

	ETc_adj_ac = ETc_adj + ETc_adj_ac_
	SET (SWB4day, 'ETc_adj_ac', ETc_adj_ac)

	Final_agotamiento_corregido = IF (i > 2; Final_agotamiento_corregido_ - Riego_neto_necesario_; De_0) - P_RO + Kc_adj*ETo + DP
	SET (SWB4day, 'Final_agotamiento_corregido', Final_agotamiento_corregido)

	Transp_ciclo = IF_ERROR (IF (_NDVI_interpolado - NDVI_interpolado > 0 && NDVI_interpolado > 0.3 && NDVI_interpolado < 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; IF (NDVI_interpolado > 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; IF (_NDVI_interpolado - NDVI_interpolado_ > 0 && NDVI_interpolado > 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; 0))); 0)
	SET (SWB4day, 'Transp_ciclo', Transp_ciclo)

	Biomasa_potencial = (Transp_ciclo*4)/100
	SET (SWB4day, 'Biomasa_potencial', Biomasa_potencial)

	Biomasa_acumulada = IF (ISNAN (_Biomasa_acumulada) || fecha <> date; IF_ERROR (Biomasa_potencial + Biomasa_acumulada_; ''); _Biomasa_acumulada)
	SET (SWB4day, 'Biomasa_acumulada', Biomasa_acumulada)

	Nuptake = IF (ISNAN (_Nuptake) || fecha <> date; (IF (Biomasa_acumulada < 13; (IF (Biomasa_acumulada < 1; 5.3; IF_ERROR (5.35*Biomasa_acumulada**(0 - 0.442); 0)))/100; 1.7/100))*Biomasa_acumulada*1000; _Nuptake)
	SET (SWB4day, 'Nuptake', Nuptake)

	Nuptakediario = Nuptake - Nuptake_
	SET (SWB4day, 'Nuptakediario', Nuptakediario)

	SET (SWB4days, fecha, SWB4day)

	fecha = _fecha
	NDVI_interpolado_ = NDVI_interpolado
	NDVI_interpolado = _NDVI_interpolado
	fc_ = fc
	fw_ = fw
	De_final_ = De_final
	Profundidad_radicular_ = Profundidad_radicular
	RAW_ = RAW
	Riego_neto_necesario_ = Riego_neto_necesario
	ETc_adj_ac_ = ETc_adj_ac
	Final_agotamiento_corregido_ = Final_agotamiento_corregido
	Biomasa_acumulada_ = Biomasa_acumulada
	Nuptake_ = Nuptake
'}' end
