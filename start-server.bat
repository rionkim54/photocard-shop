@echo off
cd /d "c:\Users\defi\Documents\GitHub\photocard-shop"
echo K-STORM 서버 시작 중...
npx pm2 delete kstorm >nul 2>&1
node node_modules/next/dist/bin/next start -H 0.0.0.0 -p 3000
