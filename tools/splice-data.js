// 将生成的农历数据表替换 main.js 中的 LUNAR_YEARS / LUNAR_M1
const fs = require('fs');
const path = require('path');

const table = JSON.parse(fs.readFileSync(path.join(__dirname, 'lunar-table.json'), 'utf8'));
let main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

main = main.replace(
  /const LUNAR_YEARS = \[[^\]]*\];/,
  'const LUNAR_YEARS = [' + table.Y.join(',') + '];'
);
main = main.replace(
  /const LUNAR_M1 = \[[^\]]*\];/,
  'const LUNAR_M1 = [' + table.M1.join(',') + '];'
);

fs.writeFileSync(path.join(__dirname, '..', 'main.js'), main);
console.log('已写入 LUNAR_YEARS(' + table.Y.length + ' 项) / LUNAR_M1(' + table.M1.length + ' 项)');
