'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CartItem {
  productId: string
  variantId: string
  title: string
  price: number
  image: string
  quantity: number
  options: {
    color?: string
    size?: string
  }
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; productId: string; variantId: string; options: { color?: string; size?: string } }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantId: string; options: { color?: string; size?: string }; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (productId: string, variantId: string, options: { color?: string; size?: string }) => void
  updateQuantity: (productId: string, variantId: string, options: { color?: string; size?: string }, quantity: number) => void
  clearCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => 
        item.productId === action.item.productId && 
        item.variantId === action.item.variantId &&
        JSON.stringify(item.options) === JSON.stringify(action.item.options)
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        )
      } else {
        newItems = [...state.items, action.item]
      }

      const total = newItems.reduce((sum, item) => sum + ((item.price / 100) * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => 
        !(item.productId === action.productId && 
          item.variantId === action.variantId &&
          JSON.stringify(item.options) === JSON.stringify(action.options))
      )

      const total = newItems.reduce((sum, item) => sum + ((item.price / 100) * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return cartReducer(state, {
          type: 'REMOVE_FROM_CART',
          productId: action.productId,
          variantId: action.variantId,
          options: action.options
        })
      }

      const newItems = state.items.map(item =>
        item.productId === action.productId && 
        item.variantId === action.variantId &&
        JSON.stringify(item.options) === JSON.stringify(action.options)
          ? { ...item, quantity: action.quantity }
          : item
      )

      const total = newItems.reduce((sum, item) => sum + ((item.price / 100) * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'LOAD_CART': {
      const total = action.items.reduce((sum, item) => sum + ((item.price / 100) * item.quantity), 0)
      const itemCount = action.items.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: action.items,
        total,
        itemCount
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  })

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'LOAD_CART', items: parsedCart })
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const addToCart = async (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', item })
  }

  const removeFromCart = (productId: string, variantId: string, options: { color?: string; size?: string }) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId, variantId, options })
  }

  const updateQuantity = (productId: string, variantId: string, options: { color?: string; size?: string }, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, options, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
