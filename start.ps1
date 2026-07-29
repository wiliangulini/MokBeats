$ErrorActionPreference = 'Stop'

# Backend (server/) e frontend (raiz) rodam em majors de Node diferentes
# (lote R1a do Plano P0 v2.2): backend em Node 24.18.1+ (corrigido,
# server/.nvmrc), frontend em Node 16.20.2 (.nvmrc da raiz), bridge EOL
# exclusiva de build/test do Angular 14 - nunca runtime de producao.
$FRONTEND_NODE_VERSION = '16.20.2'
$BACKEND_NODE_VERSION = '24.18.1'
$TOOLS_DIR = Join-Path $PSScriptRoot ".tools"

Write-Host "🚀 Iniciando o Sistema MokBeats (Windows) ..." -ForegroundColor Cyan

# Garante pasta de ferramentas locais (sem admin)
New-Item -ItemType Directory -Force -Path $TOOLS_DIR | Out-Null

function Ensure-PortableNode {
  param([string]$Version, [string]$Label)

  $nodeDir = Join-Path $TOOLS_DIR "node-v$Version-win-x64"
  $nodeExe = Join-Path $nodeDir "node.exe"
  $npmCmd = Join-Path $nodeDir "npm.cmd"
  $reqMajor = [int]($Version.Split('.')[0])

  # Reusa o Node do sistema se ja estiver na major exigida, sem mutar
  # $env:PATH globalmente (evitaria que frontend/backend pisassem um no outro).
  try {
    $sysNode = (Get-Command node -ErrorAction Stop).Path
    $sysVer = ((& node -v) -replace '^v', '')
    $sysMajor = [int]($sysVer.Split('.')[0])
    if ($sysMajor -eq $reqMajor) {
      Write-Host "✅ Node $sysVer ($Label) encontrado no sistema e compatível." -ForegroundColor Green
      return [PSCustomObject]@{ NodeExe = $sysNode; NpmCmd = (Get-Command npm -ErrorAction Stop).Path }
    }
  } catch {}

  if (-not (Test-Path $nodeExe)) {
    Write-Host "ℹ️  Instalando Node.js $Version ($Label, modo portátil, sem admin)..." -ForegroundColor Yellow
    $zip = "node-v$Version-win-x64.zip"
    $zipPath = Join-Path $TOOLS_DIR $zip
    if (-not (Test-Path $zipPath)) {
      Invoke-WebRequest -Uri "https://nodejs.org/dist/v$Version/$zip" -OutFile $zipPath
    }
    Expand-Archive -Path $zipPath -DestinationPath $TOOLS_DIR -Force
  }

  if (-not (Test-Path $nodeExe)) {
    throw "Node $Version ($Label) não encontrado após extração em $nodeDir"
  }

  Write-Host "✅ Node $Version ($Label) pronto (modo portátil)." -ForegroundColor Green
  return [PSCustomObject]@{ NodeExe = $nodeExe; NpmCmd = $npmCmd }
}

function Run-NpmInstall {
  param([string]$WorkDir, [string]$NpmCmd)
  Push-Location $WorkDir
  try {
    Write-Host "📦 Instalando dependências em $WorkDir ..." -ForegroundColor Yellow
    & $NpmCmd install
    if ($LASTEXITCODE -ne 0) { throw "npm install falhou em $WorkDir (exit $LASTEXITCODE)" }
  } finally { Pop-Location }
}

# 1) Garante os dois runtimes Node (frontend e backend), portáteis ou do sistema
$frontendNode = Ensure-PortableNode -Version $FRONTEND_NODE_VERSION -Label "frontend"
$backendNode = Ensure-PortableNode -Version $BACKEND_NODE_VERSION -Label "backend"

# Exibe versões para debug
Write-Host "Frontend Node: $(& $frontendNode.NodeExe -v)" -ForegroundColor Gray
Write-Host "Backend Node:  $(& $backendNode.NodeExe -v)" -ForegroundColor Gray

# 2) Instala dependências do frontend e backend, cada um com seu Node
Run-NpmInstall -WorkDir $PSScriptRoot -NpmCmd $frontendNode.NpmCmd
Run-NpmInstall -WorkDir (Join-Path $PSScriptRoot 'server') -NpmCmd $backendNode.NpmCmd

# 3) Sobe backend e frontend em processos separados, cada um com seu binário
Write-Host "🖥️  Iniciando backend (API) em http://localhost:3100 ..." -ForegroundColor Cyan
$backend = Start-Process -FilePath $backendNode.NodeExe -ArgumentList "server/src/index.js" -WorkingDirectory $PSScriptRoot -PassThru

Write-Host "⚛️  Iniciando frontend (Angular) em http://localhost:4200 ..." -ForegroundColor Cyan
$frontend = Start-Process -FilePath $frontendNode.NpmCmd -ArgumentList "run","start" -WorkingDirectory $PSScriptRoot -PassThru

Start-Sleep -Seconds 3
try { Start-Process "http://localhost:4200" } catch {}

Write-Host "✅ Ambos os servidores estão iniciando. Pressione Enter para encerrar." -ForegroundColor Green
[void][System.Console]::ReadLine()

Write-Host "🛑 Encerrando processos..." -ForegroundColor Yellow
foreach ($p in @($frontend,$backend)) {
  try { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force } } catch {}
}
Write-Host "👋 Finalizado." -ForegroundColor Green
