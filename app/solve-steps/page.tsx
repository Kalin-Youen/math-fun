'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

interface SolveStep {
  title: string
  content: string
  emoji: string
  type: 'read' | 'think' | 'calc' | 'check'
}

interface SolveProblem {
  title: string
  emoji: string
  story: string
  steps: SolveStep[]
  answer: number
  wrongAnswer?: number
  wrongReason?: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const SOLVE_PROBLEMS: SolveProblem[] = [
  {
    title: '买文具',
    emoji: '✏️',
    story: '小红买了3支铅笔，每支2元，又买了1块橡皮1元。她一共花了多少钱？',
    steps: [
      { title: '读题', content: '找出所有信息：3支铅笔，每支2元，1块橡皮1元', emoji: '📖', type: 'read' },
      { title: '分析', content: '这道题有两部分花费：铅笔的钱 + 橡皮的钱', emoji: '🤔', type: 'think' },
      { title: '算铅笔', content: '3支铅笔，每支2元 → 3 × 2 = 6元', emoji: '✏️', type: 'calc' },
      { title: '算橡皮', content: '1块橡皮 → 1元', emoji: '✏️', type: 'calc' },
      { title: '合起来', content: '6 + 1 = 7元', emoji: '➕', type: 'calc' },
      { title: '检验', content: '3×2=6，6+1=7。答：一共花了7元', emoji: '✅', type: 'check' },
    ],
    answer: 7,
    wrongAnswer: 5,
    wrongReason: '只算了铅笔忘了橡皮！两步题要全部算完',
    category: '两步计算',
    difficulty: 'medium',
  },
  {
    title: '分苹果',
    emoji: '🍎',
    story: '妈妈买了24个苹果，平均放在4个盘子里，每个盘子放几个？',
    steps: [
      { title: '读题', content: '找出信息：24个苹果，4个盘子，平均放', emoji: '📖', type: 'read' },
      { title: '分析', content: '"平均放"→ 用除法，总数 ÷ 份数', emoji: '🤔', type: 'think' },
      { title: '列式', content: '24 ÷ 4 = ?', emoji: '✏️', type: 'calc' },
      { title: '计算', content: '想：4×6=24，所以24÷4=6', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '4×6=24 ✓。答：每个盘子放6个', emoji: '✅', type: 'check' },
    ],
    answer: 6,
    category: '除法',
    difficulty: 'easy',
  },
  {
    title: '比身高',
    emoji: '📏',
    story: '小明身高135厘米，小红比小明矮8厘米，小红身高多少厘米？',
    steps: [
      { title: '读题', content: '找出信息：小明135厘米，小红比小明矮8厘米', emoji: '📖', type: 'read' },
      { title: '分析', content: '"比...矮"→ 用减法，从高的减去差', emoji: '🤔', type: 'think' },
      { title: '列式', content: '135 - 8 = ?', emoji: '✏️', type: 'calc' },
      { title: '计算', content: '135 - 8 = 127', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '127 + 8 = 135 ✓。答：小红身高127厘米', emoji: '✅', type: 'check' },
    ],
    answer: 127,
    wrongAnswer: 143,
    wrongReason: '"矮"应该减，不是加！比...矮 → 减法',
    category: '比多比少',
    difficulty: 'easy',
  },
  {
    title: '种花',
    emoji: '🌺',
    story: '花圃里有5排花，每排8朵。如果再种12朵，一共有多少朵花？',
    steps: [
      { title: '读题', content: '找出信息：5排每排8朵，再种12朵', emoji: '📖', type: 'read' },
      { title: '分析', content: '分两步：先算原来有多少，再加上新种的', emoji: '🤔', type: 'think' },
      { title: '第一步', content: '原来：5 × 8 = 40朵', emoji: '✏️', type: 'calc' },
      { title: '第二步', content: '加上新种：40 + 12 = 52朵', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '5×8=40，40+12=52 ✓。答：一共52朵', emoji: '✅', type: 'check' },
    ],
    answer: 52,
    wrongAnswer: 40,
    wrongReason: '忘了"再种12朵"这个条件！两步题别漏条件',
    category: '两步计算',
    difficulty: 'medium',
  },
  {
    title: '周长问题',
    emoji: '📐',
    story: '一个长方形花坛，长6米，宽4米，围一圈需要多少米栅栏？',
    steps: [
      { title: '读题', content: '找出信息：长方形，长6米，宽4米，围一圈', emoji: '📖', type: 'read' },
      { title: '分析', content: '"围一圈"→ 求周长，周长=(长+宽)×2', emoji: '🤔', type: 'think' },
      { title: '列式', content: '(6 + 4) × 2 = ?', emoji: '✏️', type: 'calc' },
      { title: '计算', content: '6+4=10，10×2=20', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '6+4+6+4=20 ✓。答：需要20米栅栏', emoji: '✅', type: 'check' },
    ],
    answer: 20,
    wrongAnswer: 24,
    wrongReason: '用6×4=24算的是面积，不是周长！周长=(长+宽)×2',
    category: '周长',
    difficulty: 'medium',
  },
  {
    title: '余数问题',
    emoji: '🍬',
    story: '有23颗糖，每袋装5颗，最多能装几袋？还剩几颗？',
    steps: [
      { title: '读题', content: '找出信息：23颗糖，每袋5颗', emoji: '📖', type: 'read' },
      { title: '分析', content: '"每袋5颗"→ 用除法，看能装几袋余几颗', emoji: '🤔', type: 'think' },
      { title: '列式', content: '23 ÷ 5 = ? 余 ?', emoji: '✏️', type: 'calc' },
      { title: '计算', content: '5×4=20，23-20=3。所以23÷5=4余3', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '5×4+3=23 ✓。答：装4袋剩3颗', emoji: '✅', type: 'check' },
    ],
    answer: 4,
    category: '有余数除法',
    difficulty: 'hard',
  },
  {
    title: '时间问题',
    emoji: '🕐',
    story: '小明8:30出发去公园，路上走了45分钟，几点到公园？',
    steps: [
      { title: '读题', content: '找出信息：8:30出发，走了45分钟', emoji: '📖', type: 'read' },
      { title: '分析', content: '出发时间 + 经过时间 = 到达时间', emoji: '🤔', type: 'think' },
      { title: '第一步', content: '8:30 + 30分钟 = 9:00', emoji: '✏️', type: 'calc' },
      { title: '第二步', content: '9:00 + 15分钟 = 9:15', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '8:30 + 45分 = 9:15 ✓。答：9:15到公园', emoji: '✅', type: 'check' },
    ],
    answer: 915,
    category: '时间计算',
    difficulty: 'hard',
  },
  {
    title: '倍数问题',
    emoji: '🔢',
    story: '小华有6颗弹珠，小明的弹珠是小华的3倍，小明有多少颗？',
    steps: [
      { title: '读题', content: '找出信息：小华6颗，小明是小华的3倍', emoji: '📖', type: 'read' },
      { title: '分析', content: '"是...的3倍"→ 用乘法', emoji: '🤔', type: 'think' },
      { title: '列式', content: '6 × 3 = ?', emoji: '✏️', type: 'calc' },
      { title: '计算', content: '6 × 3 = 18', emoji: '✏️', type: 'calc' },
      { title: '检验', content: '18 ÷ 6 = 3 ✓。答：小明有18颗', emoji: '✅', type: 'check' },
    ],
    answer: 18,
    wrongAnswer: 2,
    wrongReason: '"3倍"不是除法！是...的几倍 → 乘法',
    category: '倍数',
    difficulty: 'easy',
  },
]

const DIFFICULTY_LABELS = { easy: '🌱 基础', medium: '🌿 进阶', hard: '🌳 挑战' }
const TYPE_COLORS = {
  read: 'bg-sky-100 text-sky-700 border-sky-300',
  think: 'bg-amber-100 text-amber-700 border-amber-300',
  calc: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  check: 'bg-violet-100 text-violet-700 border-violet-300',
}
const TYPE_LABELS = { read: '📖 读题', think: '🤔 分析', calc: '✏️ 计算', check: '✅ 检验' }

export default function SolveStepsPage() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [currentStep, setCurrentStep] = useState(-1)
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [showWrong, setShowWrong] = useState(false)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('solve-steps')
  }, [trackVisit])

  const filteredProblems = filter === 'all' ? SOLVE_PROBLEMS : SOLVE_PROBLEMS.filter((p) => p.difficulty === filter)
  const problem = filteredProblems[currentProblem % filteredProblems.length]

  const nextProblem = () => {
    setCurrentStep(-1)
    setShowWrong(false)
    setCurrentProblem((c) => (c + 1) % filteredProblems.length)
  }

  const prevProblem = () => {
    setCurrentStep(-1)
    setShowWrong(false)
    setCurrentProblem((c) => (c - 1 + filteredProblems.length) % filteredProblems.length)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-bold text-teal-600">
            {currentProblem + 1}/{filteredProblems.length}
          </span>
        </div>

        <header className="mb-8 text-center">
          <div className="mb-2 text-5xl animate-float">📝</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">解题步骤演示</h1>
          <p className="text-slate-500">跟着步骤走，学会解题思路！</p>
        </header>

        <div className="mb-6 flex justify-center gap-2">
          {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => { setFilter(d); setCurrentProblem(0); setCurrentStep(-1); setShowWrong(false) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === d ? 'bg-teal-500 text-white' : 'bg-white/70 text-slate-500 hover:bg-white'
              }`}
            >
              {d === 'all' ? '全部' : DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{problem.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{problem.title}</h2>
              <div className="flex gap-2">
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-600">
                  {problem.category}
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {DIFFICULTY_LABELS[problem.difficulty]}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 p-5 text-lg leading-relaxed text-slate-700">
            {problem.story}
          </div>

          <div className="space-y-3">
            {problem.steps.map((step, i) => {
              const isCurrent = i === currentStep
              const isDone = i < currentStep || currentStep >= problem.steps.length
              const isFuture = i > currentStep && currentStep < problem.steps.length

              return (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    isCurrent
                      ? `${TYPE_COLORS[step.type]} border-2 shadow-md scale-[1.01]`
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-100 bg-slate-50/50 opacity-40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">
                          {TYPE_LABELS[step.type]}：{step.title}
                        </span>
                      </div>
                      <div className={`mt-1 text-sm ${isCurrent ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                        {step.content}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {problem.wrongReason && (
            <div className="mt-4">
              <button
                onClick={() => setShowWrong(!showWrong)}
                className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
              >
                ⚠️ 常见错误{showWrong ? '（点击收起）' : '（点击查看）'}
              </button>
              {showWrong && (
                <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 animate-bounce-in">
                  <div className="font-bold">❌ 易错答案：{problem.wrongAnswer}</div>
                  <div className="mt-1">{problem.wrongReason}</div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prevProblem}
              className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow transition hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              上一题
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(-1)}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4 inline" /> 重置
              </button>
              <button
                onClick={() => {
                  if (currentStep < problem.steps.length - 1) setCurrentStep((s) => s + 1)
                  else nextProblem()
                }}
                className="rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                {currentStep < problem.steps.length - 1 ? '下一步 →' : '下一题 →'}
              </button>
            </div>
            <button
              onClick={nextProblem}
              className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow transition hover:bg-slate-50"
            >
              下一题
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm">
          <div className="font-bold text-teal-700">💡 解题五步法</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-5">
            <div className="rounded-xl bg-sky-100 p-2 text-center text-xs">
              <div className="text-lg">📖</div>
              <div className="font-bold text-sky-700">读题</div>
              <div className="text-sky-600">读2遍不漏字</div>
            </div>
            <div className="rounded-xl bg-amber-100 p-2 text-center text-xs">
              <div className="text-lg">🤔</div>
              <div className="font-bold text-amber-700">分析</div>
              <div className="text-amber-600">找关键定运算</div>
            </div>
            <div className="rounded-xl bg-emerald-100 p-2 text-center text-xs">
              <div className="text-lg">✏️</div>
              <div className="font-bold text-emerald-700">列式</div>
              <div className="text-emerald-600">写出算式</div>
            </div>
            <div className="rounded-xl bg-emerald-100 p-2 text-center text-xs">
              <div className="text-lg">🔢</div>
              <div className="font-bold text-emerald-700">计算</div>
              <div className="text-emerald-600">仔细算结果</div>
            </div>
            <div className="rounded-xl bg-violet-100 p-2 text-center text-xs">
              <div className="text-lg">✅</div>
              <div className="font-bold text-violet-700">检验</div>
              <div className="text-violet-600">代入验证答案</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
