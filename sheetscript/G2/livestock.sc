EF_forage = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'EF_forage.csv'))
EF_feed = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'EF_feed.csv'))
EF_concentrate = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'EF_concentrate.csv'))
EF_livestock = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'EF_livestock.csv'))
Ruminants = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'Ruminants.csv'))
Pigs = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'Pigs.csv'))
Hens = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'Hens.csv'))
NEmf = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'NEmf.csv'))
Conversion = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'Conversion.csv'))
MCFRef = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'MCF.csv'))
Pastures = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'Pastures.csv'))
States = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'States.csv'))
N2O_dc = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_dc.csv'))
N2O_mc = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_mc.csv'))
N2O_s = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_s.csv'))
N2O_g = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_g.csv'))
N2O_r = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_r.csv'))
N2O_p = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_p.csv'))
N2O_po = STD_CSV2ARRAY(CONCAT('sheetscript/G2/', 'N2O_po.csv'))

CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

DAIRYCATTLE_forageCO2 = DAIRYCATTLE_feedCO2 = DAIRYCATTLE_concentrateCO2 = DAIRYCATTLE_milkCO2 = 0
MEATCATTLE_forageCO2 = MEATCATTLE_feedCO2 = MEATCATTLE_concentrateCO2 = MEATCATTLE_milkCO2 = 0
SHEEP_forageCO2 = SHEEP_feedCO2 = SHEEP_concentrateCO2 = SHEEP_milkCO2 = 0
GOATS_forageCO2 = GOATS_feedCO2 = GOATS_concentrateCO2 = GOATS_milkCO2 = 0
OtherRUMIANTS_forageCO2 = OtherRUMIANTS_feedCO2 = OtherRUMIANTS_concentrateCO2 = 0
PIGS_forageCO2 = PIGS_feedCO2 = PIGS_concentrateCO2 = 0
POULTRY_forageCO2 = POULTRY_feedCO2 = POULTRY_concentrateCO2 = 0

DAIRYCATTLE_DE = DAIRYCATTLE_N = 0
MEATCATTLE_DE = MEATCATTLE_N = 0
SHEEP_DE = SHEEP_N = 0
GOATS_DE = GOATS_N = 0
OtherRUMIANTS_DE = OtherRUMIANTS_N = 0
PIGS_DE = PIGS_N = 0
POULTRY_DE = POULTRY_N = 0

