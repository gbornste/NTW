"use client"

// Module validation utility to help debug import issues
export function validateModule(moduleName: string, moduleExports: any) {
  console.log(`Validating module: ${moduleName}`)

  if (!moduleExports) {
    console.error(`Module ${moduleName} is undefined or null`)
    return false
  }

  if (typeof moduleExports === "object") {
    console.log(`Module ${moduleName} exports:`, Object.keys(moduleExports))

    if ("default" in moduleExports) {
      console.log(`Module ${moduleName} has default export:`, typeof moduleExports.default)
    } else {
      console.warn(`Module ${moduleName} does not have a default export`)
    }
  }

  return true
}

// Helper to safely import modules
export async function safeImport(modulePath: string) {
  try {
    const module = await import(modulePath)
    validateModule(modulePath, module)
    return module
  } catch (error) {
    console.error(`Failed to import module ${modulePath}:`, error)
    throw error
  }
}

// Helper to check if a module has specific exports
export function hasExport(moduleExports: any, exportName: string): boolean {
  return moduleExports && typeof moduleExports === "object" && exportName in moduleExports
}

// Helper to get safe default export
export function getSafeDefault<T>(moduleExports: any, fallback?: T): T | undefined {
  if (hasExport(moduleExports, "default")) {
    return moduleExports.default
  }

  // If no default export but module is a function/component, use it directly
  if (typeof moduleExports === "function") {
    return moduleExports
  }

  return fallback
}
