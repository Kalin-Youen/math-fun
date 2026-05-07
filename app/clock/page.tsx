'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

export default function ClockPage() {
  const [hours, setHours] = useState(3)
  const [minutes, setMinutes] = useState(0)
  const [mode, setMode] = useState<'set' | 'quiz'>('set')
  const [quizHour, setQuizHour] = useState(0)
  const [quizMinute, setQuizMinute] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const { trackVisit } = useAchievements()

  useEffect(() => { trackVisit('clock') }, [trackVisit])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'zh-CN'
      u.rate = 0.8
      window.speechSynthesis.speak(u)
    }
  }

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? '下午' : '上午'
    const displayH = h % 12 || 12
    return `${period} ${displayH}:${m.toString().padStart(2, '0')}`
  }

  const generateQuiz = () => {
    setQuizHour(Math.floor(Math.random() * 12) + 1)
    setQuizMinute(Math.floor(Math.random() * 12) * 5)
    setUserAnswer('')
    setQuizResult(null)
  }

  const checkAnswer = () => {
    const correct = `${quizHour}:${quizMinute.toString().padStart(2, '0')}`
    const isCorrect = userAnswer.trim() === correct || userAnswer.trim() === `${quizHour}:${quizMinute}`
    setQuizResult(isCorrect ? 'correct' : 'wrong')
    setTotal(t => t + 1)
    if (isCorrect) setScore(s => s + 1)
  }

  const handleDrag = (e: React.MouseEvent, type: 'hour' | 'minute') => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2

    const onMouseMove = (ev: MouseEvent) => {
      const x = ev.clientX - rect.left - cx
      const y = ev.clientY - rect.top - cy
      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
      if (angle < 0) angle += 360

      if (type === 'hour') {
        const h = Math.round(angle / 30) % 12
        setHours(h === 0 ? 12 : h)
      } else {
        const m = Math.round(angle / 6) % 60
        setMinutes(m)
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const renderClock = (h: number, m: number, interactive = false, showNumbers = true) => {
    const hourAngle = ((h % 12) * 30) + (m * 0.5) - 90
    const minuteAngle = m * 6 - 90
    const hourRad = (hourAngle * Math.PI) / 180
    const minuteRad = (minuteAngle * Math.PI) / 180
    const hourLen = 55
    const minuteLen = 75

    return (
      <svg ref={svgRef} viewBox="0 0 200 200" className="w-full max-w-[280px] mx-auto drop-shadow-lg">
        {/* 表盘 */}
        <circle cx="100" cy="100" r="95" fill="white" stroke="#334155" strokeWidth="3" />
        <circle cx="100" cy="100" r="90" fill="white" />

        {/* 刻度 */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i * 6 - 90) * Math.PI / 180
          const isHour = i % 5 === 0
          const innerR = isHour ? 75 : 82
          const outerR = 88
          return (
            <line
              key={i}
              x1={100 + innerR * Math.cos(angle)}
              y1={100 + innerR * Math.sin(angle)}
              x2={100 + outerR * Math.cos(angle)}
              y2={100 + outerR * Math.sin(angle)}
              stroke={isHour ? '#334155' : '#cbd5e1'}
              strokeWidth={isHour ? 2.5 : 1}
              strokeLinecap="round"
            />
          )
        })}

        {/* 数字 */}
        {showNumbers && Array.from({ length: 12 }, (_, i) => {
          const num = i + 1
          const angle = ((num * 30) - 90) * Math.PI / 180
          const r = 65
          return (
            <text
              key={num}
              x={100 + r * Math.cos(angle)}
              y={100 + r * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-sm font-bold fill-slate-700"
              style={{ fontSize: '14px' }}
            >
              {num}
            </text>
          )
        })}

        {/* 时针 */}
        <line
          x1={100}
          y1={100}
          x2={100 + hourLen * Math.cos(hourRad)}
          y2={100 + hourLen * Math.sin(hourRad)}
          stroke="#1e293b"
          strokeWidth="4"
          strokeLinecap="round"
          {...(interactive ? {
            style: { cursor: 'pointer' },
            onMouseDown: (e) => handleDrag(e, 'hour'),
          } : {})}
        />

        {/* 分针 */}
        <line
          x1={100}
          y1={100}
          x2={100 + minuteLen * Math.cos(minuteRad)}
          y2={100 + minuteLen * Math.sin(minuteRad)}
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          {...(interactive ? {
            style: { cursor: 'pointer' },
            onMouseDown: (e) => handleDrag(e, 'minute'),
          } : {})}
        />

        {/* 中心点 */}
        <circle cx="100" cy="100" r="4" fill="#1e293b" />
        <circle cx="100" cy="100" r="2" fill="white" />
      </svg>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🕐 认钟表</h1>
          <div className="w-20" />
        </header>

        {/* 模式切换 */}
        <div className="mb-6 flex justify-center gap-2">
          <button onClick={() => setMode('set')} className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'set' ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md' : 'bg-white text-slate-600'}`}>
            拨钟模式
          </button>
          <button onClick={() => { setMode('quiz'); generateQuiz(); setScore(0); setTotal(0) }} className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'quiz' ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md' : 'bg-white text-slate-600'}`}>
            看钟测验
          </button>
        </div>

        {mode === 'set' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-center text-xl font-bold text-slate-700">拖动指针设置时间</h2>
              {renderClock(hours, minutes, true)}
              <div className="mt-4 text-center">
                <div className="text-4xl font-extrabold text-slate-800">
                  {formatTime(hours, minutes)}
                </div>
                <button
                  onClick={() => speak(`现在是${formatTime(hours, minutes)}`)}
                  className="mt-2 rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-200"
                >
                  <Volume2 className="mr-1 inline h-4 w-4" />
                  朗读时间
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-lg">
                <h3 className="mb-3 font-bold text-slate-700">设置小时</h3>
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHours(h)}
                      className={`rounded-lg py-2 text-sm font-bold transition ${hours === h ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-lg">
                <h3 className="mb-3 font-bold text-slate-700">设置分钟</h3>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={`rounded-lg py-2 text-sm font-bold transition ${minutes === m ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <h3 className="mb-2 font-bold text-amber-800">💡 认钟表要点</h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• <strong>短针是时针</strong>：指向几就是几时</li>
                <li>• <strong>长针是分针</strong>：指向几就乘5（如指向3就是15分）</li>
                <li>• 分针走一圈（60分），时针走一大格（1时）</li>
                <li>• 整点时分针指向12，半时（30分）分针指向6</li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'quiz' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-700">看看这是几点？</h2>
                <span className="text-sm text-slate-500">得分: {score}/{total}</span>
              </div>
              {renderClock(quizHour, quizMinute, false, false)}
              <div className="mt-4 flex justify-center gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
                  className="w-32 rounded-xl border-2 border-sky-200 px-4 py-3 text-center text-xl font-bold focus:border-sky-400 focus:outline-none"
                  placeholder="时:分"
                  autoFocus
                />
                <button onClick={checkAnswer} disabled={!userAnswer} className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-white disabled:opacity-50">
                  确认
                </button>
              </div>
              {quizResult && (
                <div className={`mt-3 rounded-xl p-3 text-center font-bold ${quizResult === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {quizResult === 'correct' ? '✅ 正确！' : `❌ 正确答案是 ${quizHour}:${quizMinute.toString().padStart(2, '0')}`}
                </div>
              )}
            </div>
            <button onClick={generateQuiz} className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 py-4 text-xl font-bold text-white shadow-lg">
              下一题
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
