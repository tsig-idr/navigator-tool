EF_forage = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'EF_forage.csv'))
EF_feed = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'EF_feed.csv'))
EF_concentrate = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'EF_concentrate.csv'))
EF_livestock = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'EF_livestock.csv'))
Ruminants = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'Ruminants.csv'))
Pigs = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'Pigs.csv'))
Hens = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'Hens.csv'))
NEmf = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'NEmf.csv'))
Conversion = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'Conversion.csv'))
MCFRef = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'MCF.csv'))
Pastures = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'Pastures.csv'))
States = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'States.csv'))
N2O_dc = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_dc.csv'))
N2O_mc = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_mc.csv'))
N2O_s = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_s.csv'))
N2O_g = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_g.csv'))
N2O_r = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_r.csv'))
N2O_p = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_p.csv'))
N2O_po = STD_CSV2ARRAY(CONCAT('sheetscript/G3/', 'N2O_po.csv'))

CO2_GWP = 1
CH4_GWP	= 25
N2O_GWP	= 298

forageCO2 = feedCO2 = concentrateCO2 = 0

n = LEN (Feeds)
i = 1
while i < n then begin '{'
	row = GET (Feeds, i)
	feed = GET (row, 0)
	purchased = IF_ERROR (GET (row, 1); 0)
	purchased = IF (purchased == ''; 0; purchased)
	forageCO2 = forageCO2 + IF_ERROR (VLOOKUP (feed; EF_forage; 3); 0)/1000*purchased
	feedCO2 = feedCO2 + IF_ERROR (VLOOKUP (feed; EF_feed; 3); 0)/1000*purchased
	concentrateCO2 = concentrateCO2 + IF_ERROR (VLOOKUP (feed; EF_concentrate; 2); 0)/1000*purchased
	i = i + 1
'}' end

CO2fromFeed = SUM (forageCO2; feedCO2; concentrateCO2)

SHEEP_DE = VLOOKUP ('Mature sheep'; Ruminants; 5)
GOATS_DE = VLOOKUP ('Mature goats'; Ruminants; 5)
OtherRUMIANTS_DE = VLOOKUP ('Horses'; Ruminants; 5)

SHEEP_NEmf = IF (SHEEP_DE == 0; 0; 18.45*SHEEP_DE*SHEEP_REM)
GOATS_NEmf = IF (GOATS_DE == 0; 0; 18.45*GOATS_DE*GOATS_REM)
OtherRUMIANTS_NEmf = IF (OtherRUMIANTS_DE == 0; 0; 18.45*OtherRUMIANTS_DE*OtherRUMIANTS_REM)

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

d_c_4000BW = VLOOKUP ('Dairy cows 4000 kg milk'; Ruminants; 2)
d_c_6000BW = VLOOKUP ('Dairy cows 6000 kg milk'; Ruminants; 2)
d_c_8000BW = VLOOKUP ('Dairy cows 8000 kg milk'; Ruminants; 2)
d_c_10000BW = VLOOKUP ('Dairy cows 10000 kg milk'; Ruminants; 2)
d_c_calvesBW = VLOOKUP ('Dairy calves'; Ruminants; 2)
d_c_growing_1BW = VLOOKUP ('Dairy growing cattle < 2 years'; Ruminants; 2)
d_c_growing_2BW = VLOOKUP ('Dairy growing cattle > 2 years'; Ruminants; 2)
d_c_matureBW = VLOOKUP ('Dairy mature cattle'; Ruminants; 2)
m_c_matureBW = VLOOKUP ('Mature cattle'; Ruminants; 2)
m_c_calvesBW = VLOOKUP ('Calves'; Ruminants; 2)
m_c_growing_1BW = VLOOKUP ('Growing cattle < 2 years'; Ruminants; 2)
m_c_growing_2BW = VLOOKUP ('Growing cattle > 2 years'; Ruminants; 2)
s_matureBW = VLOOKUP ('Mature sheep'; Ruminants; 2)
s_growingBW = VLOOKUP ('Growing sheep'; Ruminants; 2)
g_matureBW = VLOOKUP ('Mature goats'; Ruminants; 2)
g_growingBW = VLOOKUP ('Growing goats'; Ruminants; 2)
r_othersBW = VLOOKUP ('Horses'; Ruminants; 2)
p_matureBW = VLOOKUP ('Mature pigs'; Pigs; 2)
p_growingBW = VLOOKUP ('Growing pigs'; Pigs; 2)
po_henBW = VLOOKUP ('Hens'; Hens; 2)
po_broilerBW = VLOOKUP ('Broiler chicken'; Hens; 2)
po_otherBW = VLOOKUP ('Other poultry'; Hens; 2)

