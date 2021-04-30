CSVSWB = [[]]
CSVAgro = SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_CSVAgro.csv')))
Clima = SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_Clima.csv')))
Meteo = SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_Meteo.csv')))
Extracciones = SP_CSV2ARRAY(CONCAT('sheetscript/', 'Extracciones.csv'))
Mineral = SP_CSV2ARRAY(CONCAT('sheetscript/', 'Mineral.csv'))
MO = SP_CSV2ARRAY(CONCAT('sheetscript/', 'MO.csv'))
NDVI = LINTER4DATES (SP_CSV2ARRAY(CONCAT('tmp/', CONCAT(uid, '_NDVI_real.csv'))), 1)

agroasesor = 'yes'
c_mineral = VLOOKUP (FLOOR (soilOrganicMaterial*100); MO; 2)
UFN = soilDepth*100*soilDensity*1000*(1 - soilStony)*soilNmin_0/1000000




fechas = GENNDATES(cropDate, n)
nitro4days = []
N_extrA_ = 0
n = 3
i = 0
while i < n then begin '{'
	fecha = GET (fechas, i)
	i = i + 1

	SWB4day = GET (CSVSWB, fecha)
	nitro4day = NEW()

	SET (nitro4day, 'fecha', fecha)

	Jp = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 4); VLOOKUP (fecha; CSVSWB; 'J')); ' ')
	SET (nitro4day, 'Jp', Jp)
	
	Etapa = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 2); VLOOKUP (fecha; CSVSWB; 2)); ' ')
	SET (nitro4day, 'Etapa', Etapa)
	
	ET0 = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 9); VLOOKUP (fecha; CSVSWB; 8)); 0)
	SET (nitro4day, 'ET0', ET0)
	
	Kcb = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 14); VLOOKUP (fecha; CSVSWB; 13)); 0)
	SET (nitro4day, 'Kcb', Kcb)
	
	h = 0
	SET (nitro4day, 'h', h)
	
	Ke = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 26); VLOOKUP (fecha; CSVSWB; 26)); 0)
	SET (nitro4day, 'Ke', Ke)
	
	Kc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 29); VLOOKUP (fecha; CSVSWB; 29)); 0)
	SET (nitro4day, 'Kc', Kc)
	
	ETc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 30); VLOOKUP (fecha; CSVSWB; 30)); 0)
	SET (nitro4day, 'ETc', ETc)



	Prec_efec = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 13; FALSO); GET (SWB4day, 'P_RO')); 0)
	SET (nitro4day, 'Prec_efec', Prec_efec)
	
	Riego_neces = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 35; FALSO); VLOOKUP (fecha; CSVSWB; 35; FALSO)); 0)
	SET (nitro4day, 'Riego_neces', Riego_neces)
	
	DP = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 37; FALSO); VLOOKUP (fecha; CSVSWB; 37; FALSO)); 0)
	SET (nitro4day, 'DP', DP)
	
	Riego_efec = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 36; FALSO); VLOOKUP (fecha; CSVSWB; 36; FALSO)); 0)
	SET (nitro4day, 'Riego_efec', Riego_efec)
	
	t = IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 16; FALSO); IF_ERROR (VLOOKUP (fecha; Meteo; 2; FALSO); VLOOKUP (fecha; Clima; 2; FALSO)))
	SET (nitro4day, 't', t)
	
	Etc_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 42; FALSO); VLOOKUP (fecha; CSVSWB; 42; FALSO)); 0)
	SET (nitro4day, 'Etc_Acc', Etc_Acc)
	
	Prec_efec_Acc = Prec_efec + P59
	SET (nitro4day, 'Prec_efec_Acc', Prec_efec_Acc)
	
	Riego_Acc = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 43; FALSO); VLOOKUP (fecha; CSVSWB; 43; FALSO)); 0)
	SET (nitro4day, 'Riego_Acc', Riego_Acc)
	
	Tm = t
	SET (nitro4day, 'Tm', Tm)
	
	IT = Tm
	SET (nitro4day, 'IT', IT)
	
	J = Jp
	SET (nitro4day, 'J', J)
	
	Sem = IF (ISOWEEKNUMBER (fecha) < 40; ISOWEEKNUMBER (fecha); ISOWEEKNUMBER (fecha) - 53)
	SET (nitro4day, 'Sem', Sem)
	
	N_extrA = IF (IT > VLOOKUP (crop; Extracciones; 3) && IT < VLOOKUP (crop; Extracciones; 5); (IT - VLOOKUP (crop; Extracciones; 3))*soilDelta_N_NH4; 0)
	SET (nitro4day, 'N_extrA', N_extrA)
	
	N_extr = MAX(N_extrA - N_extrA_; 0)
	SET (nitro4day, 'N_extr', N_extr)
	
	N_mineralizado = IF (AD60=0; VLOOKUP (Tm; Mineral; 2)*Tm*c_mineral*mineralizationSlowdown; VLOOKUP (Tm; Mineral; 2)*Tm*c_mineral)
	SET (nitro4day, 'N_mineralizado', N_mineralizado)
	
	N_agua = SUMA(K60; M60)*waterNitrate*14/(100*62)
	SET (nitro4day, 'N_agua', N_agua)
	
	N_fert_neto = IF_ERROR (VLOOKUP (fecha; Fertiliza; 9; 0); 0)
	SET (nitro4day, 'N_fert_neto', N_fert_neto)
	
	N_fert_bruto = IF_ERROR (Z60/VLOOKUP (fecha; Fertiliza; 7); 0)
	SET (nitro4day, 'N_fert_bruto', N_fert_bruto)
	
	BBCH = VLOOKUP (fecha; FenoT; 11)
	SET (nitro4day, 'BBCH', BBCH)
	
	Nl = -L60*AH59/100
	SET (nitro4day, 'Nl', Nl)
	
	N_extr_1 = IF_ERROR (-VLOOKUP (fecha; FenoT; 9); 0)
	SET (nitro4day, 'N_extr_1', N_extr_1)
	
	N_extrA_1 = AE59 + AD60
	SET (nitro4day, 'N_extrA_1', N_extrA_1)
	
	Nh = AF59 + SUMA(X60:Z60) + SUMA(AC60:AD60)
	SET (nitro4day, 'Nh', Nh)
	
	N_recom = VLOOKUP (fecha; FenoT; 10)
	SET (nitro4day, 'N_recom', N_recom)
	
	N_NO3 = AF60*1000000/(soilDepth*100*soilDensity*1000*(1 - soilStony)*(1 + soilDelta_N_NH4))
	SET (nitro4day, 'N_NO3', N_NO3)
	
	Nmin_medido = IF_ERROR (HLOOKUP (fecha; [[soilDate_Nmin_0], [UFN]]; 2); -100)
	SET (nitro4day, 'Nmin_medido', Nmin_medido)
	
	T_Nf_recomendado = IF (AF60 > AG60; 0; 1)
	SET (nitro4day, 'T_Nf_recomendado', T_Nf_recomendado)
	
	N_mineralizado_A = X60 + AK59
	SET (nitro4day, 'N_mineralizado_A', N_mineralizado_A)
	
	N_agua_A = Y60 + AL59
	SET (nitro4day, 'N_agua_A', N_agua_A)
	
	Nl_A = AC60 + AM59
	SET (nitro4day, 'Nl_A', Nl_A)
	
	Eto_tipo = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 9; FALSO); VLOOKUP (fecha; Clima; 13; FALSO)); 0)
	SET (nitro4day, 'Eto_tipo', Eto_tipo)
	
	Eto_acumulada = AN60 + AO59
	SET (nitro4day, 'Eto_acumulada', Eto_acumulada)
	
	BBCH_tipo = IF_ERROR (VLOOKUP (fecha; 'F TrB'!$C$3:$O$21; 3; FALSO); -9999)
	SET (nitro4day, 'BBCH_tipo', BBCH_tipo)
	
	BBCH_graf = IF (AP60 > 0; 1,4; -999)
	SET (nitro4day, 'BBCH_graf', BBCH_graf)
	
	BBCH_real_et = IF_ERROR (IF (VLOOKUP (fecha; 'F TrB'!$Q$3:$R$21; 2; FALSO)=0; -99999; VLOOKUP (fecha; 'F TrB'!$Q$3:$R$21; 2; FALSO)); -99999)
	SET (nitro4day, 'BBCH_real_et', BBCH_real_et)
	
	BBCH_real = IF (AR60 > 1; 1,4; -99999)
	SET (nitro4day, 'BBCH_real', BBCH_real)
	
	NDVI_tipo = IF_ERROR (VLOOKUP (fecha; 'NDVI tipo'!$Q$8:$S$30; 2; FALSO); "")
	SET (nitro4day, 'NDVI_tipo', NDVI_tipo)
	
	NDVI_tipo_i = IF_ERROR (VLOOKUP (fecha; 'NDVI tipo'!$Q$8:$S$50; 2; FALSO); AU59 + VLOOKUP (fecha; 'NDVI tipo'!$Q$8:$S$50; 3; VERDADERO))
	SET (nitro4day, 'NDVI_tipo_i', NDVI_tipo_i)
	
	NDVI_real = IF_ERROR (VLOOKUP (fecha; 'NDVI real'!$Q$8:$S$44; 2; FALSO); -999)
	SET (nitro4day, 'NDVI_real', NDVI_real)
	
	NDVI_int = IF_ERROR (VLOOKUP (fecha; 'NDVI real'!$T$8:$U$350; 2; FALSO); "")
	SET (nitro4day, 'NDVI_int', NDVI_int)
	
	Biomasa = IF_ERROR (GET (SWB4day, 'Biomasa_acumulada'); '')
	SET (nitro4day, 'Biomasa', Biomasa)
	
	Nuptake = IF_ERROR (GET (SWB4day, 'Nuptakediario'); '')
	SET (nitro4day, 'Nuptake', Nuptake)
	
	Eto_real = IF_ERROR (VLOOKUP (fecha; Meteo; 13; FALSO); -999)
	SET (nitro4day, 'Eto_real', Eto_real)
	
	Eto_acumulada_real = IF (AZ60= -999; -999; AZ60 + BA59)
	SET (nitro4day, 'Eto_acumulada_real', Eto_acumulada_real)
	
	Eto_elegida = IF (AZ60= -999; VLOOKUP (fecha; $A$45:$AN$232; 40; FALSO); VLOOKUP (fecha; $A$45:$AZ$232; 52; FALSO))
	SET (nitro4day, 'Eto_elegida', Eto_elegida)
	
	Eto_acumulada_elegida = BB60 + BC59
	SET (nitro4day, 'Eto_acumulada_elegida', Eto_acumulada_elegida)
	
	PUSH (nitro4days, nitro4day)

	N_extrA_ = N_extrA
'}' end
