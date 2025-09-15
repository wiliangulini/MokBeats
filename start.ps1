$ErrorActionPreference = 'Stop'

# Configurações
$NODE_VERSION = '16.20.2'
$NODE_ZIP = "node-v$NODE_VERSION-win-x64.zip"
$NODE_URL = "https://nodejs.org/dist/v$NODE_VERSION/$NODE_ZIP"
$TOOLS_DIR = Join-Path $PSScriptRoot ".tools"
$NODE_DIR = Join-Path $TOOLS_DIR "node-v$NODE_VERSION-win-x64"

Write-Host "🚀 Iniciando o Sistema MokBeats (Windows) ..." -ForegroundColor Cyan

# Garante pasta de ferramentas locais (sem admin)
New-Item -ItemType Directory -Force -Path $TOOLS_DIR | Out-Null

function Ensure-PortableNode {
  param([string]$NodeDir)

  # Verifica se já existe Node utilizável na sessão e se é compatível (v16)
  $compatible = $false
  $hasNode = $false
  try {
    $nodePath = (Get-Command node -ErrorAction Stop).Path
    $hasNode = $true
    $ver = (& node -v).TrimStart('v')
    $major = [int]($ver.Split('.')[0])
    if ($major -eq 16) { $compatible = $true }
  } catch { $hasNode = $false }

  if (-not $compatible) {
    Write-Host "ℹ️  Instalando Node.js $NODE_VERSION (modo portátil, sem admin)..." -ForegroundColor Yellow
    $zipPath = Join-Path $TOOLS_DIR $NODE_ZIP
    if (-not (Test-Path $NodeDir)) {
      if (-not (Test-Path $zipPath)) {
        Invoke-WebRequest -Uri $NODE_URL -OutFile $zipPath
      }
      Expand-Archive -Path $zipPath -DestinationPath $TOOLS_DIR -Force
    }
    $env:PATH = "$NodeDir;$env:PATH"
  } else {
    Write-Host "✅ Node $(node -v) encontrado e compatível." -ForegroundColor Green
  }
}

function Run-NpmInstall {
  param([string]$WorkDir)
  Push-Location $WorkDir
  try {
    Write-Host "📦 Instalando dependências em $WorkDir ..." -ForegroundColor Yellow
    npm install
  } finally { Pop-Location }
}

# 1) Garante Node portátil (se necessário)
Ensure-PortableNode -NodeDir $NODE_DIR

# Exibe versões para debug
Write-Host "Node:  $(node -v)" -ForegroundColor Gray
Write-Host "NPM:   $(npm -v)" -ForegroundColor Gray

# 2) Instala dependências do frontend e backend
Run-NpmInstall -WorkDir $PSScriptRoot
Run-NpmInstall -WorkDir (Join-Path $PSScriptRoot 'server')

# 3) Sobe backend e frontend em processos separados
Write-Host "🖥️  Iniciando backend (API) em http://localhost:3100 ..." -ForegroundColor Cyan
$backend = Start-Process -FilePath "node" -ArgumentList "server/src/index.js" -WorkingDirectory $PSScriptRoot -PassThru

Write-Host "⚛️  Iniciando frontend (Angular) em http://localhost:4200 ..." -ForegroundColor Cyan
$frontend = Start-Process -FilePath "npm" -ArgumentList "run","start" -WorkingDirectory $PSScriptRoot -PassThru

Start-Sleep -Seconds 3
try { Start-Process "http://localhost:4200" } catch {}

Write-Host "✅ Ambos os servidores estão iniciando. Pressione Enter para encerrar." -ForegroundColor Green
[void][System.Console]::ReadLine()

Write-Host "🛑 Encerrando processos..." -ForegroundColor Yellow
foreach ($p in @($frontend,$backend)) {
  try { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force } } catch {}
}
Write-Host "👋 Finalizado." -ForegroundColor Green

