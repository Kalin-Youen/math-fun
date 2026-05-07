'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Home, Play, Pause, RotateCcw, Settings } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

type Op = '+' | '-' | '×' | '÷'

interface QuizQuestion {
  text: string
  answer: number
  op: Op
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const TOPICS = [
  { key: 'add-sub-20', label: '20以内加减', ops: ['+', '-'] as Op[], max: 20 },
  { key: 'add-sub-100', label: '100以内加减', ops: ['+', '-'] as Op[], max: 100 },
  { key: 'mul-9', label: '乘法口诀', ops: ['×'] as Op[], max: 9 },
  { key: 'div', label: '表内除法', ops: ['÷'] as Op[], max: 9 },
  { key: 'mixed', label: '混合运算', ops: ['+', '-', '×', '÷'] as Op[], max: 100 },
]

function generateQuestion(topic: typeof TOPICS[number]): QuizQuestion {
  const op = topic.ops[randInt(0, topic.ops.length - 1)]
  let a: number, b: number, answer: number

  switch (op) {
    case '+':
      a = randInt(1, topic.max)
      b = randInt(1, topic.max)
      answer = a + b
      break
    case '-':
      a = randInt(1, topic.max)
      b = randInt(1, a)
      answer = a - b
      break
    case '×':
      a = randInt(1, 9)
      b = randInt(1, 9)
      answer = a * b
      break
    case '÷':
      b = randInt(1, 9)
      answer = randInt(1, 9)
      a = b * answer
      break
    default:
      a = 1; b = 1; answer = 2
  }

  return { text: `${a} ${op} ${b}`, answer, op }
}

export default function QuickQuizPage() {
  const [topic, setTopic] = useState(TOPICS[0])
  const [count, setCount] = useState(10)
  const [timer, setTimer] = useState(5)
  const [running, setRunning] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showSettings, setShowSettings] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('quick-quiz')
  }, [trackVisit])

  useEffect(() => {
    if (!running || showResult) return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setAnswers((prev) => {
            const next = [...prev]
            next[current] = null
            return next
          })
          if (current + 1 >= questions.length) {
            setShowResult(true)
            setRunning(false)
          } else {
            setCurrent((c) => c + 1)
            return timer
          }
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [running, current, showResult, timer, questions.length])

  const startQuiz = useCallback(() => {
    const qs: QuizQuestion[] = []
    for (let i = 0; i < count; i++) {
      qs.push(generateQuestion(topic))
    }
    setQuestions(qs)
    setCurrent(0)
    setAnswers(new Array(count).fill(null))
    setShowResult(false)
    setTimeLeft(timer)
    setRunning(true)
    setShowSettings(false)
  }, [topic, count, timer])

  const handleAnswer = useCallback(
    (answer: number) => {
      if (!running || showResult) return
      setAnswers((prev) => {
        const next = [...prev]
        next[current] = answer
        return next
      })

      if (current + 1 >= questions.length) {
        setShowResult(true)
        setRunning(false)
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        setCurrent((c) => c + 1)
        setTimeLeft(timer)
      }
    },
    [running, showResult, current, questions.length, timer]
  )

  const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length

  if (showSettings) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
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

          <header className="mb-8 text-center">
            <div className="mb-2 text-5xl animate-float">🎤</div>
            <h1 className="mb-2 text-3xl font-extrabold text-slate-800">快速问答</h1>
            <p className="text-slate-500">课堂快速提问工具，投屏大屏全班抢答！</p>
          </header>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl">
              <h2 className="mb-4 text-lg font-bold text-slate-700">📋 选择题型</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTopic(t)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      topic.key === t.key
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                    }`}
                  >
                    <div className="font-bold text-slate-800">{t.label}</div>
                    <div className="text-sm text-slate-500">
                      {t.ops.map((o) => ({ '+': '加法', '-': '减法', '×': '乘法', '÷': '除法' }[o])).join('、')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl">
              <h2 className="mb-4 text-lg font-bold text-slate-700">⚙️ 设置</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600">
                    题目数量：{count}
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600">
                    每题限时：{timer}秒
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={timer}
                    onChange={(e) => setTimer(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-500 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
            >
              <Play className="mr-2 inline h-5 w-5" />
              开始提问
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (showResult) {
    const pct = Math.round((correctCount / questions.length) * 100)
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mb-2 text-5xl">{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
              <h2 className="text-2xl font-extrabold text-slate-800">问答结束！</h2>
              <div className="mt-2 text-4xl font-black text-sky-600">
                {correctCount}<span className="text-xl text-slate-400">/{questions.length}</span>
              </div>
              <div className="text-sm text-slate-500">正确率 {pct}%</div>
            </div>

            <div className="space-y-2">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.answer
                const isTimeout = answers[i] === null
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-xl p-3 text-sm ${
                      isCorrect
                        ? 'bg-emerald-50'
                        : isTimeout
                        ? 'bg-amber-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <span className="font-bold text-slate-700">
                      {i + 1}. {q.text} = {q.answer}
                    </span>
                    <span
                      className={`font-bold ${
                        isCorrect ? 'text-emerald-600' : isTimeout ? 'text-amber-600' : 'text-red-600'
                      }`}
                    >
                      {isCorrect ? '✅' : isTimeout ? '⏱️ 超时' : `❌ 答${answers[i]}`}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="h-4 w-4" />
                再来一轮
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-600 shadow transition hover:bg-slate-50"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const q = questions[current]

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-600">
              第 {current + 1}/{questions.length} 题
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
              正确 {correctCount}
            </span>
          </div>
          <button
            onClick={() => {
              setRunning(false)
              if (timerRef.current) clearInterval(timerRef.current)
              setShowSettings(true)
            }}
            className="rounded-full bg-white/70 px-3 py-1 text-sm text-slate-500 shadow-sm transition hover:bg-white"
          >
            退出
          </button>
        </div>

        <div className="mb-3 h-3 overflow-hidden rounded-full bg-white/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-8 w-full rounded-3xl border border-white/60 bg-white/90 p-10 text-center shadow-xl">
            <div
              className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
                timeLeft <= 3 ? 'animate-pulse bg-red-100' : 'bg-sky-100'
              }`}
            >
              <span className={`text-4xl font-black ${timeLeft <= 3 ? 'text-red-500' : 'text-sky-600'}`}>
                {timeLeft}
              </span>
            </div>

            <div className="text-6xl font-black text-slate-800 sm:text-7xl">
              {q?.text} = <span className="text-slate-300">?</span>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-4 gap-3">
            {generateOptions(q).map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="rounded-2xl border-2 border-sky-200 bg-white py-4 text-2xl font-bold text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-xl active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function generateOptions(q: QuizQuestion): number[] {
  const correct = q.answer
  const options = new Set<number>([correct])

  while (options.size < 4) {
    let wrong: number
    const offset = randInt(1, Math.max(5, Math.abs(correct) > 10 ? 10 : 5))
    wrong = Math.random() > 0.5 ? correct + offset : correct - offset
    if (wrong < 0) wrong = correct + offset
    if (wrong !== correct) options.add(wrong)
  }

  return Array.from(options).sort(() => Math.random() - 0.5)
}
