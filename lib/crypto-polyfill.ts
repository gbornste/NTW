declare global {
  interface Window {
    crypto: Crypto
  }
  var __crypto_polyfill_initialized: boolean | undefined
}

// Simple hash implementation for environments without crypto.createHash
function simpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

// Create a more robust implementation of crypto functions
export function initCryptoPolyfill() {
  // Skip if already initialized
  if (typeof globalThis !== "undefined" && globalThis.__crypto_polyfill_initialized) {
    return
  }

  try {
    // For browser environments
    if (typeof window !== "undefined" && window.crypto) {
      // Create a SHA-256 hash implementation using Web Crypto API
      const createHash = (algorithm: string) => {
        const supportedAlgorithms: Record<string, string> = {
          sha1: "SHA-1",
          sha256: "SHA-256",
          sha384: "SHA-384",
          sha512: "SHA-512",
        }

        const webCryptoAlgo = supportedAlgorithms[algorithm.toLowerCase()] || "SHA-256"
        let data = new Uint8Array()

        return {
          update(chunk: string | Uint8Array) {
            const encoder = new TextEncoder()
            const newData = typeof chunk === "string" ? encoder.encode(chunk) : chunk

            // Concatenate data
            const combined = new Uint8Array(data.length + newData.length)
            combined.set(data)
            combined.set(newData, data.length)
            data = combined

            return this
          },

          digest(encoding?: string) {
            return window.crypto.subtle.digest(webCryptoAlgo, data).then((hashBuffer) => {
              const hashArray = Array.from(new Uint8Array(hashBuffer))

              if (encoding === "hex") {
                return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
              } else if (encoding === "base64") {
                return btoa(String.fromCharCode.apply(null, hashArray))
              } else {
                return new Uint8Array(hashBuffer)
              }
            })
          },
        }
      }

      // Create a randomBytes implementation using Web Crypto API
      const randomBytes = (size: number) => {
        const bytes = new Uint8Array(size)
        window.crypto.getRandomValues(bytes)
        return bytes
      }

      // Add crypto methods to global scope
      if (!globalThis.crypto) {
        globalThis.crypto = window.crypto
      }

      // Add Node.js-style crypto methods
      Object.assign(globalThis.crypto, {
        createHash,
        randomBytes,
      })

      globalThis.__crypto_polyfill_initialized = true
      console.log("✅ Browser crypto polyfill initialized")
      return
    }

    // For server-side or edge runtime
    if (typeof globalThis !== "undefined") {
      // Simple fallback crypto implementation
      const fallbackCrypto = {
        subtle: {
          digest: async (algorithm: string, data: BufferSource) => {
            // Simple hash function for fallback
            const view = new Uint8Array(data instanceof ArrayBuffer ? data : data.buffer)
            const dataStr = Array.from(view)
              .map((b) => String.fromCharCode(b))
              .join("")
            const hash = simpleHash(dataStr)

            // Return as ArrayBuffer
            const result = new ArrayBuffer(32) // SHA-256 size
            const resultView = new Uint8Array(result)
            for (let i = 0; i < Math.min(hash.length / 2, 32); i++) {
              resultView[i] = Number.parseInt(hash.substr(i * 2, 2), 16)
            }
            return result
          },
        },
        getRandomValues: (array: Uint8Array) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256)
          }
          return array
        },
        randomBytes: (size: number) => {
          const array = new Uint8Array(size)
          for (let i = 0; i < size; i++) {
            array[i] = Math.floor(Math.random() * 256)
          }
          return array
        },
        createHash: (algorithm: string) => {
          let data = ""
          return {
            update: function (chunk: string | Uint8Array) {
              if (typeof chunk === "string") {
                data += chunk
              } else {
                data += Array.from(chunk)
                  .map((b) => String.fromCharCode(b))
                  .join("")
              }
              return this
            },
            digest: (encoding?: string) => {
              const hash = simpleHash(data)

              if (encoding === "hex") {
                return hash
              } else if (encoding === "base64") {
                return btoa(hash)
              }
              return new TextEncoder().encode(hash)
            },
          }
        },
      }

      // Set up global crypto
      if (!globalThis.crypto) {
        globalThis.crypto = fallbackCrypto as any
      } else {
        // Merge with existing crypto
        Object.assign(globalThis.crypto, {
          createHash: fallbackCrypto.createHash,
          randomBytes: fallbackCrypto.randomBytes,
        })
      }

      globalThis.__crypto_polyfill_initialized = true
      console.log("✅ Server crypto polyfill initialized")
    }
  } catch (error) {
    console.error("❌ Crypto polyfill initialization failed:", error)

    // Last resort fallback
    if (typeof globalThis !== "undefined" && !globalThis.crypto) {
      globalThis.crypto = {
        createHash: (algorithm: string) => ({
          update: function (chunk: any) {
            return this
          },
          digest: (encoding?: string) => {
            const fallbackHash = "fallback" + Date.now().toString(16)
            return encoding === "hex" ? fallbackHash : new TextEncoder().encode(fallbackHash)
          },
        }),
        randomBytes: (size: number) => {
          const array = new Uint8Array(size)
          for (let i = 0; i < size; i++) {
            array[i] = Math.floor(Math.random() * 256)
          }
          return array
        },
        getRandomValues: (array: Uint8Array) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256)
          }
          return array
        },
        subtle: {
          digest: async () => new ArrayBuffer(32),
        },
      } as any
    }
  }
}

// Initialize immediately
if (typeof globalThis !== "undefined") {
  initCryptoPolyfill()
}

// For server-side or edge runtime
export default function ensureCrypto() {
  initCryptoPolyfill()
}
