'use client'

import { useState, useEffect } from 'react'
import { Check, X, RotateCcw, Trophy } from 'lucide-react'

interface NumberCardGameProps {
  maxNumber?: number
  mode?: 'recognition' | 'sequence' | 'comparison'
}

export default function NumberCardGame({ maxNumber = 20, mode = 'recognition' }: NumberCardGameProps) {
  const [currentNumber, setCurrentNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [options, setOptions] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 生成选项
  const generateOptions = (correct: number) => {
    const opts = new Set<number>([correct])
    while (opts.size < 4) {
      const num = Math.floor(Math.random() * maxNumber) + 1
      if (num !== correct) opts.add(num)
    }
    return Array.from(opts).sort(() => Math.random() - 0.5)
  }

  // 初始化题目
  const initQuestion = () => {
    const num = Math.floor(Math.random() * maxNumber) + 1
    setCurrentNumber(num)
    setOptions(generateOptions(num))
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowSuccess(false)
  }

  useEffect(() => {
    initQuestion()
  }, [maxNumber, mode])

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answer)
    const correct = answer === currentNumber
    setIsCorrect(correct)
    
    if (correct) {
      setScore(s => s + 10)
      setTimeout(() => {
        setShowSuccess(true)
        setTimeout(initQuestion, 1500)
      }, 500)
    } else {
      setTimeout(() => {
        setSelectedAnswer(null)
        setIsCorrect(null)
      }, 1000)
    }
  }

  // 数字的可视化表示（用小圆点）
  const renderDots = (num: number) => {
    const dots = []
    for (let i = 0; i < num; i++) {
      dots.push(
        <div
          key={i}
          className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      )
    }
    return (
      <div className="grid grid-cols-5 gap-1 p-4">
        {dots}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-indigo-800">🔢 数字认知游戏</h3>
          <p className="text-sm text-indigo-600">选择正确的数字</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="mb-6">
        {/* 题目展示 */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="text-6xl font-bold text-indigo-700">
            {currentNumber}
          </div>
          <div className="rounded-xl bg-white p-4 shadow-inner">
            {renderDots(currentNumber)}
          </div>
          <p className="text-slate-600">这个数字是几？</p>
        </div>

        {/* 选项 */}
        <div className="grid grid-cols-4 gap-3">
          {options.map((num) => (
            <button
              key={num}
              onClick={() => handleAnswer(num)}
              disabled={selectedAnswer !== null}
              className={`
                relative rounded-xl p-4 text-2xl font-bold shadow-md transition-all duration-200
                hover:scale-105 active:scale-95
                ${selectedAnswer === num
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-white text-indigo-700 hover:bg-indigo-100'
                }
                ${selectedAnswer !== null && num === currentNumber && selectedAnswer !== num
                  ? 'bg-green-100 text-green-700'
                  : ''
                }
              `}
            >
              {num}
              {selectedAnswer === num && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                  {isCorrect ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="rounded-xl bg-green-100 p-4 text-center animate-bounce">
          <p className="text-lg font-bold text-green-700">🎉 回答正确！+10分</p>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={initQuestion}
          className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
