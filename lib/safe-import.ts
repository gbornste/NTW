"use client"

export interface SafeImportResult<T = any> {
  success: boolean
  module?: T
  defaultExport?: any
  namedExports?: Record<string, any>
  error?: string
}

// Add the missing SafeImport named export
export const SafeImport = {
  importModule: async <T = any>(modulePath: string): Promise<SafeImportResult<T>> => {
    return SafeImporter.importModule<T>(modulePath)
  },
  getDefaultExport: async <T = any>(modulePath: string): Promise<T | null> => {
    return SafeImporter.getDefaultExport<T>(modulePath)
  },
  getNamedExport: async <T = any>(modulePath: string, exportName: string): Promise<T | null> => {
    return SafeImporter.getNamedExport<T>(modulePath, exportName)
  },
}

export class SafeImporter {
  static async importModule<T = any>(modulePath: string): Promise<SafeImportResult<T>> {
    try {
      console.log(`🔄 Safely importing: ${modulePath}`)

      const module = await import(modulePath)

      if (!module) {
        throw new Error("Module is null or undefined")
      }

      const result: SafeImportResult<T> = {
        success: true,
        module: module as T,
        namedExports: {},
      }

      // Extract default export if it exists
      if ("default" in module && module.default !== undefined) {
        result.defaultExport = module.default
        console.log(`✅ Default export found: ${typeof module.default}`)
      } else {
        console.log(`ℹ️ No default export in ${modulePath}`)
      }

      // Extract named exports
      for (const key in module) {
        if (key !== "default" && module.hasOwnProperty(key)) {
          if (!result.namedExports) result.namedExports = {}
          result.namedExports[key] = module[key]
        }
      }

      console.log(`✅ Successfully imported: ${modulePath}`)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Failed to import ${modulePath}:`, errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  static async getDefaultExport<T = any>(modulePath: string): Promise<T | null> {
    const result = await this.importModule(modulePath)
    return result.defaultExport || null
  }

  static async getNamedExport<T = any>(modulePath: string, exportName: string): Promise<T | null> {
    const result = await this.importModule(modulePath)
    return result.namedExports?.[exportName] || null
  }
}

// Add a default export as well for components that might be importing it as default
export default SafeImport

export async function safeImport(path: string) {
  try {
    // Handle different path formats
    const cleanPath = path.startsWith("@/") ? path.slice(2) : path
    const fullPath = `../../${cleanPath}`

    const module = await import(fullPath)
    return { module, error: null }
  } catch (error) {
    console.error(`Failed to import module: ${path}`, error)
    return {
      module: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
