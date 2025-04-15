Start-Process powershell -ArgumentList "cd api; npm i; npm start" -WindowStyle Normal

Start-Process powershell -ArgumentList "cd frontend; npm i; npm run dev" -WindowStyle Normal