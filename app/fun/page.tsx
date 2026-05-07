'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw, Trophy } from 'lucide-react'

type GameType = 'guess' | 'pattern' | 'compare'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface GuessState {
  target: number
  attempts: number
  maxAttempts: number
  hint: string
  won: boolean
}

interface PatternState {
  sequence: number[]
  answer: number
  rule: string
  won: boolean
}

interface CompareState {
  a: number
  b: number
  answer: '>' | '<' | '='
  won: boolean
}

const GAMES: { type: GameType; title: string; emoji: string; desc: string; color: string }[] = [
  { type: 'guess', title: '猜数字', emoji: '🔮', desc: '猜 1~100 的神秘数字', color: 'from-violet-400 to-purple-500' },
  { type: 'pattern', title: '找规律', emoji: '🔢', desc: '找出数列的下一个数', color: 'from-emerald-400 to-teal-500' },
  { type: 'compare', title: '比大小', emoji: '⚖️', desc: '快速判断谁大谁小', color: 'from-orange-400 to-red-500' },
]

function generatePattern(): PatternState {
  const patterns = [
    () => {
      const start = randInt(1, 10)
      const step = randInt(2, 5)
      const seq = Array.from({ length: 4 }, (_, i) => start + step * i)
      return { sequence: seq, answer: start + step * 4, rule: `每次加 ${step}` }
    },
    () => {
      const start = randInt(1, 5)
      const mult = randInt(2, 3)
      const seq = [start, start * mult, start * mult * mult, start * mult * mult * mult]
      return { sequence: seq, answer: start * mult ** 4, rule: `每次乘 ${mult}` }
    },
    () => {
      const a = randInt(1, 5)
      const b = randInt(1, 5)
      const seq = [a, a + b, a + b * 2, a + b * 3]
      return { sequence: seq, answer: a + b * 4, rule: `差每次增加 ${b}` }
    },
  ]

  const gen = patterns[randInt(0, patterns.length - 1)]()
  return { ...gen, won: false }
}

function generateCompare(): CompareState {
  const a = randInt(1, 999)
  const b = randInt(1, 999)
  const answer: '>' | '<' | '=' = a > b ? '>' : a < b ? '<' : '='
  return { a, b, answer, won: false }
}

