'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCcw, Eye, Lightbulb, ChevronRight } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

interface Keyword {
  text: string
  type: 'number' | 'keyword' | 'question' | 'unit'
  hint: string
}

interface ReadProblem {
  text: string
  keywords: Keyword[]
  operation: '+' | '-' | '×' | '÷'
  operationHint: string
  answer: number
  steps: string[]
  category: string
  emoji: string
}

const PROBLEMS: (() => ReadProblem)[] = [
  () => {
    const a = Math.floor(Math.random() * 20) + 10
    const b = Math.floor(Math.random() * 20) + 10
    return {
      text: `果园里有${a}棵苹果树和${b}棵梨树，一共有多少棵树？`,
      keywords: [
        { text: `${a}`, type: 'number', hint: '已知数量：苹果树的棵数' },
        { text: `${b}`, type: 'number', hint: '已知数量：梨树的棵数' },
        { text: '和', type: 'keyword', hint: '"和""一共"→ 加法！' },
        { text: '一共', type: 'keyword', hint: '"一共""总共"→ 加法！' },
        { text: '多少棵', type: 'question', hint: '这是要求的问题' },
        { text: '棵', type: 'unit', hint: '单位是"棵"，答案也要用"棵"' },
      ],
      operation: '+',
      operationHint: '"一共""和"表示要把两个数合起来，用加法！',
      answer: a + b,
      steps: [
        '读题：找出已知条件和问题',
        `已知：苹果树${a}棵，梨树${b}棵`,
        '关键词"一共"→ 加法',
        `列式：${a} + ${b} = ${a + b}`,
        `答：一共有${a + b}棵树`,
      ],
      category: '加法',
      emoji: '🌳',
    }
  },
  () => {
    const total = Math.floor(Math.random() * 30) + 30
    const used = Math.floor(Math.random() * (total - 5)) + 5
    return {
      text: `图书角有${total}本故事书，借走了${used}本，还剩多少本？`,
      keywords: [
        { text: `${total}`, type: 'number', hint: '已知数量：原来的总数' },
        { text: `${used}`, type: 'number', hint: '已知数量：借走的数量' },
        { text: '借走', type: 'keyword', hint: '"借走""用了""吃了"→ 减法！' },
        { text: '还剩', type: 'keyword', hint: '"还剩""剩下"→ 减法！' },
        { text: '多少本', type: 'question', hint: '这是要求的问题' },
        { text: '本', type: 'unit', hint: '单位是"本"' },
      ],
      operation: '-',
      operationHint: '"借走""还剩"表示从总数中去掉一部分，用减法！',
      answer: total - used,
      steps: [
        '读题：找出已知条件和问题',
        `已知：一共${total}本，借走${used}本`,
        '关键词"还剩"→ 减法',
        `列式：${total} - ${used} = ${total - used}`,
        `答：还剩${total - used}本`,
      ],
      category: '减法',
      emoji: '📚',
    }
  },
  () => {
    const per = Math.floor(Math.random() * 8) + 3
    const groups = Math.floor(Math.random() * 6) + 2
    return {
      text: `每个盒子装${per}个苹果，${groups}个盒子一共装多少个苹果？`,
      keywords: [
        { text: `${per}`, type: 'number', hint: '每份数：每个盒子装的数量' },
        { text: '每个', type: 'keyword', hint: '"每个""每份"→ 可能是乘法！' },
        { text: `${groups}`, type: 'number', hint: '份数：有几个盒子' },
        { text: '一共', type: 'keyword', hint: '"一共""总共"→ 乘法！' },
        { text: '多少个', type: 'question', hint: '这是要求的问题' },
        { text: '个', type: 'unit', hint: '单位是"个"' },
      ],
      operation: '×',
      operationHint: '"每个...一共"→ 每份数 × 份数 = 总数，用乘法！',
      answer: per * groups,
      steps: [
        '读题：找出已知条件和问题',
        `已知：每盒${per}个，有${groups}盒`,
        '"每个...一共"→ 乘法',
        `列式：${per} × ${groups} = ${per * groups}`,
        `答：一共装${per * groups}个苹果`,
      ],
      category: '乘法',
      emoji: '🍎',
    }
  },
  () => {
    const total = (Math.floor(Math.random() * 8) + 2) * 5
    const groups = Math.floor(Math.random() * 5) + 2
    return {
      text: `有${total}颗糖，平均分给${groups}个小朋友，每个小朋友分到几颗？`,
      keywords: [
        { text: `${total}`, type: 'number', hint: '总数：一共有多少颗糖' },
        { text: `${groups}`, type: 'number', hint: '份数：分给几个人' },
        { text: '平均分', type: 'keyword', hint: '"平均分""平均"→ 除法！' },
        { text: '每个', type: 'keyword', hint: '"每个...分到"→ 除法！' },
        { text: '几颗', type: 'question', hint: '这是要求的问题' },
        { text: '颗', type: 'unit', hint: '单位是"颗"' },
      ],
      operation: '÷',
      operationHint: '"平均分"→ 总数 ÷ 份数 = 每份数，用除法！',
      answer: total / groups,
      steps: [
        '读题：找出已知条件和问题',
        `已知：一共${total}颗，分给${groups}人`,
        '"平均分"→ 除法',
        `列式：${total} ÷ ${groups} = ${total / groups}`,
        `答：每个小朋友分到${total / groups}颗`,
      ],
      category: '除法',
      emoji: '🍬',
    }
  },
  () => {
    const a = Math.floor(Math.random() * 15) + 5
    const b = Math.floor(Math.random() * 15) + 5
    return {
      text: `小明有${a}颗弹珠，小红的弹珠比小明多${b}颗，小红有多少颗弹珠？`,
      keywords: [
        { text: `${a}`, type: 'number', hint: '已知数量：小明的弹珠' },
        { text: '比小明多', type: 'keyword', hint: '"比...多"→ 加法！' },
        { text: `${b}`, type: 'number', hint: '多出来的数量' },
        { text: '多少颗', type: 'question', hint: '这是要求的问题' },
        { text: '颗', type: 'unit', hint: '单位是"颗"' },
      ],
      operation: '+',
      operationHint: '"比...多"→ 在原来的基础上加上多的部分，用加法！',
      answer: a + b,
      steps: [
        '读题：找出已知条件和问题',
        `已知：小明${a}颗，小红比小明多${b}颗`,
        '"比...多"→ 加法',
        `列式：${a} + ${b} = ${a + b}`,
        `答：小红有${a + b}颗弹珠`,
      ],
      category: '比多比少',
      emoji: '🔮',
    }
  },
  () => {
    const a = Math.floor(Math.random() * 30) + 20
    const b = Math.floor(Math.random() * (a - 5)) + 5
    return {
      text: `停车场有${a}辆车，开走了${b}辆，还剩多少辆？`,
      keywords: [
        { text: `${a}`, type: 'number', hint: '总数：原来有多少辆' },
        { text: `${b}`, type: 'number', hint: '减少的数量：开走了多少辆' },
        { text: '开走', type: 'keyword', hint: '"开走""走了""飞走"→ 减法！' },
        { text: '还剩', type: 'keyword', hint: '"还剩""剩下"→ 减法！' },
        { text: '多少辆', type: 'question', hint: '这是要求的问题' },
        { text: '辆', type: 'unit', hint: '单位是"辆"' },
      ],
      operation: '-',
      operationHint: '"开走""还剩"→ 从总数中去掉一部分，用减法！',
      answer: a - b,
      steps: [
        '读题：找出已知条件和问题',
        `已知：一共${a}辆，开走${b}辆`,
        '"还剩"→ 减法',
        `列式：${a} - ${b} = ${a - b}`,
        `答：还剩${a - b}辆`,
      ],
      category: '减法',
      emoji: '🚗',
    }
  },
]

