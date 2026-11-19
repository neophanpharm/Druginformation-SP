# Ghép ảnh soát thành contact sheet: powershell -File scripts/sheet.ps1 <thư mục> <mẫu tên> <ảnh ra> [cột] [rộng ô]
param([string]$Dir, [string]$Pattern = "*.png", [string]$Out = "sheet.png", [int]$Cols = 4, [int]$CellW = 300)
Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -Path $Dir -Filter $Pattern | Sort-Object Name
if (-not $files) { Write-Output "no files"; exit 1 }
$first = [System.Drawing.Image]::FromFile($files[0].FullName)
$CellH = [int]($CellW * $first.Height / $first.Width); $first.Dispose()
$rows = [math]::Ceiling($files.Count / $Cols)
$bmp = New-Object System.Drawing.Bitmap ($CellW * $Cols), ($CellH * $rows)
$g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::Black)
$font = New-Object System.Drawing.Font 'Arial', 11, ([System.Drawing.FontStyle]::Bold)
$k = 0
foreach ($f in $files) {
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $x = ($k % $Cols) * $CellW; $y = [math]::Floor($k / $Cols) * $CellH
  $g.DrawImage($img, $x, $y, $CellW, $CellH)
  $g.FillRectangle([System.Drawing.Brushes]::Black, $x, $y, 150, 18)
  $g.DrawString($f.BaseName, $font, [System.Drawing.Brushes]::Yellow, $x + 3, $y + 1)
  $img.Dispose(); $k++
}
$bmp.Save($Out); $g.Dispose(); $bmp.Dispose(); Write-Output "saved $Out"
