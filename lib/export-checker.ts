"use client"

export interface ExportInfo {
  name: string
  type: string
  isDefault: boolean
  value?: any
}

export interface ModuleInfo {
  path: string
  success: boolean
  exports: ExportInfo[]
  hasDefault: boolean
  defaultExport?: any
  error?: string
}

export class ExportChecker {
  static async checkModuleExports(modulePath: string): Promise<ModuleInfo> {
    const moduleInfo: ModuleInfo = {
      path: modulePath,
      success: false,
      exports: [],
      hasDefault: false,
    }

    try {
      console.log(`🔍 Checking exports for: ${modulePath}`)

      // Try to import the module
      const module = await import(modulePath)

      if (!module) {
        throw new Error("Module is null or undefined")
      }

      const exports: ExportInfo[] = []
      let hasDefault = false
      let defaultExport = undefined

      // Check for default export
      if ("default" in module && module.default !== undefined) {
        hasDefault = true
        defaultExport = module.default
        exports.push({
          name: "default",
          type: typeof module.default,
          isDefault: true,
          value: module.default,
        })
        console.log(`✅ Found default export: ${typeof module.default}`)
      } else {
        console.log(`❌ No default export found`)
      }

      // Check for named exports
      for (const key in module) {
        if (key !== "default" && module.hasOwnProperty(key)) {
          exports.push({
            name: key,
            type: typeof module[key],
            isDefault: false,
            value: module[key],
          })
          console.log(`✅ Found named export: ${key} (${typeof module[key]})`)
        }
      }

      moduleInfo.success = true
      moduleInfo.exports = exports
      moduleInfo.hasDefault = hasDefault
      moduleInfo.defaultExport = defaultExport

      console.log(`✅ Module ${modulePath} checked successfully`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      moduleInfo.error = errorMessage
      console.error(`❌ Failed to check module ${modulePath}:`, errorMessage)
    }

    return moduleInfo
  }

  static async checkMultipleModules(modulePaths: string[]): Promise<ModuleInfo[]> {
    const results = await Promise.allSettled(modulePaths.map((path) => this.checkModuleExports(path)))

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
        }
      }
    })
  }
}
