Feeds = SP_CSV2ARRAY(CONCAT('tmp/G3/', CONCAT(uid, '_Feeds.csv')))
Manure = SP_CSV2ARRAY(CONCAT('tmp/G3/', CONCAT(uid, '_Manure.csv')))
T52 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T52.csv'))
T53 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T53.csv'))
T54 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T54.csv'))
T60 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T60.csv'))
T61 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T61.csv'))
T62 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T62.csv'))
T63 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T63.csv'))
T64 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T64.csv'))
T65 = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'T65.csv'))
JRC = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'JRC.csv'))

CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

DAIRYCATTLE_forageCO2 = 0
DAIRYCATTLE_simpleCO2 = 0
DAIRYCATTLE_complexCO2 = 0
DAIRYCATTLE_mixedCO2 = 0
DAIRYCATTLE_milkCO2 = 0
MEATCATTLE_forageCO2 = 0
MEATCATTLE_simpleCO2 = 0
MEATCATTLE_complexCO2 = 0
MEATCATTLE_mixedCO2 = 0
MEATCATTLE_milkCO2 = 0
SHEEP_forageCO2 = 0
SHEEP_simpleCO2 = 0
SHEEP_complexCO2 = 0
SHEEP_mixedCO2 = 0
SHEEP_milkCO2 = 0
GOATS_forageCO2 = 0
GOATS_simpleCO2 = 0
GOATS_complexCO2 = 0
GOATS_mixedCO2 = 0
GOATS_milkCO2 = 0
OtherRUMIANTS_forageCO2 = 0
OtherRUMIANTS_simpleCO2 = 0
OtherRUMIANTS_complexCO2 = 0
OtherRUMIANTS_mixedCO2 = 0
OtherRUMIANTS_milkCO2 = 0
PIGS_forageCO2 = 0
PIGS_simpleCO2 = 0
PIGS_complexCO2 = 0
PIGS_mixedCO2 = 0
POULTRY_forageCO2 = 0
POULTRY_simpleCO2 = 0
POULTRY_complexCO2 = 0
POULTRY_mixedCO2 = 0
LayingHENS_forageCO2 = 0
LayingHENS_simpleCO2 = 0
LayingHENS_complexCO2 = 0
LayingHENS_mixedCO2 = 0

DAIRYCATTLE_DE = DAIRYCATTLE_N = 0
MEATCATTLE_DE = MEATCATTLE_N = 0
SHEEP_DE = SHEEP_N = 0
GOATS_DE = GOATS_N = 0
OtherRUMIANTS_DE = OtherRUMIANTS_N = 0
PIGS_DE = PIGS_N = 0
POULTRY_DE = POULTRY_N = 0
LayingHENS_DE = LayingHENS_N = 0

