$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$anonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

$uri = "$supabaseUrl/rest/v1/orders?invite_id=eq.test-invite-001&select=*"
try {
    $response = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers -TimeoutSec 5
    Write-Host "Success: $($response | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}