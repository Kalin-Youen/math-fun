'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

interface MistakeType {
  id: string
  title: string
  emoji: string
  color: string
  borderColor: string
  mistakes: {
    desc: string
    wrongExample: string
    correctExample: string
    reason: string
    practice: { question: string; wrongAnswer: number; correctAnswer: number }[]
  }[]
}

const MISTAKE_TYPES: MistakeType[] = [
  {
    id: 'carry',
    title: '进位忘记加',
    emoji: '⬆️',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
    mistakes: [
      {
        desc: '加法进位后忘记加进上来的数',
        wrongExample: '  47\n+ 28\n----\n  65  ← 忘了加进位的1',
        correctExample: '  ¹47\n+ 28\n----\n  75  ← 7+8=15，写5进1，4+2+1=7',
        reason: '个位7+8=15，进1到十位，十位4+2还要加上进位的1=7',
        practice: [
          { question: '36 + 27 = ?', wrongAnswer: 53, correctAnswer: 63 },
          { question: '48 + 35 = ?', wrongAnswer: 73, correctAnswer: 83 },
        ],
      },
    ],
  },
  {
    id: 'borrow',
    title: '借位忘记减',
    emoji: '⬇️',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    mistakes: [
      {
        desc: '减法借位后，被借的那位忘记减1',
        wrongExample: '  53\n- 27\n----\n  36  ← 十位还是5-2=3',
        correctExample: '  ⁴5³\n- 27\n----\n  26  ← 十位被借1变成4，4-2=2',
        reason: '个位3不够减7，向十位借1当10，十位5变成4，4-2=2',
        practice: [
          { question: '42 - 18 = ?', wrongAnswer: 34, correctAnswer: 24 },
          { question: '61 - 35 = ?', wrongAnswer: 36, correctAnswer: 26 },
        ],
      },
    ],
  },
  {
    id: 'op-wrong',
    title: '运算符号看错',
    emoji: '🔄',
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
    mistakes: [
      {
        desc: '把加号看成减号，或把乘号看成加号',
        wrongExample: '5 + 3 = 15  ← 把+看成了×',
        correctExample: '5 + 3 = 8',
        reason: '做题前先看清运算符号！用笔圈出来',
        practice: [
          { question: '6 + 4 = ?', wrongAnswer: 24, correctAnswer: 10 },
          { question: '7 × 3 = ?', wrongAnswer: 10, correctAnswer: 21 },
        ],
      },
    ],
  },
  {
    id: 'zero',
    title: '0的运算出错',
    emoji: '0️⃣',
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    mistakes: [
      {
        desc: '0乘任何数=0，0加任何数=原数，容易搞混',
        wrongExample: '0 × 8 = 8  ← 0乘不是加！\n0 + 8 = 0  ← 0加不是乘！',
        correctExample: '0 × 8 = 0\n0 + 8 = 8',
        reason: '口诀：0乘都得0，0加不变数',
        practice: [
          { question: '0 × 9 = ?', wrongAnswer: 9, correctAnswer: 0 },
          { question: '0 + 9 = ?', wrongAnswer: 0, correctAnswer: 9 },
          { question: '5 × 0 = ?', wrongAnswer: 5, correctAnswer: 0 },
        ],
      },
    ],
  },
  {
    id: 'compare',
    title: '比多比少搞反',
    emoji: '⚖️',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    mistakes: [
      {
        desc: '"比...多"用加法，"比...少"用减法，容易搞反',
        wrongExample: '小红有8颗糖，比小明少3颗，小明有？\n8 - 3 = 5  ← 搞反了！',
        correctExample: '小红比小明少3颗 → 小明比小红多3颗\n8 + 3 = 11',
        reason: '"小红比小明少"→ 小明更多，所以加！先想清楚谁多谁少',
        practice: [
          { question: '小明有12元，比小红多5元，小红有几元？', wrongAnswer: 17, correctAnswer: 7 },
          { question: '小华有9颗糖，比小明少4颗，小明有几颗？', wrongAnswer: 5, correctAnswer: 13 },
        ],
      },
    ],
  },
  {
    id: 'unit',
    title: '单位没统一',
    emoji: '📏',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    mistakes: [
      {
        desc: '不同单位直接计算，没有先统一',
        wrongExample: '2米 + 30厘米 = 32  ← 单位不同不能直接加！',
        correctExample: '2米 = 200厘米\n200 + 30 = 230厘米\n或 2米30厘米',
        reason: '先统一单位再计算！1米=100厘米，1千米=1000米',
        practice: [
          { question: '1米 - 40厘米 = ?厘米', wrongAnswer: 60, correctAnswer: 60 },
          { question: '3千米 + 500米 = ?米', wrongAnswer: 503, correctAnswer: 3500 },
        ],
      },
    ],
  },
  {
    id: 'area-perimeter',
    title: '面积周长混淆',
    emoji: '📐',
    color: 'bg-pink-50',
    borderColor: 'border-pink-200',
    mistakes: [
      {
        desc: '把面积公式和周长公式搞混',
        wrongExample: '长5宽3的长方形：\n面积 = (5+3)×2 = 16  ← 这是周长！',
        correctExample: '周长 = (5+3)×2 = 16\n面积 = 5×3 = 15',
        reason: '周长是"一圈的长度"→ (长+宽)×2；面积是"铺满多少"→ 长×宽',
        practice: [
          { question: '长4宽3，面积=?', wrongAnswer: 14, correctAnswer: 12 },
          { question: '边长5的正方形，周长=?', wrongAnswer: 25, correctAnswer: 20 },
        ],
      },
    ],
  },
]

