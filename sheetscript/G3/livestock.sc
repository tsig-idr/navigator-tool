Feeds = SP_CSV2ARRAY(CONCAT('tmp/G3/', CONCAT(uid, '_Feeds.csv')))
Manure = SP_CSV2ARRAY(CONCAT('tmp/G3/', CONCAT(uid, '_Manure.csv')))
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
GOAT_forageCO2 = 0
GOAT_simpleCO2 = 0
GOAT_complexCO2 = 0
GOAT_mixedCO2 = 0
GOAT_milkCO2 = 0
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

n = LEN(Feeds)
i = 1
while i < n then begin '{'
	row = GET(Feeds, i)
	animal = GET(row, 0)
	feed = GET(row, 1)

	purchased = IF_ERROR (GET(row, 3); 0)
	purchased = IF (purchased == ''; 0; purchased)
	forageCO2 = IF_ERROR (VLOOKUP (feed; T60; 3); 0)
	simpleCO2 = IF_ERROR (IF (feed <> 'Milk powder'; VLOOKUP (feed; T61; 3); 0); 0)
	complexCO2 = IF_ERROR (VLOOKUP (feed; IF (animal == 'DAIRY CATTLE' || animal == 'MEAT CATTLE'; T62; IF (animal == 'PIGS'; T63; IF (animal == 'POULTRY' || animal == 'Laying HENS'; T64; T65))); 3); 0)
	milkCO2 = IF_ERROR (IF (feed == 'Milk powder'; VLOOKUP (feed; T61; 3); 0); 0)
	feed = GET (SPLIT (feed, ' '), 0)
	row = GET (JRC, 1)
	mixedCO2 = IF_ERROR (GET (row, IF (feed == 'Cereals'; 2; IF (feed == 'Proteins'; 5; IF (feed == 'Energy'; 8; 0-1)))); 0)

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
	GOAT_forageCO2 = GOAT_forageCO2 + IF (animal == 'GOAT'; forageCO2/1000*purchased; 0)
	GOAT_simpleCO2 = GOAT_simpleCO2 + IF (animal == 'GOAT'; simpleCO2/1000*purchased; 0)
	GOAT_complexCO2 = GOAT_complexCO2 + IF (animal == 'GOAT'; complexCO2/1000*purchased; 0)
	GOAT_mixedCO2 = GOAT_mixedCO2 + IF (animal == 'GOAT'; mixedCO2*purchased; 0)
	GOAT_milkCO2 = GOAT_milkCO2 + IF (animal == 'GOAT'; milkCO2/1000*purchased/1000; 0)
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

	i = i + 1
'}' end

DAIRYCATTLE_feedsCO2 = SUM (DAIRYCATTLE_forageCO2; DAIRYCATTLE_simpleCO2; DAIRYCATTLE_complexCO2; DAIRYCATTLE_mixedCO2; DAIRYCATTLE_milkCO2)
MEATCATTLE_feedsCO2 = SUM (MEATCATTLE_forageCO2; MEATCATTLE_simpleCO2; MEATCATTLE_complexCO2; MEATCATTLE_mixedCO2; MEATCATTLE_milkCO2)
SHEEP_feedsCO2 = SUM (SHEEP_forageCO2; SHEEP_simpleCO2; SHEEP_complexCO2; SHEEP_mixedCO2; SHEEP_milkCO2)
GOAT_feedsCO2 = SUM (GOAT_forageCO2; GOAT_simpleCO2; GOAT_complexCO2; GOAT_mixedCO2; GOAT_milkCO2)
OtherRUMIANTS_feedsCO2 = SUM (OtherRUMIANTS_forageCO2; OtherRUMIANTS_simpleCO2; OtherRUMIANTS_complexCO2; OtherRUMIANTS_mixedCO2; OtherRUMIANTS_milkCO2)
PIGS_feedsCO2 = SUM (PIGS_forageCO2; PIGS_simpleCO2; PIGS_complexCO2; PIGS_mixedCO2)
POULTRY_feedsCO2 = SUM (POULTRY_forageCO2; POULTRY_simpleCO2; POULTRY_complexCO2; POULTRY_mixedCO2)
LayingHENS_feedsCO2 = SUM (LayingHENS_forageCO2; LayingHENS_simpleCO2; LayingHENS_complexCO2; LayingHENS_mixedCO2)
forageCO2 = SUM (DAIRYCATTLE_forageCO2; MEATCATTLE_forageCO2; SHEEP_forageCO2; GOAT_forageCO2; OtherRUMIANTS_forageCO2; PIGS_forageCO2; POULTRY_forageCO2; LayingHENS_forageCO2)
simpleCO2 = SUM (DAIRYCATTLE_simpleCO2; MEATCATTLE_simpleCO2; SHEEP_simpleCO2; GOAT_simpleCO2; OtherRUMIANTS_simpleCO2; PIGS_simpleCO2; POULTRY_simpleCO2; LayingHENS_simpleCO2)
complexCO2 = SUM (DAIRYCATTLE_complexCO2; MEATCATTLE_complexCO2; SHEEP_complexCO2; GOAT_complexCO2; OtherRUMIANTS_complexCO2; PIGS_complexCO2; POULTRY_complexCO2; LayingHENS_complexCO2)
mixedCO2 = SUM (DAIRYCATTLE_mixedCO2; MEATCATTLE_mixedCO2; SHEEP_mixedCO2; GOAT_mixedCO2; OtherRUMIANTS_mixedCO2; PIGS_mixedCO2; POULTRY_mixedCO2; LayingHENS_mixedCO2)
milkCO2 = SUM (DAIRYCATTLE_milkCO2; MEATCATTLE_milkCO2; SHEEP_milkCO2; GOAT_milkCO2; OtherRUMIANTS_milkCO2)

CO2fromFeed = SUM (forageCO2; simpleCO2; complexCO2; mixedCO2; milkCO2)




m = LEN(Manure)
j = 1
while j < m then begin '{'
	row = GET(Manure, j)
	animal = GET(row, 0)
	type = GET(row, 1)

	POULTRY_mixedCO2 = POULTRY_mixedCO2 + IF (animal == 'POULTRY'; mixedCO2*purchased; 0)

	j = j + 1
'}' end






CO2fromEnteric = 0
CO2fromManure = 0
CO2fromPastures = 0

CH4fromEnteric = 0
CH4fromManure = 0
N2OfromPastures = 0
N2OfromManure = 0