n = LEN (Feeds)
i = 1
while i < n then begin '{'
	row = GET (Feeds, i)
	animal = GET (row, 0)
	feed = GET (row, 1)
	produced = IF_ERROR (GET (row, 2); 0)
	produced = IF (produced == ''; 0; produced)
	purchased = IF_ERROR (GET (row, 3); 0)
	purchased = IF (purchased == ''; 0; purchased)
	forageCO2 = IF_ERROR (VLOOKUP (feed; EF_forage; 3); 0)/1000*purchased
	feedCO2 = IF_ERROR (IF (feed <> 'Milk powder'; VLOOKUP (feed; EF_feed; 3); 0); 0)/1000*purchased
	concentrateCO2 = IF_ERROR (VLOOKUP (feed; EF_concentrate; 2); 0)/1000*purchased
	milkCO2 = IF_ERROR (IF (feed == 'Milk powder'; VLOOKUP (feed; EF_feed; 3); 0); 0)/1000*purchased
	DAIRYCATTLE_forageCO2 = DAIRYCATTLE_forageCO2 + IF (animal == 'DAIRY CATTLE'; forageCO2; 0)
	DAIRYCATTLE_feedCO2 = DAIRYCATTLE_feedCO2 + IF (animal == 'DAIRY CATTLE'; feedCO2; 0)
	DAIRYCATTLE_concentrateCO2 = DAIRYCATTLE_concentrateCO2 + IF (animal == 'DAIRY CATTLE'; concentrateCO2; 0)
	DAIRYCATTLE_milkCO2 = DAIRYCATTLE_milkCO2 + IF (animal == 'DAIRY CATTLE'; milkCO2; 0)
	MEATCATTLE_forageCO2 = MEATCATTLE_forageCO2 + IF (animal == 'MEAT CATTLE'; forageCO2; 0)
	MEATCATTLE_feedCO2 = MEATCATTLE_feedCO2 + IF (animal == 'MEAT CATTLE'; feedCO2; 0)
	MEATCATTLE_concentrateCO2 = MEATCATTLE_concentrateCO2 + IF (animal == 'MEAT CATTLE'; concentrateCO2; 0)
	MEATCATTLE_milkCO2 = MEATCATTLE_milkCO2 + IF (animal == 'MEAT CATTLE'; milkCO2; 0)
	SHEEP_forageCO2 = SHEEP_forageCO2 + IF (animal == 'SHEEP'; forageCO2; 0)
	SHEEP_feedCO2 = SHEEP_feedCO2 + IF (animal == 'SHEEP'; feedCO2; 0)
	SHEEP_concentrateCO2 = SHEEP_concentrateCO2 + IF (animal == 'SHEEP'; concentrateCO2; 0)
	SHEEP_milkCO2 = SHEEP_milkCO2 + IF (animal == 'SHEEP'; milkCO2; 0)
	GOATS_forageCO2 = GOATS_forageCO2 + IF (animal == 'GOATS'; forageCO2; 0)
	GOATS_feedCO2 = GOATS_feedCO2 + IF (animal == 'GOATS'; feedCO2; 0)
	GOATS_concentrateCO2 = GOATS_concentrateCO2 + IF (animal == 'GOATS'; concentrateCO2; 0)
	GOATS_milkCO2 = GOATS_milkCO2 + IF (animal == 'GOATS'; milkCO2; 0)
	OtherRUMIANTS_forageCO2 = OtherRUMIANTS_forageCO2 + IF (animal == 'HORSES'; forageCO2; 0)
	OtherRUMIANTS_feedCO2 = OtherRUMIANTS_feedCO2 + IF (animal == 'HORSES'; feedCO2; 0)
	OtherRUMIANTS_concentrateCO2 = OtherRUMIANTS_concentrateCO2 + IF (animal == 'HORSES'; concentrateCO2; 0)
	PIGS_forageCO2 = PIGS_forageCO2 + IF (animal == 'PIGS'; forageCO2; 0)
	PIGS_feedCO2 = PIGS_feedCO2 + IF (animal == 'PIGS'; feedCO2; 0)
	PIGS_concentrateCO2 = PIGS_concentrateCO2 + IF (animal == 'PIGS'; concentrateCO2; 0)
	POULTRY_forageCO2 = POULTRY_forageCO2 + IF (animal == 'POULTRY'; forageCO2; 0)
	POULTRY_feedCO2 = POULTRY_feedCO2 + IF (animal == 'POULTRY'; feedCO2; 0)
	POULTRY_concentrateCO2 = POULTRY_concentrateCO2 + IF (animal == 'POULTRY'; concentrateCO2; 0)
	DE = IF_ERROR (VLOOKUP (feed; EF_forage; 6); IF_ERROR (VLOOKUP (feed; EF_feed; 6); IF_ERROR (VLOOKUP (feed; EF_concentrate; 3); 0.85)))
	if feed <> 'Milk powder' then begin '{'
		DAIRYCATTLE_DE = DAIRYCATTLE_DE + IF (animal == 'DAIRY CATTLE'; (produced + purchased)*DE; 0)
		DAIRYCATTLE_N = DAIRYCATTLE_N + IF (animal == 'DAIRY CATTLE'; produced + purchased; 0)
		MEATCATTLE_DE = MEATCATTLE_DE + IF (animal == 'MEAT CATTLE'; (produced + purchased)*DE; 0)
		MEATCATTLE_N = MEATCATTLE_N + IF (animal == 'MEAT CATTLE'; produced + purchased; 0)
		SHEEP_DE = SHEEP_DE + IF (animal == 'SHEEP'; (produced + purchased)*DE; 0)
		SHEEP_N = SHEEP_N + IF (animal == 'SHEEP'; produced + purchased; 0)
		GOATS_DE = GOATS_DE + IF (animal == 'GOATS'; (produced + purchased)*DE; 0)
		GOATS_N = GOATS_N + IF (animal == 'GOATS'; produced + purchased; 0)
		OtherRUMIANTS_DE = OtherRUMIANTS_DE + IF (animal == 'HORSES'; (produced + purchased)*DE; 0)
		OtherRUMIANTS_N = OtherRUMIANTS_N + IF (animal == 'HORSES'; produced + purchased; 0)
		PIGS_DE = PIGS_DE + IF (animal == 'PIGS'; (produced + purchased)*DE; 0)
		PIGS_N = PIGS_N + IF (animal == 'PIGS'; produced + purchased; 0)
		POULTRY_DE = POULTRY_DE + IF (animal == 'POULTRY'; (produced + purchased)*DE; 0)
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

