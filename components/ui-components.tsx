'use client'

import { ReactNode, useState } from 'react'
import { Check, X, Trophy, Star, Zap, Target, Clock, Award, ChevronRight, Info, AlertCircle } from 'lucide-react'

// 玻璃态卡片
export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl border border-white/40 ${className}`}>
      {children}
    </div>
  )
}

// 渐变按钮
export function GradientButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = ''
}: { 
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: ReactNode
  className?: string
}) {
  const variants = {
    primary: 'from-indigo-500 via-purple-500 to-pink-500',
    secondary: 'from-slate-500 via-slate-600 to-slate-700',
    success: 'from-emerald-400 via-green-500 to-teal-500',
    danger: 'from-rose-400 via-red-500 to-pink-500',
    warning: 'from-amber-400 via-orange-500 to-yellow-500',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-r ${variants[variant]}
        ${sizes[size]} font-bold text-white shadow-lg
        transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  )
}

// 统计卡片
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'indigo',
  subtitle
}: { 
  title: string
  value: number | string
  icon: typeof Trophy
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet'
  subtitle?: string
}) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-400 to-green-600',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-pink-500',
    sky: 'from-sky-400 to-blue-500',
    violet: 'from-violet-400 to-purple-500',
  }

  return (
    <div className="group">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium opacity-80">{title}</span>
          <Icon className="h-5 w-5 opacity-80" />
        </div>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <div className="mt-1 text-xs opacity-70">{subtitle}</div>}
      </div>
    </div>
  )
}

// 成就徽章
export function AchievementBadge({ 
  title, 
  emoji, 
  unlocked, 
  description,
}: { 
  title: string
  emoji: string
  unlocked: boolean
  progress?: number
  description?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 transition ${unlocked ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200' : 'bg-slate-100 opacity-60'}`}>
      <div className="relative z-10 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg' : 'bg-slate-300 text-slate-500'}`}>
          {unlocked ? emoji : '🔒'}
        </div>
        <div className="flex-1">
          <div className={`font-bold ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
            {unlocked ? title : '???'}
          </div>
          {description && <div className="text-xs text-slate-500">{description}</div>}
        </div>
      </div>
    </div>
  )
}

// 进度环
export function ProgressRing({ 
  progress, 
  size = 80, 
  strokeWidth = 8,
  color = '#6366f1',
  children
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  children?: ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// 标签
export function Badge({ 
  children, 
  variant = 'default',
  size = 'md'
}: { 
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm', lg: 'px-3 py-1.5 text-base' }
  return <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>{children}</span>
}

// 加载骨架屏
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
}

// 空状态
export function EmptyState({ icon: Icon, title, description, action }: { icon: typeof Trophy; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-700">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}

// 等级/经验条
export function LevelBar({ level, currentXP, maxXP, showText = true }: { level: number; currentXP: number; maxXP: number; showText?: boolean }) {
  const progress = (currentXP / maxXP) * 100
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-lg">
        {level}
      </div>
      <div className="flex-1">
        {showText && (
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
            <span>等级 {level}</span>
            <span>{currentXP} / {maxXP} XP</span>
          </div>
        )}
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

// 提示框
export function AlertBanner({ type = 'info', title, message, onClose }: { type?: 'info' | 'success' | 'warning' | 'error'; title?: string; message: string; onClose?: () => void }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }
  const icons = { info: Info, success: Check, warning: AlertCircle, error: X }
  const Icon = icons[type]
  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex-1">
          {title && <div className="font-bold">{title}</div>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100"><X className="h-4 w-4" /></button>}
      </div>
    </div>
  )
}

// 步骤指示器
export function StepIndicator({ steps, currentStep, onStepClick }: { steps: string[]; currentStep: number; onStepClick?: (index: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={() => onStepClick?.(index)}
            disabled={index > currentStep}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
              index < currentStep ? 'bg-green-500 text-white' :
              index === currentStep ? 'bg-indigo-500 text-white ring-4 ring-indigo-100' :
              'bg-slate-200 text-slate-400'
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </button>
          {index < steps.length - 1 && <div className={`mx-2 h-0.5 w-8 ${index < currentStep ? 'bg-green-500' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  )
}

// 提示
export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white shadow-lg">
          {content}
        </div>
      )}
    </div>
  )
}
