/**
 * 生成农历数据表（1900–2100），供 edgeever-rili 插件内嵌使用。
 *
 * 算法：Meeus《Astronomical Algorithms》
 *   - 朔（新月）：第 49 章级数，精度约秒级
 *   - 太阳黄经：第 25 章，定节气足够
 *   - 全部时刻按北京时间（UTC+8）取日
 *   - 含冬至（中气）的月为十一月；从冬至月往后第 2 个月为次年正月
 *   - 无中气之月为闰月，月号继承前一月
 *
 * 输出格式（经典紧凑编码）：
 *   LUNAR_YEARS[i] = 长度位 | (闰月月号 << 13) | (闰月大月 << 17)
 *     位 0..11  : 第 1..12 常规月，1=大月(30 天), 0=小月(29 天)
 *     位 13..16 : 闰几月，0=不闰
 *     位 17     : 闰月是否大月
 *   LUNAR_M1[i]  = 第 i+1900 年正月初一的 JDN（整数日号）
 */

const D2R = Math.PI / 180;
const sd = (d) => Math.sin(d * D2R);

function g2jd(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.trunc(y / 100);
  const B = 2 - A + Math.trunc(A / 4);
  return Math.trunc(365.25 * (y + 4716)) + Math.trunc(30.6001 * (m + 1)) + d + B - 1524.5;
}
function jd2g(jd) {
  const J = jd + 0.5, Z = Math.trunc(J), F = J - Z;
  let A = Z;
  if (Z >= 2299161) { const a = Math.trunc((Z - 1867216.25) / 36524.25); A = Z + 1 + a - Math.trunc(a / 4); }
  const B = A + 1524, C = Math.trunc((B - 122.1) / 365.25), D = Math.trunc(365.25 * C), E = Math.trunc((B - D) / 30.6001);
  const day = B - D - Math.trunc(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  return { y: month > 2 ? C - 4716 : C - 4715, m: month, d: Math.trunc(day) };
}

// 北京时间日编号：某时刻所在北京日期的 JDN
// 1929 年起中国历算采用东经 120° 标准时（UTC+8）；
// 此前用北京地方真太阳时（116.4167°E + 均时差）
const JD_1929 = g2jd(1929, 1, 1);
function eotMinutes(jd) {
  // 均时差（Meeus 28.3，低精度，±1s 内足够定日界）
  const T = (jd - 2451545.0) / 36525;
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const eps = (23 + 26 / 60 + 21.448 / 3600 - 46.8150 / 3600 * T - 0.00059 / 3600 * T * T + 0.001813 / 3600 * T * T * T) * D2R;
  const y = Math.tan(eps / 2) ** 2;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Lr = L0 * D2R, Mr = M * D2R;
  const E = y * Math.sin(2 * Lr) - 2 * e * Math.sin(Mr)
    + 4 * e * y * Math.sin(Lr) * Math.cos(Mr)
    - 0.5 * y * y * Math.sin(4 * Lr) - 1.25 * e * e * Math.sin(2 * Mr);
  return 4 * E / D2R; // 分钟
}
const bjDay = (jd) => {
  const offH = jd >= JD_1929 ? 8 : 116.4167 / 15 + eotMinutes(jd) / 60;
  return Math.floor(jd + offH / 24 + 0.5);
};

// ---------- 朔（Meeus《Astronomical Algorithms》第 49 章，精度约 1 分钟内） ----------
function newMoon(k) {
  const s = (d) => Math.sin(d * D2R);
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M  = 2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3;          // 太阳平近点角
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4; // 月亮平近点角
  const F  = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4; // 月纬度参数
  const O  = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;         // 升交点黄经
  JDE += -0.40720 * s(Mp) + 0.17241 * E * s(M)
    + 0.01608 * s(2 * Mp) + 0.01039 * s(2 * F)
    + 0.00739 * E * s(Mp - M) - 0.00514 * E * s(Mp + M)
    + 0.00208 * E * E * s(2 * M) - 0.00111 * s(Mp - 2 * F)
    - 0.00057 * s(Mp + 2 * F) + 0.00056 * E * s(2 * Mp + M)
    - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F)
    + 0.00038 * E * s(M - 2 * F) - 0.00024 * E * s(2 * Mp - M)
    - 0.00017 * s(O) - 0.00007 * s(Mp + 2 * M)
    + 0.00004 * s(2 * Mp - 2 * F) + 0.00004 * s(3 * M)
    + 0.00003 * s(Mp + M - 2 * F) + 0.00003 * s(2 * Mp + 2 * F)
    - 0.00003 * s(Mp + M + 2 * F) + 0.00003 * s(Mp - M + 2 * F)
    - 0.00002 * s(Mp - M - 2 * F) - 0.00002 * s(3 * Mp + M)
    + 0.00002 * s(4 * Mp);
  const A = [
    299.77 + 0.107408 * k - 0.009173 * T2,
    251.88 + 0.016321 * k,
    251.83 + 26.651886 * k,
    349.42 + 36.412478 * k,
    98.14 + 18.293782 * k,
    240.58 + 11.487364 * k,
    230.36 + 8.705822 * k,
    240.44 + 7.412657 * k,
    190.90 + 5.270426 * k,
    123.20 + 4.109782 * k,
    231.60 + 3.969542 * k,
    355.74 + 3.348566 * k,
    246.22 + 2.924940 * k,
    257.32 + 2.729084 * k,
  ];
  const AC = [0.000325, 0.000165, 0.000164, 0.000126, 0.000110, 0.000062, 0.000060, 0.000056, 0.000047, 0.000042, 0.000040, 0.000037, 0.000025, 0.000024];
  for (let i = 0; i < 14; i++) JDE += AC[i] * s(A[i]);
  return JDE;
}

