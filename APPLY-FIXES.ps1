$ErrorActionPreference = 'Stop'
$RepoRoot = $PSScriptRoot
$OverlayRoot = Join-Path $RepoRoot 'overlay'

if (-not (Test-Path (Join-Path $RepoRoot 'vercel.json')) -or -not (Test-Path (Join-Path $RepoRoot 'README.md'))) {
    throw 'Extract this repair kit directly into the Finoptiv repository root. README.md and vercel.json must be beside this script.'
}
if (-not (Test-Path $OverlayRoot)) {
    throw 'The overlay folder is missing. Re-download and extract the complete repair kit.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $RepoRoot ".finoptiv-backup/$stamp"
$changed = @()

Get-ChildItem -Path $OverlayRoot -File -Recurse | ForEach-Object {
    $relative = $_.FullName.Substring($OverlayRoot.Length).TrimStart([char[]]'\/')
    $destination = Join-Path $RepoRoot $relative
    $destinationDirectory = Split-Path -Parent $destination
    if (-not (Test-Path $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    }

    if (Test-Path $destination) {
        $backupPath = Join-Path $backupRoot $relative
        $backupDirectory = Split-Path -Parent $backupPath
        if (-not (Test-Path $backupDirectory)) {
            New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
        }
        Copy-Item -LiteralPath $destination -Destination $backupPath -Force
    }

    Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
    $changed += $relative
}

Write-Host ''
Write-Host 'Finoptiv repair overlay applied.' -ForegroundColor Green
Write-Host "Files written: $($changed.Count)"
Write-Host "Backup folder: $backupRoot"
Write-Host ''
$changed | ForEach-Object { Write-Host "  - $_" }
Write-Host ''
Write-Host 'Next: review the changes, commit/push them to GitHub, then follow DEPLOYMENT-GUIDE.md.' -ForegroundColor Cyan
