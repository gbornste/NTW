export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== "undefined" && "serviceWorker" in navigator
}

export const registerServiceWorker = async (swPath = "/sw.js"): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn("Service Workers are not supported in this browser")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: "/",
    })

    console.log("Service Worker registered successfully:", registration.scope)
    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const result = await registration.unregister()
    console.log("Service Worker unregistered:", result)
    return result
  } catch (error) {
    console.error("Service Worker unregistration failed:", error)
    return false
  }
}
