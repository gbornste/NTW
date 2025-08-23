"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
  options: Record<string, string>
  price: number
  title?: string
  image?: string
  description?: string
  dateAdded?: string
}

interface CartState {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  isLoading: boolean
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string; variantId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }

interface CartContextType {
  state: CartState
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  getCartItemCount: () => number
  getTotalPrice: () => number
  isInCart: (productId: string, variantId: string) => boolean
  isLoading: boolean
  items: CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "ADD_TO_CART": {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId && item.variantId === action.payload.variantId
      )
      
      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, dateAdded: new Date().toISOString() }]
      }

      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        itemCount,
        totalPrice,
      }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (item) => !(item.productId === action.payload.productId && item.variantId === action.payload.variantId)
      )
      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        itemCount,
        totalPrice,
      }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.productId === action.payload.productId && item.variantId === action.payload.variantId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)

      const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        itemCount,
        totalPrice,
      }
    }

    case "CLEAR_CART": {
      return { items: [], itemCount: 0, totalPrice: 0, isLoading: false }
    }

    case "LOAD_CART": {
      const itemCount = action.payload.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = action.payload.reduce((total, item) => total + (item.price * item.quantity), 0)

      return {
        ...state,
        items: action.payload,
        itemCount,
        totalPrice,
        isLoading: false,
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    totalPrice: 0,
    isLoading: true,
  })

  useEffect(() => {
    const loadCart = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        await new Promise((resolve) => setTimeout(resolve, 300))
        const savedCart = localStorage.getItem("notrumpnway-cart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            dispatch({ type: "LOAD_CART", payload: parsedCart })
          } else {
            dispatch({ type: "LOAD_CART", payload: [] })
          }
        } else {
          dispatch({ type: "LOAD_CART", payload: [] })
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        dispatch({ type: "LOAD_CART", payload: [] })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }
    loadCart()
  }, [])

  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem("notrumpnway-cart", JSON.stringify(state.items))
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }, [state.items, state.isLoading])

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item })
  }

  const removeFromCart = (productId: string, variantId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, variantId } })
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartItemCount = (): number => {
    return state.itemCount
  }

  const getTotalPrice = (): number => {
    return state.totalPrice
  }

  const isInCart = (productId: string, variantId: string): boolean => {
    return state.items.some((item) => item.productId === productId && item.variantId === variantId)
  }

  const contextValue: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getTotalPrice,
    isInCart,
    isLoading: state.isLoading,
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
