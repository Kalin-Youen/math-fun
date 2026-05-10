'use client'

import { useState, useEffect } from 'react'

export type LuoXiaoHeiType = 
  | 'default'   // 黑色 - 默认
  | 'teacher'   // 紫色 - 老师
  | 'helper'    // 蓝色 - 助手
  | 'cheer'     // 橙色 - 加油
  | 'think'     // 绿色 - 思考
  | 'success'   // 金色 - 成功
  | 'grade1'    // 绿色 - 一年级
  | 'grade2'    // 青色 - 二年级
  | 'grade3'    // 蓝色 - 三年级
  | 'grade4'    // 紫色 - 四年级
  | 'grade5'    // 粉色 - 五年级
  | 'grade6'    // 红色 - 六年级

interface LuoXiaoHeiProps {
  type?: LuoXiaoHeiType
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  animate?: boolean
  className?: string
}

// 颜色配置 - 身体颜色可变，但耳朵内侧必须是标志性的绿色
const colorConfig: Record<LuoXiaoHeiType, { body: string; eye: string; earInner: string; accent: string }> = {
  default: { body: '#1a1a1a', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  teacher: { body: '#7C3AED', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  helper: { body: '#3B82F6', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  cheer: { body: '#F97316', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  think: { body: '#22C55E', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  success: { body: '#EAB308', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade1: { body: '#22C55E', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade2: { body: '#14B8A6', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade3: { body: '#3B82F6', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade4: { body: '#8B5CF6', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade5: { body: '#EC4899', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
  grade6: { body: '#EF4444', eye: '#FFFFFF', earInner: '#7CB342', accent: '#5DADE2' },
}

const sizeConfig = {
  sm: { width: 50, height: 50 },
  md: { width: 80, height: 80 },
  lg: { width: 120, height: 120 },
  xl: { width: 160, height: 160 },
}

export default function LuoXiaoHei({ 
  type = 'default', 
  size = 'md', 
  message,
  animate = true,
  className = ''
}: LuoXiaoHeiProps) {
  const [bobY, setBobY] = useState(0)
  const colors = colorConfig[type]
  const { width, height } = sizeConfig[size]

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        setBobY(prev => prev === 0 ? -3 : 0)
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [animate])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className="relative transition-transform duration-300 ease-in-out"
        style={{ width, height, transform: `translateY(${bobY}px)` }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* ====== 小猫经典形象 ======} */}
          
          {/* 尾巴 - 细长弯曲 */}
          <path 
            d="M140 140 Q170 120 175 90 Q180 60 165 50" 
            stroke={colors.body} 
            strokeWidth="12" 
            strokeLinecap="round"
            fill="none"
          />
          
          {/* 身体 - 椭圆形，比头小 */}
          <ellipse cx="100" cy="155" rx="40" ry="35" fill={colors.body} />
          
          {/* 头部 - 圆形，大大的 */}
          <circle cx="100" cy="95" r="55" fill={colors.body} />
          
          {/* ====== 耳朵 - 小猫的标志性特征 ======} */}
          {/* 左耳朵外轮廓 - 三角形 */}
          <path d="M55 60 L45 20 L80 50 Z" fill={colors.body} />
          {/* 左耳朵内侧 - 标志性的绿色！ */}
          <path d="M58 55 L52 28 L72 50 Z" fill={colors.earInner} />
          
          {/* 右耳朵外轮廓 */}
          <path d="M145 60 L155 20 L120 50 Z" fill={colors.body} />
          {/* 右耳朵内侧 - 标志性的绿色！ */}
          <path d="M142 55 L148 28 L128 50 Z" fill={colors.earInner} />
          
          {/* ====== 眼睛 - 小猫的灵魂 ======} */}
          {/* 左眼白 - 大大的椭圆 */}
          <ellipse cx="72" cy="90" rx="22" ry="26" fill={colors.eye} />
          {/* 左眼珠 - 黑色圆形，稍微偏上 */}
          <ellipse cx="74" cy="88" rx="10" ry="14" fill="#000000" />
          {/* 左眼高光 - 让眼睛有神 */}
          <circle cx="78" cy="82" r="5" fill="white" />
          <circle cx="70" cy="92" r="2" fill="white" opacity="0.6" />
          
          {/* 右眼白 */}
          <ellipse cx="128" cy="90" rx="22" ry="26" fill={colors.eye} />
          {/* 右眼珠 */}
          <ellipse cx="126" cy="88" rx="10" ry="14" fill="#000000" />
          {/* 右眼高光 */}
          <circle cx="130" cy="82" r="5" fill="white" />
          <circle cx="122" cy="92" r="2" fill="white" opacity="0.6" />
          
          {/* ====== 鼻子 - 小小的蓝色三角形 ====== */}
          <path d="M94 115 L106 115 L100 123 Z" fill={colors.accent} />
          
          {/* ====== 嘴巴 - 小小的W形或一条线 ====== */}
          <path 
            d="M88 130 Q100 138 112 130" 
            stroke="#000000" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* ====== 腮红 - 淡淡的粉色 ====== */}
          <ellipse cx="55" cy="105" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />
          <ellipse cx="145" cy="105" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />
          
          {/* 小手 */}
          <ellipse cx="65" cy="165" rx="12" ry="8" fill={colors.body} />
          <ellipse cx="135" cy="165" rx="12" ry="8" fill={colors.body} />
          
          {/* 小脚 */}
          <ellipse cx="80" cy="185" rx="15" ry="8" fill={colors.body} />
          <ellipse cx="120" cy="185" rx="15" ry="8" fill={colors.body} />
        </svg>
      </div>
      
      {/* 对话气泡 */}
      {message && (
        <div className="relative mt-2 max-w-xs">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
            border-l-8 border-r-8 border-b-8 
            border-l-transparent border-r-transparent border-b-white"/>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-xl border-2 border-slate-100">
            <p className="text-sm text-slate-700 font-medium text-center">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 简化版小猫 - 用于图标等小尺寸
export function MiniLuoXiaoHei({ type = 'default' }: { type?: LuoXiaoHeiType }) {
  const colors = colorConfig[type]
  return (
    <svg viewBox="0 0 50 50" className="w-full h-full">
      {/* 身体 */}
      <ellipse cx="25" cy="38" rx="10" ry="8" fill={colors.body} />
      {/* 头 */}
      <circle cx="25" cy="24" r="14" fill={colors.body} />
      {/* 左耳外 */}
      <path d="M14 16 L11 5 L20 14 Z" fill={colors.body} />
      {/* 左耳内 - 绿色 */}
      <path d="M15 15 L13 7 L19 13 Z" fill={colors.earInner} />
      {/* 右耳外 */}
      <path d="M36 16 L39 5 L30 14 Z" fill={colors.body} />
      {/* 右耳内 - 绿色 */}
      <path d="M35 15 L37 7 L31 13 Z" fill={colors.earInner} />
      {/* 左眼 */}
      <ellipse cx="19" cy="23" rx="5" ry="6" fill={colors.eye} />
      <ellipse cx="20" cy="22" rx="2.5" ry="3.5" fill="#000" />
      <circle cx="21" cy="20" r="1.2" fill="white" />
      {/* 右眼 */}
      <ellipse cx="31" cy="23" rx="5" ry="6" fill={colors.eye} />
      <ellipse cx="30" cy="22" rx="2.5" ry="3.5" fill="#000" />
      <circle cx="31" cy="20" r="1.2" fill="white" />
      {/* 鼻子 */}
      <path d="M23 29 L27 29 L25 32 Z" fill={colors.accent} />
    </svg>
  )
}

// 浮动小猫助手
export function FloatingLuoXiaoXiaoHei({ 
  type = 'helper',
  onClick,
  tooltip
}: { 
  type?: LuoXiaoHeiType
  onClick?: () => void
  tooltip?: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {showTooltip && tooltip && (
        <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-xl bg-slate-800 px-4 py-2 text-sm text-white shadow-xl">
          {tooltip}
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800"/>
        </div>
      )}
      <div className="rounded-full bg-white p-2 shadow-xl hover:shadow-2xl transition-shadow group-hover:scale-110">
        <LuoXiaoHei type={type} size="md" animate />
      </div>
    </div>
  )
}

// 欢迎小猫
export function WelcomeLuoXiaoHei({ 
  gradeId,
  userName = '小朋友'
}: { 
  gradeId?: number
  userName?: string
}) {
  const getGradeType = (): LuoXiaoHeiType => {
    if (!gradeId) return 'default'
    return `grade${gradeId}` as LuoXiaoHeiType
  }

  const greetings = [
    `你好呀，${userName}！我是小猫，今天一起学习吧！🎉`,
    `欢迎来到数学乐园！让我带你一起探索~ ✨`,
    `学习是一件很有趣的事情哦，相信你一定可以！💪`,
  ]

  const [greetingIndex, setGreetingIndex] = useState(0)

  return (
    <div className="flex items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-violet-50 to-purple-50 shadow-lg border border-violet-100">
      <LuoXiaoHei type={getGradeType()} size="xl" animate />
      <div className="flex-1">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-lg text-slate-800 leading-relaxed">{greetings[greetingIndex]}</p>
        </div>
        <div className="flex gap-2">
          {greetings.map((_, i) => (
            <button
              key={i}
              onClick={() => setGreetingIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === greetingIndex ? 'bg-violet-500 w-6' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