const OP_COLORS: Record<string, string> = {
  '+': 'bg-orange-100 text-orange-700 border-orange-300',
  '-': 'bg-blue-100 text-blue-700 border-blue-300',
  '×': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  '÷': 'bg-violet-100 text-violet-700 border-violet-300',
}

const OP_NAMES: Record<string, string> = { '+': '加法', '-': '减法', '×': '乘法', '÷': '除法' }

export default function ReadCarefullyPage() {
  const [problem, setProblem] = useState<ReadProblem | null>(null)
  const [phase, setPhase] = useState<'read' | 'analyze' | 'solve' | 'done'>('read')
  const [highlightedKeywords, setHighlightedKeywords] = useState<Set<number>>(new Set())
  const [selectedOp, setSelectedOp] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('read-carefully')
  }, [trackVisit])

  const generateNew = useCallback(() => {
    const p = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)]()
    setProblem(p)
    setPhase('read')
    setHighlightedKeywords(new Set())
    setSelectedOp(null)
    setCurrentStep(0)
  }, [])

  useEffect(() => {
    generateNew()
  }, [generateNew])

  const handleKeywordClick = (index: number) => {
    if (phase !== 'read') return
    setHighlightedKeywords((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleShowAllKeywords = () => {
    if (!problem) return
    setHighlightedKeywords(new Set(problem.keywords.map((_, i) => i)))
  }

  const handleOpSelect = (op: string) => {
    if (phase !== 'analyze') return
    setSelectedOp(op)
  }

  const handleConfirmOp = () => {
    if (!problem || !selectedOp) return
    setTotal((t) => t + 1)
    if (selectedOp === problem.operation) {
      setScore((s) => s + 1)
    }
    setPhase('solve')
  }

  const handleNextStep = () => {
    if (!problem) return
    if (currentStep < problem.steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setPhase('done')
    }
  }

  if (!problem) return null

  const renderAnnotatedText = () => {
    let text = problem.text
    const parts: { text: string; keywordIndex: number | null }[] = []
    let remaining = text
    const keywordPositions: { start: number; end: number; index: number }[] = []

    problem.keywords.forEach((kw, i) => {
      const idx = remaining.indexOf(kw.text)
      if (idx !== -1) {
        keywordPositions.push({ start: idx, end: idx + kw.text.length, index: i })
      }
    })

    keywordPositions.sort((a, b) => a.start - b.start)

    let pos = 0
    for (const kp of keywordPositions) {
      if (kp.start > pos) {
        parts.push({ text: remaining.slice(pos, kp.start), keywordIndex: null })
      }
      parts.push({ text: remaining.slice(kp.start, kp.end), keywordIndex: kp.index })
      pos = kp.end
    }
    if (pos < remaining.length) {
      parts.push({ text: remaining.slice(pos), keywordIndex: null })
    }

    return (
      <div className="text-lg leading-loose text-slate-700">
        {parts.map((part, i) => {
          if (part.keywordIndex !== null) {
            const kw = problem.keywords[part.keywordIndex]
            const isHighlighted = highlightedKeywords.has(part.keywordIndex)
            const typeColors: Record<string, string> = {
              number: 'bg-amber-200 text-amber-800 border-b-2 border-amber-400',
              keyword: 'bg-rose-200 text-rose-800 border-b-2 border-rose-400',
              question: 'bg-sky-200 text-sky-800 border-b-2 border-sky-400',
              unit: 'bg-emerald-200 text-emerald-800 border-b-2 border-emerald-400',
            }
            return (
              <span
                key={i}
                onClick={() => handleKeywordClick(part.keywordIndex!)}
                className={`cursor-pointer rounded px-1 transition-all ${
                  isHighlighted ? typeColors[kw.type] : 'hover:bg-slate-100'
                }`}
                title={isHighlighted ? kw.hint : '点击标注'}
              >
                {part.text}
              </span>
            )
          }
          return <span key={i}>{part.text}</span>
        })}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-600">
            得分：{score}/{total}
          </span>
        </div>

        <header className="mb-8 text-center">
          <div className="mb-2 text-5xl animate-float">🔍</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">审题训练</h1>
          <p className="text-slate-500">学会读题、找关键词、判断运算方法！</p>
        </header>

        <div className="mb-6 flex items-center justify-center gap-2">
          {[
            { key: 'read', label: '1️⃣ 读题', desc: '标注关键词' },
            { key: 'analyze', label: '2️⃣ 分析', desc: '判断运算' },
            { key: 'solve', label: '3️⃣ 解题', desc: '分步计算' },
            { key: 'done', label: '4️⃣ 完成', desc: '检查答案' },
          ].map((p, i) => (
            <div key={p.key} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4 text-slate-300" />}
              <div
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  phase === p.key
                    ? 'bg-amber-400 text-white shadow-lg'
                    : ['read', 'analyze', 'solve', 'done'].indexOf(phase) > i
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {p.label}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{problem.emoji}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-600">
              {problem.category}
            </span>
          </div>

          {renderAnnotatedText()}

          {phase === 'read' && highlightedKeywords.size > 0 && (
            <div className="mt-4 space-y-2">
              {Array.from(highlightedKeywords).map((ki) => {
                const kw = problem.keywords[ki]
                const typeLabels: Record<string, string> = {
                  number: '🔢 数字',
                  keyword: '🔑 关键词',
                  question: '❓ 问题',
                  unit: '📏 单位',
                }
                return (
                  <div
                    key={ki}
                    className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm"
                  >
                    <span className="font-bold text-amber-700">{typeLabels[kw.type]} "{kw.text}"</span>
                    <span className="ml-2 text-amber-600">{kw.hint}</span>
                  </div>
                )
              })}
            </div>
          )}

          {phase === 'read' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleShowAllKeywords}
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-200"
              >
                <Eye className="h-4 w-4" />
                显示所有标注
              </button>
              <button
                onClick={() => setPhase('analyze')}
                className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-lg"
              >
                下一步：判断运算 →
              </button>
            </div>
          )}

          {phase === 'analyze' && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-bold text-slate-700">这道题应该用什么运算？</h3>
              <div className="flex gap-3">
                {(['+', '-', '×', '÷'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => handleOpSelect(op)}
                    className={`rounded-2xl border-2 px-6 py-3 text-lg font-bold transition ${
                      selectedOp === op
                        ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-lg scale-105'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200'
                    }`}
                  >
                    {op} {OP_NAMES[op]}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleConfirmOp}
                  disabled={!selectedOp}
                  className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-lg disabled:opacity-40"
                >
                  确认选择
                </button>
                <button
                  onClick={() => setPhase('read')}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow transition hover:bg-slate-50"
                >
                  ← 返回读题
                </button>
              </div>
              {selectedOp && selectedOp !== problem.operation && (
                <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
                  💡 再想想？注意题目中的关键词！
                </div>
              )}
            </div>
          )}

          {phase === 'analyze' && selectedOp === problem.operation && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-center gap-2 font-bold text-emerald-700">
                <Lightbulb className="h-5 w-5" />
                判断正确！
              </div>
              <div className="mt-1 text-sm text-emerald-600">{problem.operationHint}</div>
            </div>
          )}

          {(phase === 'solve' || phase === 'done') && (
            <div className="mt-6">
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="font-bold text-amber-700">运算方法：{OP_NAMES[problem.operation]}</div>
                <div className="text-sm text-amber-600">{problem.operationHint}</div>
              </div>

              <h3 className="mb-3 text-lg font-bold text-slate-700">📝 解题步骤</h3>
              <div className="space-y-2">
                {problem.steps.map((step, i) => {
                  const isCurrent = phase === 'solve' && i === currentStep
                  const isDone = phase === 'done' || (phase === 'solve' && i < currentStep)
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 transition-all ${
                        isCurrent
                          ? 'border-amber-300 bg-amber-50 shadow-md'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : 'border-slate-100 bg-slate-50/50 opacity-40'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? '✓' : i + 1}
                        </span>
                        <span className="text-sm text-slate-700">{step}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {phase === 'solve' && (
                <button
                  onClick={handleNextStep}
                  className="mt-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-lg"
                >
                  {currentStep < problem.steps.length - 1 ? '下一步 →' : '完成解题 ✓'}
                </button>
              )}
            </div>
          )}

          {phase === 'done' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={generateNew}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="h-4 w-4" />
                下一题
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <div className="font-bold text-amber-700">💡 审题四步法</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-amber-700">1️⃣ 读题</span>
              <span className="text-amber-600">：仔细读2遍，不漏字</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-amber-700">2️⃣ 标注</span>
              <span className="text-amber-600">：圈出数字、关键词、单位</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-amber-700">3️⃣ 判断</span>
              <span className="text-amber-600">：根据关键词选运算</span>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <span className="font-bold text-amber-700">4️⃣ 列式</span>
              <span className="text-amber-600">：写出算式并计算</span>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-white/70 p-3">
            <div className="font-bold text-amber-700">🔑 关键词速查表</div>
            <div className="mt-1 grid gap-1 text-xs sm:grid-cols-2">
              <div><span className="text-orange-600 font-bold">加法</span>：一共、总共、和、比…多</div>
              <div><span className="text-blue-600 font-bold">减法</span>：还剩、剩下、比…少、借走</div>
              <div><span className="text-emerald-600 font-bold">乘法</span>：每个…一共、几倍</div>
              <div><span className="text-violet-600 font-bold">除法</span>：平均分、每份、是几倍</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
