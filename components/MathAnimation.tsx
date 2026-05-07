'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'

interface AnimationStep {
  id: number
  title: string
  content: string
  visual: React.ReactNode
}

interface MathAnimationProps {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fraction'
}

// 加法动画
const AdditionAnimation = () => {
  const [step, setStep] = useState(0)
  const [leftCount, setLeftCount] = useState(3)
  const [rightCount, setRightCount] = useState(4)
  
  const steps = [
    { title: '初始状态', desc: '左边有3个苹果，右边有4个苹果' },
    { title: '合并', desc: '把两边的苹果放在一起' },
    { title: '数一数', desc: '1、2、3、4、5、6、7，一共7个' },
  ]
  
  return (
    <div className="p-6">
      <div className="flex justify-center items-center gap-8 mb-6">
        {/* 左边 */}
        <div className="flex gap-2">
          {Array.from({ length: step >= 1 ? 0 : leftCount }).map((_, i) => (
            <div key={i} className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
              🍎
            </div>
          ))}
        </div>
        
        {step < 1 && <div className="text-4xl font-bold text-indigo-500">+</div>}
        
        {/* 右边 */}
        <div className="flex gap-2">
          {Array.from({ length: step >= 1 ? 0 : rightCount }).map((_, i) => (
            <div key={i} className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              🍎
            </div>
          ))}
        </div>
        
        {step < 1 && <div className="text-4xl font-bold text-indigo-500">=</div>}
        
        {/* 结果 */}
        <div className="flex gap-2 flex-wrap max-w-[200px]">
          {step >= 1 && Array.from({ length: leftCount + rightCount }).map((_, i) => (
            <div 
              key={i} 
              className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-2xl"
              style={{ 
                animation: step === 1 ? 'slideIn 0.5s ease-out forwards' : 'none',
                animationDelay: `${i * 0.1}s`
              }}
            >
              🍎
            </div>
          ))}
        </div>
      </div>
      
      {/* 算式 */}
      <div className="text-center text-3xl font-bold text-slate-700">
        3 + 4 = <span className={step >= 2 ? 'text-green-500' : 'text-slate-300'}>7</span>
      </div>
      
      {/* 控制 */}
      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
          {steps[step]?.title}
        </span>
        <button 
          onClick={() => setStep(Math.min(2, step + 1))}
          className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-center text-slate-500 mt-4">{steps[step]?.desc}</p>
    </div>
  )
}

// 乘法动画
const MultiplicationAnimation = () => {
  const [step, setStep] = useState(0)
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-3 mb-6 max-w-[300px] mx-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl transition-all duration-500"
            style={{
              opacity: step >= 1 || i < 3 ? 1 : 0.3,
              transform: step >= 2 && i < 12 ? 'scale(1.1)' : 'scale(1)',
              backgroundColor: step >= 2 && i < 12 ? '#818cf8' : '#e0e7ff',
            }}
          >
            🌟
          </div>
        ))}
      </div>
      
      {/* 算式 */}
      <div className="text-center text-3xl font-bold text-slate-700 mb-4">
        3 × 4 = <span className={step >= 2 ? 'text-green-500' : 'text-slate-300'}>12</span>
      </div>
      
      {/* 解释 */}
      <div className="text-center text-slate-600">
        {step === 0 && '3 × 4 表示 3个4 或 4个3'}
        {step === 1 && '一行有3个，一共有4行'}
        {step === 2 && '3+3+3+3 = 12，或者 4+4+4 = 12'}
      </div>
      
      {/* 控制 */}
      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
          步骤 {step + 1}/3
        </span>
        <button 
          onClick={() => setStep(Math.min(2, step + 1))}
          className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// 分数动画
const FractionAnimation = () => {
  const [numerator, setNumerator] = useState(1)
  const [denominator, setDenominator] = useState(4)
  
  return (
    <div className="p-6">
      {/* 圆形分数可视化 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* 背景圆 */}
          <div className="absolute inset-0 rounded-full border-8 border-slate-200" />
          
          {/* 分数扇形 */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#6366f1"
              strokeWidth="10"
              strokeDasharray={`${(numerator / denominator) * 283} 283`}
              className="transition-all duration-500"
            />
          </svg>
          
          {/* 中心文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">
                {numerator}/{denominator}
              </div>
              <div className="text-sm text-slate-500">
                {Math.round((numerator / denominator) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 控制 */}
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <label className="text-sm text-slate-500 block mb-2">分子（取几份）</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setNumerator(Math.max(1, numerator - 1))}
              className="w-10 h-10 bg-slate-100 rounded-lg hover:bg-slate-200"
            >-</button>
            <span className="w-12 text-center text-xl font-bold">{numerator}</span>
            <button 
              onClick={() => setNumerator(Math.min(denominator, numerator + 1))}
              className="w-10 h-10 bg-slate-100 rounded-lg hover:bg-slate-200"
            >+</button>
          </div>
        </div>
        
        <div className="text-center">
          <label className="text-sm text-slate-500 block mb-2">分母（分几份）</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setDenominator(Math.max(2, denominator - 1))
                setNumerator(Math.min(numerator, denominator - 1))
              }}
              className="w-10 h-10 bg-slate-100 rounded-lg hover:bg-slate-200"
            >-</button>
            <span className="w-12 text-center text-xl font-bold">{denominator}</span>
            <button 
              onClick={() => setDenominator(Math.min(12, denominator + 1))}
              className="w-10 h-10 bg-slate-100 rounded-lg hover:bg-slate-200"
            >+</button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-slate-600 mt-6">
        把一个圆平均分成{denominator}份，取其中的{numerator}份，就是{numerator}/{denominator}
      </p>
    </div>
  )
}

export default function MathAnimation({ type }: MathAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const animations = {
    addition: <AdditionAnimation />,
    multiplication: <MultiplicationAnimation />,
    fraction: <FractionAnimation />,
    subtraction: <AdditionAnimation />, // 复用
    division: <MultiplicationAnimation />, // 复用
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <h3 className="font-bold flex items-center gap-2">
          <Play className="w-5 h-5" />
          动画演示
        </h3>
      </div>
      {animations[type] || animations.addition}
    </div>
  )
}
