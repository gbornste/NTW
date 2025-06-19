"use client"

import { SafeImport } from "./safe-import"

export async function validateModuleExports() {
  try {
    console.log("🔍 Validating module exports...")

    // Check safe-import.ts exports
    const safeImportModule = await SafeImport.importModule("./lib/safe-import")

    if (!safeImportModule.success) {
      console.error("❌ Failed to import safe-import.ts:", safeImportModule.error)
      return false
    }

    const hasNamedExport = safeImportModule.namedExports?.SafeImport !== undefined

    if (!hasNamedExport) {
      console.error("❌ Missing named export 'SafeImport' in safe-import.ts")
      return false
    }

    console.log("✅ All required exports validated successfully")
    return true
  } catch (error) {
    console.error("❌ Error validating module exports:", error)
    return false
  }
}

// Run validation in development mode
if (process.env.NODE_ENV === "development") {
  validateModuleExports().then((valid) => {
    if (!valid) {
      console.warn("⚠️ Some required module exports are missing. This may cause runtime errors.")
    }
  })
}