n = LEN(Feeds)
i = 1
while i < n then begin '{'
	row = GET(Feeds, i)
	animal = GET(row, 0)
	feed = GET(row, 1)
	produced = IF_ERROR (GET(row, 2); 0)
	produced = IF (produced == ''; 0; produced)
	purchased = IF_ERROR (GET(row, 3); 0)
	purchased = IF (purchased == ''; 0; purchased)

	forageCO2 = IF_ERROR (VLOOKUP (feed; T60; 3); 0)
	simpleCO2 = IF_ERROR (IF (feed <> 'Milk powder'; VLOOKUP (feed; T61; 3); 0); 0)
	complexCO2 = IF_ERROR (VLOOKUP (feed; IF (animal == 'DAIRY CATTLE' || animal == 'MEAT CATTLE'; T62; IF (animal == 'PIGS'; T63; IF (animal == 'POULTRY' || animal == 'Laying HENS'; T64; T65))); 3); 0)
	milkCO2 = IF_ERROR (IF (feed == 'Milk powder'; VLOOKUP (feed; T61; 3); 0); 0)
	feed_ = GET (SPLIT (feed, ' '), 0)
	mixedCO2 = IF_ERROR (GET (GET (JRC, 1), IF (feed_ == 'Cereals'; 2; IF (feed_ == 'Proteins'; 5; IF (feed_ == 'Energy'; 8; 0-1)))); 0)

	DAIRYCATTLE_forageCO2 = DAIRYCATTLE_forageCO2 + IF (animal == 'DAIRY CATTLE'; forageCO2/1000*purchased; 0)
	DAIRYCATTLE_simpleCO2 = DAIRYCATTLE_simpleCO2 + IF (animal == 'DAIRY CATTLE'; simpleCO2/1000*purchased; 0)
	DAIRYCATTLE_complexCO2 = DAIRYCATTLE_complexCO2 + IF (animal == 'DAIRY CATTLE'; complexCO2/1000*purchased; 0)
	DAIRYCATTLE_mixedCO2 = DAIRYCATTLE_mixedCO2 + IF (animal == 'DAIRY CATTLE'; mixedCO2*purchased; 0)
	DAIRYCATTLE_milkCO2 = DAIRYCATTLE_milkCO2 + IF (animal == 'DAIRY CATTLE'; milkCO2/1000*purchased/1000; 0)
	MEATCATTLE_forageCO2 = MEATCATTLE_forageCO2 + IF (animal == 'MEAT CATTLE'; forageCO2/1000*purchased; 0)
	MEATCATTLE_simpleCO2 = MEATCATTLE_simpleCO2 + IF (animal == 'MEAT CATTLE'; simpleCO2/1000*purchased; 0)
	MEATCATTLE_complexCO2 = MEATCATTLE_complexCO2 + IF (animal == 'MEAT CATTLE'; complexCO2/1000*purchased; 0)
	MEATCATTLE_mixedCO2 = MEATCATTLE_mixedCO2 + IF (animal == 'MEAT CATTLE'; mixedCO2*purchased; 0)
	MEATCATTLE_milkCO2 = MEATCATTLE_milkCO2 + IF (animal == 'MEAT CATTLE'; milkCO2/1000*purchased/1000; 0)
	SHEEP_forageCO2 = SHEEP_forageCO2 + IF (animal == 'SHEEP'; forageCO2/1000*purchased; 0)
	SHEEP_simpleCO2 = SHEEP_simpleCO2 + IF (animal == 'SHEEP'; simpleCO2/1000*purchased; 0)
	SHEEP_complexCO2 = SHEEP_complexCO2 + IF (animal == 'SHEEP'; complexCO2/1000*purchased; 0)
	SHEEP_mixedCO2 = SHEEP_mixedCO2 + IF (animal == 'SHEEP'; mixedCO2*purchased; 0)
	SHEEP_milkCO2 = SHEEP_milkCO2 + IF (animal == 'SHEEP'; milkCO2/1000*purchased/1000; 0)
	GOATS_forageCO2 = GOATS_forageCO2 + IF (animal == 'GOATS'; forageCO2/1000*purchased; 0)
	GOATS_simpleCO2 = GOATS_simpleCO2 + IF (animal == 'GOATS'; simpleCO2/1000*purchased; 0)
	GOATS_complexCO2 = GOATS_complexCO2 + IF (animal == 'GOATS'; complexCO2/1000*purchased; 0)
	GOATS_mixedCO2 = GOATS_mixedCO2 + IF (animal == 'GOATS'; mixedCO2*purchased; 0)
	GOATS_milkCO2 = GOATS_milkCO2 + IF (animal == 'GOATS'; milkCO2/1000*purchased/1000; 0)
	OtherRUMIANTS_forageCO2 = OtherRUMIANTS_forageCO2 + IF (animal == 'Other RUMIANTS'; forageCO2/1000*purchased; 0)
	OtherRUMIANTS_simpleCO2 = OtherRUMIANTS_simpleCO2 + IF (animal == 'Other RUMIANTS'; simpleCO2/1000*purchased; 0)
	OtherRUMIANTS_complexCO2 = OtherRUMIANTS_complexCO2 + IF (animal == 'Other RUMIANTS'; complexCO2/1000*purchased; 0)
	OtherRUMIANTS_mixedCO2 = OtherRUMIANTS_mixedCO2 + IF (animal == 'Other RUMIANTS'; mixedCO2*purchased; 0)
	OtherRUMIANTS_milkCO2 = OtherRUMIANTS_milkCO2 + IF (animal == 'Other RUMIANTS'; milkCO2/1000*purchased/1000; 0)
	PIGS_forageCO2 = PIGS_forageCO2 + IF (animal == 'PIGS'; forageCO2/1000*purchased; 0)
	PIGS_simpleCO2 = PIGS_simpleCO2 + IF (animal == 'PIGS'; simpleCO2/1000*purchased; 0)
	PIGS_complexCO2 = PIGS_complexCO2 + IF (animal == 'PIGS'; complexCO2/1000*purchased; 0)
	PIGS_mixedCO2 = PIGS_mixedCO2 + IF (animal == 'PIGS'; mixedCO2*purchased; 0)
	POULTRY_forageCO2 = POULTRY_forageCO2 + IF (animal == 'POULTRY'; forageCO2/1000*purchased; 0)
	POULTRY_simpleCO2 = POULTRY_simpleCO2 + IF (animal == 'POULTRY'; simpleCO2/1000*purchased; 0)
	POULTRY_complexCO2 = POULTRY_complexCO2 + IF (animal == 'POULTRY'; complexCO2/1000*purchased; 0)
	POULTRY_mixedCO2 = POULTRY_mixedCO2 + IF (animal == 'POULTRY'; mixedCO2*purchased; 0)
	LayingHENS_forageCO2 = LayingHENS_forageCO2 + IF (animal == 'Laying HENS'; forageCO2/1000*purchased; 0)
	LayingHENS_simpleCO2 = LayingHENS_simpleCO2 + IF (animal == 'Laying HENS'; simpleCO2/1000*purchased; 0)
	LayingHENS_complexCO2 = LayingHENS_complexCO2 + IF (animal == 'Laying HENS'; complexCO2/1000*purchased; 0)
	LayingHENS_mixedCO2 = LayingHENS_mixedCO2 + IF (animal == 'Laying HENS'; mixedCO2*purchased; 0)

	if feed <> 'Milk powder' then begin '{'
		DAIRYCATTLE_DE = DAIRYCATTLE_DE + IF (animal == 'DAIRY CATTLE'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.85); 0)
		DAIRYCATTLE_N = DAIRYCATTLE_N + IF (animal == 'DAIRY CATTLE'; produced + purchased; 0)
		MEATCATTLE_DE = MEATCATTLE_DE + IF (animal == 'MEAT CATTLE'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.85); 0)
		MEATCATTLE_N = MEATCATTLE_N + IF (animal == 'MEAT CATTLE'; produced + purchased; 0)
		SHEEP_DE = SHEEP_DE + IF (animal == 'SHEEP'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.85); 0)
		SHEEP_N = SHEEP_N + IF (animal == 'SHEEP'; produced + purchased; 0)
		GOATS_DE = GOATS_DE + IF (animal == 'GOATS'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.85); 0)
		GOATS_N = GOATS_N + IF (animal == 'GOATS'; produced + purchased; 0)
		OtherRUMIANTS_DE = OtherRUMIANTS_DE + IF (animal == 'Other RUMIANTS'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.85); 0)
		OtherRUMIANTS_N = OtherRUMIANTS_N + IF (animal == 'Other RUMIANTS'; produced + purchased; 0)
		PIGS_DE = PIGS_DE + IF (animal == 'PIGS'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.88); 0)
		PIGS_N = PIGS_N + IF (animal == 'PIGS'; produced + purchased; 0)
		POULTRY_DE = POULTRY_DE + IF (animal == 'POULTRY'; (produced + purchased)*IF_ERROR (VLOOKUP (feed; T60; 6); 0.90); 0)
		POULTRY_N = POULTRY_N + IF (animal == 'POULTRY'; produced + purchased; 0)
	'}' end
	i = i + 1