d_c_calvesNEmf = VLOOKUP (d_c_calves_diet; NEmf; 2)
d_c_growing_1NEmf = VLOOKUP (d_c_growing_1_diet; NEmf; 2)
d_c_growing_2NEmf = VLOOKUP (d_c_growing_2_diet; NEmf; 2)
d_c_matureNEmf = VLOOKUP (d_c_mature_diet; NEmf; 2)
m_c_calvesNEmf = VLOOKUP (m_c_calves_diet; NEmf; 2)
m_c_growing_1NEmf = VLOOKUP (m_c_growing_1_diet; NEmf; 2)
m_c_growing_2NEmf = VLOOKUP (m_c_growing_2_diet; NEmf; 2)
s_matureNEmf = s_growingNEmf = SHEEP_NEmf
g_matureNEmf = g_growingNEmf = GOATS_NEmf
r_othersNEmf = OtherRUMIANTS_NEmf

d_c_4000Ym = VLOOKUP ('Dairy cows 4000 kg milk'; Ruminants; 4)
d_c_6000Ym = VLOOKUP ('Dairy cows 6000 kg milk'; Ruminants; 4)
d_c_8000Ym = VLOOKUP ('Dairy cows 8000 kg milk'; Ruminants; 4)
d_c_10000Ym = VLOOKUP ('Dairy cows 10000 kg milk'; Ruminants; 4)
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

d_c_4000DMI = 0.0185*d_c_4000BW + 0.305*(0.4324*4000/305 + 16.216*4000/305*0.035)
d_c_6000DMI = 0.0185*d_c_6000BW + 0.305*(0.4324*6000/305 + 16.216*6000/305*0.035)
d_c_8000DMI = 0.0185*d_c_8000BW + 0.305*(0.4324*8000/305 + 16.216*8000/305*0.035)
d_c_10000DMI = 0.0185*d_c_10000BW + 0.305*(0.4324*10000/305 + 16.216*10000/305*0.035)
d_c_calvesDMI = d_c_calvesBW**0.75*(0.0582*d_c_calvesNEmf - 0.00266*d_c_calvesNEmf**2 - 0.1128)/(0.239*d_c_calvesNEmf)
d_c_growing_1DMI = d_c_growing_1BW**0.75*(0.0582*d_c_growing_1NEmf - 0.00266*d_c_growing_1NEmf**2 - 0.0869)/(0.239*d_c_growing_1NEmf)
d_c_growing_2DMI = d_c_growing_2BW**0.75*(0.0582*d_c_growing_2NEmf - 0.00266*d_c_growing_2NEmf**2 - 0.0869)/(0.239*d_c_growing_2NEmf)
d_c_matureDMI = IF (d_c_matureNEmf == 0; 0; d_c_matureBW**0.75*(0.0119*(d_c_matureNEmf*1)**2 + 0.1938)/d_c_matureNEmf)
m_c_matureDMI = 3.83 + 0.0143*m_c_matureBW*0.96
m_c_calvesDMI = m_c_calvesBW**0.75*(0.0582*m_c_calvesNEmf - 0.00266*m_c_calvesNEmf**2 - 0.1128)/(0.239*m_c_calvesNEmf)
m_c_growing_1DMI = m_c_growing_1BW**0.75*(0.0582*m_c_growing_1NEmf - 0.00266*m_c_growing_1NEmf**2 - 0.0869)/(0.239*m_c_growing_1NEmf)
m_c_growing_2DMI = m_c_growing_2BW**0.75*(0.0582*m_c_growing_2NEmf - 0.00266*m_c_growing_2NEmf**2 - 0.0869)/(0.239*m_c_growing_2NEmf)
s_matureDMI = IF (s_matureNEmf == 0; 0; s_matureBW**0.75*(0.2444*s_matureNEmf - 0.0111*s_matureNEmf**2 - 0.472)/s_matureNEmf)
s_growingDMI = IF (s_growingNEmf == 0; 0; s_growingBW**0.75*(0.2444*s_growingNEmf - 0.0111*s_growingNEmf**2 - 0.472)/s_growingNEmf)
g_matureDMI = IF (g_matureNEmf == 0; 0; g_matureBW**0.75*(0.2444*g_matureNEmf - 0.0111*g_matureNEmf**2 - 0.472)/g_matureNEmf)
g_growingDMI = IF (g_growingNEmf == 0; 0; g_growingBW**0.75*(0.2444*g_growingNEmf - 0.0111*g_growingNEmf**2 - 0.472)/g_growingNEmf)
r_othersDMI = IF (r_othersNEmf == 0; 0; r_othersBW**0.75*(0.2444*r_othersNEmf - 0.0111*r_othersNEmf**2 - 0.472)/r_othersNEmf)
p_matureDMI = VLOOKUP ('Mature pigs'; Pigs; 3)
p_growingDMI = VLOOKUP ('Growing pigs'; Pigs; 3)
po_henDMI = VLOOKUP ('Hens'; Hens; 3)
po_broilerDMI = VLOOKUP ('Broiler chicken'; Hens; 3)
po_otherDMI = VLOOKUP ('Other poultry'; Hens; 3)

