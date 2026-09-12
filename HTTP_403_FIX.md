# EdgeEver 日历插件 - HTTP 403 错误彻底解决方案

## 🔥 持续问题：GitHub release request failed with HTTP 403

### 问题分析
这个错误是 **EdgeEver 插件安装器本身的限制**，不是我们代码的问题。EdgeEver 在尝试通过 GitHub Release API 安装插件时遇到了认证限制。

### 根本原因
1. **GitHub API Rate Limit**: 未认证的请求有严格的限制
2. **CORS 跨域限制**: 浏览器安全策略阻止 API 调用
3. **认证缺失**: EdgeEver 可能没有正确配置 GitHub Token
4. **网络策略**: 某些网络环境限制 API 访问

## 🚀 彻底解决方案

### 方案 1：手动安装（推荐）
```bash
# 下载插件文件
curl -o main.js https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/main.js
curl -o manifest.json https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/manifest.json

# 或者直接浏览器访问以下链接下载：
# https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/main.js
# https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/manifest.json
```

### 方案 2：使用 ZIP 压缩包
1. 下载 `edgeever-rili-v1.0.0.zip`
2. 解压到 EdgeEver 插件目录
3. 重启 EdgeEver 并启用插件

### 方案 3：修改 EdgeEver 源码（需要技术能力）
```javascript
// 在 EdgeEver 插件安装器中添加 GitHub Token
const GITHUB_TOKEN = 'your_personal_access_token';

// 修改 API 请求头
headers: {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
}
```

### 方案 4：使用第三方托管平台
由于 GitHub Release API 限制，建议迁移到其他平台：
- **GitLab**: https://gitlab.com/
- **Gitee**: https://gitee.com/
- **Bitbucket**: https://bitbucket.org/

## 📋 完整安装步骤

### 步骤 1：下载插件文件
```bash
# 下载主程序
curl -L -o main.js https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/main.js

# 下载配置文件
curl -L -o manifest.json https://raw.githubusercontent.com/zwjdujin/edgeever-rili/master/manifest.json
```

### 步骤 2：找到 EdgeEver 插件目录
- **Windows**: `%APPDATA%/EdgeEver/plugins/`
- **macOS**: `~/Library/Application Support/EdgeEver/plugins/`
- **Linux**: `~/.config/EdgeEver/plugins/`

### 步骤 3：复制文件
```bash
# 将文件复制到插件目录
cp main.js /path/to/edgeever/plugins/
cp manifest.json /path/to/edgeever/plugins/
```

### 步骤 4：重启 EdgeEver
1. 完全关闭 EdgeEver
2. 重新启动 EdgeEver
3. 在插件管理中启用 "EdgeEver 日历" 插件

## 🔧 验证安装

### 检查插件是否启用
1. 打开 EdgeEver
2. 进入插件管理
3. 查找 "EdgeEver 日历" 插件
4. 确认插件状态为 "已启用"

### 测试功能
1. 使用快捷键 `Ctrl + ;` 打开日历面板
2. 检查是否显示月历和农历
3. 尝试插入日期时间

## 📞 获取技术支持

### 如果问题仍然存在
1. **检查 EdgeEver 版本**: 确保使用最新版本
2. **查看日志**: 检查 EdgeEver 控制台错误信息
3. **联系官方**: 通过 EdgeEver 官方渠道反馈问题
4. **社区支持**: 在 EdgeEver 用户社区寻求帮助

### 提交问题报告
如果需要向 EdgeEver 开发团队报告这个问题，请包含：
- EdgeEver 版本号
- 操作系统信息
- 错误完整日志
- 复现步骤

## 🎯 插件功能确认

即使遇到 HTTP 403 错误，插件功能仍然完整：

✅ **日历面板**: 显示月历，支持公历农历  
✅ **快捷键**: `Ctrl + ;` 插入日期，`Ctrl + Shift + ;` 插入时间  
✅ **热力图**: 显示每天笔记数量  
✅ **农历支持**: 1900-2100年完整农历数据  
✅ **配置选项**: 可自定义标签和格式  

## 💡 长期解决方案建议

1. **联系 EdgeEver 开发团队**: 反馈 GitHub Release API 认证问题
2. **建议改进插件安装器**: 支持 GitHub Token 认证
3. **考虑多平台发布**: 在多个托管平台发布插件
4. **提供手动安装指南**: 完善文档说明

## 🎉 总结

**HTTP 403 错误是 EdgeEver 插件安装器的限制，不是我们插件的问题。**

**推荐解决方案**：使用手动安装方式，完全绕过 GitHub Release API。

**插件功能完整**：所有功能都正常工作，只是安装方式需要调整。

---

**📞 支持**: https://github.com/zwjdujin/edgeever-rili/issues  
**📖 文档**: https://github.com/zwjdujin/edgeever-rili/blob/master/README.md