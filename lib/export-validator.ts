export interface ExportValidationResult {
  isValid: boolean
  missingExports: string[]
  availableExports: string[]
  error?: string
}

export async function validateModuleExports(
  modulePath: string,
  expectedExports: string[],
): Promise<ExportValidationResult> {
  try {
    const module = await import(modulePath)
    const availableExports = Object.keys(module)
    const missingExports = expectedExports.filter((exportName) => !(exportName in module))

    return {
      isValid: missingExports.length === 0,
      missingExports,
      availableExports,
    }
  } catch (error) {
    return {
      isValid: false,
      missingExports: expectedExports,
      availableExports: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function validateAuthProvider(): Promise<ExportValidationResult> {
  return validateModuleExports("@/components/auth-provider", ["AuthProvider", "default"])
}

// Development-only validation
export async function runDevelopmentValidation() {
  if (process.env.NODE_ENV !== "development") return

  console.log("🔍 Running export validation...")

  const authProviderResult = await validateAuthProvider()

  if (!authProviderResult.isValid) {
    console.error("❌ AuthProvider validation failed:", authProviderResult)
  } else {
    console.log("✅ AuthProvider validation passed")
  }

  return {
    authProvider: authProviderResult,
  }
}
