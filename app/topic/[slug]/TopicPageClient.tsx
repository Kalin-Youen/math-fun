'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, Lightbulb, AlertTriangle, BookOpen, BookText, Gamepad2, BookMarked, Calculator } from 'lucide-react'
import { getTopicBySlug } from '@/lib/curriculum'
import { feynmanTopics } from '@/lib/feynman-learning'
import { 
  NumberCardGame, MathPractice, PerimeterPractice, ShapeExplorer, 
  ClockLearning, MoneyCalculator, CompareGame, CarryAddition,
  FeynmanCoach, FractionGame, EquationGame, PercentGame
} from '@/components/interactive-learning'

type InteractiveConfig =
  | { type: 'number-game'; props: { maxNumber: number } }
  | { type: 'math-practice'; props: { operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'mixed'; maxNumber: number } }
  | { type: 'perimeter'; props: { shape: 'rectangle' | 'square' | 'mixed' } }
  | { type: 'shape-explorer'; props: { grade: number } }
  | { type: 'clock-learning'; props: Record<string, never> }
  | { type: 'money-calculator'; props: { maxAmount: number } }
  | { type: 'compare-game'; props: Record<string, never> }
  | { type: 'carry-addition'; props: Record<string, never> }
  | { type: 'feynman-coach'; props: { topicSlug: string } }
  | { type: 'fraction-game'; props: Record<string, never> }
  | { type: 'equation-game'; props: Record<string, never> }
  | { type: 'percent-game'; props: Record<string, never> }

// 根据知识点 slug 精确匹配交互组件
const getInteractiveComponent = (slug: string, gradeId: number, topicTitle: string): InteractiveConfig => {
  // 优先检查费曼学习数据
  const feynmanSlugs = ['g1-1-20', 'g1-add-20', 'g1-sub-20', 'g1-compare', 'g1-shapes', 
    'g1-clock', 'g1-money', 'g2-mul-table', 'g2-division', 'g2-angle',
    'g3-fractions-intro', 'g3-perimeter', 'g3-area', 'g4-decimal-intro', 'g4-triangle',
    'g5-equation-problems', 'g5-fraction-ops', 'g6-percent', 'g6-circle', 'g6-proportion']
  if (feynmanSlugs.includes(slug)) {
    return { type: 'feynman-coach', props: { topicSlug: slug } }
  }
  
  // ========== 一年级 ==========
  if (slug === 'g1-1-20') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-1-100') return { type: 'number-game', props: { maxNumber: 100 } }
  if (slug === 'g1-compare') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-add-10') return { type: 'math-practice', props: { operation: 'add', maxNumber: 10 } }
  if (slug === 'g1-add-20-no-carry') return { type: 'math-practice', props: { operation: 'add', maxNumber: 20 } }
  if (slug === 'g1-add-20') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-sub-20-no-borrow') return { type: 'math-practice', props: { operation: 'subtract', maxNumber: 20 } }
  if (slug === 'g1-sub-20') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-shapes' || slug === 'g1-plane-shapes') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-sort') return { type: 'number-game', props: { maxNumber: 20 } }
  if (slug === 'g1-clock') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-money') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g1-position') return { type: 'number-game', props: { maxNumber: 10 } }
  if (slug === 'g1-math-fun') return { type: 'feynman-coach', props: { topicSlug: slug } }

  // ========== 二年级 ==========
  if (slug === 'g2-add-sub-100') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mental-calc') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mixed-ops') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mul-table') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g2-division') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g2-length') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mass') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-angle') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g2-observe') return { type: 'shape-explorer', props: { grade: gradeId } }
  if (slug === 'g2-line-segment') return { type: 'math-practice', props: { operation: 'add', maxNumber: 100 } }
  if (slug === 'g2-data-collect') return { type: 'number-game', props: { maxNumber: 50 } }

  // ========== 三年级 ==========
  if (slug === 'g3-multi-digit-add-sub') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 1000 } }
  if (slug === 'g3-multi-digit-mul') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 100 } }
  if (slug === 'g3-two-digit-mul') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 100 } }
  if (slug === 'g3-division') return { type: 'math-practice', props: { operation: 'divide', maxNumber: 100 } }
  if (slug === 'g3-fractions-intro') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g3-perimeter') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g3-area') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g3-time') return { type: 'clock-learning', props: {} }

  // ========== 四年级 ==========
  if (slug === 'g4-large-numbers') return { type: 'number-game', props: { maxNumber: 10000 } }
  if (slug === 'g4-decimal-intro') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g4-triangle') return { type: 'feynman-coach', props: { topicSlug: slug } }

  // ========== 五年级 ==========
  if (slug === 'g5-equation-problems') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g5-fraction-ops') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g5-polygon-area') return { type: 'perimeter', props: { shape: 'mixed' } }

  // ========== 六年级 ==========
  if (slug === 'g6-percent') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g6-circle') return { type: 'feynman-coach', props: { topicSlug: slug } }
  if (slug === 'g6-proportion') return { type: 'feynman-coach', props: { topicSlug: slug } }

  // ========== 默认 ==========
  if (gradeId <= 2) return { type: 'number-game', props: { maxNumber: gradeId === 1 ? 20 : 100 } }
  return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
}