export default function FunMathPage() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null)
  const [guess, setGuess] = useState<GuessState | null>(null)
  const [pattern, setPattern] = useState<PatternState | null>(null)
  const [compare, setCompare] = useState<CompareState | null>(null)
  const [input, setInput] = useState('')
  const [compareScore, setCompareScore] = useState(0)
  const [compareTotal, setCompareTotal] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  const startGuess = useCallback(() => {
    setGuess({
      target: randInt(1, 100),
      attempts: 0,
      maxAttempts: 7,
      hint: '我想了一个 1~100 的数字，猜猜看！',
      won: false,
    })
    setInput('')
    setFeedback(null)
  }, [])

  const startPattern = useCallback(() => {
    setPattern(generatePattern())
    setInput('')
    setFeedback(null)
  }, [])

  const startCompare = useCallback(() => {
    setCompare(generateCompare())
    setCompareScore(0)
    setCompareTotal(0)
    setFeedback(null)
  }, [])

  const nextCompare = useCallback(() => {
    setCompare(generateCompare())
    setFeedback(null)
  }, [])

  const handleGuessSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!guess || guess.won) return
      const num = parseInt(input, 10)
      if (isNaN(num) || num < 1 || num > 100) return

      const newAttempts = guess.attempts + 1

      if (num === guess.target) {
        setGuess({ ...guess, attempts: newAttempts, won: true, hint: '🎉 猜对了！' })
        setFeedback('correct')
      } else if (newAttempts >= guess.maxAttempts) {
        setGuess({
          ...guess,
          attempts: newAttempts,
          hint: `😔 次数用完了！答案是 ${guess.target}`,
        })
        setFeedback('wrong')
      } else if (num > guess.target) {
        setGuess({ ...guess, attempts: newAttempts, hint: `📉 太大了！还剩 ${guess.maxAttempts - newAttempts} 次` })
      } else {
        setGuess({ ...guess, attempts: newAttempts, hint: `📈 太小了！还剩 ${guess.maxAttempts - newAttempts} 次` })
      }
      setInput('')
    },
    [guess, input]
  )

  const handlePatternSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!pattern || pattern.won) return
      const num = parseInt(input, 10)
      if (isNaN(num)) return

      if (num === pattern.answer) {
        setPattern({ ...pattern, won: true })
        setFeedback('correct')
      } else {
        setFeedback('wrong')
      }
      setInput('')
    },
    [pattern, input]
  )

  const handleCompareChoice = useCallback(
    (choice: '>' | '<' | '=') => {
      if (!compare || feedback) return
      setCompareTotal((t) => t + 1)
      if (choice === compare.answer) {
        setCompareScore((s) => s + 1)
        setFeedback('correct')
      } else {
        setFeedback('wrong')
      }
      setTimeout(nextCompare, 800)
    },
    [compare, feedback, nextCompare]
  )

  useEffect(() => {
    if (currentGame === 'guess') startGuess()
    if (currentGame === 'pattern') startPattern()
    if (currentGame === 'compare') startCompare()
  }, [currentGame, startGuess, startPattern, startCompare])

  if (!currentGame) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
            >
              <Home className="h-4 w-4" />
              首页
            </Link>
          </div>

          <div className="mb-10 text-center">
            <div className="mb-3 text-6xl animate-float">🎯</div>
            <h1 className="mb-3 text-3xl font-extrabold text-slate-800">趣味数学</h1>
            <p className="text-slate-500">选一个游戏，边玩边学！</p>
          </div>

          <div className="grid gap-4">
            {GAMES.map((g) => (
              <button
                key={g.type}
                onClick={() => setCurrentGame(g.type)}
                className="group rounded-2xl border border-white/60 bg-white/80 p-6 text-left shadow-lg shadow-violet-100 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${g.color} text-2xl shadow`}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{g.title}</div>
                    <div className="text-sm text-slate-500">{g.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (currentGame === 'guess' && guess) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setCurrentGame(null)}
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
            >
              ← 返回
            </button>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-600">
              🔮 猜数字
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-6 w-full rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-xl">
              <div className="mb-4 text-4xl">🔮</div>
              <div className="mb-2 text-lg font-bold text-slate-700">{guess.hint}</div>
              <div className="text-sm text-slate-500">
                已猜 {guess.attempts}/{guess.maxAttempts} 次
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all"
                  style={{ width: `${(guess.attempts / guess.maxAttempts) * 100}%` }}
                />
              </div>
            </div>

            {!guess.won && guess.attempts < guess.maxAttempts ? (
              <form onSubmit={handleGuessSubmit} className="w-full max-w-xs">
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                  placeholder="1 ~ 100"
                  min={1}
                  max={100}
                  className="mb-4 w-full rounded-2xl border-2 border-violet-200 bg-white px-6 py-4 text-center text-3xl font-bold text-slate-800 shadow-lg outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-purple-500 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
                >
                  猜！
                </button>
              </form>
            ) : (
              <button
                onClick={startGuess}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="h-4 w-4" />
                再来一局
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  if (currentGame === 'pattern' && pattern) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setCurrentGame(null)}
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
            >
              ← 返回
            </button>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
              🔢 找规律
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-6 w-full rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-xl">
              <div className="mb-4 text-4xl">🔢</div>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                {pattern.sequence.map((n, i) => (
                  <span
                    key={i}
                    className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700"
                  >
                    {n}
                  </span>
                ))}
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 text-xl font-bold text-emerald-400">
                  ?
                </span>
              </div>
              {pattern.won && (
                <div className="text-sm font-bold text-emerald-600">
                  ✅ 正确！规律：{pattern.rule}
                </div>
              )}
              {feedback === 'wrong' && !pattern.won && (
                <div className="text-sm font-bold text-red-500">
                  ❌ 不对哦，答案是 {pattern.answer}，规律：{pattern.rule}
                </div>
              )}
            </div>

            {!pattern.won && feedback !== 'wrong' ? (
              <form onSubmit={handlePatternSubmit} className="w-full max-w-xs">
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                  placeholder="下一个数是？"
                  className="mb-4 w-full rounded-2xl border-2 border-emerald-200 bg-white px-6 py-4 text-center text-3xl font-bold text-slate-800 shadow-lg outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
                >
                  提交答案
                </button>
              </form>
            ) : (
              <button
                onClick={startPattern}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="h-4 w-4" />
                下一题
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  if (currentGame === 'compare' && compare) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setCurrentGame(null)}
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
            >
              ← 返回
            </button>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
              ⚖️ 比大小
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
              {compareScore}/{compareTotal}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div
              className={`mb-6 w-full rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-xl transition-all duration-300 ${
                feedback === 'correct'
                  ? 'border-emerald-300 bg-emerald-50'
                  : feedback === 'wrong'
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <div className="flex items-center justify-center gap-6">
                <span className="text-5xl font-black text-orange-600">{compare.a}</span>
                <span className="text-3xl font-bold text-slate-400">？</span>
                <span className="text-5xl font-black text-blue-600">{compare.b}</span>
              </div>
            </div>

            <div className="flex gap-4">
              {(['>', '<', '='] as const).map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleCompareChoice(sym)}
                  disabled={!!feedback}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-orange-200 bg-white text-3xl font-black text-orange-500 shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-40"
                >
                  {sym}
                </button>
              ))}
            </div>

            {feedback === 'correct' && (
              <div className="mt-4 text-xl font-bold text-emerald-600">✅ 正确！</div>
            )}
            {feedback === 'wrong' && (
              <div className="mt-4 text-xl font-bold text-red-500">
                ❌ {compare.a} {compare.answer} {compare.b}
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  return null
}