DAIRYCATTLE_feedsCO2 = SUM (DAIRYCATTLE_forageCO2; DAIRYCATTLE_feedCO2; DAIRYCATTLE_concentrateCO2; DAIRYCATTLE_milkCO2)
MEATCATTLE_feedsCO2 = SUM (MEATCATTLE_forageCO2; MEATCATTLE_feedCO2; MEATCATTLE_concentrateCO2; MEATCATTLE_milkCO2)
SHEEP_feedsCO2 = SUM (SHEEP_forageCO2; SHEEP_feedCO2; SHEEP_concentrateCO2; SHEEP_milkCO2)
GOATS_feedsCO2 = SUM (GOATS_forageCO2; GOATS_feedCO2; GOATS_concentrateCO2; GOATS_milkCO2)
OtherRUMIANTS_feedsCO2 = SUM (OtherRUMIANTS_forageCO2; OtherRUMIANTS_feedCO2; OtherRUMIANTS_concentrateCO2)
PIGS_feedsCO2 = SUM (PIGS_forageCO2; PIGS_feedCO2; PIGS_concentrateCO2)
POULTRY_feedsCO2 = SUM (POULTRY_forageCO2; POULTRY_feedCO2; POULTRY_concentrateCO2)
forageCO2 = SUM (DAIRYCATTLE_forageCO2; MEATCATTLE_forageCO2; SHEEP_forageCO2; GOATS_forageCO2; OtherRUMIANTS_forageCO2; PIGS_forageCO2; POULTRY_forageCO2)
feedCO2 = SUM (DAIRYCATTLE_feedCO2; MEATCATTLE_feedCO2; SHEEP_feedCO2; GOATS_feedCO2; OtherRUMIANTS_feedCO2; PIGS_feedCO2; POULTRY_feedCO2)
concentrateCO2 = SUM (DAIRYCATTLE_concentrateCO2; MEATCATTLE_concentrateCO2; SHEEP_concentrateCO2; GOATS_concentrateCO2; OtherRUMIANTS_concentrateCO2; PIGS_concentrateCO2; POULTRY_concentrateCO2)
milkCO2 = SUM (DAIRYCATTLE_milkCO2; MEATCATTLE_milkCO2; SHEEP_milkCO2; GOATS_milkCO2)
test = [DAIRYCATTLE_feedsCO2, MEATCATTLE_feedsCO2, SHEEP_feedsCO2, GOATS_feedsCO2, OtherRUMIANTS_feedsCO2, PIGS_feedsCO2, POULTRY_feedsCO2]
CO2fromFeed = SUM (forageCO2; feedCO2; concentrateCO2; milkCO2)

DAIRYCATTLE_NEmf = IF (DAIRYCATTLE_DE == 0; 0; 18.45*DAIRYCATTLE_DE*SHEEP_REM)
MEATCATTLE_NEmf = IF (MEATCATTLE_DE == 0; 0; 18.45*MEATCATTLE_DE*SHEEP_REM)
SHEEP_NEmf = IF (SHEEP_DE == 0; 0; 18.45*SHEEP_DE*SHEEP_REM)
GOATS_NEmf = IF (GOATS_DE == 0; 0; 18.45*GOATS_DE*GOATS_REM)
OtherRUMIANTS_NEmf = IF (OtherRUMIANTS_DE == 0; 0; 18.45*OtherRUMIANTS_DE*OtherRUMIANTS_REM)

DAIRYCATTLE_REM = IF_ERROR (1.123 - 4.092*0.001*DAIRYCATTLE_DE*100 + 1.126*0.00001*(DAIRYCATTLE_DE*100)**2 - 25.4/(DAIRYCATTLE_DE*100); 0)
MEATCATTLE_REM = IF_ERROR (1.123 - 4.092*0.001*MEATCATTLE_DE*100 + 1.126*0.00001*(MEATCATTLE_DE*100)**2 - 25.4/(MEATCATTLE_DE*100); 0)
SHEEP_REM = IF_ERROR (1.123 - 4.092*0.001*SHEEP_DE*100 + 1.126*0.00001*(SHEEP_DE*100)**2 - 25.4/(SHEEP_DE*100); 0)
GOATS_REM = IF_ERROR (1.123 - 4.092*0.001*GOATS_DE*100 + 1.126*0.00001*(GOATS_DE*100)**2 - 25.4/(GOATS_DE*100); 0)
OtherRUMIANTS_REM = IF_ERROR (1.123 - 4.092*0.001*OtherRUMIANTS_DE*100 + 1.126*0.00001*(OtherRUMIANTS_DE*100)**2 - 25.4/(OtherRUMIANTS_DE*100); 0)

DAIRYCATTLE_B0 = VLOOKUP ('Dairy cattle'; EF_livestock; 2)
MEATCATTLE_B0 = VLOOKUP ('Meat cattle'; EF_livestock; 2)
SHEEP_B0 = VLOOKUP ('Sheep'; EF_livestock; 2)
GOATS_B0 = VLOOKUP ('Goats'; EF_livestock; 2)
OtherRUMIANTS_B0 = VLOOKUP ('Horses'; EF_livestock; 2)
PIGS_B0 = VLOOKUP ('Pigs'; EF_livestock; 2)
POULTRY_B0 = VLOOKUP ('Poultry'; EF_livestock; 2)

DAIRYCATTLE_ashes = VLOOKUP ('Dairy cattle'; EF_livestock; 3)
MEATCATTLE_ashes = VLOOKUP ('Meat cattle'; EF_livestock; 3)
SHEEP_ashes = VLOOKUP ('Sheep'; EF_livestock; 3)
GOATS_ashes = VLOOKUP ('Goats'; EF_livestock; 3)
OtherRUMIANTS_ashes = VLOOKUP ('Horses. others'; EF_livestock; 3)
PIGS_ashes = VLOOKUP ('Pigs'; EF_livestock; 3)
POULTRY_ashes = VLOOKUP ('Poultry'; EF_livestock; 3)

DAIRYCATTLE_UE = VLOOKUP ('Dairy cattle'; EF_livestock; 4)
MEATCATTLE_UE = VLOOKUP ('Meat cattle'; EF_livestock; 4)
SHEEP_UE = VLOOKUP ('Sheep'; EF_livestock; 4)
GOATS_UE = VLOOKUP ('Goats'; EF_livestock; 4)
OtherRUMIANTS_UE = VLOOKUP ('Horses. others'; EF_livestock; 4)
PIGS_UE = VLOOKUP ('Pigs'; EF_livestock; 4)
POULTRY_UE = VLOOKUP ('Poultry'; EF_livestock; 4)

