'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, RotateCcw, Lightbulb } from 'lucide-react'

// 分数认识游戏 - 三年级专用
export default function FractionGame() {
  const [numerator, setNumerator] = useState(1) // 分子
  const [denominator, setDenominator] = useState(4) // 分母
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [questionType, setQuestionType] = useState<'read' | 'shade' | 'compare'>('read')

  const generateProblem = useCallback(() => {
    const denoms = [2, 3, 4, 5, 6, 8]
    const denom = denoms[Math.floor(Math.random() * denoms.length)]
    const numer = Math.floor(Math.random() * (denom - 1)) + 1
    
    setNumerator(numer)
    setDenominator(denom)
    setSelectedAnswer(null)
    setShowResult(null)
    setQuestionType(['read', 'shade', 'compare'][Math.floor(Math.random() * 3)] as any)
  }, [])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return
    
    setSelectedAnswer(answer)
    const correct = `${numerator}/${denominator}`
    
    if (answer === correct) {
      setScore(s => s + 15)
      setShowResult('correct')
      setTimeout(generateProblem, 1500)
    } else {
      setShowResult('wrong')
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowResult(null)
      }, 1500)
    }
  }

  // 渲染分数图形
  const renderFraction = () => {
    const parts = []
    for (let i = 0; i < denominator; i++) {
      const isShaded = i < numerator
      parts.push(
        <div
          key={i}
          className={`h-12 w-12 border-2 border-indigo-400 transition-all ${
            isShaded ? 'bg-indigo-500' : 'bg-white'
          }`}
        />
      )
    }
    return (
      <div className="flex flex-wrap justify-center gap-1">
        {parts}
      </div>
    )
  }

  // 生成选项
  const generateOptions = () => {
    const correct = `${numerator}/${denominator}`
    const options = new Set([correct])
    
    while (options.size < 4) {
      const denoms = [2, 3, 4, 5, 6, 8]
      const d = denoms[Math.floor(Math.random() * denoms.length)]
      const n = Math.floor(Math.random() * d) + 1
      options.add(`${n}/${d}`)
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5)
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-indigo-800">🥧 分数认识</h3>
          <p className="text-sm text-indigo-600">理解分数的意义</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 分数可视化 */}
      <div className="mb-6 text-center">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-inner">
          {renderFraction()}
          <p className="mt-3 text-slate-600">
            涂色部分占整个图形的几分之几？
          </p>
        </div>
        
        <div className="text-4xl font-bold text-indigo-700">
          <span className="text-indigo-500">{numerator}</span>
          <span className="mx-1">/</span>
          <span className="text-indigo-500">{denominator}</span>
        </div>
      </div>

      {/* 选项 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {generateOptions().map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`rounded-xl p-4 text-2xl font-bold shadow-md transition-all
              ${selectedAnswer === option
                ? showResult === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-indigo-700 hover:bg-indigo-100'
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 提示 */}
      <div className="mb-4 rounded-xl bg-indigo-100 p-3 text-sm text-indigo-700">
        <p><strong>💡 分数小知识：</strong></p>
        <p>分母表示把整体平均分成几份，分子表示取了其中的几份</p>
        <p className="mt-1">比如 {numerator}/{denominator} 表示把整体分成{denominator}份，取了{numerator}份</p>
      </div>

      {showResult === 'correct' && (
        <div className="rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 正确！涂色部分是 {numerator}/{denominator}</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再想想！</p>
          <p className="text-sm">正确答案是 {numerator}/{denominator}</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={generateProblem}
          className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
