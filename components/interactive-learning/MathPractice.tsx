'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Check, X, RotateCcw, Trophy, Lightbulb, Star, Zap, Target, ChevronRight } from 'lucide-react'

interface MathPracticeProps {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'mixed'
  maxNumber?: number
  allowNegative?: boolean
}

// 混合运算题目生成器
interface Problem {
  display: string        // 显示的公式（美化版）
  answer: number         // 正确答案
  hint: string           // 提示
  difficulty: number     // 难度 1-3
  steps: string[]        // 解题步骤
}

function generateMixedProblem(maxNum: number): Problem {
  const difficulties = [
    // 难度1: 两步运算 a + b × c
    () => {
      const a = rand(1, 20)
      const b = rand(2, 9)
      const c = rand(2, 9)
      const ans = a + b * c
      return {
        display: `${a} + ${b} × ${c}`,
        answer: ans,
        hint: `先算乘法：${b} × ${c} = ${b * c}，再加 ${a}`,
        difficulty: 1,
        steps: [`第一步：${b} × ${c} = ${b * c}`, `第二步：${a} + ${b * c} = ${ans}`]
      }
    },
    // 难度1: a × b - c
    () => {
      const b = rand(2, 9)
      const c = rand(1, b * 9 - 1)
      const a = rand(2, 9)
      const product = a * b
      const ans = product - c
      return {
        display: `${a} × ${b} - ${c}`,
        answer: ans,
        hint: `先算乘法：${a} × ${b} = ${product}，再减 ${c}`,
        difficulty: 1,
        steps: [`第一步：${a} × ${b} = ${product}`, `第二步：${product} - ${c} = ${ans}`]
      }
    },
    // 难度2: (a + b) × c
    () => {
      const a = rand(2, 15)
      const b = rand(2, 15)
      const c = rand(2, 5)
      const ans = (a + b) * c
      return {
        display: `(${a} + ${b}) × ${c}`,
        answer: ans,
        hint: `先算括号里：${a} + ${b} = ${a + b}，再乘 ${c}`,
        difficulty: 2,
        steps: [`第一步：${a} + ${b} = ${a + b}（括号优先）`, `第二步：${a + b} × ${c} = ${ans}`]
      }
    },
    // 难度2: a × b + c × d
    () => {
      const a = rand(2, 9)
      const b = rand(2, 9)
      const c = rand(2, 9)
      const d = rand(2, 9)
      const ans = a * b + c * d
      return {
        display: `${a} × ${b} + ${c} × ${d}`,
        answer: ans,
        hint: `分别算两个乘法，再相加`,
        difficulty: 2,
        steps: [`第一步：${a} × ${b} = ${a * b}`, `第二步：${c} × ${d} = ${c * d}`, `第三步：${a * b} + ${c * d} = ${ans}`]
      }
    },
    // 难度2: a × (b - c)
    () => {
      const c = rand(1, 8)
      const b = rand(c + 1, 15)
      const a = rand(2, 9)
      const ans = a * (b - c)
      return {
        display: `${a} × (${b} - ${c})`,
        answer: ans,
        hint: `先算括号里：${b} - ${c} = ${b - c}，再乘 ${a}`,
        difficulty: 2,
        steps: [`第一步：${b} - ${c} = ${b - c}（括号优先）`, `第二步：${a} × ${b - c} = ${ans}`]
      }
    },
    // 难度3: a + b × c - d
    () => {
      const b = rand(2, 9)
      const c = rand(2, 9)
      const a = rand(1, 20)
      const d = rand(1, a + b * c - 1)
      const ans = a + b * c - d
      return {
        display: `${a} + ${b} × ${c} - ${d}`,
        answer: ans,
        hint: `先算乘法 ${b} × ${c}，再从左到右加减`,
        difficulty: 3,
        steps: [`第一步：${b} × ${c} = ${b * c}`, `第二步：${a} + ${b * c} = ${a + b * c}`, `第三步：${a + b * c} - ${d} = ${ans}`]
      }
    },
    // 难度3: (a + b) × c - d
    () => {
      const a = rand(2, 10)
      const b = rand(2, 10)
      const c = rand(2, 5)
      const d = rand(1, (a + b) * c - 1)
      const ans = (a + b) * c - d
      return {
        display: `(${a} + ${b}) × ${c} - ${d}`,
        answer: ans,
        hint: `先算括号，再乘，最后减`,
        difficulty: 3,
        steps: [`第一步：${a} + ${b} = ${a + b}`, `第二步：${a + b} × ${c} = ${(a + b) * c}`, `第三步：${(a + b) * c} - ${d} = ${ans}`]
      }
    },
  ]

  const gen = difficulties[Math.floor(Math.random() * difficulties.length)]
  return gen()
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 美化公式显示 - 将运算符和数字拆分成带样式的片段
function renderFormula(display: string, showAnswer: boolean, answer: number) {
  const parts = display.split(/(\s+|\(|\)|\+|-|×|÷|=)/).filter(Boolean)
  return parts.map((part, i) => {
    const isNum = /^-?\d+$/.test(part)
    const isOp = ['+', '-', '×', '÷', '='].includes(part)
    const isBracket = ['(', ')'].includes(part)

    if (isNum) {
      return (
        <span key={i} className="inline-block rounded-lg bg-white/80 px-2 py-1 mx-0.5 font-bold text-slate-800 shadow-sm border border-slate-100">
          {part}
        </span>
      )
    }
    if (isOp) {
      return (
        <span key={i} className="inline-block mx-1 text-2xl font-bold text-indigo-500">
          {part}
        </span>
      )
    }
    if (isBracket) {
      return (
        <span key={i} className="inline-block text-3xl font-bold text-violet-500 mx-0.5">
          {part}
        </span>
      )
    }
    return <span key={i} className="inline-block mx-0.5">{part}</span>
  })
}

export default function MathPractice({
  operation = 'add',
  maxNumber = 20,
  allowNegative = false
}: MathPracticeProps) {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [combo, setCombo] = useState(0)
  const [animateScore, setAnimateScore] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateProblem = useCallback(() => {
    if (operation === 'mixed' && maxNumber > 50) {
      // 混合运算模式
      const p = generateMixedProblem(maxNumber)
      setProblem(p)
    } else {
      // 基础运算模式
      let n1 = rand(1, Math.min(maxNumber, 99))
      let n2 = rand(1, Math.min(maxNumber, 99))
      let op = operation === 'mixed'
        ? ['add', 'subtract', 'multiply'][Math.floor(Math.random() * 3)]
        : operation

      const opSymbols: Record<string, string> = { add: '+', subtract: '-', multiply: '×', divide: '÷' }

      if (op === 'subtract' && !allowNegative && n1 < n2) [n1, n2] = [n2, n1]
      if (op === 'divide') n1 = n2 * rand(1, 9)
      if (op === 'multiply') { n1 = rand(2, 9); n2 = rand(2, 9) }

      let ans = 0
      switch (op) {
        case 'add': ans = n1 + n2; break
        case 'subtract': ans = n1 - n2; break
        case 'multiply': ans = n1 * n2; break
        case 'divide': ans = n1 / n2; break
      }

      setProblem({
        display: `${n1} ${opSymbols[op]} ${n2}`,
        answer: ans,
        hint: op === 'add' ? `${n1} 往后数 ${n2} 个`
          : op === 'subtract' ? `从 ${n1} 往前数 ${n2} 个`
          : op === 'multiply' ? `${n1} 个 ${n2} 相加`
          : `想：${ans} ÷ ${n2} = ${n1}`,
        difficulty: 1,
        steps: [`${n1} ${opSymbols[op]} ${n2} = ${ans}`]
      })
    }

    setAnswer('')
    setShowResult(null)
    setShowHint(false)
    setShowSteps(false)
    setIsInitialized(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [operation, maxNumber, allowNegative])

  useEffect(() => {
    if (!isInitialized) generateProblem()
  }, [generateProblem, isInitialized])

  const handleSubmit = () => {
    if (!answer || !problem) return
    const userAnswer = parseFloat(answer)
    const isCorrect = userAnswer === problem.answer

    setTotalAttempts(t => t + 1)

    if (isCorrect) {
      const bonus = 10 + streak * 2 + problem.difficulty * 5
      setScore(s => s + bonus)
      setStreak(s => {
        const newStreak = s + 1
        setBestStreak(b => Math.max(b, newStreak))
        return newStreak
      })
      setCorrectCount(c => c + 1)
      setCombo(c => c + 1)
      setShowResult('correct')
      setAnimateScore(true)
      setTimeout(() => setAnimateScore(false), 600)
      setTimeout(() => generateProblem(), 1200)
    } else {
      setStreak(0)
      setCombo(0)
      setShowResult('wrong')
      setTimeout(() => {
        setShowResult(null)
        setAnswer('')
        inputRef.current?.focus()
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const difficultyStars = (d: number) => '⭐'.repeat(d) + '☆'.repeat(3 - d)

  if (!problem) return null

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden">
      {/* 顶部状态栏 */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
              <Trophy className="h-4 w-4" />
              <span className="font-bold">{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-400/30 px-3 py-1.5 backdrop-blur-sm animate-pulse">
                <Zap className="h-4 w-4" />
                <span className="font-bold">{streak}连对</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 opacity-80" />
              <span>{correctCount}/{totalAttempts}</span>
            </div>
            {bestStreak > 2 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-300" />
                <span>最佳 {bestStreak}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 难度指示 */}
      {operation === 'mixed' && maxNumber > 50 && (
        <div className="px-6 pt-4 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">难度</span>
          <span className="text-sm">{difficultyStars(problem.difficulty)}</span>
        </div>
      )}

      {/* 公式区域 */}
      <div className="px-6 py-8">
        <div className={`text-center transition-all duration-300 ${showResult === 'wrong' ? 'animate-shake' : ''}`}>
          {/* 美化的公式 */}
          <div className="inline-flex items-center flex-wrap justify-center gap-1 mb-6 text-4xl sm:text-5xl">
            {renderFormula(problem.display, false, problem.answer)}
            <span className="inline-block mx-2 text-3xl font-bold text-slate-400">=</span>
            <div className="relative inline-block">
              <input
                ref={inputRef}
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={showResult !== null}
                className={`
                  w-28 sm:w-36 rounded-2xl border-3 px-4 py-3 text-center text-4xl sm:text-5xl font-bold
                  outline-none transition-all duration-300
                  ${showResult === 'correct'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600 scale-110'
                    : showResult === 'wrong'
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-indigo-200 bg-slate-50 text-slate-800 focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-100'
                  }
                `}
                placeholder="?"
                autoFocus
              />
              {/* 正确标记 */}
              {showResult === 'correct' && (
                <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-bounce-in">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </div>
              )}
              {/* 错误标记 */}
              {showResult === 'wrong' && (
                <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                  <X className="h-5 w-5" strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          {/* 加分动画 */}
          {animateScore && (
            <div className="text-center animate-float-up">
              <span className="inline-block rounded-full bg-yellow-400 px-4 py-1 text-lg font-bold text-yellow-900 shadow-lg">
                +{10 + streak * 2 + problem.difficulty * 5}
              </span>
            </div>
          )}

          {/* 正确反馈 */}
          {showResult === 'correct' && (
            <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 animate-fade-in">
              <p className="text-lg font-bold text-emerald-700">
                {combo >= 5 ? '🏆 太强了！' : combo >= 3 ? '🔥 连续答对！' : '✅ 回答正确！'}
              </p>
            </div>
          )}

          {/* 错误反馈 */}
          {showResult === 'wrong' && (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 animate-fade-in">
              <p className="font-bold text-red-600 mb-2">❌ 不对哦，正确答案是：</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-700">
                {renderFormula(problem.display, true, problem.answer)}
                <span className="mx-1 text-slate-400">=</span>
                <span className="rounded-lg bg-white px-3 py-1 shadow-sm">{problem.answer}</span>
              </div>
              <button
                onClick={() => setShowSteps(true)}
                className="mt-3 flex items-center gap-1 mx-auto text-sm text-red-500 hover:text-red-600"
              >
                <ChevronRight className="h-4 w-4" />
                查看解题步骤
              </button>
            </div>
          )}

          {/* 解题步骤 */}
          {showSteps && (
            <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 animate-fade-in">
              <p className="mb-2 font-bold text-blue-700">📝 解题步骤：</p>
              <div className="space-y-1">
                {problem.steps.map((step, i) => (
                  <p key={i} className="text-blue-600 pl-4 border-l-2 border-blue-300">{step}</p>
                ))}
              </div>
            </div>
          )}

          {/* 提示 */}
          {showHint && !showResult && (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 animate-fade-in">
              <p className="text-amber-700">
                <Lightbulb className="inline h-4 w-4 mr-1" />
                💡 {problem.hint}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="px-6 pb-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setShowHint(!showHint)}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
            showHint
              ? 'bg-amber-100 text-amber-700 shadow-inner'
              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          提示
        </button>
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Check className="h-4 w-4" />
          确认
        </button>
        <button
          onClick={generateProblem}
          className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          换题
        </button>
      </div>

      {/* 进度条 */}
      {totalAttempts > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>正确率</span>
            <span className="font-bold text-slate-600">{Math.round((correctCount / totalAttempts) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(correctCount / totalAttempts) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 内联CSS动画 */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-float-up { animation: float-up 0.8s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}