cowtype_4000 = IF (d_c_4000_milk <= 5000; 'Dairy cows 4000 kg milk'; IF (d_c_4000_milk > 5000 && d_c_4000_milk <= 8500; 'Dairy cows 6000 kg milk'; IF (d_c_4000_milk > 8500 && d_c_4000_milk <= 10000; 'Dairy cows 8000 kg milk'; IF (d_c_4000_milk > 10000; 'Dairy cows 10000 kg milk'))))
cowtype_6000 = IF (d_c_6000_milk <= 5000; 'Dairy cows 4000 kg milk'; IF (d_c_6000_milk > 5000 && d_c_6000_milk <= 8500; 'Dairy cows 6000 kg milk'; IF (d_c_6000_milk > 8500 && d_c_6000_milk <= 10000; 'Dairy cows 8000 kg milk'; IF (d_c_6000_milk > 10000; 'Dairy cows 10000 kg milk'))))
cowtype_8000 = IF (d_c_8000_milk <= 5000; 'Dairy cows 4000 kg milk'; IF (d_c_8000_milk > 5000 && d_c_8000_milk <= 8500; 'Dairy cows 6000 kg milk'; IF (d_c_8000_milk > 8500 && d_c_8000_milk <= 10000; 'Dairy cows 8000 kg milk'; IF (d_c_8000_milk > 10000; 'Dairy cows 10000 kg milk'))))
cowtype_10000 = IF (d_c_10000_milk <= 5000; 'Dairy cows 4000 kg milk'; IF (d_c_10000_milk > 5000 && d_c_10000_milk <= 8500; 'Dairy cows 6000 kg milk'; IF (d_c_10000_milk > 8500 && d_c_10000_milk <= 10000; 'Dairy cows 8000 kg milk'; IF (d_c_10000_milk > 10000; 'Dairy cows 10000 kg milk'))))

d_c_4000Ym = VLOOKUP (cowtype_4000; Ruminants; 4)
d_c_6000Ym = VLOOKUP (cowtype_6000; Ruminants; 4)
d_c_8000Ym = VLOOKUP (cowtype_8000; Ruminants; 4)
d_c_10000Ym = VLOOKUP (cowtype_10000; Ruminants; 4)
d_c_calvesYm = VLOOKUP ('Dairy calves'; Ruminants; 4)
d_c_growing_1Ym = VLOOKUP ('Dairy growing cattle < 2 years'; Ruminants; 4)
d_c_growing_2Ym = VLOOKUP ('Dairy growing cattle > 2 years'; Ruminants; 4)
d_c_matureYm = VLOOKUP ('Dairy mature cattle'; Ruminants; 4)
m_c_matureYm = VLOOKUP ('Mature cattle'; Ruminants; 4)
m_c_calvesYm = VLOOKUP ('Calves'; Ruminants; 4)
m_c_growing_1Ym = VLOOKUP ('Growing cattle < 2 years'; Ruminants; 4)
m_c_growing_2Ym = VLOOKUP ('Growing cattle > 2 years'; Ruminants; 4)
s_matureYm = VLOOKUP ('Mature sheep'; Ruminants; 4)
s_growingYm = VLOOKUP ('Growing sheep'; Ruminants; 4)
g_matureYm = VLOOKUP ('Mature goats'; Ruminants; 4)
g_growingYm = VLOOKUP ('Growing goats'; Ruminants; 4)
r_othersYm = VLOOKUP ('Horses'; Ruminants; 4)
p_matureYm = VLOOKUP ('Mature pigs'; Pigs; 5)
p_growingYm = VLOOKUP ('Growing pigs'; Pigs; 5)
po_henYm = VLOOKUP ('Hens'; Hens; 5)
po_broilerYm = VLOOKUP ('Broiler chicken'; Hens; 5)
po_otherYm = VLOOKUP ('Other poultry'; Hens; 5)

