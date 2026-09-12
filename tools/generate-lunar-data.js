/**
 * 生成农历数据表供主程序使用
 */

const fs = require('fs');
const path = require('path');

// 农历数据生成逻辑（从 build-lunar-table.js 复制）
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

function meanNewMoon(k) {
  const T = k / 1200;
  return 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.000000150 * T * T * T
    + 0.00000000073 * T * T * T * T;
}

function newMoon(k) {
  const c_ = (k - 1) / 1200, T = k / 1200;
  const E = -0.00033 - 0.0007884 * c_ - 0.0000117 * c_ * c_;
  const A1 = 0.07732 + 0.00111907 * c_ - 0.00000712 * c_ * c_, B1 = -0.00047 - 0.00039309 * c_ - 0.00000149 * c_ * c_;
  const A2 = 0.00289 + 0.00024615 * c_ - 0.00000539 * c_ * c_, B2 = 0.00569 - 0.0007784 * c_ + 0.00000306 * c_ * c_;
  const A3 = 0.00289 - 0.0000276 * c_ - 0.00000490 * c_ * c_, B3 = -0.00806 + 0.0005679 * c_ - 0.00000770 * c_ * c_;
  const A4 = 0.00065 - 0.0001134 * c_ - 0.00000221 * c_ * c_, B4 = 0.00041 - 0.0001734 * c_ - 0.00000045 * c_ * c_;
  const W = 0.00306 - 0.0003808 * c_ + 0.00000444 * c_ * c_, W2 = 0.00027 + 0.0005484 * c_ - 0.0000119 * c_ * c_;
  const M  =   2.5534 +  29.10535670 * k - 0.00000141 * T * T - 0.00000011 * T * T * T;
  const Mm = 201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T * T * T - 0.000000058 * T * T * T * T;
  const F  = 160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T * T * T + 0.000000011 * T * T * T * T;
  const Om = 124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T * T * T;
  return meanNewMoon(k) + E
    + (0.3819 + A1 * T - 0.000227 * T * T - 0.00000160 * T * T * T) * sd(Mm)
    + (0.2042 + B1 * T - 0.000160 * T * T - 0.00000126 * T * T * T) * sd(2 * Mm)
    + (0.1806 - 0.000127 * T * T - 0.00000100 * T * T * T) * sd(3 * Mm)
    + (0.1026 - 0.000082 * T * T - 0.00000060 * T * T * T) * sd(4 * Mm)
    + 0.0728 * sd(2 * F - 2 * Om) + 0.0627 * sd(2 * F) + 0.0548 * sd(2 * F - 2 * Om + Mm)
    + 0.0462 * sd(2 * F + Mm) + 0.0416 * sd(2 * F - 2 * Om - Mm) + 0.0336 * sd(2 * F - Om)
    + 0.0335 * sd(2 * F - 2 * Om + 2 * Mm) + 0.0307 * sd(2 * F - 2 * Om - 2 * Mm)
    + 0.0304 * sd(2 * F - 2 * Om + M) + 0.0282 * sd(2 * F + M) + 0.0262 * sd(2 * F - M)
    + 0.0249 * sd(2 * F - 2 * Om - M) + 0.0229 * sd(2 * F + 2 * Om - 2 * Mm) + 0.0199 * sd(2 * F + Om)
    + 0.0179 * sd(2 * F + 2 * Om - Mm) + 0.0172 * sd(2 * F + 2 * Om + Mm)
    + 0.0164 * sd(2 * F - 2 * Om + M + 2 * Mm) + 0.0134 * sd(2 * F - Om - Mm)
    + 0.0130 * sd(2 * F - 2 * Om + 2 * M) + 0.0119 * sd(2 * F + 2 * Om + 2 * Mm)
    + 0.0110 * sd(2 * F + 2 * Om - Mm) + 0.0085 * sd(2 * F - 2 * Om - 2 * M)
    + 0.0081 * sd(2 * F - 2 * Om + M - Mm) + 0.0075 * sd(2 * F + 2 * Om - 2 * Mm + M)
    + 0.0066 * sd(2 * F - 2 * Om + M + Mm) + 0.0064 * sd(2 * F + 2 * Om + M - 2 * Mm)
    + 0.0055 * sd(2 * F + 2 * Om - M - Mm) + 0.0047 * sd(2 * F - 2 * Om + 2 * M - Mm)
    + 0.0042 * sd(2 * F + 2 * Om + M - Mm) + 0.0039 * sd(2 * F + 2 * Om - M - 2 * Mm)
    + 0.0038 * sd(2 * F + 2 * Om + 2 * M - 2 * Mm) + 0.0034 * sd(2 * F - 2 * Om - M + 2 * Mm)
    + 0.0033 * sd(2 * F + 2 * Om + Mm - M) + 0.0030 * sd(2 * F - 2 * Om + 2 * M + Mm)
    + 0.0027 * sd(2 * F + 2 * Om + 2 * Mm - M) + 0.0026 * sd(2 * F + 2 * Om + Mm)
    + W * sd(5 * Mm - 2 * F + 2 * Om) + W2 * sd(Mm - 2 * F + 2 * Om);
}

