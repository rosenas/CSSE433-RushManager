start powershell {Set-Location "rush-manager-backend"; npm start}

start powershell {Set-Location "rush-manager-frontend"; npm start}

start powershell {Set-Location "rush-manager-python-backend"; Set-Location "rush-manager-python-backend"; Set-Location "Scripts"; .\Activate.ps1; python .\app.py }