d_c_4000DMI = IF (DAIRYCATTLE_NEmf == 0; 0; 0.0185*d_c_4000_BW_av + 0.305*(0.4324*d_c_4000_milk/d_c_4000_lact_d + 16.216*d_c_4000_milk/d_c_4000_lact_d*0.035))
d_c_6000DMI = IF (DAIRYCATTLE_NEmf == 0; 0; 0.0185*d_c_6000_BW_av + 0.305*(0.4324*d_c_6000_milk/d_c_6000_lact_d + 16.216*d_c_6000_milk/d_c_6000_lact_d*0.035))
d_c_8000DMI = IF (DAIRYCATTLE_NEmf == 0; 0; 0.0185*d_c_8000_BW_av + 0.305*(0.4324*d_c_8000_milk/d_c_8000_lact_d + 16.216*d_c_8000_milk/d_c_8000_lact_d*0.035))
d_c_10000DMI = IF (DAIRYCATTLE_NEmf == 0; 0; 0.0185*d_c_10000_BW_av + 0.305*(0.4324*d_c_10000_milk/d_c_10000_lact_d + 16.216*d_c_10000_milk/d_c_10000_lact_d*0.035))
d_c_calvesDMI = IF (DAIRYCATTLE_NEmf == 0; 0; d_c_calves_BW_av**0.75*(0.0582*DAIRYCATTLE_NEmf - 0.00266*DAIRYCATTLE_NEmf**2 - 0.1128)/(0.239*DAIRYCATTLE_NEmf))
d_c_growing_1DMI = IF (DAIRYCATTLE_NEmf == 0; 0; d_c_growing_1_BW_av**0.75*(0.0582*DAIRYCATTLE_NEmf - 0.00266*DAIRYCATTLE_NEmf**2 - 0.0869)/(0.239*DAIRYCATTLE_NEmf))
d_c_growing_2DMI = IF (DAIRYCATTLE_NEmf == 0; 0; d_c_growing_2_BW_av**0.75*(0.0582*DAIRYCATTLE_NEmf - 0.00266*DAIRYCATTLE_NEmf**2 - 0.0869)/(0.239*DAIRYCATTLE_NEmf))
d_c_matureDMI = IF (DAIRYCATTLE_NEmf == 0; 0; d_c_mature_BW_av**0.75*(0.0119*DAIRYCATTLE_NEmf**2 + 0.1938)/DAIRYCATTLE_NEmf)
m_c_matureDMI = IF (MEATCATTLE_NEmf == 0; 0; 3.83 + 0.0143*m_c_mature_BW_av*0.96)
m_c_calvesDMI = IF (MEATCATTLE_NEmf == 0; 0; m_c_calves_BW_av**0.75*(0.0582*MEATCATTLE_NEmf - 0.00266*MEATCATTLE_NEmf**2 - 0.1128)/(0.239*MEATCATTLE_NEmf))
m_c_growing_1DMI = IF (MEATCATTLE_NEmf == 0; 0; 3.184 + 0.01536*m_c_growing_1_BW_av*0.96)
m_c_growing_2DMI = IF (MEATCATTLE_NEmf == 0; 0; 3.184 + 0.01536*m_c_growing_2_BW_av*0.96)
s_matureDMI = IF (SHEEP_NEmf == 0; 0; s_mature_BW_av**0.75*(0.2444*SHEEP_NEmf - 0.0111*SHEEP_NEmf**2 - 0.472)/SHEEP_NEmf)
s_growingDMI = IF (SHEEP_NEmf == 0; 0; s_growing_BW_av**0.75*(0.2444*SHEEP_NEmf - 0.0111*SHEEP_NEmf**2 - 0.472)/SHEEP_NEmf)
g_matureDMI = IF (GOATS_NEmf == 0; 0; g_mature_BW_av**0.75*(0.2444*GOATS_NEmf - 0.0111*GOATS_NEmf**2 - 0.472)/GOATS_NEmf)
g_growingDMI = IF (GOATS_NEmf == 0; 0; g_growing_BW_av**0.75*(0.2444*GOATS_NEmf - 0.0111*GOATS_NEmf**2 - 0.472)/GOATS_NEmf)
r_othersDMI = IF (OtherRUMIANTS_NEmf == 0; 0; r_others_BW_av**0.75*(0.2444*OtherRUMIANTS_NEmf - 0.0111*OtherRUMIANTS_NEmf**2 - 0.472)/OtherRUMIANTS_NEmf)
p_matureDMI = VLOOKUP ('Mature pigs'; Pigs; 3)
p_growingDMI = VLOOKUP ('Growing pigs'; Pigs; 3)
po_henDMI = VLOOKUP ('Hens'; Hens; 3)
po_broilerDMI = VLOOKUP ('Broiler chicken'; Hens; 3)
po_otherDMI = VLOOKUP ('Other poultry'; Hens; 3)

d_c_4000Nex = VLOOKUP (cowtype_4000; Ruminants; 3)
d_c_6000Nex = VLOOKUP (cowtype_6000; Ruminants; 3)
d_c_8000Nex = VLOOKUP (cowtype_8000; Ruminants; 3)
d_c_10000Nex = VLOOKUP (cowtype_10000; Ruminants; 3)
d_c_calvesNex = VLOOKUP ('Dairy calves'; Ruminants; 3)
d_c_growing_1Nex = VLOOKUP ('Dairy growing cattle < 2 years'; Ruminants; 3)
d_c_growing_2Nex = VLOOKUP ('Dairy growing cattle > 2 years'; Ruminants; 3)
d_c_matureNex = VLOOKUP ('Dairy mature cattle'; Ruminants; 3)
m_c_matureNex = VLOOKUP ('Mature cattle'; Ruminants; 3)
m_c_calvesNex = VLOOKUP ('Calves'; Ruminants; 3)
m_c_growing_1Nex = VLOOKUP ('Growing cattle < 2 years'; Ruminants; 3)
m_c_growing_2Nex = VLOOKUP ('Growing cattle > 2 years'; Ruminants; 3)
s_matureNex = VLOOKUP ('Mature sheep'; Ruminants; 3)
s_growingNex = VLOOKUP ('Growing sheep'; Ruminants; 3)
g_matureNex = VLOOKUP ('Mature goats'; Ruminants; 3)
g_growingNex = VLOOKUP ('Growing goats'; Ruminants; 3)
r_othersNex = VLOOKUP ('Horses'; Ruminants; 3)
p_matureNex = VLOOKUP ('Mature pigs'; Pigs; 4)
p_growingNex = VLOOKUP ('Growing pigs'; Pigs; 4)
po_henNex = VLOOKUP ('Hens'; Hens; 4)
po_broilerNex = VLOOKUP ('Broiler chicken'; Hens; 4)
po_otherNex = VLOOKUP ('Other poultry'; Hens; 4)