function sunLambda(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sd(M)
    + (0.019993 - 0.000101 * T) * sd(2 * M) + 0.000289 * sd(3 * M);
  const Omega = 125.04 - 1934.136 * T;
  return ((L0 + C - 0.00056 - 0.000319 * sd(Omega)) % 360 + 360) % 360;
}

function solarTermsInRange(jd0, jd1) {
  const base = Array.from({ length: 24 }, (_, i) => ((i - 3) % 24 + 24) % 24 * 15);
  const out = [];
  let j = jd0 - 1, last = sunLambda(j);
  let probe = last;
  for (let jd = jd0; jd <= jd1; jd++) {
    let v = sunLambda(jd);
    if (v < probe) v += 360;
    probe = v;
  }
  const targets = [];
  for (const b of base) for (let t = b; t <= probe + 360; t += 360) targets.push(t);
  for (let jd = jd0; jd <= jd1; jd++) {
    let v = sunLambda(jd);
    if (v < last) v += 360;
    for (const t of targets) {
      const a = last - t, b = v - t;
      if (a * b <= 0 && !(a === 0 && b === 0)) {
        const day = Math.round(j + a / (a - b || 1));
        if (!out.some((o) => Math.round(o.jd) === day)) out.push({ idx: base.indexOf(t % 360), jd: j + a / (a - b || 1) });
      }
    }
    last = v; j = jd;
  }
  return out;
}

const DONGZHI = 21;

function build(years) {
  const loY = years[0] - 1, hiY = years[years.length - 1] + 1;
  const k0 = Math.ceil((g2jd(loY, 1, 15) - 2451550.09766) / 29.530588861) - 2;
  const k1 = Math.floor((g2jd(hiY, 3, 15) - 2451550.09766) / 29.530588861) + 2;
  const moons = [];
  for (let k = k0; k <= k1; k++) moons.push(Math.floor(newMoon(k) + 0.5) - 0.5);
  const terms = solarTermsInRange(g2jd(loY, 1, 1) - 5, g2jd(hiY + 1, 1, 15) + 5);
  const months = [];
  for (let i = 0; i < moons.length - 1; i++) {
    const start = moons[i], end = moons[i + 1];
    const qi = terms.find((t) => t.jd >= start && t.jd < end && t.idx % 2 === 1);
    months.push({ start, qiIdx: qi ? qi.idx : -1 });
  }
  months.forEach((m, i) => {
    if (m.qiIdx < 0) {
      m.leap = true;
      const prev = months[i - 1];
      if (prev && !prev.leap) m.num = prev.num;
      else m.num = 0;
    } else {
      const num = ((m.qiIdx - 1) / 2 + 1) % 12 || 12;
      m.num = num;
    }
  });
  const solstices = terms.filter((t) => t.idx === DONGZHI);
  const blocks = [];
  for (let b = 0; b < solstices.length - 1; b++) {
    const t0 = solstices[b], t1 = solstices[b + 1];
    const tag = jd2g(t0.jd).y;
    const startIdx = months.findIndex((m) => m.start <= t0.jd && t0.jd < m.start + 32);
    const endIdx = months.findIndex((m) => m.start <= t1.jd && t1.jd < m.start + 32);
    if (startIdx >= 0 && endIdx >= 0 && startIdx < endIdx) {
      for (let i = startIdx; i < endIdx; i++) months[i].year = tag;
      blocks.push({ year: tag, months: months.slice(startIdx, endIdx) });
    }
  }
  return blocks;
}

