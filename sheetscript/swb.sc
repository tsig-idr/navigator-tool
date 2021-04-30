Clima = SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_Clima.csv')))
Meteo = SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_Meteo.csv')))
NDVI_real = LINTER4DATES (SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_NDVI_real.csv'))), 1)
NDVI_tipo = LINTER4DATES (SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_NDVI_tipo.csv'))), 1)

fechas = GENNDATES(cropDate, n)
SWB4days = []

fecha = GET (fechas, 1)
NDVI_interpolado_ = IF_ERROR (VLOOKUP (GET (fechas, 0); NDVI_real; 2); VLOOKUP (GET (fechas, 0); NDVI_tipo; 2))
NDVI_interpolado = IF_ERROR (VLOOKUP (fecha; NDVI_real; 2); VLOOKUP (fecha; NDVI_tipo; 2))
Biomasa_acumulada_ = 0
Nuptake_ = 0

n = 8
i = 1
while i < n - 1 then begin '{'
	i = i + 1
	_fecha = GET (fechas, i)

	SWB4day = NEW()

	SET (SWB4day, 'fecha', fecha)

	P_RO = IF_ERROR (VLOOKUP (fecha; Meteo; 12); VLOOKUP (fecha; Clima; 12))
	SET (SWB4day, 'P_RO', P_RO)

	_NDVI_interpolado = IF_ERROR (VLOOKUP (_fecha; NDVI_real; 2); VLOOKUP (_fecha; NDVI_tipo; 2))
	SET (SWB4day, 'NDVI_interpolado', NDVI_interpolado)

	ETo = IF_ERROR (VLOOKUP (fecha; Meteo; 13); VLOOKUP (fecha; Clima; 13))
	SET (SWB4day, 'ETo', ETo)

	Transp_ciclo = IF_ERROR (IF (_NDVI_interpolado - NDVI_interpolado > 0 && NDVI_interpolado > 0.3 && NDVI_interpolado < 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; IF (NDVI_interpolado > 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; IF (_NDVI_interpolado - NDVI_interpolado_ > 0 && NDVI_interpolado > 0.45; (NDVI_interpolado*1.5 - 0.2)*ETo; 0))); 0)
	SET (SWB4day, 'Transp_ciclo', Transp_ciclo)

	Biomasa_potencial = (Transp_ciclo*4)/100
	SET (SWB4day, 'Biomasa_potencial', Biomasa_potencial)

	Biomasa_acumulada = IF_ERROR (Biomasa_potencial + Biomasa_acumulada_; '')
	SET (SWB4day, 'Biomasa_acumulada', Biomasa_acumulada)

	Nuptake = (IF (Biomasa_acumulada < 13; (IF (Biomasa_acumulada < 1; 5.3; IF_ERROR (5.35*Biomasa_acumulada**(0 - 0.442); 0)))/100; 1.7/100))*Biomasa_acumulada*1000
	SET (SWB4day, 'Nuptake', Nuptake)

	Nuptakediario = Nuptake - Nuptake_
	SET (SWB4day, 'Nuptakediario', Nuptakediario)

	PUSH (SWB4days, SWB4day)

	fecha = _fecha
	NDVI_interpolado_ = NDVI_interpolado
	NDVI_interpolado = _NDVI_interpolado
	Biomasa_acumulada_ = Biomasa_acumulada
	Nuptake_ = Nuptake
'}' end