'}' end

DAIRYCATTLE_DE = IF (DAIRYCATTLE_N == 0; 0; DAIRYCATTLE_DE/DAIRYCATTLE_N)
MEATCATTLE_DE = IF (MEATCATTLE_N == 0; 0; MEATCATTLE_DE/MEATCATTLE_N)
SHEEP_DE = IF (SHEEP_N == 0; 0; SHEEP_DE/SHEEP_N)
GOATS_DE = IF (GOATS_N == 0; 0; GOATS_DE/GOATS_N)
OtherRUMIANTS_DE = IF (OtherRUMIANTS_N == 0; 0; OtherRUMIANTS_DE/OtherRUMIANTS_N)
PIGS_DE = IF (PIGS_N == 0; 0; PIGS_DE/PIGS_N)
POULTRY_DE = IF (POULTRY_N == 0; 0; POULTRY_DE/POULTRY_N)

DAIRYCATTLE_REM = IF_ERROR (1.123 - 4.092*0.001*DAIRYCATTLE_DE*100 + 1.126*0.00001*(DAIRYCATTLE_DE*100)**2 - 25.4/(DAIRYCATTLE_DE*100); 0)
MEATCATTLE_REM = IF_ERROR (1.123 - 4.092*0.001*MEATCATTLE_DE*100 + 1.126*0.00001*(MEATCATTLE_DE*100)**2 - 25.4/(MEATCATTLE_DE*100); 0)
SHEEP_REM = IF_ERROR (1.123 - 4.092*0.001*SHEEP_DE*100 + 1.126*0.00001*(SHEEP_DE*100)**2 - 25.4/(SHEEP_DE*100); 0)
GOATS_REM = IF_ERROR (1.123 - 4.092*0.001*GOATS_DE*100 + 1.126*0.00001*(GOATS_DE*100)**2 - 25.4/(GOATS_DE*100); 0)
OtherRUMIANTS_REM = IF_ERROR (1.123 - 4.092*0.001*OtherRUMIANTS_DE*100 + 1.126*0.00001*(OtherRUMIANTS_DE*100)**2 - 25.4/(OtherRUMIANTS_DE*100); 0)
PIGS_REM = IF_ERROR (1.123 - 4.092*0.001*PIGS_DE*100 + 1.126*0.00001*(PIGS_DE*100)**2 - 25.4/(PIGS_DE*100); 0)
POULTRY_REM = IF_ERROR (1.123 - 4.092*0.001*POULTRY_DE*100 + 1.126*0.00001*(POULTRY_DE*100)**2 - 25.4/(POULTRY_DE*100); 0)

