#!/usr/local/bin/node

const http = require('http');

let stocks = [
  'sh000001',
  'sz399001',
  'sz399006',

  'sh601318',
  'sh600036',
  'sz000001',
  'sz002142',
  'sh600519',
  'sz000858',
  'sz000568',
  'sh600809',
  'sz000596',
  'sh603288',
  'sh600872',
  'sh603027',
  'sh600305',
  'sh603259',
  'sz300347',
  'sz002821',
  'sh600763',
  'sz300015',
  'sz300760',
  'sz300529',
  'sz300595',
  'sz002463',
  'sz002916',
  'sh600183',
  'sz002475',
  'sz300735',
  'sz000063',
  'sh603444',
  'sz300699',
  'sz002352',
  'sh600346',
  'sz002001',
  'sh603605',
  'sz002511',
  'sh601888',
  'sz300144',
  'sh603939',
  'sz000529',
  'sz003882',
  'sz003127',
  'sz300759',
  'sz300725',

  'sh603658',
  'sh600009',
  'sz000333',
  'sz000651',
  'sz000002',
  'sz002607',
  'sz300003',
  'sh603233',
  'sh603883',
  'sh600436',
  'sz000661',
  'sz300122',
  'sz300357',
  'sz300146',
  'sz300012',
  'sh603899',
  'sz002372',
  'sz300783',
  'sz002557',
  'sz002695',
  'sz002507',
  'sh603517',
  'sz002415',
  'sh600585',
  'sh600309',
  'sh600031',
  'sz002008',
  'sz300776',
  'sh601012',
  'sz300034',
  'sz300638',
  'sz300782',
  'sz002384',
  'sz000049',
  'sh603236',
  'sh603160',
  'sz300628',
  'sz000977',
  'sh600570',
  'sz002120',
  'sz000338',
  
];
stocks = stocks.join(',');
if(process.argv.length > 2){
  stocks = process.argv[2];
}

const url = `http://sqt.gtimg.cn/utf8/q=${stocks}`;
///////////////////
const perurl = `https://tc.xueqiu.com/tc/snowx//MONI/performances.json?gid=3100348639198801`;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
//////////////////////////////////

(async () => {
  try {
    procTS(await request(url));
    //let dt = await request(perurl);
    //dt = JSON.parse(dt);
    //console.log(dt);
  } catch (e){
    console.error(e.message);
  }
})();

function request(options) {
  return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
          const { statusCode } = res;
          let error;
          if(200 !== statusCode){
            error = new Error(`Request Failed: ${statusCode}`);
          }
          if (error) {
            console.error(error.message);
            res.resume();
            reject(error);
            return;
          }
          res.setEncoding('utf8');
          let ret = '';
          res.on('data', buffer => { ret += buffer.toString() });
          res.on('end', () => resolve(ret));
      });
      req.on('error', (e) => reject(e));
      req.end();
  });
};

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
  console.info(`PE:${v.syl} PB:${v.sjl}`);
  console.info(v.zb);
  console.info(v.tm);
}