export default function TopicPageClient() {
  const params = useParams()
  const slug = params.slug as string
  const data = getTopicBySlug(slug)

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">找不到这个知识点</h1>
          <Link href="/" className="rounded-full bg-indigo-500 px-6 py-2 text-white font-bold shadow">
            返回首页
          </Link>
        </div>
      </main>
    )
  }

  const { topic, grade } = data
  const config = getInteractiveComponent(slug, grade.id, topic.title)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href={`/grade/${grade.id}`} className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white">
            <ArrowLeft className="h-4 w-4" />{grade.title}
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white">
            <Home className="h-4 w-4" />首页
          </Link>
        </div>

        <header className={`mb-8 rounded-3xl border ${grade.borderColor} ${grade.bg} p-8 shadow-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full bg-white/80 px-3 py-1 text-xs font-bold ${grade.color}`}>{grade.emoji} {grade.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topic.emoji}</span>
            <h1 className="text-3xl font-extrabold text-slate-800">{topic.title}</h1>
          </div>
          <p className="mt-2 text-lg text-slate-600">{topic.desc}</p>
          {topic.textbookContent && (
            <Link href={`/textbook/${slug}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200">
              <BookText className="h-4 w-4" />查看教材原文
            </Link>
          )}
        </header>

        {/* 多方法学习区域 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">🎯 多方法学习</h2>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">选择适合你的方式</span>
          </div>

          <MultiMethodLearning slug={slug} gradeId={grade.id} topicTitle={topic.title} />
        </section>

        {/* 练习题区域 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800">📝 配套练习题</h2>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-emerald-700">完成以下练习题巩固知识点</p>
              <Link href="/practice" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600">更多练习</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/practice?topic=${slug}&mode=smart`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">🧠</span>
                <div><p className="font-bold text-emerald-800">智能练习</p><p className="text-xs text-emerald-600">AI根据你的水平出题</p></div>
              </Link>
              <Link href={`/practice?topic=${slug}&mode=custom`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">⚙️</span>
                <div><p className="font-bold text-blue-800">自定义练习</p><p className="text-xs text-blue-600">选择难度和题量</p></div>
              </Link>
            </div>
          </div>
        </section>

        {/* 学习技巧区域 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-800">💡 学习技巧与理解方法</h2>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-lg">
            <div className="space-y-4">
              {topic.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-amber-700">{i + 1}</span>
                  <p className="text-amber-800">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-amber-100/50 p-4">
              <p className="text-sm font-bold text-amber-700">🎯 学习建议：</p>
              <p className="mt-1 text-sm text-amber-600">先通过"互动学习"熟悉概念，然后做"配套练习题"巩固，最后查看"常见错误"避免踩坑。每天坚持练习10-15分钟效果最好！</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-md">
              <div className="mb-3 flex items-center gap-2 font-bold text-emerald-700"><BookOpen className="h-5 w-5" />核心要点</div>
              <ul className="space-y-2">
                {topic.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold text-emerald-700">{i + 1}</span>
                    {kp}
                  </li>
                ))}
              </ul>
            </div>
            {topic.formulas && topic.formulas.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-md">
                <div className="mb-3 font-bold text-amber-700">📐 公式</div>
                <div className="space-y-2">
                  {topic.formulas.map((f, i) => (
                    <div key={i} className="rounded-lg bg-white/70 p-3 font-mono text-sm text-amber-800">{f}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-md">
              <div className="mb-3 flex items-center gap-2 font-bold text-rose-700"><AlertTriangle className="h-5 w-5" />常见错误</div>
              <ul className="space-y-2">
                {topic.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-rose-700"><span className="shrink-0">❌</span>{m}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-md">
              <div className="mb-3 font-bold text-violet-700">📝 练习类型</div>
              <div className="flex flex-wrap gap-2">
                {topic.practiceTypes.map((pt, i) => (
                  <span key={i} className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-violet-700">{pt}</span>
                ))}
              </div>
            </div>

            {topic.relatedTools.length > 0 && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-md">
                <div className="mb-3 font-bold text-indigo-700">🎮 更多练习工具</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {topic.relatedTools.map((tool) => {
                    const toolMap: Record<string, { label: string; emoji: string }> = {
                      '/speed-calc': { label: '速算练习', emoji: '⚡' },
                      '/multiplication-table': { label: '九九乘法表', emoji: '✖️' },
                      '/column-calc': { label: '竖式计算', emoji: '📐' },
                      '/word-problems': { label: '应用题', emoji: '📖' },
                      '/mistakes': { label: '易错题', emoji: '⚠️' },
                      '/formulas': { label: '公式卡片', emoji: '📝' },
                      '/fractions': { label: '分数可视化', emoji: '🥧' },
                      '/clock': { label: '认钟表', emoji: '🕐' },
                      '/number-sense': { label: '数感训练', emoji: '🧠' },
                      '/number-line': { label: '数轴探索', emoji: '📏' },
                      '/concepts': { label: '抽象概念', emoji: '💡' },
                      '/solve-steps': { label: '解题步骤', emoji: '📝' },
                    }
                    const info = toolMap[tool]
                    return info ? (
                      <Link key={tool} href={tool} className="flex items-center gap-2 rounded-xl bg-white/80 p-3 text-sm font-medium text-indigo-700 transition hover:bg-white hover:shadow">
                        <span>{info.emoji}</span>{info.label}
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// ========== 多方法学习组件 ==========
type MethodTab = {
  id: string
  label: string
  emoji: string
  desc: string
  color: string
}

function MultiMethodLearning({ slug, gradeId, topicTitle }: { slug: string; gradeId: number; topicTitle: string }) {
  const [activeTab, setActiveTab] = useState('feynman')
  const config = getInteractiveComponent(slug, gradeId, topicTitle)
  const hasFeynman = !!feynmanTopics[slug]

  // 构建可用方法列表
  const methods: MethodTab[] = []

  if (hasFeynman) {
    methods.push({ id: 'feynman', label: '费曼学习法', emoji: '🎓', desc: '老师引导，讲给别人听', color: 'from-violet-500 to-purple-500' })
  }
  if (config) {
    const methodLabels: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
      'number-game': { label: '数字游戏', emoji: '🔢', desc: '看图选数字', color: 'from-indigo-500 to-blue-500' },
      'math-practice': { label: '计算练习', emoji: '🧮', desc: '做题巩固', color: 'from-emerald-500 to-teal-500' },
      'perimeter': { label: '图形计算', emoji: '📐', desc: '看图算周长面积', color: 'from-blue-500 to-indigo-500' },
      'shape-explorer': { label: '图形探索', emoji: '🔷', desc: '认识各种图形', color: 'from-purple-500 to-pink-500' },
      'clock-learning': { label: '认识钟表', emoji: '🕐', desc: '读出时间', color: 'from-amber-500 to-orange-500' },
      'money-calculator': { label: '人民币计算', emoji: '💰', desc: '凑钱游戏', color: 'from-green-500 to-emerald-500' },
      'compare-game': { label: '比较大小', emoji: '⚖️', desc: '谁大谁小', color: 'from-orange-500 to-red-500' },
      'carry-addition': { label: '进位加法', emoji: '➕', desc: '竖式演示', color: 'from-blue-500 to-cyan-500' },
      'fraction-game': { label: '分数认识', emoji: '🥧', desc: '涂色学分数', color: 'from-indigo-500 to-violet-500' },
      'equation-game': { label: '解方程', emoji: '📐', desc: '求未知数', color: 'from-teal-500 to-cyan-500' },
      'percent-game': { label: '百分数', emoji: '💯', desc: '百分数应用', color: 'from-rose-500 to-pink-500' },
    }
    const info = methodLabels[config.type]
    if (info) {
      methods.push({ id: 'interactive', label: info.label, emoji: info.emoji, desc: info.desc, color: info.color })
    }
  }
  methods.push({ id: 'practice', label: '练习题', emoji: '📝', desc: '配套巩固练习', color: 'from-amber-500 to-yellow-500' })
  methods.push({ id: 'tips', label: '学习技巧', emoji: '💡', desc: '方法与要点', color: 'from-sky-500 to-blue-500' })

  // 默认选中第一个
  const [initialized, setInitialized] = useState(false)
  if (!initialized && methods.length > 0) {
    setActiveTab(hasFeynman ? 'feynman' : methods[0].id)
    setInitialized(true)
  }

  return (
    <div>
      {/* 方法选择 Tab */}
      <div className="mb-4 flex flex-wrap gap-2">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${
              activeTab === m.id
                ? `bg-gradient-to-r ${m.color} text-white shadow-md scale-105`
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:shadow'
            }`}
          >
            <span className="text-lg">{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* 方法描述 */}
      <div className="mb-4 text-center">
        <p className="text-sm text-slate-500">
          {methods.find(m => m.id === activeTab)?.emoji}{' '}
          {methods.find(m => m.id === activeTab)?.desc}
        </p>
      </div>

      {/* 内容区域 */}
      {activeTab === 'feynman' && hasFeynman && (
        <FeynmanCoach topicSlug={slug} />
      )}

      {activeTab === 'interactive' && config && (
        <>
          {config.type === 'number-game' && <NumberCardGame maxNumber={config.props.maxNumber} />}
          {config.type === 'math-practice' && <MathPractice operation={config.props.operation} maxNumber={config.props.maxNumber} />}
          {config.type === 'perimeter' && <PerimeterPractice shape={config.props.shape} />}
          {config.type === 'shape-explorer' && <ShapeExplorer grade={config.props.grade} />}
          {config.type === 'clock-learning' && <ClockLearning />}
          {config.type === 'money-calculator' && <MoneyCalculator maxAmount={config.props.maxAmount} />}
          {config.type === 'compare-game' && <CompareGame />}
          {config.type === 'carry-addition' && <CarryAddition />}
          {config.type === 'fraction-game' && <FractionGame />}
          {config.type === 'equation-game' && <EquationGame />}
          {config.type === 'percent-game' && <PercentGame />}
        </>
      )}

      {activeTab === 'practice' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-emerald-700 font-bold">通过练习巩固知识点</p>
            <Link href="/practice" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600">
              更多练习
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/practice?topic=${slug}&mode=smart`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">🧠</span>
              <div><p className="font-bold text-emerald-800">智能练习</p><p className="text-xs text-emerald-600">AI根据你的水平出题</p></div>
            </Link>
            <Link href={`/practice?topic=${slug}&mode=custom`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">⚙️</span>
              <div><p className="font-bold text-blue-800">自定义练习</p><p className="text-xs text-blue-600">选择难度和题量</p></div>
            </Link>
            <Link href={`/speed-calc`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg">⚡</span>
              <div><p className="font-bold text-orange-800">速算挑战</p><p className="text-xs text-orange-600">限时计算比赛</p></div>
            </Link>
            <Link href={`/mistake-book`} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg">📕</span>
              <div><p className="font-bold text-red-800">错题本</p><p className="text-xs text-red-600">复习做错的题</p></div>
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <TipsPanel slug={slug} />
      )}
    </div>
  )
}

// 学习技巧面板
function TipsPanel({ slug }: { slug: string }) {
  const data = getTopicBySlug(slug)
  if (!data) return null
  const { topic } = data

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-6 shadow-lg">
      {/* 学习流程建议 */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h4 className="mb-3 font-bold text-sky-800">🗺️ 推荐学习流程</h4>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-violet-100 px-3 py-1 font-bold text-violet-700">1️⃣ 费曼学习</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 font-bold text-indigo-700">2️⃣ 互动练习</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700">3️⃣ 做题巩固</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-700">4️⃣ 查看技巧</span>
        </div>
      </div>

      {/* 学习技巧 */}
      <div className="mb-6">
        <h4 className="mb-3 font-bold text-sky-800">💡 学习技巧</h4>
        <div className="space-y-3">
          {topic.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-amber-700">{i + 1}</span>
              <p className="text-slate-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 核心要点 + 公式 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h4 className="mb-2 font-bold text-emerald-700">📌 核心要点</h4>
          <ul className="space-y-1">
            {topic.keyPoints.map((kp, i) => (
              <li key={i} className="text-sm text-slate-600">• {kp}</li>
            ))}
          </ul>
        </div>
        {topic.formulas && topic.formulas.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h4 className="mb-2 font-bold text-amber-700">📐 公式</h4>
            <div className="space-y-1">
              {topic.formulas.map((f, i) => (
                <div key={i} className="rounded bg-amber-50 p-2 font-mono text-sm text-amber-800">{f}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 常见错误 */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <h4 className="mb-2 font-bold text-rose-700">⚠️ 常见错误（注意避开！）</h4>
        <div className="space-y-2">
          {topic.commonMistakes.map((m, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-rose-500">❌</span>
              <span className="text-slate-600">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