DAIRYCATTLE_feedsCO2 = SUM (DAIRYCATTLE_forageCO2; DAIRYCATTLE_simpleCO2; DAIRYCATTLE_complexCO2; DAIRYCATTLE_mixedCO2; DAIRYCATTLE_milkCO2)
MEATCATTLE_feedsCO2 = SUM (MEATCATTLE_forageCO2; MEATCATTLE_simpleCO2; MEATCATTLE_complexCO2; MEATCATTLE_mixedCO2; MEATCATTLE_milkCO2)
SHEEP_feedsCO2 = SUM (SHEEP_forageCO2; SHEEP_simpleCO2; SHEEP_complexCO2; SHEEP_mixedCO2; SHEEP_milkCO2)
GOATS_feedsCO2 = SUM (GOATS_forageCO2; GOATS_simpleCO2; GOATS_complexCO2; GOATS_mixedCO2; GOATS_milkCO2)
OtherRUMIANTS_feedsCO2 = SUM (OtherRUMIANTS_forageCO2; OtherRUMIANTS_simpleCO2; OtherRUMIANTS_complexCO2; OtherRUMIANTS_mixedCO2; OtherRUMIANTS_milkCO2)
PIGS_feedsCO2 = SUM (PIGS_forageCO2; PIGS_simpleCO2; PIGS_complexCO2; PIGS_mixedCO2)
POULTRY_feedsCO2 = SUM (POULTRY_forageCO2; POULTRY_simpleCO2; POULTRY_complexCO2; POULTRY_mixedCO2)
LayingHENS_feedsCO2 = SUM (LayingHENS_forageCO2; LayingHENS_simpleCO2; LayingHENS_complexCO2; LayingHENS_mixedCO2)
forageCO2 = SUM (DAIRYCATTLE_forageCO2; MEATCATTLE_forageCO2; SHEEP_forageCO2; GOATS_forageCO2; OtherRUMIANTS_forageCO2; PIGS_forageCO2; POULTRY_forageCO2; LayingHENS_forageCO2)
simpleCO2 = SUM (DAIRYCATTLE_simpleCO2; MEATCATTLE_simpleCO2; SHEEP_simpleCO2; GOATS_simpleCO2; OtherRUMIANTS_simpleCO2; PIGS_simpleCO2; POULTRY_simpleCO2; LayingHENS_simpleCO2)
complexCO2 = SUM (DAIRYCATTLE_complexCO2; MEATCATTLE_complexCO2; SHEEP_complexCO2; GOATS_complexCO2; OtherRUMIANTS_complexCO2; PIGS_complexCO2; POULTRY_complexCO2; LayingHENS_complexCO2)
mixedCO2 = SUM (DAIRYCATTLE_mixedCO2; MEATCATTLE_mixedCO2; SHEEP_mixedCO2; GOATS_mixedCO2; OtherRUMIANTS_mixedCO2; PIGS_mixedCO2; POULTRY_mixedCO2; LayingHENS_mixedCO2)
milkCO2 = SUM (DAIRYCATTLE_milkCO2; MEATCATTLE_milkCO2; SHEEP_milkCO2; GOATS_milkCO2; OtherRUMIANTS_milkCO2)



