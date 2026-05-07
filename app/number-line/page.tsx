'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

type Mode = 'explore' | 'add-sub' | 'quiz'

export default function NumberLinePage() {
  const [mode, setMode] = useState<Mode>('explore')
  const [position, setPosition] = useState(5)
  const [minVal, setMinVal] = useState(0)
  const [maxVal, setMaxVal] = useState(20)
  const [jumpSize, setJumpSize] = useState(3)
  const [expression, setExpression] = useState<string[]>([])
  const [quizStart, setQuizStart] = useState(0)
  const [quizJump, setQuizJump] = useState(0)
  const [quizOp, setQuizOp] = useState<'+' | '-'>('+')
  const [quizInput, setQuizInput] = useState('')
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [animPos, setAnimPos] = useState(position)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('number-line')
  }, [trackVisit])

  const handleJump = useCallback(
    (direction: '+' | '-') => {
      if (animating) return
      const delta = direction === '+' ? jumpSize : -jumpSize
      const newPos = position + delta
      if (newPos < minVal || newPos > maxVal) return

      setAnimating(true)
      setAnimPos(position)

      const steps = 10
      let step = 0
      const interval = setInterval(() => {
        step++
        setAnimPos(position + (delta * step) / steps)
        if (step >= steps) {
          clearInterval(interval)
          setPosition(newPos)
          setAnimPos(newPos)
          setAnimating(false)
          setExpression((prev) => [
            ...prev,
            `${direction === '+' ? '+' : '-'}${jumpSize}`,
          ])
        }
      }, 30)
    },
    [position, jumpSize, minVal, maxVal, animating]
  )

  const resetExplore = () => {
    setPosition(5)
    setAnimPos(5)
    setExpression([])
  }

  const generateQuiz = useCallback(() => {
    const start = Math.floor(Math.random() * 15) + 1
    const op: '+' | '-' = Math.random() > 0.5 ? '+' : '-'
    const jump = Math.floor(Math.random() * 8) + 1
    const end = op === '+' ? start + jump : start - jump
    if (end < 0 || end > 20) return generateQuiz()
    setQuizStart(start)
    setQuizJump(jump)
    setQuizOp(op)
    setQuizInput('')
    setQuizFeedback(null)
  }, [])

  useEffect(() => {
    if (mode === 'quiz') generateQuiz()
  }, [mode, generateQuiz])

  const handleQuizSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const answer = parseInt(quizInput, 10)
      if (isNaN(answer)) return
      const correct = quizOp === '+' ? quizStart + quizJump : quizStart - quizJump
      setQuizTotal((t) => t + 1)
      if (answer === correct) {
        setQuizScore((s) => s + 1)
        setQuizFeedback('correct')
      } else {
        setQuizFeedback('wrong')
      }
      setTimeout(generateQuiz, 1000)
    },
    [quizInput, quizStart, quizJump, quizOp, generateQuiz]
  )

  const renderNumberLine = (
    currentPos: number,
    startPos?: number,
    jumpDir?: '+' | '-',
    jumpAmount?: number
  ) => {
    const range = maxVal - minVal
    const ticks = Math.min(range, 21)
    const step = range / (ticks - 1)

    return (
      <div className="relative mx-auto mb-4" style={{ width: '100%', maxWidth: 600 }}>
        <svg viewBox={`0 0 ${ticks * 30 + 20} 80`} className="w-full">
          <line
            x1={10}
            y1={40}
            x2={ticks * 30 + 10}
            y2={40}
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <polygon
            points={`${ticks * 30 + 10},40 ${ticks * 30},35 ${ticks * 30},45`}
            fill="#94a3b8"
          />

          {Array.from({ length: ticks }, (_, i) => {
            const val = minVal + i * step
            const x = 10 + i * 30
            const isCurrent = Math.abs(val - currentPos) < 0.5
            const isStart = startPos !== undefined && Math.abs(val - startPos) < 0.5

            return (
              <g key={i}>
                <line x1={x} y1={35} x2={x} y2={45} stroke="#94a3b8" strokeWidth="2" />
                <text
                  x={x}
                  y={58}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isCurrent ? '#f97316' : '#64748b'}
                  fontWeight={isCurrent ? 'bold' : 'normal'}
                >
                  {Math.round(val)}
                </text>
                {isCurrent && (
                  <circle cx={x} cy={40} r={10} fill="#f97316" stroke="white" strokeWidth="2" />
                )}
                {isStart && !isCurrent && (
                  <circle cx={x} cy={40} r={6} fill="#3b82f6" stroke="white" strokeWidth="2" />
                )}
              </g>
            )
          })}

          {startPos !== undefined && jumpDir && jumpAmount && (
            <>
              <line
                x1={10 + (startPos - minVal) / step * 30}
                y1={20}
                x2={10 + (currentPos - minVal) / step * 30}
                y2={20}
                stroke={jumpDir === '+' ? '#22c55e' : '#ef4444'}
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(10 + (startPos - minVal) / step * 30 + 10 + (currentPos - minVal) / step * 30) / 2}
                y={15}
                textAnchor="middle"
                fontSize="12"
                fill={jumpDir === '+' ? '#22c55e' : '#ef4444'}
                fontWeight="bold"
              >
                {jumpDir}{jumpAmount}
              </text>
            </>
          )}
        </svg>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="mb-2 text-5xl animate-float">📏</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">数轴探索</h1>
          <p className="text-slate-500">在数轴上跳一跳，加法减法看得见！</p>
        </header>

        <div className="mb-6 flex justify-center gap-2">
          {[
            { key: 'explore' as Mode, label: '🚶 自由探索' },
            { key: 'add-sub' as Mode, label: '➕ 加减跳步' },
            { key: 'quiz' as Mode, label: '🎯 数轴测验' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === m.key ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/70 text-slate-500 hover:bg-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
          {mode === 'explore' && (
            <div>
              <div className="mb-4 text-center text-lg font-bold text-slate-700">
                点击数轴上的位置，或者拖动滑块
              </div>
              {renderNumberLine(position)}

              <div className="mb-4 text-center">
                <div className="text-5xl font-black text-orange-600">{position}</div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  位置：{position}
                </label>
                <input
                  type="range"
                  min={minVal}
                  max={maxVal}
                  value={position}
                  onChange={(e) => {
                    setPosition(parseInt(e.target.value))
                    setAnimPos(parseInt(e.target.value))
                  }}
                  className="w-full accent-blue-500"
                />
                <div className="flex gap-4">
                  <label className="text-sm text-slate-600">
                    范围：{minVal} ~ {maxVal}
                  </label>
                  <select
                    value={`${minVal}-${maxVal}`}
                    onChange={(e) => {
                      const [mn, mx] = e.target.value.split('-').map(Number)
                      setMinVal(mn)
                      setMaxVal(mx)
                      if (position < mn) setPosition(mn)
                      if (position > mx) setPosition(mx)
                    }}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  >
                    <option value="0-10">0~10</option>
                    <option value="0-20">0~20</option>
                    <option value="0-50">0~50</option>
                    <option value="0-100">0~100</option>
                    <option value="-10-10">-10~10</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'add-sub' && (
            <div>
              <div className="mb-4 text-center text-lg font-bold text-slate-700">
                在数轴上跳步！加法向右跳，减法向左跳
              </div>
              {renderNumberLine(animPos)}

              <div className="mb-4 text-center">
                <div className="text-3xl font-black text-slate-800">
                  5 {expression.map((e) => e).join(' ')} = <span className="text-orange-600">{position}</span>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  每次跳几步：{jumpSize}
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={jumpSize}
                  onChange={(e) => setJumpSize(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleJump('-')}
                  disabled={animating || position - jumpSize < minVal}
                  className="rounded-2xl bg-gradient-to-r from-red-400 to-rose-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-40"
                >
                  ← 减 {jumpSize}
                </button>
                <button
                  onClick={resetExplore}
                  className="rounded-2xl bg-white px-4 py-4 text-sm font-medium text-slate-500 shadow transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleJump('+')}
                  disabled={animating || position + jumpSize > maxVal}
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-40"
                >
                  加 {jumpSize} →
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-center text-sm text-blue-700">
                💡 加法 = 向右跳，减法 = 向左跳。数轴让加减法看得见！
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div>
              <div className="mb-2 text-center text-sm font-bold text-slate-500">
                得分：{quizScore}/{quizTotal}
              </div>
              <div className="mb-4 text-center text-lg font-bold text-slate-700">
                从 {quizStart} 开始，{quizOp === '+' ? '向右' : '向左'}跳 {quizJump} 步，到达哪里？
              </div>
              {renderNumberLine(quizStart, quizStart, quizOp, quizJump)}

              <div className="mb-4 text-center text-2xl font-black text-slate-800">
                {quizStart} {quizOp} {quizJump} = <span className="text-slate-300">?</span>
              </div>

              {quizFeedback === 'correct' && (
                <div className="mb-4 text-center text-xl font-bold text-emerald-600">✅ 正确！</div>
              )}
              {quizFeedback === 'wrong' && (
                <div className="mb-4 text-center text-xl font-bold text-red-500">
                  ❌ 答案是 {quizOp === '+' ? quizStart + quizJump : quizStart - quizJump}
                </div>
              )}

              {!quizFeedback && (
                <form onSubmit={handleQuizSubmit} className="mx-auto flex max-w-xs gap-2">
                  <input
                    type="number"
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    autoFocus
                    placeholder="?"
                    className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-center text-2xl font-bold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 px-6 py-3 font-bold text-white shadow transition hover:shadow-lg"
                  >
                    确认
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
