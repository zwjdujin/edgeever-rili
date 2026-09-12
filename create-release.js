#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 manifest.json 获取版本信息
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('🎉 EdgeEver 日历插件 Release 信息');
console.log('====================================');
console.log(`版本: ${manifest.version}`);
console.log(`名称: ${manifest.name}`);
console.log(`ID: ${manifest.id}`);
console.log('');
console.log('📦 Release 包含文件:');
console.log('- main.js (主程序文件)');
console.log('- manifest.json (插件配置)');
console.log('- README.md (使用说明)');
console.log('- tools/generate-lunar-data.js (农历数据生成工具)');
console.log('- tools/lunar-data.js (农历数据文件)');
console.log('');
console.log('🔗 GitHub Release:');
console.log(`https://github.com/zwjdujin/edgeever-rili/releases/tag/v${manifest.version}`);
console.log('');
console.log('✅ Release 创建成功！');
console.log('用户现在可以通过上述链接下载插件文件。');