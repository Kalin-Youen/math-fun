'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

type GameMode = 'decompose' | 'estimate' | 'place-value' | 'compare' | 'neighbor'

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function NumberSensePage() {
  const [mode, setMode] = useState<GameMode>('decompose')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [input, setInput] = useState('')
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('number-sense')
  }, [trackVisit])

  const [decomposeNum, setDecomposeNum] = useState(0)
  const [decomposeTarget, setDecomposeTarget] = useState(0)
  const [estimateTarget, setEstimateTarget] = useState(0)
  const [placeValueNum, setPlaceValueNum] = useState(0)
  const [placeValuePos, setPlaceValuePos] = useState(0)
  const [compareA, setCompareA] = useState(0)
  const [compareB, setCompareB] = useState(0)
  const [neighborNum, setNeighborNum] = useState(0)
  const [neighborDir, setNeighborDir] = useState<'before' | 'after'>('after')

  const generateDecompose = useCallback(() => {
    const num = randInt(10, 99)
    const target = randInt(1, num - 1)
    setDecomposeNum(num)
    setDecomposeTarget(target)
    setInput('')
    setFeedback(null)
  }, [])

  const generateEstimate = useCallback(() => {
    setEstimateTarget(randInt(1, 100))
    setInput('')
    setFeedback(null)
  }, [])

  const generatePlaceValue = useCallback(() => {
    const num = randInt(100, 9999)
    const pos = randInt(0, 3)
    setPlaceValueNum(num)
    setPlaceValuePos(pos)
    setInput('')
    setFeedback(null)
  }, [])

  const generateCompare = useCallback(() => {
    let a = randInt(1, 9999)
    let b = randInt(1, 9999)
    if (a === b) b += randInt(1, 10)
    setCompareA(a)
    setCompareB(b)
    setInput('')
    setFeedback(null)
  }, [])

  const generateNeighbor = useCallback(() => {
    setNeighborNum(randInt(2, 999))
    setNeighborDir(Math.random() > 0.5 ? 'before' : 'after')
    setInput('')
    setFeedback(null)
  }, [])

  useEffect(() => {
    if (mode === 'decompose') generateDecompose()
    if (mode === 'estimate') generateEstimate()
    if (mode === 'place-value') generatePlaceValue()
    if (mode === 'compare') generateCompare()
    if (mode === 'neighbor') generateNeighbor()
    setScore(0)
    setTotal(0)
  }, [mode, generateDecompose, generateEstimate, generatePlaceValue, generateCompare, generateNeighbor])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (feedback) return
      const num = parseInt(input, 10)
      if (isNaN(num)) return

      let correct = false
      switch (mode) {
        case 'decompose':
          correct = decomposeNum - decomposeTarget === num || (decomposeTarget + num === decomposeNum)
          break
        case 'estimate':
          correct = Math.abs(num - estimateTarget) <= 5
          break
        case 'place-value': {
          const digits = placeValueNum.toString().split('').map(Number)
          const fromRight = digits.length - 1 - placeValuePos
          correct = num === digits[fromRight] * Math.pow(10, placeValuePos)
          break
        }
        case 'compare':
          correct = (num === 1 && compareA > compareB) || (num === -1 && compareA < compareB) || (num === 0 && compareA === compareB)
          break
        case 'neighbor':
          correct = (neighborDir === 'before' && num === neighborNum - 1) || (neighborDir === 'after' && num === neighborNum + 1)
          break
      }

      setTotal((t) => t + 1)
      if (correct) {
        setScore((s) => s + 1)
        setFeedback('correct')
      } else {
        setFeedback('wrong')
      }
      setTimeout(() => {
        if (mode === 'decompose') generateDecompose()
        if (mode === 'estimate') generateEstimate()
        if (mode === 'place-value') generatePlaceValue()
        if (mode === 'compare') generateCompare()
        if (mode === 'neighbor') generateNeighbor()
      }, 1000)
    },
    [feedback, input, mode, decomposeNum, decomposeTarget, estimateTarget, placeValueNum, placeValuePos, compareA, compareB, neighborNum, neighborDir, generateDecompose, generateEstimate, generatePlaceValue, generateCompare, generateNeighbor]
  )

  const MODES: { key: GameMode; label: string; emoji: string; desc: string }[] = [
    { key: 'decompose', label: '数的分解', emoji: '🧩', desc: '把数拆成两部分' },
    { key: 'estimate', label: '估算训练', emoji: '🎯', desc: '猜猜这个点在哪' },
    { key: 'place-value', label: '位值理解', emoji: '🔢', desc: '百位/十位/个位代表几' },
    { key: 'compare', label: '大小比较', emoji: '⚖️', desc: '哪个数更大' },
    { key: 'neighbor', label: '相邻数', emoji: '🏠', desc: '前面/后面是谁' },
  ]

  const renderGame = () => {
    switch (mode) {
      case 'decompose':
        return (
          <div className="text-center">
            <div className="mb-4 text-6xl font-black text-slate-800">{decomposeNum}</div>
            <div className="mb-2 text-lg text-slate-600">
              把 <span className="font-bold text-orange-600">{decomposeNum}</span> 拆成{' '}
              <span className="font-bold text-emerald-600">{decomposeTarget}</span> 和 ？两部分
            </div>
            <div className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold">
              <span className="rounded-xl bg-emerald-100 px-4 py-2 text-emerald-700">{decomposeTarget}</span>
              <span className="text-slate-400">+</span>
              <span className="rounded-xl bg-orange-100 px-4 py-2 text-orange-700">?</span>
              <span className="text-slate-400">=</span>
              <span className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700">{decomposeNum}</span>
            </div>
            {feedback === 'correct' && <div className="text-xl font-bold text-emerald-600">✅ 正确！</div>}
            {feedback === 'wrong' && (
              <div className="text-xl font-bold text-red-500">❌ 答案是 {decomposeNum - decomposeTarget}</div>
            )}
          </div>
        )

      case 'estimate':
        return (
          <div className="text-center">
            <div className="mb-4 text-lg text-slate-600">数轴上 0~100，红色标记在哪个位置？猜猜它代表几！</div>
            <div className="relative mx-auto mb-6 h-12 w-full max-w-md">
              <div className="absolute inset-x-0 top-4 h-4 rounded-full bg-slate-200" />
              <div className="absolute top-0 h-12 w-0.5 bg-slate-400" style={{ left: '0%' }} />
              <div className="absolute top-0 h-12 w-0.5 bg-slate-400" style={{ left: '100%' }} />
              <div
                className="absolute top-1 h-10 w-1 rounded-full bg-red-500 shadow-lg"
                style={{ left: `${estimateTarget}%`, transform: 'translateX(-50%)' }}
              />
              <div className="absolute -top-1 left-0 text-xs font-bold text-slate-500">0</div>
              <div className="absolute -top-1 right-0 text-xs font-bold text-slate-500">100</div>
              <div className="absolute -top-1 text-xs font-bold text-slate-400" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                50
              </div>
            </div>
            {feedback === 'correct' && (
              <div className="text-xl font-bold text-emerald-600">✅ 很接近！答案是 {estimateTarget}</div>
            )}
            {feedback === 'wrong' && (
              <div className="text-xl font-bold text-red-500">❌ 答案是 {estimateTarget}，误差需≤5</div>
            )}
          </div>
        )

      case 'place-value': {
        const posNames = ['个', '十', '百', '千']
        const digits = placeValueNum.toString().split('').reverse().map(Number)
        return (
          <div className="text-center">
            <div className="mb-4 text-6xl font-black text-slate-800">{placeValueNum}</div>
            <div className="mb-4 text-lg text-slate-600">
              <span className="font-bold text-violet-600">{posNames[placeValuePos]}位</span>上的数字代表多少？
            </div>
            <div className="mb-4 flex items-center justify-center gap-1">
              {placeValueNum
                .toString()
                .split('')
                .reverse()
                .map((d, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center rounded-xl border-2 p-2 ${
                      i === placeValuePos ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-xs text-slate-400">{posNames[i]}位</span>
                    <span className="text-2xl font-bold text-slate-800">{d}</span>
                  </div>
                ))
                .reverse()}
            </div>
            {feedback === 'correct' && <div className="text-xl font-bold text-emerald-600">✅ 正确！</div>}
            {feedback === 'wrong' && (
              <div className="text-xl font-bold text-red-500">
                ❌ 答案是 {digits[placeValuePos] * Math.pow(10, placeValuePos)}
              </div>
            )}
          </div>
        )
      }

      case 'compare':
        return (
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-6">
              <span className="text-5xl font-black text-blue-600">{compareA}</span>
              <span className="text-3xl font-bold text-slate-400">？</span>
              <span className="text-5xl font-black text-rose-600">{compareB}</span>
            </div>
            <div className="mb-2 text-lg text-slate-600">填 1（左大）、-1（右大）、0（相等）</div>
            {feedback === 'correct' && <div className="text-xl font-bold text-emerald-600">✅ 正确！</div>}
            {feedback === 'wrong' && (
              <div className="text-xl font-bold text-red-500">
                ❌ {compareA} {compareA > compareB ? '>' : '<'} {compareB}
              </div>
            )}
          </div>
        )

      case 'neighbor':
        return (
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              {neighborDir === 'before' ? (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-orange-300 text-2xl font-bold text-orange-400">
                    ?
                  </span>
                  <span className="text-2xl text-slate-400">→</span>
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-800">
                    {neighborNum}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-800">
                    {neighborNum}
                  </span>
                  <span className="text-2xl text-slate-400">→</span>
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-orange-300 text-2xl font-bold text-orange-400">
                    ?
                  </span>
                </>
              )}
            </div>
            <div className="text-lg text-slate-600">
              {neighborDir === 'before' ? `${neighborNum} 前面的数是？` : `${neighborNum} 后面的数是？`}
            </div>
            {feedback === 'correct' && <div className="mt-2 text-xl font-bold text-emerald-600">✅ 正确！</div>}
            {feedback === 'wrong' && (
              <div className="mt-2 text-xl font-bold text-red-500">
                ❌ 答案是 {neighborDir === 'before' ? neighborNum - 1 : neighborNum + 1}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
            得分：{score}/{total}
          </span>
        </div>

        <header className="mb-8 text-center">
          <div className="mb-2 text-5xl animate-float">🧠</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">数感训练</h1>
          <p className="text-slate-500">建立对数字的直觉，让数学不再抽象！</p>
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === m.key
                  ? 'bg-fuchsia-500 text-white shadow-lg'
                  : 'bg-white/70 text-slate-500 hover:bg-white'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
          <div className="mb-2 text-center text-sm font-bold text-fuchsia-600">
            {MODES.find((m) => m.key === mode)?.desc}
          </div>

          {renderGame()}

          {!feedback && (
            <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-xs gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                placeholder="?"
                className="w-full rounded-xl border-2 border-fuchsia-200 bg-white px-4 py-3 text-center text-2xl font-bold text-slate-800 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-fuchsia-400 to-pink-500 px-6 py-3 font-bold text-white shadow transition hover:shadow-lg"
              >
                确认
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 text-sm">
          <div className="font-bold text-fuchsia-700">💡 什么是数感？</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-fuchsia-700">🧩 数的分解</span>
              <span className="text-fuchsia-600">：理解数可以拆成不同组合</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-fuchsia-700">🎯 估算能力</span>
              <span className="text-fuchsia-600">：快速判断数的大小和位置</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-fuchsia-700">🔢 位值理解</span>
              <span className="text-fuchsia-600">：每个数字在不同位置含义不同</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-fuchsia-700">🏠 相邻关系</span>
              <span className="text-fuchsia-600">：数与数之间的前后顺序</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
