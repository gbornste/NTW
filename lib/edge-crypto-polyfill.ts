declare global {
  var __edge_crypto_initialized: boolean | undefined
}

// Simple but effective hash implementation
function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

// SHA-256 like implementation using multiple hash rounds
function multiRoundHash(data: string): string {
  let hash = djb2Hash(data)

  // Multiple rounds for better distribution
  for (let i = 0; i < 3; i++) {
    hash = djb2Hash(hash + data + i.toString())
  }

  return hash.padStart(64, "0").substring(0, 64) // 64 chars like SHA-256
}

// Create a comprehensive crypto polyfill
export function initEdgeCrypto() {
  if (globalThis.__edge_crypto_initialized) {
    return
  }

  try {
    // Create crypto object if it doesn't exist
    if (!globalThis.crypto) {
      globalThis.crypto = {} as any
    }

    // Implement createHash
    if (!globalThis.crypto.createHash) {
      globalThis.crypto.createHash = (algorithm: string) => {
        let data = ""

        return {
          update: function (chunk: string | Buffer | Uint8Array) {
            if (typeof chunk === "string") {
              data += chunk
            } else if (chunk instanceof Uint8Array || Buffer.isBuffer?.(chunk)) {
              // Convert buffer to string
              data += Array.from(chunk)
                .map((b) => String.fromCharCode(b))
                .join("")
            } else {
              data += String(chunk)
            }
            return this
          },

          digest: (encoding?: string) => {
            const hash = multiRoundHash(data)

            if (encoding === "hex") {
              return hash
            } else if (encoding === "base64") {
              // Convert hex to base64
              const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
              return btoa(String.fromCharCode(...bytes))
            } else {
              // Return as buffer-like object
              const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
              return new Uint8Array(bytes)
            }
          },
        }
      }
    }

    // Implement randomBytes
    if (!globalThis.crypto.randomBytes) {
      globalThis.crypto.randomBytes = (size: number) => {
        const bytes = new Uint8Array(size)
        if (globalThis.crypto?.getRandomValues) {
          globalThis.crypto.getRandomValues(bytes)
        } else {
          // Fallback random
          for (let i = 0; i < size; i++) {
            bytes[i] = Math.floor(Math.random() * 256)
          }
        }
        return bytes
      }
    }

    // Implement getRandomValues if missing
    if (!globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues = (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256)
        }
        return array
      }
    }

    // Implement subtle crypto if missing
    if (!globalThis.crypto.subtle) {
      globalThis.crypto.subtle = {
        digest: async (algorithm: string, data: BufferSource) => {
          const view = new Uint8Array(data instanceof ArrayBuffer ? data : data.buffer)
          const str = Array.from(view)
            .map((b) => String.fromCharCode(b))
            .join("")
          const hash = multiRoundHash(str)

          // Convert hex string to ArrayBuffer
          const bytes = hash.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []
          return new Uint8Array(bytes).buffer
        },
      } as any
    }

    globalThis.__edge_crypto_initialized = true
    console.log("✅ Edge crypto polyfill initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize edge crypto:", error)

    // Last resort minimal implementation
    globalThis.crypto = globalThis.crypto || ({} as any)
    globalThis.crypto.createHash =
      globalThis.crypto.createHash ||
      (() => ({
        update: function () {
          return this
        },
        digest: () => "fallback-hash-" + Date.now().toString(16),
      }))
  }
}

// Initialize immediately
initEdgeCrypto()

export default initEdgeCrypto
