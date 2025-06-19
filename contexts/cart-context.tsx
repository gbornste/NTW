"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
  variant: string
  variantTitle?: string
  options?: Record<string, string>
  customization?: {
    giftWrap?: boolean
    giftMessage?: string
    specialInstructions?: string
    rushDelivery?: boolean
    expressShipping?: boolean
  }
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
  subtotal: number
  itemCount: number
  items: CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
        return calculateCartTotals({ ...state, items: updatedItems })
      } else {
        // Add new item
        return calculateCartTotals({ ...state, items: [...state.items, action.payload] })
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      return calculateCartTotals({ ...state, items: updatedItems })
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter((item) => item.id !== action.payload.id)
        return calculateCartTotals({ ...state, items: updatedItems })
      } else {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        )
        return calculateCartTotals({ ...state, items: updatedItems })
      }
    }

    case "CLEAR_CART": {
      return { items: [], total: 0, itemCount: 0, isLoading: false }
    }

    case "LOAD_CART": {
      return calculateCartTotals({ ...state, items: action.payload, isLoading: false })
    }

    default:
      return state
  }
}

function calculateCartTotals(state: CartState): CartState {
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...state, total, itemCount }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
  })

  // Check if we're on the client side
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!isClient) return

    const loadCart = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        // Add a small delay to simulate loading (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const savedCart = localStorage.getItem("notrumpnway-cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            console.log(`🛒 Loaded ${parsedCart.length} items from localStorage`)
            dispatch({ type: "LOAD_CART", payload: parsedCart })
          } else {
            console.log("🛒 Invalid cart data in localStorage, starting fresh")
            dispatch({ type: "LOAD_CART", payload: [] })
          }
        } else {
          console.log("🛒 No saved cart found, starting fresh")
          dispatch({ type: "LOAD_CART", payload: [] })
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        dispatch({ type: "LOAD_CART", payload: [] })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadCart()
  }, [isClient])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading && isClient) {
      try {
        localStorage.setItem("notrumpnway-cart", JSON.stringify(state.items))
        console.log(`💾 Saved ${state.items.length} items to localStorage`)
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [state.items, state.isLoading, isClient])

  const addItem = (item: CartItem) => {
    // Ensure all values are properly converted to strings and numbers
    const sanitizedItem: CartItem = {
      ...item,
      id: String(item.id),
      productId: String(item.productId),
      variantId: String(item.variantId),
      name: String(item.name),
      variant: String(item.variant),
      variantTitle: String(item.variantTitle || item.variant),
      image: String(item.image),
      price: Number(item.price),
      quantity: Number(item.quantity),
      options: item.options || {},
      customization: item.customization || {},
    }

    console.log(`🛒 Adding item to cart:`, {
      id: sanitizedItem.id,
      name: sanitizedItem.name,
      price: sanitizedItem.price,
      quantity: sanitizedItem.quantity,
      customization: sanitizedItem.customization,
    })
    dispatch({ type: "ADD_ITEM", payload: sanitizedItem })
  }

  const removeItem = (id: string) => {
    console.log(`🗑️ Removing item from cart: ${id}`)
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    console.log(`🔄 Updating quantity for ${id}: ${quantity}`)
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    console.log(`🧹 Clearing cart`)
    dispatch({ type: "CLEAR_CART" })
  }

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading: state.isLoading,
    subtotal: state.total,
    itemCount: state.itemCount,
    items: state.items,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
