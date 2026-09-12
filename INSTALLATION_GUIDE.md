# EdgeEver 日历插件 v1.0.0 - 安装指南

## 🚀 快速安装

### 方法一：直接下载（推荐）

1. **访问下载页面**：
   https://github.com/zwjdujin/edgeever-rili/blob/master/DOWNLOAD.md

2. **下载文件**：
   - `main.js` (主程序文件)
   - `manifest.json` (插件配置文件)

3. **安装插件**：
   - 将两个文件复制到 EdgeEver 的插件目录
   - 重启 EdgeEver
   - 在插件管理中启用 "EdgeEver 日历" 插件

### 方法二：命令行下载

```bash
# 下载主程序文件
curl -o main.js https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/main.js

# 下载配置文件
curl -o manifest.json https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/manifest.json
```

## ⚠️ 问题解决

### GitHub Release HTTP 403 错误

**问题**：`GitHub release request failed with HTTP 403`

**原因**：GitHub API 认证限制

**解决方案**：使用直接文件下载方式，避开 GitHub Release API

### 下载链接

- **主仓库**：https://github.com/zwjdujin/edgeever-rili
- **下载页面**：https://github.com/zwjdujin/edgeever-rili/blob/master/DOWNLOAD.md
- **Raw 文件访问**：
  - main.js: https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/main.js
  - manifest.json: https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/manifest.json

## 🎯 插件功能

### 日历面板
- 显示当月月历，包含公历和农历日期
- 每个日期显示当天笔记数量（热力图）
- 支持年份和月份切换
- 显示当月笔记列表

### 快捷键
- `Ctrl + ;` - 插入当前日期
- `Ctrl + Shift + ;` - 插入当前时间

### 农历支持
- 完整农历数据（1900-2100年）
- 显示农历月份和日期
- 支持闰月显示

### 热力图
- 无笔记：灰色
- 少量笔记：浅绿色
- 中等笔记：绿色
- 大量笔记：深绿色

## 🔧 配置选项

在 EdgeEver 设置中可以调整：

- **日历标签**：带有此标签的笔记会在日历中显示（默认："日历"）
- **日期格式**：插入日期的格式（默认："YYYY-MM-DD"）
- **时间格式**：插入时间的格式（默认："YYYY-MM-DD HH:mm"）

## 📝 支持格式

### 日期格式
- `YYYY-MM-DD` → 2024-03-15
- `MM/DD/DD` → 03/15/24
- `DD MM YYYY` → 15 03 2024

### 时间格式
- `YYYY-MM-DD HH:mm` → 2024-03-15 14:30
- `MM/DD/DD HH:mm` → 03/15/24 14:30

## 📞 支持

- **GitHub Issues**：https://github.com/zwjdujin/edgeever-rili/issues
- **文档**：https://github.com/zwjdujin/edgeever-rili/blob/master/README.md
- **下载**：https://github.com/zwjdujin/edgeever-rili/blob/master/DOWNLOAD.md

## 🎉 总结

遇到 GitHub Release HTTP 403 错误时，使用直接文件下载方式是最可靠的解决方案。这种方法：

✅ 避开 GitHub API 认证限制  
✅ 提供稳定的文件访问  
✅ 支持浏览器和命令行下载  
✅ 无需等待 Release 页面创建  

**安装完成！享受 EdgeEver 日历插件带来的便利吧！** 🎊