d_c_4000Nex = VLOOKUP ('Dairy cows 4000 kg milk'; Ruminants; 3)
d_c_6000Nex = VLOOKUP ('Dairy cows 6000 kg milk'; Ruminants; 3)
d_c_8000Nex = VLOOKUP ('Dairy cows 8000 kg milk'; Ruminants; 3)
d_c_10000Nex = VLOOKUP ('Dairy cows 10000 kg milk'; Ruminants; 3)
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

DAIRYCATTLE_Nex = SUM (d_c_4000*d_c_4000Nex; d_c_6000*d_c_6000Nex; d_c_8000*d_c_8000Nex; d_c_10000*d_c_10000Nex; d_c_calves*d_c_calvesNex; d_c_growing_1*d_c_growing_1Nex; d_c_growing_2*d_c_growing_2Nex; d_c_mature*d_c_matureNex)
MEATCATTLE_Nex = SUM (m_c_mature*m_c_matureNex; m_c_calves*m_c_calvesNex; m_c_growing_1*m_c_growing_1Nex; m_c_growing_2*m_c_growing_2Nex)
SHEEP_Nex = SUM (s_mature*s_matureNex; s_growing*s_growingNex)
GOATS_Nex = SUM (g_mature*g_matureNex; g_growing*g_growingNex)
OtherRUMIANTS_Nex = SUM (r_others*r_othersNex)
PIGS_Nex = SUM (p_mature*p_matureNex; p_growing*p_growingNex)
POULTRY_Nex = SUM (po_hen*po_henNex; po_broiler*po_broilerNex; po_other*po_otherNex)

d_c_4000VS = d_c_4000BW/1000*VLOOKUP ('Dairy cows 4000 kg milk'; Ruminants; 6)
d_c_6000VS = d_c_6000BW/1000*VLOOKUP ('Dairy cows 6000 kg milk'; Ruminants; 6)
d_c_8000VS = d_c_8000BW/1000*VLOOKUP ('Dairy cows 8000 kg milk'; Ruminants; 6)
d_c_10000VS = d_c_10000BW/1000*VLOOKUP ('Dairy cows 10000 kg milk'; Ruminants; 6)
d_c_calvesVS = d_c_calvesBW/1000*VLOOKUP ('Dairy calves'; Ruminants; 6)
d_c_growing_1VS = d_c_growing_1BW/1000*VLOOKUP ('Dairy growing cattle < 2 years'; Ruminants; 6)
d_c_growing_2VS = d_c_growing_2BW/1000* VLOOKUP ('Dairy growing cattle > 2 years'; Ruminants; 6)
d_c_matureVS = d_c_matureBW/1000*VLOOKUP ('Dairy mature cattle'; Ruminants; 6)
m_c_matureVS = m_c_matureBW/1000*VLOOKUP ('Mature cattle'; Ruminants; 6)
m_c_calvesVS = m_c_calvesBW/1000*VLOOKUP ('Calves'; Ruminants; 6)
m_c_growing_1VS = m_c_growing_1BW/1000*VLOOKUP ('Growing cattle < 2 years'; Ruminants; 6)
m_c_growing_2VS = m_c_growing_2BW/1000*VLOOKUP ('Growing cattle > 2 years'; Ruminants; 6)
s_matureVS = s_matureBW/1000*VLOOKUP ('Mature sheep'; Ruminants; 6)
s_growingVS = s_growingBW/1000*VLOOKUP ('Growing sheep'; Ruminants; 6)
g_matureVS = g_matureBW/1000*VLOOKUP ('Mature goats'; Ruminants; 6)
g_growingVS =  g_growingBW/1000*VLOOKUP ('Growing goats'; Ruminants; 6)
r_othersVS =  r_othersBW/1000*VLOOKUP ('Horses'; Ruminants; 6)
p_matureVS = p_matureBW/1000*VLOOKUP ('Mature pigs'; Pigs; 7)
p_growingVS = p_growingBW/1000*VLOOKUP ('Growing pigs'; Pigs; 7)
po_henVS = po_henBW/1000*VLOOKUP ('Hens'; Hens; 7)
po_broilerVS = po_broilerBW/1000*VLOOKUP ('Broiler chicken'; Hens; 7)
po_otherVS = po_otherBW/1000*VLOOKUP ('Other poultry'; Hens; 7)

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
