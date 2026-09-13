#!/bin/bash
# 发布新版本：版本号最后一位 +1，提交、打标签、创建 GitHub Release 并上传附件
# 用法: bash tools/bump-release.sh "更新说明（支持 \n 换行）"
# 前提: 工作区干净（本次更新的代码改动已先行提交）
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="zwjdujin/edgeever-rili"
NOTES="${1:-Bug 修复与优化}"

# 0. 工作区必须干净
if [ -n "$(git status --porcelain)" ]; then
  echo "错误：工作区有未提交的改动。请先提交本次更新的代码，再运行本脚本发布版本。"
  git status --short
  exit 1
fi

# 1. 版本号最后一位 +1（v1.0.0 -> v1.0.1 -> v1.0.2 ...）
OLD_VERSION=$(node -p "JSON.parse(require('fs').readFileSync('manifest.json','utf8')).version")
NEW_VERSION=$(node -p "const [maj,min,pat] = String(process.argv[1]).split('.').map(Number); [maj, min, pat + 1].join('.')" "$OLD_VERSION")
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('manifest.json','utf8'));m.version=process.argv[1];fs.writeFileSync('manifest.json', JSON.stringify(m,null,2)+'\n')" "$NEW_VERSION"
echo "版本: $OLD_VERSION -> $NEW_VERSION"

# 2. 提交 + 打标签 + 推送
git add manifest.json
git commit -m "Release v$NEW_VERSION

$NOTES"
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION"
git push origin HEAD
git push origin "v$NEW_VERSION"

# 3. 取本地 git 凭证管理器中的 token（仅用于本次 API 调用，不落盘）
TOKEN=$(printf "protocol=https\nhost=github.com\n" | git credential fill | grep '^password=' | cut -d= -f2)

# 4. 构建 Release JSON（写 UTF-8 文件，规避 Windows Git Bash 内联中文 JSON 解析失败）
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('manifest.json','utf8'));fs.writeFileSync('release-body.json', JSON.stringify({tag_name:'v'+m.version, target_commitish:'master', name:m.name+' v'+m.version, body:process.argv[1], draft:false, prerelease:false},null,2))" "$NOTES"

# 5. 创建 Release（已存在则复用）
RESP=$(curl -s -X POST -H "Authorization: token $TOKEN" -H "Content-Type: application/json; charset=utf-8" --data-binary @release-body.json "https://api.github.com/repos/$REPO/releases")
RELEASE_ID=$(echo "$RESP" | grep -m1 '"id"' | grep -o '[0-9]*' || true)
if [ -z "$RELEASE_ID" ]; then
  RELEASE_ID=$(curl -s -H "Authorization: token $TOKEN" "https://api.github.com/repos/$REPO/releases/tags/v$NEW_VERSION" | grep -m1 '"id"' | grep -o '[0-9]*')
fi
echo "Release id: $RELEASE_ID"

# 6. 上传附件（安装器从附件下载）
upload() {
  curl -s -X POST -H "Authorization: token $TOKEN" -H "Content-Type: $2" --data-binary @"$1" "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=$1" > /dev/null
  echo "已上传 $1"
}
upload main.js application/javascript
upload manifest.json application/json

# 7. 验证（未认证视角，模拟安装器）+ 清理临时文件
sleep 2
rm -f release-body.json
echo "--- 验证 Release v$NEW_VERSION ---"
curl -s "https://api.github.com/repos/$REPO/releases/tags/v$NEW_VERSION" | grep -oE '"tag_name": *"[^"]*"|"browser_download_url": *"[^"]*"'
