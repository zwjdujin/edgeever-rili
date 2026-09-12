#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 EdgeEver 日历插件 Release 状态检查');
console.log('=====================================');

// 检查文件是否存在
const files = [
  'main.js',
  'manifest.json', 
  'README.md',
  'tools/generate-lunar-data.js',
  'tools/lunar-data.js'
];

console.log('📁 文件检查:');
files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 检查 Git 状态
const { execSync } = require('child_process');
try {
  const tags = execSync('git tag -l', { encoding: 'utf8' });
  const remoteTags = execSync('git ls-remote --tags origin', { encoding: 'utf8' });
  
  console.log('\n🏷️ 标签检查:');
  console.log(`  本地标签: ${tags.includes('v1.0.0') ? '✅ v1.0.0' : '❌ v1.0.0'}`);
  console.log(`  远程标签: ${remoteTags.includes('v1.0.0') ? '✅ v1.0.0' : '❌ v1.0.0'}`);
} catch (error) {
  console.log('❌ Git 检查失败:', error.message);
}

console.log('\n🔗 GitHub Release 链接:');
console.log('  https://github.com/zwjdujin/edgeever-rili/releases/tag/v1.0.0');
console.log('  https://github.com/zwjdujin/edgeever-rili/releases');

console.log('\n💡 提示:');
console.log('  如果 Release 页面尚未显示，请稍等几分钟 GitHub 自动创建。');
console.log('  或者直接访问上述链接查看 Release 状态。');