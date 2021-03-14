agroasesor = 'yes'
CSVSWB = [[]]
CSVAgro = SP_CSV2ARRAY('tmp/agroasesor.csv')

fechas = GENNDATES(inicio, n)
nitro4day = NEW()
inicio = '2020-01-12'
n = 20
i = 0
while i < n then begin '{'
	fecha = GET (fechas, i)
	i = i + 1
	Jp = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 4); VLOOKUP(fecha; CSVSWB; 3)); ' ')
	SET (nitro4day, 'Jp', Jp)
	Etapa = IF_ERROR ( IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 2); VLOOKUP (fecha; CSVSWB; 2)); ' ')
	SET (nitro4day, 'Etapa', Etapa)
	ET0 = IF_ERROR (IF (agroasesor == 'yes'; VLOOKUP (fecha; CSVAgro; 9); VLOOKUP (fecha; CSVSWB; 8)); 0)
	SET (nitro4day, 'ET0', ET0)
	Kcb = 0
	h = 0
	Ke = 0
	Kc = 0
	ETc = 0
	Prec_efec = 0
	Riego_neces = 0
	DP = 0
	Riego_efec = 0
	t = 0
	Etc_Acc = 0
	Prec_efec_Acc = 0
	Riego_Acc = 0
	Tm = 0
	IT = 0
	J = 0
	Sem = 0
	N_extr = 0
	N_extrA = 0
	N_mineralizado = 0
	N_agua = 0
	N_fert_neto = 0
	N_fert_bruto = 0
	BBCH = 0
	Nl = 0
	N_extr_1 = 0
	N_extrA_1 = 0
	Nh = 0
	N_recom = 0
	N_NO3 = 0
	Nmin_medido = 0
	T_Nf_recomendado = 0
	N_mineralizado_A = 0
	N_agua_A = 0
	Nl_A = 0
	Eto_tipo = 0
	Eto_acumulada = 0
	BBCH_tipo = 0
	BBCH_graf = 0
	BBCH_real_et = 0
	BBCH_real = 0
	NDVI_tipo = 0
	NDVI_tipo_i = 0
	NDVI_real = 0
	NDVI_int = 0
	Biomasa = 0
	Nuptake = 0
	Eto_real = 0
	Eto_acumulada_real = 0
	Eto_elegida = 0
	Eto_acumulada_elegida = 0
'}' end
