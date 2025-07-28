# GoAdventureGo Server Fixer - PowerShell Version
# Usage: .\fix-server.ps1

Write-Host "🔍 GoAdventureGo Server Diagnostics" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connections = netstat -ano | Select-String ":$Port "
    return $connections.Count -gt 0
}

# Function to kill process on port
function Kill-PortProcess {
    param([int]$Port)
    Write-Host "🧹 Killing processes on port $Port..." -ForegroundColor Yellow
    $processes = netstat -ano | Select-String ":$Port " | ForEach-Object {
        $fields = $_ -split '\s+'
        $fields[-1]
    } | Sort-Object -Unique
    
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Killed process $pid" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not kill process $pid" -ForegroundColor Yellow
        }
    }
}

# Function to test if server is responding
function Test-ServerResponse {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Function to open browser
function Open-Browser {
    param([string]$Url)
    try {
        Start-Process $Url
        Write-Host "🌐 Opened browser at: $Url" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not open browser automatically. Please open: $Url" -ForegroundColor Red
    }
}

# Main execution
$commonPorts = @(3000, 5173, 8080, 3001, 4000)

# 1. Check for existing servers
Write-Host "1️⃣  Checking for running servers..." -ForegroundColor Cyan

$foundServer = $null
foreach ($port in $commonPorts) {
    if (Test-Port $port) {
        $url = "http://localhost:$port/"
        $isResponding = Test-ServerResponse $url
        
        if ($isResponding) {
            Write-Host "✅ Found working server on port $port" -ForegroundColor Green
            Write-Host "🎉 Opening browser at: $url" -ForegroundColor Green
            Open-Browser $url
            exit 0
        } else {
            Write-Host "⚠️  Found unresponsive server on port $port" -ForegroundColor Yellow
            Kill-PortProcess $port
        }
    }
}

# 2. Check if package.json exists
Write-Host ""
Write-Host "2️⃣  Checking project configuration..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Make sure you're in the project directory." -ForegroundColor Red
    exit 1
}

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$scripts = $packageJson.scripts

# 3. Determine the correct command
$devCommand = "npm run dev"
if ($scripts.dev) {
    $devCommand = "npm run dev"
} elseif ($scripts.start) {
    $devCommand = "npm start"
} else {
    Write-Host "⚠️  No dev or start script found in package.json" -ForegroundColor Yellow
}

Write-Host "🔧 Using command: $devCommand" -ForegroundColor Cyan

# 4. Kill any processes on common ports
Write-Host ""
Write-Host "3️⃣  Clearing common ports..." -ForegroundColor Cyan
foreach ($port in $commonPorts) {
    if (Test-Port $port) {
        Kill-PortProcess $port
    }
}

# Wait for ports to clear
Start-Sleep -Seconds 2

# 5. Start the server
Write-Host ""
Write-Host "4️⃣  Starting development server..." -ForegroundColor Cyan
Write-Host "🚀 Running: $devCommand" -ForegroundColor Yellow

try {
    # Start the server process
    $process = Start-Process -FilePath "cmd" -ArgumentList "/c", $devCommand -PassThru -WindowStyle Hidden
    
    # Wait for server to start
    Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    
    # Check if server is running
    $serverFound = $false
    foreach ($port in $commonPorts) {
        $url = "http://localhost:$port/"
        if (Test-ServerResponse $url) {
            Write-Host ""
            Write-Host "🎉 SUCCESS! Server is running at: $url" -ForegroundColor Green
            Write-Host "🌐 Opening browser..." -ForegroundColor Green
            Open-Browser $url
            $serverFound = $true
            break
        }
    }
    
    if (-not $serverFound) {
        Write-Host ""
        Write-Host "⚠️  Server may still be starting. Please check manually:" -ForegroundColor Yellow
        Write-Host "   http://localhost:3000/" -ForegroundColor White
        Write-Host "   http://localhost:5173/" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Manual troubleshooting steps:" -ForegroundColor Cyan
    Write-Host "1. Run: npm install" -ForegroundColor White
    Write-Host "2. Run: npm run dev" -ForegroundColor White
    Write-Host "3. Check console for error messages" -ForegroundColor White
}

Write-Host ""
Write-Host "💡 If issues persist, try:" -ForegroundColor Cyan
Write-Host "   - Delete node_modules and run 'npm install'" -ForegroundColor White
Write-Host "   - Check if antivirus is blocking the server" -ForegroundColor White
Write-Host "   - Try a different port with 'npm run dev -- --port 3001'" -ForegroundColor White
