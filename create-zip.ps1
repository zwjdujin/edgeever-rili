# EdgeEver 日历插件 v1.0.0 ZIP 压缩脚本
Write-Host "🗜️ 创建 EdgeEver 日历插件 v1.0.0 ZIP 压缩包..." -ForegroundColor Green

# 创建 ZIP 文件
Compress-Archive -Path "main.js", "manifest.json" -DestinationPath "edgeever-rili-v1.0.0.zip" -Force

Write-Host "✅ ZIP 压缩包创建完成: edgeever-rili-v1.0.0.zip" -ForegroundColor Green
Write-Host "📦 包含文件:" -ForegroundColor Yellow
Write-Host "  - main.js (主程序)" -ForegroundColor White
Write-Host "  - manifest.json (配置文件)" -ForegroundColor White
Write-Host ""
Write-Host "📥 使用方法:" -ForegroundColor Cyan
Write-Host "  1. 下载 edgeever-rili-v1.0.0.zip 文件" -ForegroundColor White
Write-Host "  2. 解压到 EdgeEver 插件目录" -ForegroundColor White
Write-Host "  3. 重启 EdgeEver 并启用插件" -ForegroundColor White