CO2fromFeed = SUM (forageCO2; simpleCO2; complexCO2; mixedCO2; milkCO2)

d_c_4000BW = VLOOKUP ('Dairy cows 4000 kg milk'; T52; 2)
d_c_6000BW = VLOOKUP ('Dairy cows 6000 kg milk'; T52; 2)
d_c_8000BW = VLOOKUP ('Dairy cows 8000 kg milk'; T52; 2)
d_c_10000BW = VLOOKUP ('Dairy cows 10000 kg milk'; T52; 2)
d_c_calvesBW = VLOOKUP ('Dairy calves'; T52; 2)
d_c_growing_1BW = VLOOKUP ('Dairy growing cattle < 2 years'; T52; 2)
d_c_growing_2BW = VLOOKUP ('Dairy growing cattle > 2 years'; T52; 2)
d_c_matureBW = VLOOKUP ('Dairy mature cattle'; T52; 2)
m_c_matureBW = VLOOKUP ('Mature cattle'; T52; 2)
m_c_calvesBW = VLOOKUP ('Calves'; T52; 2)
m_c_growing_1BW = VLOOKUP ('Growing cattle < 2 years'; T52; 2)
m_c_growing_2BW = VLOOKUP ('Growing cattle > 2 years'; T52; 2)
s_matureBW = VLOOKUP ('Mature sheep'; T52; 2)
s_growingBW = VLOOKUP ('Growing sheep'; T52; 2)
g_matureBW = VLOOKUP ('Mature goats'; T52; 2)
g_growingBW = VLOOKUP ('Growing goats'; T52; 2)
r_othersBW = VLOOKUP ('Others ruminants'; T52; 2)
p_matureBW = VLOOKUP ('Mature pigs'; T53; 4)
p_growingBW = VLOOKUP ('Growing pigs'; T53; 4)
po_henBW = VLOOKUP ('Hens'; T54; 4)
po_broilerBW = VLOOKUP ('Broiler chicken'; T54; 4)
po_otherBW = VLOOKUP ('Other poultry'; T54; 4)

d_c_4000Nema_Nemf = d_c_6000Nema_Nemf = d_c_8000Nema_Nemf = d_c_10000Nema_Nemf = d_c_calvesNema_Nemf = d_c_growing_1Nema_Nemf = d_c_growing_2Nema_Nemf = d_c_matureNema_Nemf = IF (DAIRYCATTLE_DE == 0; 0; 18.45*DAIRYCATTLE_DE*DAIRYCATTLE_REM)
m_c_matureNema_Nemf = m_c_calvesNema_Nemf = m_c_growing_1Nema_Nemf = m_c_growing_2Nema_Nemf = IF (MEATCATTLE_DE == 0; 0; 18.45*MEATCATTLE_DE*MEATCATTLE_REM)
s_matureNema_Nemf = s_growingNema_Nemf = IF (SHEEP_DE == 0; 0; 18.45*SHEEP_DE*SHEEP_REM)
g_matureNema_Nemf = g_growingNema_Nemf = IF (GOATS_DE == 0; 0; 18.45*GOATS_DE*GOATS_REM)
r_othersNema_Nemf = IF (OtherRUMIANTS_DE == 0; 0; 18.45*OtherRUMIANTS_DE*OtherRUMIANTS_REM)
p_matureNema_Nemf = p_growingNema_Nemf = IF (PIGS_DE == 0; 0; 18.45*PIGS_DE*PIGS_REM)
po_henNema_Nemf = po_broilerNema_Nemf = po_otherNema_Nemf = IF (POULTRY_DE == 0; 0; 18.45*POULTRY_DE*POULTRY_REM)