// 生成 1900-2100 年的农历数据
function generateLunarData() {
  const years = [...Array(201).keys()].map((i) => i + 1900);
  const blocks = build(years);
  const byYear = {};
  blocks.forEach((b) => { byYear[b.year] = b; });

  const Y = [], M1 = [];
  for (let i = 0; i < 201; i++) {
    const y = 1900 + i, b = byYear[y], next = byYear[y + 1];
    
    // 检查数据是否存在
    if (!b || !b.months) {
      console.log(`Missing data for year ${y}`);
      Y.push(0); // 默认值
      M1.push(2451545); // 默认值
      continue;
    }
    
    const first = b.months.find((m) => m.num === 1);
    const nextFirst = next ? next.months.find((m) => m.num === 1) : null;
    const ordered = [];
    for (let n = 1; n <= 12; n++) {
      const leap = b.months.find((m) => m.num === n && m.leap);
      const reg = b.months.find((m) => m.num === n && !m.leap);
      if (leap) ordered.push(leap);
      if (reg) ordered.push(reg);
    }
    let code = 0, leapNum = 0, leapBig = 0;
    ordered.forEach((m, k) => {
      const days = Math.round((ordered[k + 1] ? ordered[k + 1].start : nextFirst ? nextFirst.start : first.start + 354) - m.start);
      if (m.leap) { leapNum = m.num; if (days === 30) leapBig = 1; }
      else code |= (days === 30 ? 1 : 0) << (m.num - 1);
    });
    Y.push(code | (leapNum << 13) | (leapBig << 17));
    M1.push(Math.round(first.start));
  }
  return { Y, M1, byYear };
}

// 生成数据并保存
const lunarData = generateLunarData();

const output = `
// 农历数据 (1900-2100)
const LUNAR_YEARS = [${lunarData.Y.join(',')}];
const LUNAR_M1 = [${lunarData.M1.join(',')}];

// 农历转换函数
function solarToLunar(date) {
  const jd = g2jd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const offset = jd - LUNAR_M1[0];
  
  let yearIdx = 0;
  for (let i = 0; i < LUNAR_YEARS.length; i++) {
    if (jd >= LUNAR_M1[i] && (i === LUNAR_YEARS.length - 1 || jd < LUNAR_M1[i + 1])) {
      yearIdx = i;
      break;
    }
  }
  
  const year = 1900 + yearIdx;
  const lunarYear = LUNAR_YEARS[yearIdx];
  const isLeapMonth = (lunarYear >> 13) & 1;
  const leapMonth = (lunarYear >> 13) & 0xf;
  const isLeapBig = (lunarYear >> 17) & 1;
  
  let month = 1, day = 1;
  let currentDay = offset;
  
  for (let m = 1; m <= 12; m++) {
    const isBig = (lunarYear >> (m - 1)) & 1;
    const monthDays = isBig ? 30 : 29;
    
    if (currentDay < monthDays) {
      month = m;
      day = currentDay + 1;
      break;
    }
    currentDay -= monthDays;
  }
  
  return {
    year,
    month,
    day,
    isLeap: month === leapMonth,
    isLeapBig
  };
}

module.exports = { LUNAR_YEARS, LUNAR_M1, solarToLunar };
`;

fs.writeFileSync(path.join(__dirname, 'lunar-data.js'), output);
console.log('农历数据生成完成: lunar-data.js');