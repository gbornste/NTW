"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface FavoriteItem {
  id: string
  title: string
  description: string
  image: string
  price: string
  tags: string[]
  dateAdded: string
}

interface FavoritesState {
  items: FavoriteItem[]
  itemCount: number
  isLoading: boolean
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "CLEAR_FAVORITES" }
  | { type: "LOAD_FAVORITES"; payload: FavoriteItem[] }
  | { type: "SET_LOADING"; payload: boolean }

interface FavoritesContextType {
  state: FavoritesState
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
  isLoading: boolean
  itemCount: number
  items: FavoriteItem[]
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "ADD_FAVORITE": {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (existingIndex >= 0) {
        // Item already exists, don't add duplicate
        return state
      }
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      }
    }

    case "REMOVE_FAVORITE": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      }
    }

    case "CLEAR_FAVORITES": {
      return { items: [], itemCount: 0, isLoading: false }
    }

    case "LOAD_FAVORITES": {
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.length,
        isLoading: false,
      }
    }

    default:
      return state
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, {
    items: [],
    itemCount: 0,
    isLoading: true,
  })

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        // Add a small delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 300))

        const savedFavorites = localStorage.getItem("notrumpnway-favorites")
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites)
          if (Array.isArray(parsedFavorites)) {
            console.log(`❤️ Loaded ${parsedFavorites.length} favorites from localStorage`)
            dispatch({ type: "LOAD_FAVORITES", payload: parsedFavorites })
          } else {
            console.log("❤️ Invalid favorites data in localStorage, starting fresh")
            dispatch({ type: "LOAD_FAVORITES", payload: [] })
          }
        } else {
          console.log("❤️ No saved favorites found, starting fresh")
          dispatch({ type: "LOAD_FAVORITES", payload: [] })
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
        dispatch({ type: "LOAD_FAVORITES", payload: [] })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadFavorites()
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem("notrumpnway-favorites", JSON.stringify(state.items))
        console.log(`💾 Saved ${state.items.length} favorites to localStorage`)
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error)
      }
    }
  }, [state.items, state.isLoading])

  const addFavorite = (item: FavoriteItem) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      id: String(item.id),
      title: String(item.title),
      description: String(item.description),
      image: String(item.image),
      price: String(item.price),
      tags: item.tags || [],
      dateAdded: new Date().toISOString(),
    }

    console.log(`❤️ Adding item to favorites:`, {
      id: favoriteItem.id,
      title: favoriteItem.title,
    })
    dispatch({ type: "ADD_FAVORITE", payload: favoriteItem })
  }

  const removeFavorite = (id: string) => {
    console.log(`💔 Removing item from favorites: ${id}`)
    dispatch({ type: "REMOVE_FAVORITE", payload: id })
  }

  const clearFavorites = () => {
    console.log(`🧹 Clearing all favorites`)
    dispatch({ type: "CLEAR_FAVORITES" })
  }

  const isFavorite = (id: string): boolean => {
    return state.items.some((item) => item.id === id)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
  }

  const contextValue: FavoritesContextType = {
    state,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    toggleFavorite,
    isLoading: state.isLoading,
    itemCount: state.itemCount,
    items: state.items,
  }

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
