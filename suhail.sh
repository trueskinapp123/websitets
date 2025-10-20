cd
cd skin/websitets/
git stash
git pull
npm run build
mv dist ./backend
cd backend
pm2 restart 46