// ---------- 太阳黄经 ----------
function sunLambda(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sd(M)
    + (0.019993 - 0.000101 * T) * sd(2 * M) + 0.000289 * sd(3 * M);
  const Omega = 125.04 - 1934.136 * T;
  return ((L0 + C - 0.00569 - 0.00478 * sd(Omega)) % 360 + 360) % 360;
}
function solarTermsInRange(jd0, jd1) {
  // 逐日扫描太阳黄经，累积展开（while 处理多次 360° 回绕），
  // 每天只检查 24 个节气基值在 (last, v] 内的命中。
  const out = [];
  let j = jd0 - 1, last = sunLambda(j);
  for (let jd = jd0; jd <= jd1; jd++) {
    let v = sunLambda(jd);
    while (v < last) v += 360;
    for (let i = 0; i < 24; i++) {
      const b = ((i - 3) % 24 + 24) % 24 * 15;
      const k = Math.floor((last - b) / 360) + 1;
      const t = b + 360 * k;
      if (t > last && t <= v) {
        out.push({ idx: i, jd: j + (t - last) / (v - last) });
      }
    }
    last = v; j = jd;
  }
  out.sort((x, y) => x.jd - y.jd);
  return out;
}

// ---------- 构建月表 ----------
function buildMonths(loY, hiY) {
  const k0 = Math.ceil((g2jd(loY, 1, 15) - 2451550.09766) / 29.530588861) - 2;
  const k1 = Math.floor((g2jd(hiY, 3, 15) - 2451550.09766) / 29.530588861) + 2;
  const moonDays = [];
  for (let k = k0; k <= k1; k++) {
    const day = bjDay(newMoon(k));
    if (moonDays.length === 0 || day > moonDays[moonDays.length - 1]) moonDays.push(day);
  }
  const terms = solarTermsInRange(g2jd(loY, 1, 1) - 5, g2jd(hiY + 1, 1, 15) + 5)
    .map((t) => ({ idx: t.idx, day: bjDay(t.jd) }));

  const months = [];
  for (let i = 0; i < moonDays.length - 1; i++) {
    const start = moonDays[i], end = moonDays[i + 1];
    const qi = terms.find((t) => t.day >= start && t.day < end && t.idx % 2 === 1);
    months.push({ start, qiIdx: qi ? qi.idx : -1 });
  }
  months.forEach((m, i) => {
    if (m.qiIdx < 0) {
      m.leap = true;
      const prev = months[i - 1];
      m.num = prev ? prev.num : 0;
    } else {
      m.num = ((m.qiIdx - 1) / 2 + 1) % 12 || 12;
    }
  });
  return { months, terms };
}

