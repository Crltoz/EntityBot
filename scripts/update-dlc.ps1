<#
.SYNOPSIS
    Refreshes the bundled game data after a Dead by Daylight chapter drops.

.DESCRIPTION
    The bot keeps its roster in sync on its own, but the container filesystem is ephemeral:
    anything it downloads at runtime is gone on the next restart. What actually ships is what
    lives in the repo, so run this every so often and commit the result.

    It downloads every perk icon the wiki has, pulls anything you listed by hand in
    assets/manual-icons.json, and leaves that file as an up-to-date to-do list of what is
    still missing.

.PARAMETER Report
    Only report what would change. Nothing is downloaded or written.

.EXAMPLE
    .\scripts\update-dlc.ps1
    Downloads what is available and prints what to commit.

.EXAMPLE
    .\scripts\update-dlc.ps1 -Report
    Shows what is missing without touching anything.
#>

[CmdletBinding()]
param(
    [switch]$Report
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "node is not on PATH. Install Node.js and try again."
    exit 1
}

Push-Location $repo
try {
    Write-Host "EntityBot - actualizacion de datos" -ForegroundColor Cyan
    Write-Host "repositorio: $repo`n"

    $nodeArgs = @("scripts/update-data.js")
    if (-not $Report) { $nodeArgs += "--write" }

    & node $nodeArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "update-data.js fallo con codigo $LASTEXITCODE"
        exit $LASTEXITCODE
    }

    if ($Report) {
        Write-Host "`nModo reporte: no se escribio nada." -ForegroundColor Yellow
        exit 0
    }

    # Show what is now waiting to be committed, so the images actually ship.
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "`ngit no esta en PATH, revisa los cambios a mano." -ForegroundColor Yellow
        exit 0
    }

    $paths = @("assets/Visuals", "assets/perks/icons.json", "assets/characters/icons.json",
               "assets/manual-icons.json", "src/data/names.es.json")
    $changes = git status --porcelain -- $paths

    Write-Host "`n== Cambios para commitear ==" -ForegroundColor Cyan
    if (-not $changes) {
        Write-Host "  nada nuevo, la data ya estaba al dia."
        exit 0
    }

    $changes | ForEach-Object { Write-Host "  $_" }
    $count = ($changes | Measure-Object).Count
    Write-Host "`n$count archivo(s). Para commitearlos:" -ForegroundColor Green
    Write-Host "  git add $($paths -join ' ')"
    Write-Host "  git commit -m `"update game data`""
}
finally {
    Pop-Location
}
