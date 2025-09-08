// 🚨 CTO FINAL VERIFICATION - One Size Auto-Selection & Size Guide
// This script comprehensively tests both auto-selection and size guide functionality

console.log('🚨 CTO FINAL VERIFICATION STARTING...')

function runVerification() {
  console.log('🔍 VERIFICATION: Running comprehensive checks...')
  
  // Check if we're on the correct product page
  const isTestProduct = window.location.pathname.includes('shop-22732326-product-3')
  console.log('✅ Test product page (Hat - One Size):', isTestProduct)
  
  // Find the size dropdown using multiple selectors
  const sizeDropdownSelectors = [
    'button[role="combobox"]',
    '[data-radix-collection-item]',
    'button:has-text("Select your size")',
    'button:has-text("One Size")',
    '.size-select',
    'select'
  ]
  
  let sizeDropdown = null
  for (const selector of sizeDropdownSelectors) {
    try {
      sizeDropdown = document.querySelector(selector)
      if (sizeDropdown) {
        console.log('✅ Size dropdown found with selector:', selector)
        break
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  if (!sizeDropdown) {
    // Try finding by text content
    const buttons = Array.from(document.querySelectorAll('button'))
    sizeDropdown = buttons.find(btn => 
      btn.textContent?.includes('Select your size') || 
      btn.textContent?.includes('One Size') ||
      btn.getAttribute('role') === 'combobox'
    )
    if (sizeDropdown) {
      console.log('✅ Size dropdown found by text content')
    }
  }
  
  if (sizeDropdown) {
    console.log('🔍 Size dropdown element:', sizeDropdown)
    console.log('🔍 Size dropdown text content:', sizeDropdown.textContent)
    console.log('🔍 Size dropdown aria-expanded:', sizeDropdown.getAttribute('aria-expanded'))
    console.log('🔍 Size dropdown data-state:', sizeDropdown.getAttribute('data-state'))
    
    // Check if One Size is pre-selected
    const isOneSizeSelected = sizeDropdown.textContent?.includes('One Size') && 
                             !sizeDropdown.textContent?.includes('Select your size')
    
    console.log('🚨 CTO RESULT: One Size auto-selected:', isOneSizeSelected)
    
    if (isOneSizeSelected) {
      console.log('✅ SUCCESS: ONE SIZE AUTO-SELECTION WORKING!')
    } else {
      console.log('❌ FAILURE: One Size is NOT auto-selected')
      console.log('🔍 Current dropdown text:', sizeDropdown.textContent)
    }
  } else {
    console.log('❌ Size dropdown not found')
    
    // Debug: show all interactive elements
    console.log('🔍 All buttons on page:')
    document.querySelectorAll('button').forEach((btn, i) => {
      console.log(`  ${i}: "${btn.textContent?.trim()}" (${btn.className})`)
    })
    
    console.log('🔍 All select elements:')
    document.querySelectorAll('select').forEach((sel, i) => {
      console.log(`  ${i}: value="${sel.value}" (${sel.className})`)
    })
  }
  
  // Check Size Guide functionality
  console.log('🔍 VERIFICATION: Checking Size Guide...')
  const sizeGuideButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent?.includes('Size Guide')
  )
  
  if (sizeGuideButton) {
    console.log('✅ Size Guide button found')
    
    // Check if size guide shows proper hat information
    const sizeGuideContent = document.querySelector('[data-testid="size-guide"], .size-guide, [class*="size-guide"]')
    if (sizeGuideContent) {
      console.log('✅ Size Guide content found')
      console.log('🔍 Size Guide content:', sizeGuideContent.textContent)
      
      const hasHatInfo = sizeGuideContent.textContent?.includes('Adjustable') || 
                        sizeGuideContent.textContent?.includes('baseball cap') ||
                        sizeGuideContent.textContent?.includes('head circumference')
      
      console.log('🚨 CTO RESULT: Size Guide shows hat-specific info:', hasHatInfo)
      
      if (hasHatInfo) {
        console.log('✅ SUCCESS: SIZE GUIDE SHOWS PROPER HAT INFORMATION!')
      } else {
        console.log('❌ Size Guide missing hat-specific information')
      }
    } else {
      // Try clicking to open size guide
      console.log('🔄 Opening Size Guide to check content...')
      sizeGuideButton.click()
      
      setTimeout(() => {
        const openedGuide = document.querySelector('[role="dialog"], .modal, [data-state="open"]')
        if (openedGuide) {
          console.log('✅ Size Guide opened:', openedGuide.textContent)
        }
      }, 500)
    }
  } else {
    console.log('❌ Size Guide button not found')
  }
  
  // Check console logs for React state
  console.log('🔍 React state logs should show:')
  console.log('  - 🚨 CTO ABSOLUTE NUCLEAR: selectedSize initialized to: One Size')
  console.log('  - 🚨 CTO BULLETPROOF: uniqueSizes available: ["One Size"]')
  console.log('  - ✅ SIZES SUCCESSFULLY EXTRACTED: count: 1, sizes: ["One Size"]')
}

// Run verification immediately and after delays
runVerification()

setTimeout(() => {
  console.log('🕐 VERIFICATION (2 seconds): Re-checking after React hydration...')
  runVerification()
}, 2000)

setTimeout(() => {
  console.log('🕐 VERIFICATION (5 seconds): Final verification...')
  runVerification()
  console.log('🚨 CTO FINAL VERIFICATION COMPLETE')
}, 5000)