export default function MistakesPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['carry']))
  const [practiceMode, setPracticeMode] = useState<string | null>(null)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('mistakes')
  }, [trackVisit])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startPractice = (typeId: string) => {
    setPracticeMode(typeId)
    setPracticeIndex(0)
    setInput('')
    setFeedback(null)
    setScore(0)
    setTotal(0)
  }

  const getCurrentPractice = () => {
    if (!practiceMode) return null
    const type = MISTAKE_TYPES.find((t) => t.id === practiceMode)
    if (!type) return null
    const allPractices = type.mistakes.flatMap((m) => m.practice)
    return allPractices[practiceIndex % allPractices.length]
  }

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = getCurrentPractice()
    if (!p) return
    const num = parseInt(input, 10)
    if (isNaN(num)) return
    setTotal((t) => t + 1)
    if (num === p.correctAnswer) {
      setScore((s) => s + 1)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }
    setTimeout(() => {
      const type = MISTAKE_TYPES.find((t) => t.id === practiceMode)
      if (type) {
        const allPractices = type.mistakes.flatMap((m) => m.practice)
        if (practiceIndex + 1 >= allPractices.length) {
          setPracticeMode(null)
        } else {
          setPracticeIndex((i) => i + 1)
          setInput('')
          setFeedback(null)
        }
      }
    }, 1200)
  }

  if (practiceMode) {
    const type = MISTAKE_TYPES.find((t) => t.id === practiceMode)
    const p = getCurrentPractice()
    if (!type || !p) return null

    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setPracticeMode(null)}
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
            >
              ← 返回
            </button>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
              {type.emoji} {type.title} 练习
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
              {score}/{total}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-6 w-full rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-xl">
              <div className="mb-2 text-sm font-bold text-rose-600">⚠️ 小心易错！</div>
              <div className="text-xl font-bold text-slate-800">{p.question}</div>
              {feedback === 'correct' && (
                <div className="mt-4 text-xl font-bold text-emerald-600">✅ 正确！答案是 {p.correctAnswer}</div>
              )}
              {feedback === 'wrong' && (
                <div className="mt-4 text-xl font-bold text-red-500">
                  ❌ 易错！正确答案是 {p.correctAnswer}（常见错误答案：{p.wrongAnswer}）
                </div>
              )}
            </div>

            {!feedback && (
              <form onSubmit={handlePracticeSubmit} className="w-full max-w-xs">
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                  placeholder="输入答案"
                  className="mb-4 w-full rounded-2xl border-2 border-rose-200 bg-white px-6 py-4 text-center text-3xl font-bold text-slate-800 shadow-lg outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-400 to-red-500 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
                >
                  确认
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
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
          <div className="mb-2 text-5xl animate-float">⚠️</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">易错题分析</h1>
          <p className="text-slate-500">认识常见错误，避免再犯！</p>
        </header>

        <div className="space-y-4">
          {MISTAKE_TYPES.map((type) => {
            const isOpen = expanded.has(type.id)
            return (
              <div
                key={type.id}
                className={`overflow-hidden rounded-2xl border ${type.borderColor} ${type.color} shadow-md transition-all`}
              >
                <button
                  onClick={() => toggleExpand(type.id)}
                  className="flex w-full items-center gap-3 p-5 text-left"
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <span className="flex-1 text-lg font-bold text-slate-800">{type.title}</span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-slate-500">
                    {type.mistakes.length}种错误
                  </span>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="border-t border-white/50 px-5 pb-5">
                    {type.mistakes.map((m, mi) => (
                      <div key={mi} className="mt-4">
                        <div className="mb-3 font-bold text-slate-700">{m.desc}</div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="mb-1 text-sm font-bold text-red-600">❌ 错误做法</div>
                            <pre className="whitespace-pre-wrap text-sm text-red-700 font-mono">{m.wrongExample}</pre>
                          </div>
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                            <div className="mb-1 text-sm font-bold text-emerald-600">✅ 正确做法</div>
                            <pre className="whitespace-pre-wrap text-sm text-emerald-700 font-mono">{m.correctExample}</pre>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
                          <AlertTriangle className="mr-1 inline h-4 w-4" />
                          {m.reason}
                        </div>

                        {m.practice.length > 0 && (
                          <button
                            onClick={() => startPractice(type.id)}
                            className="mt-3 rounded-full bg-gradient-to-r from-rose-400 to-red-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-lg"
                          >
                            🎯 练习避坑
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm">
          <div className="font-bold text-rose-700">💡 避免错误的好习惯</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-rose-700">1️⃣ 圈出运算符号</span>
              <span className="text-rose-600">：做题前先圈+ - × ÷</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-rose-700">2️⃣ 写上进位/借位</span>
              <span className="text-rose-600">：小字写在上面提醒自己</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-rose-700">3️⃣ 逆向检验</span>
              <span className="text-rose-600">：加法用减法验，乘法用除法验</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-rose-700">4️⃣ 估算检查</span>
              <span className="text-rose-600">：先大概估算，差太多就错了</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