d_c_4000DMI = IF (d_c_4000Nema_Nemf == 0; 0; 0.0185*d_c_4000BW + 0.305*(0.4324*4000 + 16.216*4000*0.035))
d_c_6000DMI = IF (d_c_6000Nema_Nemf == 0; 0; 0.0185*d_c_6000BW + 0.305*(0.4324*6000 + 16.216*6000*0.035))
d_c_8000DMI = IF (d_c_8000Nema_Nemf == 0; 0; 0.0185*d_c_8000BW + 0.305*(0.4324*8000 + 16.216*8000*0.035))
d_c_10000DMI = IF (d_c_10000Nema_Nemf == 0; 0; 0.0185*d_c_10000BW + 0.305*(0.4324*10000 + 16.216*10000*0.035))
d_c_calvesDMI = IF (d_c_calvesNema_Nemf == 0; 0; d_c_calvesBW**0.75*(0.0582*d_c_calvesNema_Nemf - 0.00266*d_c_calvesNema_Nemf**2 - 0.1128)/(0.239*d_c_calvesNema_Nemf))
d_c_growing_1DMI = IF (d_c_growing_1Nema_Nemf == 0; 0; d_c_growing_1BW**0.75*(0.0582*d_c_growing_1Nema_Nemf - 0.00266*d_c_growing_1Nema_Nemf**2 - 0.0869)/(0.239*d_c_growing_1Nema_Nemf))
d_c_growing_2DMI = IF (d_c_growing_2Nema_Nemf == 0; 0; d_c_growing_2BW**0.75*(0.0582*d_c_growing_2Nema_Nemf - 0.00266*d_c_growing_2Nema_Nemf**2 - 0.0869)/(0.239*d_c_growing_2Nema_Nemf))
d_c_matureDMI = IF (d_c_matureNema_Nemf == 0; 0; d_c_matureBW**0.75*(0.0119*d_c_matureNema_Nemf**2 + 0.1938)/d_c_matureNema_Nemf)
m_c_matureDMI = IF (m_c_matureNema_Nemf == 0; 0; 3.83 + 0.0143*m_c_matureBW*0.96)
m_c_calvesDMI = IF (m_c_calvesNema_Nemf == 0; 0; m_c_calvesBW**0.75*(0.0582*m_c_calvesNema_Nemf - 0.00266*m_c_calvesNema_Nemf**2 - 0.1128)/(0.239*m_c_calvesNema_Nemf))
m_c_growing_1DMI = IF (m_c_growing_1Nema_Nemf == 0; 0; 3.184 + 0.01536*m_c_growing_1BW*0.96)
m_c_growing_2DMI = IF (m_c_growing_2Nema_Nemf == 0; 0; 3.184 + 0.01536*m_c_growing_2BW*0.96)
s_matureDMI = IF (s_matureNema_Nemf == 0; 0; s_matureBW**0.75*(0.2444*s_matureNema_Nemf - 0.0111*s_matureNema_Nemf**2 - 0.472)/s_matureNema_Nemf)
s_growingDMI = IF (s_growingNema_Nemf == 0; 0; s_growingBW**0.75*(0.2444*s_growingNema_Nemf - 0.0111*s_growingNema_Nemf**2 - 0.472)/s_growingNema_Nemf)
g_matureDMI = IF (g_matureNema_Nemf == 0; 0; g_matureBW**0.75*(0.2444*g_matureNema_Nemf - 0.0111*g_matureNema_Nemf**2 - 0.472)/g_matureNema_Nemf)
g_growingDMI = IF (g_growingNema_Nemf == 0; 0; g_growingBW**0.75*(0.2444*g_growingNema_Nemf - 0.0111*g_growingNema_Nemf**2 - 0.472)/g_growingNema_Nemf)
r_othersDMI = IF (r_othersNema_Nemf == 0; 0; r_othersBW**0.75*(0.2444*r_othersNema_Nemf - 0.0111*r_othersNema_Nemf**2 - 0.472)/r_othersNema_Nemf)
p_matureDMI = IF (p_mature == 0; VLOOKUP ('Mature pigs'; T53; 6); p_mature_feed/p_mature*1000/365)
p_growingDMI = IF (p_growing == 0; VLOOKUP ('Mature pigs'; T53; 6); p_mature_feed/p_growing*1000/365)
po_henDMI = IF (po_hen == 0; VLOOKUP ('Hens'; T54; 6); po_hen_feed/po_hen*1000/365)
po_broilerDMI = IF (po_broiler == 0; VLOOKUP ('Hens'; T54; 6); po_broiler_feed/po_broiler_feed*1000/365)
po_otherDMI = IF (po_other == 0; VLOOKUP ('Hens'; T54; 6); po_other_feed/po_other*1000/365)

