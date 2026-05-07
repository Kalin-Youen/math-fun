'use client'

import { useState, useCallback, useEffect } from 'react'
import { Check, X, RotateCcw, Trophy, Lightbulb } from 'lucide-react'

interface PerimeterPracticeProps {
  shape?: 'rectangle' | 'square' | 'mixed'
}

export default function PerimeterPractice({ shape = 'mixed' }: PerimeterPracticeProps) {
  const [currentShape, setCurrentShape] = useState<'rectangle' | 'square'>('rectangle')
  const [length, setLength] = useState(0)
  const [width, setWidth] = useState(0)
  const [side, setSide] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showFormula, setShowFormula] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const generateProblem = useCallback(() => {
    const isSquare = shape === 'square' || (shape === 'mixed' && Math.random() > 0.5)
    setCurrentShape(isSquare ? 'square' : 'rectangle')
    
    if (isSquare) {
      const s = Math.floor(Math.random() * 15) + 3 // 边长 3-18
      setSide(s)
      setCorrectAnswer(s * 4)
    } else {
      const l = Math.floor(Math.random() * 15) + 5 // 长 5-20
      const w = Math.floor(Math.random() * 10) + 3 // 宽 3-13
      setLength(l)
      setWidth(w)
      setCorrectAnswer((l + w) * 2)
    }
    
    setAnswer('')
    setShowResult(null)
    setShowHint(false)
    setShowFormula(false)
  }, [shape])

  // 初始化
  useEffect(() => {
    if (!isInitialized) {
      generateProblem()
      setIsInitialized(true)
    }
  }, [generateProblem, isInitialized])

  const handleSubmit = () => {
    if (!answer) return
    
    const userAnswer = parseInt(answer)
    const isCorrect = userAnswer === correctAnswer
    
    setTotalAttempts(t => t + 1)
    
    if (isCorrect) {
      setScore(s => s + 10 + streak * 2)
      setStreak(s => s + 1)
      setShowResult('correct')
      setTimeout(() => {
        generateProblem()
      }, 2000)
    } else {
      setStreak(0)
      setShowResult('wrong')
      setTimeout(() => {
        setShowResult(null)
        setAnswer('')
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const getHint = () => {
    if (currentShape === 'square') {
      return `正方形周长 = 边长 × 4 = ${side} × 4`
    } else {
      return `长方形周长 = (长 + 宽) × 2 = (${length} + ${width}) × 2`
    }
  }

  // 渲染图形可视化
  const renderShape = () => {
    if (currentShape === 'square') {
      const size = Math.min(side * 8, 120)
      return (
        <div className="flex flex-col items-center gap-2">
          <div 
            className="border-4 border-indigo-500 bg-indigo-100 relative flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <span className="text-indigo-700 font-bold">{side}cm</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <span>边长: {side}cm</span>
          </div>
        </div>
      )
    } else {
      const scale = Math.min(120 / Math.max(length, width), 8)
      const w = width * scale
      const l = length * scale
      return (
        <div className="flex flex-col items-center gap-2">
          <div 
            className="border-4 border-emerald-500 bg-emerald-100 relative flex items-center justify-center"
            style={{ width: l, height: w }}
          >
            <span className="text-emerald-700 font-bold text-sm">?</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>长: {length}cm</span>
            <span>宽: {width}cm</span>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
      {/* 头部 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-800">📐 周长计算</h3>
          <p className="text-sm text-blue-600">
            计算{currentShape === 'square' ? '正方形' : '长方形'}的周长
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 2 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-700">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-amber-700">{score} 分</span>
          </div>
        </div>
      </div>

      {/* 图形和题目 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* 左侧：图形 */}
        <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-inner">
          {renderShape()}
        </div>

        {/* 右侧：题目和输入 */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-center">
            <p className="mb-2 text-slate-600">
              {currentShape === 'square' 
                ? `正方形边长 = ${side}cm`
                : `长方形 长=${length}cm, 宽=${width}cm`
              }
            </p>
            <p className="text-lg font-bold text-blue-800">
              周长 = ? cm
            </p>
          </div>

          {/* 公式提示 */}
          {showFormula && (
            <div className="rounded-lg bg-amber-50 p-2 text-center text-sm text-amber-700">
              {currentShape === 'square' 
                ? '正方形周长 = 边长 × 4'
                : '长方形周长 = (长 + 宽) × 2'
              }
            </div>
          )}

          {/* 输入框 */}
          <div className="relative flex justify-center">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={showResult !== null}
              className={`
                w-32 rounded-xl border-2 px-4 py-3 text-center text-3xl font-bold outline-none transition-all
                ${showResult === 'correct' 
                  ? 'border-green-500 bg-green-100 text-green-700' 
                  : showResult === 'wrong'
                    ? 'border-red-500 bg-red-100 text-red-700'
                    : 'border-blue-300 bg-white text-blue-800 focus:border-blue-500'
                }
              `}
              placeholder="?"
              autoFocus
            />
            {showResult === 'correct' && (
              <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow animate-bounce">
                <Check className="h-5 w-5" />
              </div>
            )}
            {showResult === 'wrong' && (
              <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow">
                <X className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 提示 */}
      {showHint && (
        <div className="mb-4 rounded-xl bg-amber-50 p-3 text-center text-amber-700 animate-fade-in">
          <Lightbulb className="mb-1 inline h-4 w-4" />
          <span className="text-sm"> {getHint()}</span>
        </div>
      )}

      {/* 结果反馈 */}
      {showResult === 'wrong' && (
        <div className="mb-4 rounded-xl bg-red-100 p-3 text-center text-red-700 animate-shake">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是 {correctAnswer} cm</p>
        </div>
      )}
      {showResult === 'correct' && (
        <div className="mb-4 rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="text-lg font-bold">🎉 太棒了！+{10 + streak * 2}分</p>
        </div>
      )}

      {/* 按钮区域 */}
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-200"
        >
          📐 {showFormula ? '隐藏公式' : '公式'}
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
        >
          <Lightbulb className="h-4 w-4" />
          {showHint ? '隐藏提示' : '提示'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          提交
        </button>
        <button
          onClick={generateProblem}
          className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>

      {/* 统计 */}
      {totalAttempts > 0 && (
        <div className="mt-4 text-center text-sm text-slate-500">
          已答 {totalAttempts} 题，正确率 {Math.round((score / (totalAttempts * 10)) * 100)}%
        </div>
      )}
    </div>
  )
}
