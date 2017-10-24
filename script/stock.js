#!/usr/local/bin/node

const http = require('http');

let stocks = 'sh000001,sz399001,sz399006,sh600340,sz002310,sz300355,sh601318,sz300072,sh600519,sz300070';

if(process.argv.length > 2){
  stocks = process.argv[2];
}

const url = `http://sqt.gtimg.cn/utf8/q=${stocks}`;

http.get(url, (res) => { 
	const { statusCode } = res;
	let error;
	if(200 !== statusCode){
		error = new Error(`Request Failed: ${statusCode}`);
	}
	if (error) {
		console.error(error.message);
		res.resume();
		return;
	}
	res.setEncoding('utf8');
	let rawData = '';
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		try {
			procTS(rawData);
		} catch (e){
			console.error(e.message);
		}
	});
}).on('error', (e) => { 
	console.log("Got error: " + e.message); 
});

function procTS(data){
	const items = data.split("\n");
  const list = [];
	items.forEach((row) => {
    if(row){
      list.push(getTCStock(row));
    }
	});
  if(process.argv.length > 2){
    printDetail(list[0]);
  } else {
    printList(list);
  }
}

function getTCStock(str){
	const v = str.split('~');
	const dm = (v[0].split('='))[0].split('_')[1];
	const mz = v[1]; // 名字
	const xj = v[3];  // 现价
  const zs = v[4];  // 昨收
  const jk = v[5];  // 今开
  const cjl = v[6];  // 成交量
  const wp = v[7];  // 外盘
  const np = v[8];  // 内盘
  const pk = {
    b1:[v[9], v[10]],
    b2:[v[11], v[12]],
    b3:[v[13], v[14]],
    b4:[v[15], v[16]],
    b5:[v[17], v[18]],
    s1:[v[19], v[20]],
    s2:[v[21], v[22]],
    s3:[v[23], v[24]],
    s4:[v[25], v[26]],
    s5:[v[27], v[28]]
  }; //盘口
  const zb = v[29].split('|'); //逐笔
  const tm = v[30]; // 更新时间
  const zde = v[31]; // 涨跌额
  const zdf = v[32]; // 涨跌幅
  const zg = v[33]; // 最高
  const zd = v[34]; // 最低
  const cje = v[37]; // 成交额
  const hsl = `${v[38]}%`; // 换手率
  const syl = v[39]; // 市盈率
  const zf = `${v[43]}%`; // 振幅
  const ltsz = v[44]; // 流通市值
  const zsz = v[45]; // 总市值
  const sjl = v[46]; // 市净率
  const ztj = v[47]; // 涨停价
  const dtj = v[48]; // 跌停价
  return {
    dm, mz, xj, zs, jk, cjl, wp, np, pk, zb, tm, zde, zdf, zg, zd, cje, hsl, syl, zf, ltsz, zsz, sjl, ztj, dtj
  };
}

function printList(list){
  list.forEach((v) => {
    console.info(`${v.dm} ${v.mz} ${v.xj} ${v.zde} ${v.zdf} ${v.cje}`);
  });
}

function printDetail(v){
  console.info(`${v.dm} ${v.mz}`);
  console.info(`Open:${v.jk} Yesterday:${v.zs}`);
  console.info(`Max:${v.zg} Min:${v.zd}`);
  console.info(`s5:${v.pk.s5[0]} ${v.pk.s5[1]}`);
  console.info(`s4:${v.pk.s4[0]} ${v.pk.s4[1]}`);
  console.info(`s3:${v.pk.s3[0]} ${v.pk.s3[1]}`);
  console.info(`s2:${v.pk.s2[0]} ${v.pk.s2[1]}`);
  console.info(`s1:${v.pk.s1[0]} ${v.pk.s1[1]}`);
  console.info(`${v.xj}`);
  console.info(`b1:${v.pk.b1[0]} ${v.pk.b1[1]}`);
  console.info(`b2:${v.pk.b2[0]} ${v.pk.b2[1]}`);
  console.info(`b3:${v.pk.b3[0]} ${v.pk.b3[1]}`);
  console.info(`b4:${v.pk.b4[0]} ${v.pk.b4[1]}`);
  console.info(`b5:${v.pk.b5[0]} ${v.pk.b5[1]}`);
  console.info(`Change:${v.zde} ${v.zdf}%`);
  console.info(`HL:${v.ztj} LL:${v.dtj}`);
  console.info(v.zb);
  console.info(v.tm);
}