d_c_4000Nex = VLOOKUP ('Dairy cows 4000 kg milk'; T52; 3)*d_c_4000
d_c_6000Nex = VLOOKUP ('Dairy cows 6000 kg milk'; T52; 3)*d_c_6000
d_c_8000Nex = VLOOKUP ('Dairy cows 8000 kg milk'; T52; 3)*d_c_8000
d_c_10000Nex = VLOOKUP ('Dairy cows 10000 kg milk'; T52; 3)*d_c_10000
d_c_calvesNex = VLOOKUP ('Dairy calves'; T52; 3)*d_c_calves
d_c_growing_1Nex = VLOOKUP ('Dairy growing cattle < 2 years'; T52; 3)*d_c_growing_1
d_c_growing_2Nex = VLOOKUP ('Dairy growing cattle > 2 years'; T52; 3)*d_c_growing_2
d_c_matureNex = VLOOKUP ('Dairy mature cattle'; T52; 3)*d_c_mature
m_c_matureNex = VLOOKUP ('Mature cattle'; T52; 3)*m_c_mature
m_c_calvesNex = VLOOKUP ('Calves'; T52; 3)*m_c_calves
m_c_growing_1Nex = VLOOKUP ('Growing cattle < 2 years'; T52; 3)*m_c_growing_1
m_c_growing_2Nex = VLOOKUP ('Growing cattle > 2 years'; T52; 3)*m_c_growing_2
s_matureNex = VLOOKUP ('Mature sheep'; T52; 3)*s_mature
s_growingNex = VLOOKUP ('Growing sheep'; T52; 3)*s_growing
g_matureNex = VLOOKUP ('Mature goats'; T52; 3)*g_mature
g_growingNex = VLOOKUP ('Growing goats'; T52; 3)*g_growing
r_othersNex = VLOOKUP ('Others ruminants'; T52; 3)*r_others
p_matureNex = VLOOKUP ('Mature pigs'; T53; 3)*p_mature
p_growingNex = VLOOKUP ('Growing pigs'; T53; 3)*p_growing
po_henNex = VLOOKUP ('Hens'; T54; 3)*po_hen
po_broilerNex = VLOOKUP ('Broiler chicken'; T54; 3)*po_broiler
po_otherNex = VLOOKUP ('Other poultry'; T54; 3)*po_other

DAIRYCATTLE_Nex = SUM(d_c_4000Nex; d_c_6000Nex; d_c_8000Nex; d_c_10000Nex; d_c_calvesNex; d_c_growing_1Nex; d_c_growing_2Nex; d_c_matureNex)
MEATCATTLE_Nex = SUM(m_c_matureNex; m_c_calvesNex; m_c_growing_1Nex; m_c_growing_2Nex)
SHEEP_Nex = SUM(s_matureNex; s_growingNex)
GOATS_Nex = SUM(g_matureNex; g_growingNex)
OtherRUMIANTS_Nex = SUM(r_othersNex)
PIGS_Nex = SUM(p_matureNex; p_growingNex)
POULTRY_Nex = SUM(po_henNex; po_broilerNex; po_otherNex)





m = LEN(Manure)
j = 1
while j < m then begin '{'
	row = GET(Manure, j)
	animal = GET(row, 0)
	type = GET(row, 1)

	j = j + 1
'}' end






CO2fromEnteric = 0
CO2fromManure = 0
CO2fromPastures = 0

CH4fromEnteric = 0
CH4fromManure = 0
N2OfromPastures = 0
N2OfromManure = 0