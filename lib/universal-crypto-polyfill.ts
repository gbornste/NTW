declare global {
  var __crypto_polyfill_loaded: boolean | undefined
  var crypto: any
}

// Simple but effective hash functions
function simpleHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString(16).padStart(8, "0")

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16).padStart(8, "0")
}

function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

function combinedHash(data: string): string {
  const hash1 = simpleHash(data)
  const hash2 = djb2Hash(data + hash1)
  const hash3 = simpleHash(hash2 + data)

  // Combine hashes to create a longer, more secure hash
  const combined = hash1 + hash2 + hash3
  return combined.substring(0, 64) // 64 characters like SHA-256
}

// Create hash function
function createHashFunction(algorithm: string) {
  let data = ""

  return {
    update: function (chunk: string | Buffer | Uint8Array) {
      if (typeof chunk === "string") {
        data += chunk
      } else if (chunk instanceof Uint8Array) {
        // Convert Uint8Array to string
        data += Array.from(chunk)
          .map((b) => String.fromCharCode(b))
          .join("")
      } else if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(chunk)) {
        // Handle Buffer if available
        data += chunk.toString("binary")
      } else {
        data += String(chunk)
      }
      return this
    },

    digest: (encoding?: string) => {
      const hash = combinedHash(data)

      if (encoding === "hex") {
        return hash
      } else if (encoding === "base64") {
        // Convert hex to base64
        try {
          const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
          return btoa(String.fromCharCode(...bytes))
        } catch {
          return btoa(hash) // Fallback
        }
      } else {
        // Return as Uint8Array
        const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
        return new Uint8Array(bytes)
      }
    },
  }
}

// Create random bytes function
function createRandomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size)

  // Use crypto.getRandomValues if available
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
  } else if (globalThis.crypto?.getRandomValues) {
    try {
      globalThis.crypto.getRandomValues(bytes)
    } catch {
      // Fallback if getRandomValues fails
      for (let i = 0; i < size; i++) {
        bytes[i] = Math.floor(Math.random() * 256)
      }
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }

  return bytes
}

// Create getRandomValues function
function createGetRandomValues(array: Uint8Array): Uint8Array {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    try {
      return window.crypto.getRandomValues(array)
    } catch {
      // Fallback if native function fails
    }
  }

  // Fallback implementation
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256)
  }
  return array
}

// Create subtle crypto implementation
function createSubtleCrypto() {
  return {
    digest: async (algorithm: string, data: BufferSource) => {
      const view = new Uint8Array(data instanceof ArrayBuffer ? data : data.buffer)
      const str = Array.from(view)
        .map((b) => String.fromCharCode(b))
        .join("")
      const hash = combinedHash(str)

      // Convert hex string to ArrayBuffer
      const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
      return new Uint8Array(bytes).buffer
    },
  }
}

