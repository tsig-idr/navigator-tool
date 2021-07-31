FADN = STD_CSV2ARRAY (CONCAT ('sheetscript/E2/', 'FADN.csv'))

2_ = region
3_ = tf8_grouping
4_ = economic_size
farm = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

n = LEN (FADN)
i = 0
while i < n then begin '{'
	row = GET (FADN, i)
	farm = IF (2_ == GET (row, 2) && 3_ == GET (row, 3) && 4_ == GET (row, 4); row; farm)
	i = i + 1
'}' end

SE010 = GET (farm, 5)
SE025 = GET (farm, 6)
SE080 = GET (farm, 7)
SE131 = GET (farm, 8)
SE132 = GET (farm, 9)
SE135 = GET (farm, 10)
SE136 = GET (farm, 11)
SE206 = GET (farm, 12)
SE270 = GET (farm, 13)
SE281 = GET (farm, 14)
SE284 = GET (farm, 15)
SE285 = GET (farm, 16)
SE295 = GET (farm, 17)
SE300 = GET (farm, 18)
SE305 = GET (farm, 19)
SE309 = GET (farm, 20)
SE345 = GET (farm, 21)
SE410 = GET (farm, 22)
SE415 = GET (farm, 23)
SE425 = GET (farm, 24)
SE605 = GET (farm, 25)