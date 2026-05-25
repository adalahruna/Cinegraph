'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { OrderService } from '../lib/services/orders'

// Cart Context
const CartContext = createContext()

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
}

// Cart Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item
          )
        }
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock) }]
        }
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      }
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        }
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      }
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      }
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      }
    }
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  items: []
}

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cinegraph_cart')
      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cinegraph_cart', JSON.stringify(state))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state])

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    })
    
    // Return success for toast notification
    return {
      success: true,
      message: `${product.name} berhasil ditambahkan ke keranjang!`
    }
  }

  const removeFromCart = (productId) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { productId } 
    })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { productId, quantity } 
    })
  }

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  // Checkout function
  const checkout = async (orderData = {}) => {
    try {
      if (!state.items || state.items.length === 0) {
        return { order: null, error: 'Cart is empty' }
      }
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Checkout timeout - please try again')), 30000)
      })
      
      const checkoutPromise = OrderService.createOrder(state.items, orderData)
      
      const result = await Promise.race([checkoutPromise, timeoutPromise])
      
      if (result.order) {
        // Clear cart on successful order
        clearCart()
      }
      
      return result
    } catch (error) {
      console.error('Checkout error:', error)
      return { order: null, error: error.message || 'Checkout failed' }
    }
  }

  // Computed values
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    items: state.items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}