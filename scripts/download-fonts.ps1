$baseUrl = "https://fonts.gstatic.com"

# Inter font files (weights 100-900)
$interFonts = @(
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyeMZg.ttf"; Name="Inter-Thin.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyfMZg.ttf"; Name="Inter-ExtraLight.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf"; Name="Inter-Light.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"; Name="Inter-Regular.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf"; Name="Inter-Medium.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf"; Name="Inter-SemiBold.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf"; Name="Inter-Bold.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf"; Name="Inter-ExtraBold.ttf"},
    @{Url="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYMZg.ttf"; Name="Inter-Black.ttf"}
)

Write-Output "Downloading Inter fonts..."
foreach ($font in $interFonts) {
    $outPath = "public/fonts/$($font.Name)"
    if (-not (Test-Path $outPath)) {
        Write-Output "  Downloading $($font.Name)..."
        Invoke-WebRequest -Uri $font.Url -UseBasicParsing -OutFile $outPath
    } else {
        Write-Output "  $($font.Name) already exists, skipping."
    }
}

# Cormorant Garamond fonts (weights 300-700)
$cormorantFonts = @(
    @{Url="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_qE6GnM.ttf"; Name="CormorantGaramond-Light.ttf"},
    @{Url="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf"; Name="CormorantGaramond-Regular.ttf"},
    @{Url="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_s06GnM.ttf"; Name="CormorantGaramond-Medium.ttf"},
    @{Url="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9GnM.ttf"; Name="CormorantGaramond-SemiBold.ttf"},
    @{Url="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_hg9GnM.ttf"; Name="CormorantGaramond-Bold.ttf"}
)

Write-Output "Downloading Cormorant Garamond fonts..."
foreach ($font in $cormorantFonts) {
    $outPath = "public/fonts/$($font.Name)"
    if (-not (Test-Path $outPath)) {
        Write-Output "  Downloading $($font.Name)..."
        Invoke-WebRequest -Uri $font.Url -UseBasicParsing -OutFile $outPath
    } else {
        Write-Output "  $($font.Name) already exists, skipping."
    }
}

Write-Output "All fonts downloaded successfully."
