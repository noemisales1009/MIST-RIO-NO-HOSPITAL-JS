@echo off
chcp 65001 >nul
title Misterio no Hospital JS
cd /d "%~dp0"
node servidor-local.mjs
pause
