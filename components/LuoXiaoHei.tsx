'use client'

import { useState, useEffect } from 'react'

// 罗小黑角色类型
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

// 颜色配置
const colorConfig: Record<LuoXiaoHeiType, { primary: string; secondary: string; accent: string }> = {
  default: { primary: '#2D2D2D', secondary: '#4A4A4A', accent: '#FFD700' },
  teacher: { primary: '#7C3AED', secondary: '#A78BFA', accent: '#FBBF24' },
  helper: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#FCD34D' },
  cheer: { primary: '#F97316', secondary: '#FB923C', accent: '#FDE047' },
  think: { primary: '#22C55E', secondary: '#4ADE80', accent: '#FBBF24' },
  success: { primary: '#EAB308', secondary: '#FACC15', accent: '#FEF08A' },
  grade1: { primary: '#22C55E', secondary: '#4ADE80', accent: '#FBBF24' },
  grade2: { primary: '#14B8A6', secondary: '#2DD4BF', accent: '#FCD34D' },
  grade3: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#FBBF24' },
  grade4: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#FCD34D' },
  grade5: { primary: '#EC4899', secondary: '#F472B6', accent: '#FBBF24' },
  grade6: { primary: '#EF4444', secondary: '#F87171', accent: '#FDE047' },
}

// 尺寸配置
const sizeConfig = {
  sm: { width: 60, height: 60 },
  md: { width: 100, height: 100 },
  lg: { width: 150, height: 150 },
  xl: { width: 200, height: 200 },
}

export default function LuoXiaoHei({ 
  type = 'default', 
  size = 'md', 
  message,
  animate = true,
  className = ''
}: LuoXiaoHeiProps) {
  const [bounce, setBounce] = useState(false)
  const colors = colorConfig[type]
  const { width, height } = sizeConfig[size]

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        setBounce(b => !b)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [animate])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 罗小黑 SVG */}
      <div 
        className={`transition-transform duration-300 ${bounce ? '-translate-y-2' : ''}`}
        style={{ width, height }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 身体 */}
          <ellipse cx="100" cy="130" rx="50" ry="45" fill={colors.primary}/>
          
          {/* 头部 */}
          <circle cx="100" cy="80" r="55" fill={colors.primary}/>
          
          {/* 耳朵 */}
          <path d="M55 40 L45 10 L75 35 Z" fill={colors.primary}/>
          <path d="M145 40 L155 10 L125 35 Z" fill={colors.primary}/>
          <path d="M58 38 L52 18 L72 35 Z" fill={colors.secondary}/>
          <path d="M142 38 L148 18 L128 35 Z" fill={colors.secondary}/>
          
          {/* 脸部白色区域 */}
          <ellipse cx="100" cy="90" rx="35" ry="30" fill="white"/>
          
          {/* 眼睛 */}
          <ellipse cx="80" cy="75" rx="12" ry="14" fill="white"/>
          <ellipse cx="120" cy="75" rx="12" ry="14" fill="white"/>
          <ellipse cx="82" cy="77" rx="6" ry="8" fill="#1a1a1a"/>
          <ellipse cx="122" cy="77" rx="6" ry="8" fill="#1a1a1a"/>
          <circle cx="84" cy="74" r="2" fill="white"/>
          <circle cx="124" cy="74" r="2" fill="white"/>
          
          {/* 鼻子 */}
          <ellipse cx="100" cy="95" rx="5" ry="4" fill="#FF6B6B"/>
          
          {/* 嘴巴 */}
          <path d="M90 102 Q100 112 110 102" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          
          {/* 胡须 */}
          <line x1="65" y1="90" x2="45" y2="85" stroke="#1a1a1a" strokeWidth="1.5"/>
          <line x1="65" y1="95" x2="42" y2="95" stroke="#1a1a1a" strokeWidth="1.5"/>
          <line x1="65" y1="100" x2="45" y2="105" stroke="#1a1a1a" strokeWidth="1.5"/>
          <line x1="135" y1="90" x2="155" y2="85" stroke="#1a1a1a" strokeWidth="1.5"/>
          <line x1="135" y1="95" x2="158" y2="95" stroke="#1a1a1a" strokeWidth="1.5"/>
          <line x1="135" y1="100" x2="155" y2="105" stroke="#1a1a1a" strokeWidth="1.5"/>
          
          {/* 尾巴 */}
          <path d="M150 130 Q180 120 170 150 Q165 170 145 160" stroke={colors.primary} strokeWidth="12" fill="none" strokeLinecap="round"/>
          
          {/* 前爪 */}
          <ellipse cx="75" cy="165" rx="15" ry="10" fill={colors.primary}/>
          <ellipse cx="125" cy="165" rx="15" ry="10" fill={colors.primary}/>
          
          {/* 爪子细节 */}
          <circle cx="68" cy="168" r="3" fill={colors.secondary}/>
          <circle cx="75" cy="170" r="3" fill={colors.secondary}/>
          <circle cx="82" cy="168" r="3" fill={colors.secondary}/>
          <circle cx="118" cy="168" r="3" fill={colors.secondary}/>
          <circle cx="125" cy="170" r="3" fill={colors.secondary}/>
          <circle cx="132" cy="168" r="3" fill={colors.secondary}/>
          
          {/* 项圈 */}
          <ellipse cx="100" cy="125" rx="25" ry="8" fill={colors.accent}/>
          <circle cx="100" cy="128" r="6" fill={colors.accent} stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* 对话气泡 */}
      {message && (
        <div className="relative mt-2 max-w-xs">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
            border-l-8 border-r-8 border-b-8 
            border-l-transparent border-r-transparent border-b-white"/>
          <div className="rounded-xl bg-white px-4 py-2 shadow-lg text-center">
            <p className="text-sm text-slate-700">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 罗小黑对话组件
export function LuoXiaoHeiChat({ 
  type = 'teacher',
  messages,
  currentStep = 0
}: { 
  type?: LuoXiaoHeiType
  messages: string[]
  currentStep?: number
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [currentStep])

  if (!visible || !messages[currentStep]) return null

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white shadow-lg">
      <LuoXiaoHei type={type} size="lg" animate />
      <div className="flex-1">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <p className="text-slate-700 leading-relaxed">{messages[currentStep]}</p>
        </div>
        <div className="flex gap-2 mt-2">
          {messages.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep ? 'bg-violet-500 w-4' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 浮动罗小黑助手
export function FloatingLuoXiaoHei({ 
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
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {showTooltip && tooltip && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-sm text-white shadow-lg">
          {tooltip}
        </div>
      )}
      <div className="rounded-full bg-white p-2 shadow-lg hover:shadow-xl transition-shadow">
        <LuoXiaoHei type={type} size="sm" animate />
      </div>
    </div>
  )
}

// 欢迎罗小黑
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
    `你好呀，${userName}！我是罗小黑，今天一起学习吧！`,
    `欢迎来到数学乐园！让我带你一起探索~`,
    `学习是一件很有趣的事情哦，相信你一定可以！`,
  ]

  const [greetingIndex, setGreetingIndex] = useState(0)

  return (
    <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 shadow-lg">
      <LuoXiaoHei type={getGradeType()} size="xl" animate />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-violet-800 mb-2">
          {greetings[greetingIndex]}
        </h3>
        <p className="text-slate-600 text-sm">
          点击下方开始你的学习之旅吧！
        </p>
        <div className="flex gap-2 mt-3">
          {greetings.map((_, i) => (
            <button
              key={i}
              onClick={() => setGreetingIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === greetingIndex ? 'bg-violet-500 w-4' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
