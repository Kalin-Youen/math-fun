'use client'

import { ReactNode, useEffect, useState, useRef } from 'react'

// 数字滚动动画组件
export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  useEffect(() => { setDisplay(value) }, [value])
  return <span className="inline-block tabular-nums">{display}</span>
}

// 进度条动画
export function AnimatedProgress({ progress, color = 'bg-gradient-to-r from-indigo-500 to-purple-500' }: { progress: number; color?: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setWidth(progress) }, [progress])
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// 浮动动画
export function FloatingElement({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="animate-bounce" style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }}>
      {children}
    </div>
  )
}

// 页面包装器
export function AnimatedPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={className}>{children}</main>
}

// 卡片包装器
export function AnimatedCard({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

// 模态框包装器
export function AnimatedModal({ children, isOpen, onClose }: { children: ReactNode; isOpen: boolean; onClose?: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// 成功动画
export function SuccessAnimation({ children }: { children: ReactNode }) {
  return <div className="animate-[scale-in_0.3s_ease-out]">{children}</div>
}

// 星星闪烁动画
export function SparkleEffect({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>
}

// 打字机效果
export function TypewriterText({ text }: { text: string }) {
  return <span>{text}</span>
}
