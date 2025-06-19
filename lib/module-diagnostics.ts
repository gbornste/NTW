"use client"

export interface ModuleExportInfo {
  name: string
  type: string
  value?: any
}

export interface ModuleDiagnostic {
  path: string
  success: boolean
  exports: ModuleExportInfo[]
  hasDefault: boolean
  error?: string
  timestamp: number
}

export class ModuleDiagnostics {
  private static cache = new Map<string, ModuleDiagnostic>()

  static async checkModule(modulePath: string): Promise<ModuleDiagnostic> {
    const cacheKey = modulePath
    const cached = this.cache.get(cacheKey)

    // Return cached result if less than 5 seconds old
    if (cached && Date.now() - cached.timestamp < 5000) {
      return cached
    }

    const diagnostic: ModuleDiagnostic = {
      path: modulePath,
      success: false,
      exports: [],
      hasDefault: false,
      timestamp: Date.now(),
    }

    try {
      console.log(`🔍 Checking module: ${modulePath}`)

      // Try to import the module
      const module = await import(modulePath)

      // Analyze exports
      const exports: ModuleExportInfo[] = []
      let hasDefault = false

      if (module) {
        // Check for default export
        if ("default" in module) {
          hasDefault = true
          exports.push({
            name: "default",
            type: typeof module.default,
            value: module.default,
          })
        }

        // Check for named exports
        for (const key in module) {
          if (key !== "default") {
            exports.push({
              name: key,
              type: typeof module[key],
              value: module[key],
            })
          }
        }

        diagnostic.success = true
        diagnostic.exports = exports
        diagnostic.hasDefault = hasDefault

        console.log(`✅ Module ${modulePath} loaded successfully:`, {
          hasDefault,
          exports: exports.map((e) => `${e.name}: ${e.type}`),
        })
      }
    } catch (error) {
      diagnostic.error = error instanceof Error ? error.message : String(error)
      console.error(`❌ Failed to load module ${modulePath}:`, error)
    }

    this.cache.set(cacheKey, diagnostic)
    return diagnostic
  }

  static async checkMultipleModules(modulePaths: string[]): Promise<ModuleDiagnostic[]> {
    const results = await Promise.allSettled(modulePaths.map((path) => this.checkModule(path)))

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          path: modulePaths[index],
          success: false,
          exports: [],
          hasDefault: false,
          error: result.reason?.message || "Unknown error",
          timestamp: Date.now(),
        }
      }
    })
  }

  static clearCache() {
    this.cache.clear()
  }
}
