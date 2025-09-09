/**
 * BROWSER CONSOLE VERIFICATION SCRIPT
 * Run this in the browser's developer console to check size detection
 */

console.log('🧪 BROWSER VERIFICATION STARTING...')

// Check if the size dropdown exists and what's selected
const sizeSelect = document.querySelector('[data-testid="size-select"]') || 
                   document.querySelector('select[name="size"]') ||
                   document.querySelector('[class*="size"]') ||
                   document.querySelector('[class*="Select"]')

console.log('🔍 Size dropdown element:', sizeSelect)

if (sizeSelect) {
  console.log('📝 Current size selection:', sizeSelect.textContent || sizeSelect.value)
  console.log('📋 Available size options:')
  
  const options = sizeSelect.querySelectorAll('option, [role="option"]')
  options.forEach((option, index) => {
    console.log(`   ${index + 1}. "${option.textContent || option.value}"`)
  })
} else {
  console.log('❌ Size dropdown not found!')
}

// Check pricing
const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"], .currency')
console.log('💰 Price elements found:', priceElements.length)
priceElements.forEach((el, index) => {
  console.log(`   Price ${index + 1}: "${el.textContent}"`)
})

// Check if "One Size" is visible anywhere
const oneSizeElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('one size')
)
console.log('🎯 "One Size" elements found:', oneSizeElements.length)
oneSizeElements.forEach((el, index) => {
  console.log(`   One Size ${index + 1}: "${el.textContent}" (tag: ${el.tagName})`)
})

console.log('✅ Browser verification complete!')
