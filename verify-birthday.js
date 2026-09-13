// 生日联动逻辑验证：解析、索引、闰年 2/29 兜底
const fs = require('fs');
const path = require('path');

let src = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
src = src.replace(/export default[\s\S]*$/m, '');
const mod = new Function(src + '; return { parseBirthday, buildBirthdayIndex, birthdaysForDate, isLeapYear };')();
const { parseBirthday, buildBirthdayIndex, birthdaysForDate, isLeapYear } = mod;

let bad = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { console.log(`✗ ${name}: 期望 ${JSON.stringify(want)}, 实际 ${JSON.stringify(got)}`); bad++; }
};

// 解析
check('标准格式', parseBirthday('## 基本信息\n\n- 生日：1990-05-23'), { year: 1990, month: 5, day: 23 });
check('中文日期', parseBirthday('- 生日：1990年5月23日'), { year: 1990, month: 5, day: 23 });
check('斜杠格式', parseBirthday('- 生日：1990/5/23'), { year: 1990, month: 5, day: 23 });
check('无年份', parseBirthday('- 生日：5月23日'), { year: null, month: 5, day: 23 });
check('空值', parseBirthday('- 生日：'), null);
check('非生日内容', parseBirthday('- 电话：13800138000'), null);
check('undefined', parseBirthday(undefined), null);

// 索引与匹配
const index = buildBirthdayIndex([
  { id: 'a', name: '张三', birth: { year: 1990, month: 8, day: 15 } },
  { id: 'b', name: '李四', birth: { year: null, month: 2, day: 29 } },
  { id: 'c', name: '王五', birth: { year: 1985, month: 2, day: 28 } },
]);

const d = (y, m, dd) => new Date(y, m - 1, dd);
check('公历命中', birthdaysForDate(index, d(2026, 8, 15)).map((x) => x.id), ['a']);
check('平年2/28兜底', birthdaysForDate(index, d(2026, 2, 28)).map((x) => x.id), ['c', 'b']);
check('闰年2/28不兜底', birthdaysForDate(index, d(2028, 2, 28)).map((x) => x.id), ['c']);
check('闰年2/29命中', birthdaysForDate(index, d(2028, 2, 29)).map((x) => x.id), ['b']);
check('无生日日期', birthdaysForDate(index, d(2026, 12, 1)), []);

// 平年 2 月只出现一次李四（28 号兜底、29 号不存在）
const count29InLeap = birthdaysForDate(index, d(2028, 2, 28)).filter((x) => x.id === 'b').length
  + birthdaysForDate(index, d(2028, 2, 29)).filter((x) => x.id === 'b').length;
check('闰年不重复', count29InLeap, 1);

console.log(`生日联动验证：${bad} 处不一致`);
if (bad === 0) console.log('✅ 全部通过');
