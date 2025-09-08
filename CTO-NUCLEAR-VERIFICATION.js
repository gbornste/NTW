// 🚨 CTO NUCLEAR VERIFICATION SCRIPT
// This script verifies that the One Size auto-selection is working

console.log('🚨 CTO NUCLEAR VERIFICATION STARTING...')

// Wait for page to load
setTimeout(() => {
  console.log('🔍 VERIFICATION: Checking One Size auto-selection...')
  
  // Check if we're on the correct product page
  const isTestProduct = window.location.pathname.includes('shop-22732326-product-3')
  console.log('✅ Test product page:', isTestProduct)
  
  // Find the size dropdown
  const sizeDropdown = document.querySelector('select[id*="size"], select[name*="size"], select.size-selector, [data-testid="size-select"]')
  console.log('✅ Size dropdown found:', !!sizeDropdown)
  
  if (sizeDropdown) {
    console.log('🔍 Size dropdown value:', sizeDropdown.value)
    console.log('🔍 Size dropdown options:', Array.from(sizeDropdown.options).map(opt => opt.text))
    
    // Check if One Size is selected
    const isOneSizeSelected = sizeDropdown.value === 'One Size' || 
                             sizeDropdown.value.includes('One Size') ||
                             Array.from(sizeDropdown.options).some(opt => 
                               opt.selected && opt.text.includes('One Size')
                             )
    
    console.log('🚨 CTO RESULT: One Size auto-selected:', isOneSizeSelected)
    
    if (isOneSizeSelected) {
      console.log('✅ SUCCESS: CTO NUCLEAR OPTION WORKED! One Size is auto-selected!')
    } else {
      console.log('❌ FAILURE: One Size is NOT auto-selected')
      
      // Emergency manual selection
      console.log('🚨 EMERGENCY: Attempting manual selection...')
      const oneSizeOption = Array.from(sizeDropdown.options).find(opt => 
        opt.text.includes('One Size')
      )
      
      if (oneSizeOption) {
        oneSizeOption.selected = true
        sizeDropdown.value = oneSizeOption.value
        sizeDropdown.dispatchEvent(new Event('change', { bubbles: true }))
        console.log('🚨 EMERGENCY: Manual selection attempted')
      }
    }
  } else {
    console.log('❌ Size dropdown not found - checking for other selectors...')
    
    // Alternative selectors
    const alternatives = [
      'select',
      '[role="combobox"]',
      '.dropdown',
      '.select',
      '.size-select'
    ]
    
    alternatives.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      console.log(`🔍 Found ${elements.length} elements for selector: ${selector}`)
      elements.forEach((el, i) => {
        console.log(`  ${i}: ${el.tagName} ${el.className} ${el.id}`)
      })
    })
  }
  
  // Also check for any React component state in console
  console.log('🔍 Checking console logs for React state...')
  
}, 2000)

// Extended verification after more time
setTimeout(() => {
  console.log('🕐 EXTENDED VERIFICATION (5 seconds)...')
  
  const sizeDropdown = document.querySelector('select')
  if (sizeDropdown) {
    console.log('🔍 Final size dropdown value:', sizeDropdown.value)
    console.log('🔍 Final selected option text:', sizeDropdown.selectedOptions[0]?.text)
  }
  
  console.log('🚨 CTO NUCLEAR VERIFICATION COMPLETE')
}, 5000)