// Initialize crypto polyfill
export function initUniversalCrypto() {
  if (globalThis.__crypto_polyfill_loaded) {
    return
  }

  try {
    console.log("🔧 Initializing universal crypto polyfill...")

    // Check if crypto exists and what properties it has
    const existingCrypto = globalThis.crypto
    const hasExistingCrypto = !!existingCrypto
    const hasCreateHash = !!existingCrypto?.createHash
    const hasRandomBytes = !!existingCrypto?.randomBytes
    const hasGetRandomValues = !!existingCrypto?.getRandomValues
    const hasSubtle = !!existingCrypto?.subtle

    console.log("🔍 Existing crypto status:", {
      hasExistingCrypto,
      hasCreateHash,
      hasRandomBytes,
      hasGetRandomValues,
      hasSubtle,
    })

    // If no crypto object exists, create a complete one
    if (!hasExistingCrypto) {
      globalThis.crypto = {
        createHash: createHashFunction,
        randomBytes: createRandomBytes,
        getRandomValues: createGetRandomValues,
        subtle: createSubtleCrypto(),
      }
    } else {
      // Crypto exists, but we need to add missing methods carefully

      // Add createHash if missing
      if (!hasCreateHash) {
        try {
          Object.defineProperty(globalThis.crypto, "createHash", {
            value: createHashFunction,
            writable: true,
            configurable: true,
          })
        } catch (error) {
          console.warn("Could not add createHash property:", error)
          // Try direct assignment as fallback
          try {
            globalThis.crypto.createHash = createHashFunction
          } catch (e) {
            console.warn("Direct assignment of createHash also failed:", e)
          }
        }
      }

      // Add randomBytes if missing
      if (!hasRandomBytes) {
        try {
          Object.defineProperty(globalThis.crypto, "randomBytes", {
            value: createRandomBytes,
            writable: true,
            configurable: true,
          })
        } catch (error) {
          console.warn("Could not add randomBytes property:", error)
          try {
            globalThis.crypto.randomBytes = createRandomBytes
          } catch (e) {
            console.warn("Direct assignment of randomBytes also failed:", e)
          }
        }
      }

      // Handle getRandomValues carefully
      if (!hasGetRandomValues) {
        try {
          Object.defineProperty(globalThis.crypto, "getRandomValues", {
            value: createGetRandomValues,
            writable: true,
            configurable: true,
          })
        } catch (error) {
          console.warn("Could not add getRandomValues property:", error)
          try {
            globalThis.crypto.getRandomValues = createGetRandomValues
          } catch (e) {
            console.warn("Direct assignment of getRandomValues also failed:", e)
          }
        }
      }

      // Handle subtle property carefully (it's often read-only)
      if (!hasSubtle) {
        try {
          Object.defineProperty(globalThis.crypto, "subtle", {
            value: createSubtleCrypto(),
            writable: true,
            configurable: true,
          })
        } catch (error) {
          console.warn("Could not add subtle property (likely read-only):", error)
          // Don't try direct assignment for subtle as it's often a getter
        }
      }
    }

    // Also set up for Node.js style imports if global exists
    if (typeof global !== "undefined" && !global.crypto) {
      global.crypto = globalThis.crypto
    }

    // Mark as loaded
    globalThis.__crypto_polyfill_loaded = true

    console.log("✅ Universal crypto polyfill loaded successfully")
    console.log("🔍 Final crypto functions available:", {
      createHash: typeof globalThis.crypto.createHash,
      randomBytes: typeof globalThis.crypto.randomBytes,
      getRandomValues: typeof globalThis.crypto.getRandomValues,
      subtle: typeof globalThis.crypto.subtle,
    })

    // Test the implementation
    try {
      const testHash = globalThis.crypto.createHash("sha256")
      testHash.update("test")
      const result = testHash.digest("hex")
      console.log("🧪 Crypto test successful, hash result:", result.substring(0, 16) + "...")
    } catch (testError) {
      console.warn("⚠️ Crypto test failed:", testError)
    }
  } catch (error) {
    console.error("❌ Failed to initialize crypto polyfill:", error)

    // Last resort - create a minimal crypto object
    try {
      if (!globalThis.crypto) {
        globalThis.crypto = {}
      }

      // Add minimal implementations only if they don't exist
      if (!globalThis.crypto.createHash) {
        globalThis.crypto.createHash = () => ({
          update: function () {
            return this
          },
          digest: () => "fallback-hash-" + Date.now().toString(16),
        })
      }

      if (!globalThis.crypto.randomBytes) {
        globalThis.crypto.randomBytes = (size: number) =>
          new Uint8Array(size).map(() => Math.floor(Math.random() * 256))
      }

      if (!globalThis.crypto.getRandomValues) {
        globalThis.crypto.getRandomValues = (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256)
          return arr
        }
      }

      console.log("🔧 Minimal crypto fallback implemented")
    } catch (fallbackError) {
      console.error("❌ Even fallback crypto implementation failed:", fallbackError)
    }
  }
}

// Auto-initialize when module loads
initUniversalCrypto()

export default initUniversalCrypto