d_c_4000Nex_ = d_c_4000*d_c_4000Nex
d_c_6000Nex_ = d_c_6000*d_c_6000Nex
d_c_8000Nex_ = d_c_8000*d_c_8000Nex
d_c_10000Nex_ = d_c_10000*d_c_10000Nex
d_c_calvesNex_ = d_c_calves*d_c_calvesNex
d_c_growing_1Nex_ = d_c_growing_1*d_c_growing_1Nex
d_c_growing_2Nex_ = d_c_growing_2*d_c_growing_2Nex
d_c_matureNex_ = d_c_mature*d_c_matureNex
m_c_calvesNex_ = m_c_calves*m_c_calvesNex
m_c_growing_1Nex_ = m_c_growing_1*m_c_growing_1Nex
m_c_growing_2Nex_ = m_c_growing_2*m_c_growing_2Nex
m_c_matureNex_ = m_c_mature*m_c_matureNex
s_growingNex_ = s_growing*s_growingNex
s_matureNex_ = s_mature*s_matureNex
g_growingNex_ = g_growing*g_growingNex
g_matureNex_ = g_mature*g_matureNex
r_othersNex_ = r_others*r_othersNex
p_growingNex_ = p_growing*p_growingNex
p_matureNex_ = p_mature*p_matureNex
po_henNex_ = po_hen*po_henNex
po_broilerNex_ = po_broiler*po_broilerNex
po_otherNex_ = po_other*po_otherNex

DAIRYCATTLE_Nex = SUM (d_c_4000Nex_*1; d_c_6000Nex_*1; d_c_8000Nex_*1; d_c_10000Nex_*1; d_c_calvesNex_*1; d_c_growing_1Nex_*1; d_c_growing_2Nex_*1; d_c_matureNex_*1)
MEATCATTLE_Nex = SUM (m_c_matureNex_*1; m_c_calvesNex_*1; m_c_growing_1Nex_*1; m_c_growing_2Nex_*1)
SHEEP_Nex = SUM (s_matureNex_*1; s_growingNex_*1)
GOATS_Nex = SUM (g_matureNex_*1; g_growingNex_*1)
OtherRUMIANTS_Nex = r_othersNex_
PIGS_Nex = SUM (p_matureNex_*1; p_growingNex_*1)
POULTRY_Nex = SUM (po_henNex_*1; po_broilerNex_*1; po_otherNex_*1)

d_c_4000VS = d_c_4000DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_6000VS = d_c_6000DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_8000VS = d_c_8000DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_10000VS = d_c_10000DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_calvesVS = d_c_calvesDMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_growing_1VS = d_c_growing_1DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_growing_2VS = d_c_growing_2DMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
d_c_matureVS = d_c_matureDMI*(1 - DAIRYCATTLE_DE - DAIRYCATTLE_UE)*(1 - DAIRYCATTLE_ashes)
m_c_matureVS = m_c_matureDMI*(1 - MEATCATTLE_DE - MEATCATTLE_UE)*(1 - MEATCATTLE_ashes)
m_c_calvesVS = m_c_calvesDMI*(1 - MEATCATTLE_DE - MEATCATTLE_UE)*(1 - MEATCATTLE_ashes)
m_c_growing_1VS = m_c_growing_1DMI*(1 - MEATCATTLE_DE - MEATCATTLE_UE)*(1 - MEATCATTLE_ashes)
m_c_growing_2VS = m_c_growing_2DMI*(1 - MEATCATTLE_DE - MEATCATTLE_UE)*(1 - MEATCATTLE_ashes)
s_matureVS = s_matureDMI*(1 - SHEEP_DE - SHEEP_UE)*(1 - SHEEP_ashes)
s_growingVS = s_growingDMI*(1 - SHEEP_DE - SHEEP_UE)*(1 - SHEEP_ashes)
g_matureVS = g_matureDMI*(1 - GOATS_DE - GOATS_UE)*(1 - GOATS_ashes)
g_growingVS = g_growingDMI*(1 - GOATS_DE - GOATS_UE)*(1 - GOATS_ashes)
r_othersVS = r_othersDMI*(1 - OtherRUMIANTS_DE - OtherRUMIANTS_UE)*(1 - OtherRUMIANTS_ashes)
p_matureVS = p_matureDMI*(1 - PIGS_DE - PIGS_UE)*(1 - PIGS_ashes)
p_growingVS = p_growingDMI*(1 - PIGS_DE - PIGS_UE)*(1 - PIGS_ashes)
po_henVS = po_henDMI*(1 - POULTRY_DE - POULTRY_UE)*(1 - POULTRY_ashes)
po_broilerVS = po_broilerDMI*(1 - POULTRY_DE - POULTRY_UE)*(1 - POULTRY_ashes)
po_otherVS = po_otherDMI*(1 - POULTRY_DE - POULTRY_UE)*(1 - POULTRY_ashes)

