import { initUniversalCrypto } from "@/lib/universal-crypto-polyfill"

export async function GET() {
  try {
    console.log("🧪 Starting crypto test...")

    // Initialize crypto
    initUniversalCrypto()

    // Basic availability tests
    const basicTests = {
      cryptoExists: !!globalThis.crypto,
      createHashExists: !!globalThis.crypto?.createHash,
      randomBytesExists: !!globalThis.crypto?.randomBytes,
      getRandomValuesExists: !!globalThis.crypto?.getRandomValues,
      subtleExists: !!globalThis.crypto?.subtle,
    }

    console.log("🔍 Basic tests:", basicTests)

    // Functional tests
    const functionalTests: any = {}

    // Test createHash
    try {
      const hash = globalThis.crypto.createHash("sha256")
      hash.update("test-string")
      const hexResult = hash.digest("hex")
      const base64Result = globalThis.crypto.createHash("sha256")
      base64Result.update("test-string")
      const base64 = base64Result.digest("base64")

      functionalTests.hashTest = {
        status: "success",
        hexLength: hexResult.length,
        base64Length: base64.length,
        hexSample: hexResult.substring(0, 16),
      }
    } catch (error) {
      functionalTests.hashTest = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test randomBytes
    try {
      const random = globalThis.crypto.randomBytes(16)
      functionalTests.randomTest = {
        status: "success",
        length: random.length,
        type: random.constructor.name,
        sample: Array.from(random.slice(0, 4))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      }
    } catch (error) {
      functionalTests.randomTest = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test getRandomValues
    try {
      const array = new Uint8Array(8)
      globalThis.crypto.getRandomValues(array)
      functionalTests.getRandomValuesTest = {
        status: "success",
        length: array.length,
        sample: Array.from(array.slice(0, 4))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      }
    } catch (error) {
      functionalTests.getRandomValuesTest = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test subtle crypto
    try {
      const data = new TextEncoder().encode("test")
      const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data)
      const hashArray = new Uint8Array(hashBuffer)

      functionalTests.subtleTest = {
        status: "success",
        length: hashArray.length,
        sample: Array.from(hashArray.slice(0, 4))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      }
    } catch (error) {
      functionalTests.subtleTest = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    const allTests = {
      ...basicTests,
      ...functionalTests,
      timestamp: new Date().toISOString(),
      environment: {
        runtime: "edge",
        nodeEnv: process.env.NODE_ENV,
      },
    }

    console.log("🧪 All tests completed:", allTests)

    return Response.json({
      success: true,
      message: "Crypto tests completed",
      results: allTests,
    })
  } catch (error) {
    console.error("❌ Crypto test failed:", error)

    return Response.json(
      {
        success: false,
        message: "Crypto test failed",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export const runtime = "edge"