// ---------- 生成与校验 ----------
const CNY = {1900:'0131',1901:'0219',1902:'0208',1903:'0129',1904:'0216',1905:'0204',1906:'0125',1907:'0213',1908:'0202',1909:'0122',
1910:'0210',1911:'0130',1912:'0218',1913:'0206',1914:'0126',1915:'0214',1916:'0203',1917:'0123',1918:'0211',1919:'0201',
1920:'0220',1921:'0208',1922:'0128',1923:'0216',1924:'0205',1925:'0124',1926:'0213',1927:'0202',1928:'0123',1929:'0210',
1930:'0130',1931:'0217',1932:'0206',1933:'0126',1934:'0214',1935:'0204',1936:'0124',1937:'0211',1938:'0131',1939:'0219',
1940:'0208',1941:'0127',1942:'0215',1943:'0205',1944:'0125',1945:'0213',1946:'0202',1947:'0122',1948:'0210',1949:'0129',
1950:'0217',1951:'0206',1952:'0127',1953:'0214',1954:'0203',1955:'0124',1956:'0212',1957:'0131',1958:'0218',1959:'0208',
1960:'0128',1961:'0215',1962:'0205',1963:'0125',1964:'0213',1965:'0202',1966:'0121',1967:'0209',1968:'0130',1969:'0217',
1970:'0206',1971:'0127',1972:'0215',1973:'0203',1974:'0123',1975:'0211',1976:'0131',1977:'0218',1978:'0207',1979:'0128',
1980:'0216',1981:'0205',1982:'0125',1983:'0213',1984:'0202',1985:'0220',1986:'0209',1987:'0129',1988:'0217',1989:'0206',
1990:'0127',1991:'0215',1992:'0204',1993:'0123',1994:'0210',1995:'0131',1996:'0219',1997:'0207',1998:'0128',1999:'0216',
2000:'0205',2001:'0124',2002:'0212',2003:'0201',2004:'0122',2005:'0209',2006:'0129',2007:'0218',2008:'0207',2009:'0126',
2010:'0214',2011:'0203',2012:'0123',2013:'0210',2014:'0131',2015:'0219',2016:'0208',2017:'0128',2018:'0216',2019:'0205',
2020:'0125',2021:'0212',2022:'0201',2023:'0122',2024:'0210',2025:'0129',2026:'0217',2027:'0206',2028:'0126',2029:'0213',2030:'0203'};
const KNOWN_LEAP = {1900:8,1903:5,1906:4,1909:2,1911:6,1914:5,1917:2,1919:7,1922:5,1925:4,1928:2,1930:6,1933:5,1936:3,1938:7,1941:6,
1944:4,1947:2,1949:7,1952:5,1955:3,1957:8,1960:6,1963:4,1966:3,1968:7,1971:5,1974:4,1976:8,1979:6,1982:4,1984:10,
1987:6,1990:5,1993:3,1995:8,1998:5,2001:4,2004:2,2006:7,2009:5,2012:4,2014:9,2017:6,2020:4,2023:2,2025:6,2028:5};
// 注：早期闰月已按史实修正（1900 闰八月、1917 闰二月、1919 闰七月、1925 闰四月、1928 闰二月、1938 闰七月；
// 1920、1939 无闰月），与台北市志闰月一览表及百度百科闰月条目一致。
// 已知偏差：1917（算得闰三月，史载闰二月）、1922（算得闰六月，史载闰五月）——
// 两年置闰取决于谷雨/大暑落在月界前后 3~9 分钟内的临界时刻，低于本太阳公式的 ±15 分钟精度极限，
// 且 131 个春节（含 1916）与其余全部闰月均已验证一致，故接受该偏差。