DAIRYCATTLE_entericCH4 = (d_c_4000*d_c_4000DMI*d_c_4000Ym + d_c_6000*d_c_6000DMI*d_c_6000Ym + d_c_8000*d_c_8000DMI*d_c_8000Ym + d_c_10000*d_c_10000DMI*d_c_10000Ym + d_c_calves*d_c_calvesDMI*d_c_calvesYm + d_c_growing_1*d_c_growing_1DMI*d_c_growing_1Ym + d_c_growing_2*d_c_growing_2DMI*d_c_growing_2Ym + d_c_mature*d_c_matureDMI*d_c_matureYm)*365/1000
MEATCATTLE_entericCH4 = (m_c_calves*m_c_calvesDMI*m_c_calvesYm + m_c_growing_1*m_c_growing_1DMI*m_c_growing_1Ym + m_c_growing_2*m_c_growing_2DMI*m_c_growing_2Ym + m_c_mature*m_c_matureDMI*m_c_matureYm)*365/1000
factor = 365*VLOOKUP ('Diet energy ratio'; Conversion; 2)/VLOOKUP ('Methan energy'; Conversion; 2)
SHEEP_entericCH4 = (s_growing*s_growingDMI*s_growingYm + s_mature*s_matureDMI*s_matureYm)*factor
GOATS_entericCH4 = (g_growing*g_growingDMI*g_growingYm + g_mature*g_matureDMI*g_matureYm)*factor
OtherRUMIANTS_entericCH4 = (r_others*r_othersDMI*r_othersYm)*365/1000
PIGS_entericCH4 = (p_growing*p_growingDMI*p_growingYm + p_mature*p_matureDMI*p_matureYm)*factor
POULTRY_entericCH4 = (po_hen*po_henDMI*po_henYm + po_broiler*po_broilerDMI*po_broilerYm + po_other*po_otherDMI*po_otherYm)*factor

CH4fromEnteric = SUM (DAIRYCATTLE_entericCH4; MEATCATTLE_entericCH4; SHEEP_entericCH4; GOATS_entericCH4; OtherRUMIANTS_entericCH4; PIGS_entericCH4; POULTRY_entericCH4)
CO2fromEnteric = CH4fromEnteric*CH4_GWP

N2OfromManure_pasture = N2OfromManure_liquid = N2OfromManure_solid = 0
indirectN2OfromManure_pasture = indirectN2OfromManure_liquid = indirectN2OfromManure_solid = 0
DAIRYCATTLE_MCF = MEATCATTLE_MCF = SHEEP_MCF = GOATS_MCF = OtherRUMIANTS_MCF = PIGS_MCF = POULTRY_MCF = 0

