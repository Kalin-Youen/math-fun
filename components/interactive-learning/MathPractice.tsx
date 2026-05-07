'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, RotateCcw, Trophy, Lightbulb } from 'lucide-react'

interface MathPracticeProps {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'mixed'
  maxNumber?: number
  allowNegative?: boolean
}

export default function MathPractice({ 
  operation = 'add', 
  maxNumber = 20,
  allowNegative = false 
}: MathPracticeProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState('+')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const operators: Record<string, string> = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷'
  }

  const generateProblem = useCallback(() => {
    let n1 = Math.floor(Math.random() * maxNumber) + 1
    let n2 = Math.floor(Math.random() * maxNumber) + 1
    let op = operation === 'mixed' 
      ? ['add', 'subtract', 'multiply'][Math.floor(Math.random() * 3)]
      : operation
    
    // 确保减法不产生负数（除非允许）
    if (op === 'subtract' && !allowNegative && n1 < n2) {
      [n1, n2] = [n2, n1]
    }
    
    // 确保除法能整除
    if (op === 'divide') {
      n1 = n2 * (Math.floor(Math.random() * 10) + 1)
    }
    
    // 乘法限制范围（一位数乘一位数）
    if (op === 'multiply') {
      n1 = Math.floor(Math.random() * 9) + 1
      n2 = Math.floor(Math.random() * 9) + 1
    }
    
    // 加减法：限制数字范围，避免过大的数
    if (op === 'add' || op === 'subtract') {
      // 对于大数运算，限制在合理的两位数范围内
      if (maxNumber > 100) {
        n1 = Math.floor(Math.random() * 99) + 1  // 1-99
        n2 = Math.floor(Math.random() * 99) + 1  // 1-99
      }
    }

    setNum1(n1)
    setNum2(n2)
    setOperator(operators[op])
    
    let ans = 0
    switch (op) {
      case 'add': ans = n1 + n2; break
      case 'subtract': ans = n1 - n2; break
      case 'multiply': ans = n1 * n2; break
      case 'divide': ans = n1 / n2; break
    }
    setCorrectAnswer(ans)
    setAnswer('')
    setShowResult(null)
    setShowHint(false)
  }, [operation, maxNumber, allowNegative])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

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
      }, 1500)
    } else {
      setStreak(0)
      setShowResult('wrong')
      setTimeout(() => {
        setShowResult(null)
        setAnswer('')
      }, 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const getHint = () => {
    if (operator === '+') {
      return `${num1} + ${num2} = ${num1} 往后数 ${num2} 个`
    } else if (operator === '-') {
      return `${num1} - ${num2} = 从 ${num1} 往前数 ${num2} 个`
    } else if (operator === '×') {
      return `${num1} × ${num2} = ${num1} 个 ${num2} 相加`
    }
    return ''
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-lg">
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-emerald-800">🧮 计算练习</h3>
          <p className="text-sm text-emerald-600">输入正确答案</p>
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

      {/* 题目区域 */}
      <div className="mb-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-4 text-5xl font-bold text-emerald-800">
          <span 
            key={num1}
            className="rounded-xl bg-white px-6 py-3 shadow-md animate-fade-in"
          >
            {num1}
          </span>
          <span className="text-emerald-600">{operator}</span>
          <span 
            key={num2}
            className="rounded-xl bg-white px-6 py-3 shadow-md animate-fade-in"
          >
            {num2}
          </span>
          <span className="text-emerald-600">=</span>
          <div className="relative">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={showResult !== null}
              className={`
                w-32 rounded-xl border-2 px-4 py-3 text-center text-4xl font-bold outline-none transition-all
                ${showResult === 'correct' 
                  ? 'border-green-500 bg-green-100 text-green-700' 
                  : showResult === 'wrong'
                    ? 'border-red-500 bg-red-100 text-red-700'
                    : 'border-emerald-300 bg-white text-emerald-800 focus:border-emerald-500'
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

        {/* 提示 */}
        {showHint && (
          <div className="mb-4 rounded-xl bg-amber-50 p-3 text-amber-700 animate-fade-in">
            <Lightbulb className="mb-1 inline h-4 w-4" />
            <span className="text-sm"> {getHint()}</span>
          </div>
        )}
      </div>

      {/* 结果反馈 */}
      {showResult === 'wrong' && (
        <div className="mb-4 rounded-xl bg-red-100 p-3 text-center text-red-700 animate-shake">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是 {correctAnswer}</p>
        </div>
      )}
      {showResult === 'correct' && (
        <div className="mb-4 rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="text-lg font-bold">🎉 太棒了！+{10 + streak * 2}分</p>
        </div>
      )}

      {/* 按钮区域 */}
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
        >
          <Lightbulb className="h-4 w-4" />
          {showHint ? '隐藏提示' : '提示'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          提交答案
        </button>
        <button
          onClick={generateProblem}
          className="flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
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