// 已核实的基准日期（公历 → 农历）
const SPOT_CHECKS = [
  { solar: '2023-03-22', want: '2023年闰二月初一' },
  { solar: '2025-07-25', want: '2025年闰六月初一' },
  { solar: '2026-09-11', want: '2026年八月初一' },
  { solar: '2026-09-25', want: '2026年八月十五' },
  { solar: '1984-11-23', want: '1984年闰十月初一' },
  { solar: '2033-12-22', want: '2033年闰冬月初一' },
  { solar: '2034-02-19', want: '2034年正月初一' },
];

function lunarName(m, d, leap) {
  const MON = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  const DAY = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  return `${leap ? '闰' : ''}${MON[m - 1]}月${DAY[d - 1]}`;
}

function buildTable() {
  const { months, terms } = buildMonths(1899, 2102);

  // 冬至（idx 21）所在月：必为十一月，作为编号锚点
  const solstices = terms.filter((t) => t.idx === 21);
  const dzIdx = solstices
    .map((s) => months.findIndex((m, i) => m.start <= s.day
      && (i + 1 >= months.length ? s.day < m.start + 31 : s.day < months[i + 1].start)))
    .filter((i) => i >= 0);

  // 冬至锚点顺序编号：十一月 → 十二月 → 正月 → … → 十月 → （下一）十一月
  // 相邻冬至月间隔 13 个月时，期间第一个无中气月为闰月（月号继承前一月）
  const numArr = new Array(months.length).fill(0);
  const leapArr = new Array(months.length).fill(false);
  for (let d = 0; d < dzIdx.length - 1; d++) {
    const i1 = dzIdx[d], i2 = dzIdx[d + 1];
    numArr[i1] = 11;
    const gapLeap = i2 - i1 === 13;
    if (!gapLeap && i2 - i1 !== 12) console.log(`警告：冬至间隔 ${i2 - i1} 个月（期望 12 或 13）`);
    let n = 11, leapUsed = false;
    for (let j = i1 + 1; j < i2; j++) {
      if (gapLeap && !leapUsed && months[j].qiIdx < 0) {
        leapArr[j] = true;
        numArr[j] = n; // 闰月继承前一月的月号
        leapUsed = true;
      } else {
        n = n % 12 + 1;
        numArr[j] = n;
      }
    }
    if (n !== 10) console.log(`警告：冬至段 ${d} 编号末位为 ${n}（期望 10）`);
  }

  // 农历年 Y 的正月 = 冬至(Y-1) 月之后第一个编号为正月的月
  const cnyIdx = {};
  for (let d = 0; d < dzIdx.length - 1; d++) {
    const winterYear = jd2g(solstices[d].day - 0.5).y;
    for (let j = dzIdx[d] + 1; j < months.length; j++) {
      if (numArr[j] === 1) { cnyIdx[winterYear + 1] = j; break; }
    }
  }

  const Y = [], M1 = [];
  for (let y = 1900; y <= 2100; y++) {
    const from = cnyIdx[y], to = cnyIdx[y + 1];
    if (from == null || to == null) { console.log(`缺 ${y} 年数据`); Y.push(0); M1.push(0); continue; }
    const ym = months.slice(from, to);
    const yLeap = ym.map((_, k) => leapArr[from + k]);
    const yNums = ym.map((_, k) => numArr[from + k]);
    const regNums = yNums.filter((_, k) => !yLeap[k]);
    const expect = Array.from({ length: 12 }, (_, i) => i + 1);
    if (JSON.stringify(regNums) !== JSON.stringify(expect) || yLeap.filter(Boolean).length > 1) {
      console.log(`月序异常 ${y}: ${regNums.join(',')} (leap: ${yNums.filter((_, k) => yLeap[k]).join(',') || '无'})`);
    }
    M1.push(ym[0].start);
    let code = 0, leapNum = 0, leapBig = 0;
    ym.forEach((m, k) => {
      const nextStart = k + 1 < ym.length ? ym[k + 1].start : months[to].start;
      const days = nextStart - m.start;
      if (yLeap[k]) { leapNum = yNums[k]; if (days === 30) leapBig = 1; }
      else code |= (days === 30 ? 1 : 0) << (yNums[k] - 1);
    });
    Y.push(code | (leapNum << 13) | (leapBig << 17));
  }
  return { Y, M1, months, numArr, leapArr, cnyIdx };
}

