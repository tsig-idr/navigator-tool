SC = CI = 0
n = LEN (crops)
i = 0
areas = 0
yields = 0
while i < n then begin '{'
	crop = GET (crops, i)
	area = IF_ERROR (GET (crop, 'area'); 0)
	yield = IF_ERROR (GET (crop, 'yield'); 0)
	price = IF_ERROR (GET (crop, 'price'); 0)
	dose_irrigation = IF_ERROR (GET (crop, 'dose_irrigation'); 0)
	seeds = IF_ERROR (GET (crop, 'seeds'); 0)
	fung = IF_ERROR (GET (crop, 'fung'); 0)
	herb = IF_ERROR (GET (crop, 'herb'); 0)
	insect = IF_ERROR (GET (crop, 'insect'); 0)
	otreat = IF_ERROR (GET (crop, 'otreat'); 0)
	price_water = IF_ERROR (GET (crop, 'price_water'); 0)
	price_seeds = IF_ERROR (GET (crop, 'price_seeds'); 0)
	price_fung = IF_ERROR (GET (crop, 'price_fung'); 0)
	price_herb = IF_ERROR (GET (crop, 'price_herb'); 0)
	price_insect = IF_ERROR (GET (crop, 'price_insect'); 0)
	price_otreat = IF_ERROR (GET (crop, 'price_otreat'); 0)
	fertilization = GET (crop, 'fertilization')
	CI = CI + area*yield*price
	SC = SC + area*dose_irrigation*price_water
	SC = SC + area*seeds*price_seeds
	SC = SC + area*fung*price_fung
	SC = SC + area*herb*price_herb
	SC = SC + area*insect*price_insect
	SC = SC + area*otreat*price_otreat
	m = LEN (fertilization)
	j = 0
	while j < m then begin '{'
		fertilizer = GET (fertilization, j)
		cost = IF_ERROR (GET (fertilizer, 'cost'); 0)
		SC = SC + area*cost
		j = j + 1
	'}' end
	areas = areas + area
	yields = yields + yield
	i = i + 1
'}' end
n = LEN (electricity)
i = 0
while i < n then begin '{'
	row = GET (electricity, i)
	amount = IF_ERROR (GET (row, 'amount'); 0)
	price = IF_ERROR (GET (row, 'price'); 0)
	SC = SC + amount*price
	i = i + 1
'}' end
n = LEN (energy)
i = 0
while i < n then begin '{'
	row = GET (energy, i)
	amount = IF_ERROR (GET (row, 'amount'); 0)
	price = IF_ERROR (GET (row, 'price'); 0)
	SC = SC + amount*price
	i = i + 1
'}' end
n = LEN (biomass)
i = 0
while i < n then begin '{'
	row = GET (biomass, i)
	amount = IF_ERROR (GET (row, 'amount'); 0)
	price = IF_ERROR (GET (row, 'price'); 0)
	SC = SC + amount*price
	i = i + 1
'}' end
n = LEN (fuels)
i = 0
while i < n then begin '{'
	row = GET (fuels, i)
	amount = IF_ERROR (GET (row, 'amount'); 0)
	price = IF_ERROR (GET (row, 'price'); 0)
	SC = SC + amount*price
	i = i + 1
'}' end

TGV = CI + TWI + LI
TDC = SC + OCS
GM = TGV - TDC
OI = GM - (HWC + MWC)
UCP = IF (yields <> 0 && areas <> 0; TDC/(yields*areas); 0)
GMH = IF (areas <> 0; GM/areas; 0)
UGM = IF (yields <> 0 && areas <> 0; GM/(yields*areas); 0)
CPH = IF (areas <> 0; TDC/areas; 0)