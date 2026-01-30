$baseUrl = "http://localhost:3001"

Write-Host "1. Fetching Initial Settings..."
$initial = Invoke-RestMethod -Uri "$baseUrl/api/settings" -Method Get
Write-Host "Initial Supplier Name: $($initial.settings.supplier_name)"

Write-Host "`n2. Updating Supplier Info..."
$body = @{
    supplier_name = "Test Copilot Supplier"
    supplier_ceo = "AI CEO"
    supplier_reg_no = "999-99-99999"
    supplier_address = "Digital World"
    supplier_phone = "010-1234-5678"
    simple_password = "123456" # Needed if the API requires it, though my code might not enforce it for this endpoint yet
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/settings/supplier" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Update Response: $($response.success)"
} catch {
    Write-Host "Error updating: $_"
    exit
}

Write-Host "`n3. Verifying Persistence..."
$updated = Invoke-RestMethod -Uri "$baseUrl/api/settings" -Method Get
Write-Host "Updated Supplier Name: $($updated.settings.supplier_name)"

if ($updated.settings.supplier_name -eq "Test Copilot Supplier") {
    Write-Host "`nSUCCESS: Supplier info updated and persisted."
} else {
    Write-Host "`nFAILURE: Supplier info did not persist."
}

Write-Host "`n4. Checking Stats API for Supplier Info..."
$stats = Invoke-RestMethod -Uri "$baseUrl/api/stats" -Method Get
Write-Host "Stats Supplier Name: $($stats.stats.supplierInfo.supplier_name)"

if ($stats.stats.supplierInfo.supplier_name -eq "Test Copilot Supplier") {
    Write-Host "SUCCESS: Stats API returns correct supplier info."
} else {
    Write-Host "FAILURE: Stats API returned wrong supplier info."
}
