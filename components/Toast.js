'use client'

import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose && onClose(), 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose && onClose(), 300)
  }

  if (!isVisible) return null

  const typeStyles = {
    success: {
      background: 'rgba(34, 197, 94, 0.1)',
      border: '0.5px solid rgba(34, 197, 94, 0.3)',
      color: '#22c55e',
      icon: '✅'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '0.5px solid rgba(239, 68, 68, 0.3)',
      color: '#ef4444',
      icon: '❌'
    },
    info: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '0.5px solid rgba(59, 130, 246, 0.3)',
      color: '#3b82f6',
      icon: 'ℹ️'
    }
  }

  const style = typeStyles[type] || typeStyles.success

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        background: style.background,
        border: style.border,
        borderRadius: 12,
        padding: '12px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 400,
        animation: isVisible ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-in',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span style={{ fontSize: 16 }}>{style.icon}</span>
      <span style={{ color: style.color, fontSize: 14, fontWeight: 500, flex: 1 }}>
        {message}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: 16,
          padding: 4,
          borderRadius: 4,
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.target.style.opacity = 1}
        onMouseLeave={e => e.target.style.opacity = 0.7}
      >
        ×
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}