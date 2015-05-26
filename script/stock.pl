#!/usr/bin/python
#coding=utf-8
import sys
import urllib
import string	

l = len(sys.argv)
if l>1:
	i = 1;
	while i<l:
                url  = "http://hq.sinajs.cn/list="+sys.argv[i];
                doc = urllib.urlopen(url).read();
                dt = doc.split(',');
                name = dt[0].decode('gbk').encode('utf-8');
                print '%s %s' %(name[13:19], name[21:len(name)])
                print 'Open:%s yesterday:%s' %(dt[1], dt[2])
                print 'max:%s min:%s' %(dt[4], dt[5])
                print 's5:%s %s' %(dt[29], int(dt[28])/100)
                print 's4:%s %s' %(dt[27], int(dt[26])/100)
                print 's3:%s %s' %(dt[25], int(dt[24])/100)
                print 's2:%s %s' %(dt[23], int(dt[22])/100)
                print 's1:%s %s' %(dt[21], int(dt[20])/100)
                print '%s' %(dt[3])		
                print 'b1:%s %s' %(dt[11], int(dt[10])/100)
                print 'b2:%s %s' %(dt[13], int(dt[12])/100)
                print 'b3:%s %s' %(dt[15], int(dt[14])/100)
                print 'b4:%s %s' %(dt[17], int(dt[16])/100)
                print 'b5:%s %s' %(dt[18], int(dt[18])/100)
                print 'change:%s %s%%' %(float(dt[3])-float(dt[2]), round((float(dt[3])-float(dt[2]))*100/float(dt[2]),2) )
                print 'max:%s min:%s' %(dt[4], dt[5])
                print 'HighLimit:%s LowerLimit:%s' %(round(float(dt[2])*1.1,2), round(float(dt[2])*0.9,2))
                print 'VOL:%sHand AMOUNT:%sW' %(float(dt[8])/100, float(dt[9])/10000)
                print '%s %s' %(dt[30], dt[31])
		i+=1;
else:
	url  = "http://hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sh600340,s_sz002310,s_sh600352,s_sh601318,s_sz300072,s_sh600519,s_sh600000,s_sh601699,s_sz300002,s_sz002024,s_sz002437,s_sz002202,s_sh600652"
	data = urllib.urlopen(url).read()
	line = data.split('\n')
	for vv in line:
		aa = vv.split(',');
		if aa[0] :
			name  = aa[0].split('_')[3].replace('"','').replace('=','   ').decode('gbk').encode('utf-8')
			cur   = string.atof(aa[1])
			wave  = string.atof(aa[2])
			per   = string.atof(aa[3])
			money = string.atof(aa[5].replace('";',''))
			print '%s %10.2f %10.2f %10.2f %12d w' %(name, cur, wave, per, money)
	                