EF_volatization = 0.01
EF_leaching = 0.0075
m = LEN (Manure)
j = 1
while j < m then begin '{'
	row = GET (Manure, j)
	animal = GET (row, 0)
	type = GET (row, 1)
	share = IF_ERROR (GET (row, 2); 0)
	share = IF (share == ''; 0; share)
	state = VLOOKUP (type; States; 2)
	MCF = IF_ERROR (VLOOKUP (type; MCFRef; temp_av - 7); 0)
	DAIRYCATTLE_MCF = DAIRYCATTLE_MCF + IF (animal == 'DAIRY CATTLE'; MCF; 0)*share/100
	MEATCATTLE_MCF = MEATCATTLE_MCF + IF (animal == 'MEAT CATTLE'; MCF; 0)*share/100
	SHEEP_MCF = SHEEP_MCF + IF (animal == 'SHEEP'; MCF; 0)*share/100
	GOATS_MCF = GOATS_MCF + IF (animal == 'GOATS'; MCF; 0)*share/100
	OtherRUMIANTS_MCF = OtherRUMIANTS_MCF + IF (animal == 'HORSES'; MCF; 0)*share/100
	PIGS_MCF = PIGS_MCF + IF (animal == 'PIGS'; MCF; 0)*share/100
	POULTRY_MCF = POULTRY_MCF + IF (animal == 'POULTRY'; MCF; 0)*share/100
	EF3 = IF_ERROR (IF (type == 'Pasture. range. paddock'; VLOOKUP (animal; Pastures; 2); VLOOKUP (type; MCFRef; 2)); 0)
	Nex = share/100*IF (animal == 'DAIRY CATTLE'; DAIRYCATTLE_Nex; IF (animal == 'MEAT CATTLE'; MEATCATTLE_Nex; IF (animal == 'SHEEP'; SHEEP_Nex; IF (animal == 'GOATS'; GOATS_Nex; IF (animal == 'HORSES'; OtherRUMIANTS_Nex; IF (animal == 'PIGS'; PIGS_Nex; IF (animal == 'POULTRY' || animal == 'Laying HENS'; POULTRY_Nex; 0)))))))
	Nvol = Nex*IF (animal == 'DAIRY CATTLE'; VLOOKUP (type; N2O_dc; 2); IF (animal == 'MEAT CATTLE'; VLOOKUP (type; N2O_mc; 2); IF (animal == 'SHEEP'; VLOOKUP (type; N2O_s; 2); IF (animal == 'GOATS'; VLOOKUP (type; N2O_g; 2); IF (animal == 'HORSES'; VLOOKUP (type; N2O_r; 2); IF (animal == 'PIGS'; VLOOKUP (type; N2O_p; 2); IF (animal == 'POULTRY' || animal == 'Laying HENS'; VLOOKUP (type; N2O_po; 2); 0)))))))
	Nlea = Nex*IF (animal == 'DAIRY CATTLE'; VLOOKUP (type; N2O_dc; 3); IF (animal == 'MEAT CATTLE'; VLOOKUP (type; N2O_mc; 3); IF (animal == 'SHEEP'; VLOOKUP (type; N2O_s; 3); IF (animal == 'GOATS'; VLOOKUP (type; N2O_g; 3); IF (animal == 'HORSES'; VLOOKUP (type; N2O_r; 3); IF (animal == 'PIGS'; VLOOKUP (type; N2O_p; 3); IF (animal == 'POULTRY' || animal == 'Laying HENS'; VLOOKUP (type; N2O_po; 3); 0)))))))
	N2OfromManure_pasture = N2OfromManure_pasture + IF (state == 'pasture'; Nex*EF3; 0)
	N2OfromManure_liquid = N2OfromManure_liquid + IF (state == 'liquid'; Nex*EF3; 0)
	N2OfromManure_solid = N2OfromManure_solid + IF (state == 'solid'; Nex*EF3; 0)
	indirectN2OfromManure_pasture = indirectN2OfromManure_pasture + IF (state == 'pasture'; Nvol*EF_volatization + Nlea*EF_leaching; 0)
	indirectN2OfromManure_liquid = indirectN2OfromManure_liquid + IF (state == 'liquid'; Nvol*EF_volatization + Nlea*EF_leaching; 0)
	indirectN2OfromManure_solid = indirectN2OfromManure_solid + IF (state == 'solid'; Nvol*EF_volatization + Nlea*EF_leaching; 0)
	j = j + 1
'}' end

DAIRYCATTLE_manureCH4 = (d_c_4000*d_c_4000VS + d_c_6000*d_c_6000VS + d_c_8000*d_c_8000VS + d_c_10000*d_c_10000VS + d_c_calves*d_c_calvesVS + d_c_growing_1*d_c_growing_1VS + d_c_growing_2*d_c_growing_2VS + d_c_mature*d_c_matureVS)*365*DAIRYCATTLE_B0*VLOOKUP ('methan density'; Conversion; 2)*DAIRYCATTLE_MCF
MEATCATTLE_manureCH4 = (m_c_calves*m_c_calvesVS + m_c_growing_1*m_c_growing_1VS + m_c_growing_2*m_c_growing_2VS + m_c_mature*m_c_matureVS)*365*MEATCATTLE_B0*VLOOKUP ('methan density'; Conversion; 2)*MEATCATTLE_MCF
SHEEP_manureCH4 = (s_growing*s_growingVS + s_mature*s_matureVS)*365*SHEEP_B0*VLOOKUP ('methan density'; Conversion; 2)*SHEEP_MCF
GOATS_manureCH4 = (g_growing*g_growingVS + g_mature*g_matureVS)*365*GOATS_B0*VLOOKUP ('methan density'; Conversion; 2)*GOATS_MCF
OtherRUMIANTS_manureCH4 = (r_others*r_othersVS)*365*OtherRUMIANTS_B0*VLOOKUP ('methan density'; Conversion; 2)*OtherRUMIANTS_MCF
PIGS_manureCH4 = (p_growing*p_growingVS + p_mature*p_matureVS)*365*PIGS_B0*VLOOKUP ('methan density'; Conversion; 2)*PIGS_MCF
POULTRY_manureCH4 = (po_hen*po_henVS + po_broiler*po_broilerVS + po_other*po_otherVS)*365*POULTRY_B0*VLOOKUP ('methan density'; Conversion; 2)*POULTRY_MCF

N2OfromPastures = (N2OfromManure_pasture + indirectN2OfromManure_pasture)*44/28
CO2fromPastures = N2OfromPastures*N2O_GWP
N2OfromManure = (N2OfromManure_liquid + N2OfromManure_solid + indirectN2OfromManure_liquid + indirectN2OfromManure_solid)*44/28
CH4fromManure = SUM (DAIRYCATTLE_manureCH4; MEATCATTLE_manureCH4; SHEEP_manureCH4; GOATS_manureCH4; OtherRUMIANTS_manureCH4; PIGS_manureCH4; POULTRY_manureCH4)
CO2fromManure = CH4fromManure*CH4_GWP + N2OfromManure*N2O_GWP