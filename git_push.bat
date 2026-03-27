@echo off
git status
git remote -v
git add .
git reset stitch/
git commit -m "UI enhancements and fixes"
git push origin main