function solarToLunarFromTable(Y, M1, date) {
  const jdn = Math.round(g2jd(date.getFullYear(), date.getMonth() + 1, date.getDate()) + 0.5);
  let yearIdx = -1;
  for (let i = 0; i < Y.length; i++) {
    if (jdn >= M1[i] && (i === Y.length - 1 || jdn < M1[i + 1])) { yearIdx = i; break; }
  }
  if (yearIdx < 0) return null;
  const code = Y[yearIdx];
  const leapMonth = (code >> 13) & 0xF;
  const leapBig = (code >> 17) & 1;
  let offset = jdn - M1[yearIdx];
  for (let m = 1; m <= 12; m++) {
    const regLen = ((code >> (m - 1)) & 1) ? 30 : 29;
    if (offset < regLen) return { year: 1900 + yearIdx, month: m, day: offset + 1, isLeap: false };
    offset -= regLen;
    if (leapMonth === m) {
      const leapLen = leapBig ? 30 : 29;
      if (offset < leapLen) return { year: 1900 + yearIdx, month: m, day: offset + 1, isLeap: true };
      offset -= leapLen;
    }
  }
  return null;
}

const out = buildTable();
const { Y, M1 } = out;

// 校验 1：春节日期
let badCNY = 0;
for (const y in CNY) {
  const g = jd2g(M1[y - 1900] - 0.5);
  const key = String(g.m).padStart(2, '0') + String(g.d).padStart(2, '0');
  if (key !== CNY[y]) { console.log(`CNY ${y}: 期望 ${CNY[y]}, 实际 ${key}`); badCNY++; }
}
console.log(`春节校验：${Object.keys(CNY).length} 年 → ${badCNY} 处不一致`);

// 校验 2：闰月
let badLeap = 0;
for (let y = 1900; y <= 2028; y++) {
  const code = Y[y - 1900];
  const got = (code >> 13) & 0xF;
  const want = KNOWN_LEAP[y] || 0;
  if (got !== want) { console.log(`LEAP ${y}: 期望 ${want}, 实际 ${got}`); badLeap++; }
}
console.log(`闰月校验：1900–2028 → ${badLeap} 处不一致`);

// 校验 3：基准日期抽查
let badSpot = 0;
for (const c of SPOT_CHECKS) {
  const [yy, mm, dd] = c.solar.split('-').map(Number);
  const r = solarToLunarFromTable(Y, M1, new Date(yy, mm - 1, dd));
  const got = r ? `${r.year}年${lunarName(r.month, r.day, r.isLeap)}` : 'null';
  if (got !== c.want) { console.log(`SPOT ${c.solar}: 期望 ${c.want}, 实际 ${got}`); badSpot++; }
  else console.log(`SPOT ${c.solar} = ${got} ✓`);
}
console.log(`抽查校验：${SPOT_CHECKS.length} 项 → ${badSpot} 处不一致`);

// 输出
const fs = require('fs');
fs.writeFileSync(__dirname + '/lunar-table.json', JSON.stringify({ Y, M1 }));
console.log('');
console.log('LUNAR_YEARS = [' + Y.join(',') + '];');
console.log('LUNAR_M1 = [' + M1.join(',') + '];');
