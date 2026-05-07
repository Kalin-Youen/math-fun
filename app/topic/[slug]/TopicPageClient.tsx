'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, Lightbulb, AlertTriangle, BookOpen, BookText, Gamepad2, BookMarked, Calculator } from 'lucide-react'
import { getTopicBySlug } from '@/lib/curriculum'
import { 
  NumberCardGame, MathPractice, PerimeterPractice, ShapeExplorer, 
  ClockLearning, MoneyCalculator, CompareGame, CarryAddition,
  FeynmanTutor, FractionGame, EquationGame, PercentGame
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
  | { type: 'feynman-tutor'; props: { topicSlug: string; topicTitle: string; gradeId: number } }
  | { type: 'fraction-game'; props: Record<string, never> }
  | { type: 'equation-game'; props: Record<string, never> }
  | { type: 'percent-game'; props: Record<string, never> }

// 根据知识点 slug 精确匹配交互组件
const getInteractiveComponent = (slug: string, gradeId: number, topicTitle: string): InteractiveConfig => {
  // ========== 一年级 ==========
  if (slug === 'g1-1-20') return { type: 'number-game', props: { maxNumber: 20 } }
  if (slug === 'g1-1-100') return { type: 'number-game', props: { maxNumber: 100 } }
  if (slug === 'g1-compare') return { type: 'compare-game', props: {} }
  if (slug === 'g1-add-10') return { type: 'math-practice', props: { operation: 'add', maxNumber: 10 } }
  if (slug === 'g1-add-20-no-carry') return { type: 'math-practice', props: { operation: 'add', maxNumber: 20 } }
  if (slug === 'g1-add-20') return { type: 'carry-addition', props: {} }
  if (slug === 'g1-sub-20-no-borrow') return { type: 'math-practice', props: { operation: 'subtract', maxNumber: 20 } }
  if (slug === 'g1-sub-20') return { type: 'math-practice', props: { operation: 'subtract', maxNumber: 20 } }
  if (slug === 'g1-shapes' || slug === 'g1-plane-shapes') return { type: 'shape-explorer', props: { grade: gradeId } }
  if (slug === 'g1-sort') return { type: 'number-game', props: { maxNumber: 20 } }
  if (slug === 'g1-clock') return { type: 'clock-learning', props: {} }
  if (slug === 'g1-money') return { type: 'money-calculator', props: { maxAmount: 20 } }
  if (slug === 'g1-position') return { type: 'number-game', props: { maxNumber: 10 } }
  if (slug === 'g1-math-fun') return { type: 'feynman-tutor', props: { topicSlug: slug, topicTitle, gradeId } }

  // ========== 二年级 ==========
  if (slug === 'g2-add-sub-100') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mental-calc') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mixed-ops') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mul-table') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 9 } }
  if (slug === 'g2-division') return { type: 'math-practice', props: { operation: 'divide', maxNumber: 81 } }
  if (slug === 'g2-length') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-mass') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-angle') return { type: 'shape-explorer', props: { grade: gradeId } }
  if (slug === 'g2-observe') return { type: 'shape-explorer', props: { grade: gradeId } }
  if (slug === 'g2-line-segment') return { type: 'math-practice', props: { operation: 'add', maxNumber: 100 } }
  if (slug === 'g2-data-collect') return { type: 'number-game', props: { maxNumber: 50 } }

  // ========== 三年级 ==========
  if (slug === 'g3-multi-digit-add-sub') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 1000 } }
  if (slug === 'g3-multi-digit-mul') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 100 } }
  if (slug === 'g3-two-digit-mul') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 100 } }
  if (slug === 'g3-division') return { type: 'math-practice', props: { operation: 'divide', maxNumber: 100 } }
  if (slug === 'g3-fractions-intro') return { type: 'fraction-game', props: {} }
  if (slug === 'g3-perimeter') return { type: 'perimeter', props: { shape: 'mixed' } }
  if (slug === 'g3-area') return { type: 'perimeter', props: { shape: 'mixed' } }
  if (slug === 'g3-time') return { type: 'clock-learning', props: {} }

  // ========== 四年级 ==========
  if (slug === 'g4-large-numbers') return { type: 'number-game', props: { maxNumber: 10000 } }
  if (slug === 'g4-decimal-intro') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g4-triangle') return { type: 'shape-explorer', props: { grade: gradeId } }

  // ========== 五年级 ==========
  if (slug === 'g5-equation-problems') return { type: 'equation-game', props: {} }
  if (slug === 'g5-fraction-ops') return { type: 'fraction-game', props: {} }
  if (slug === 'g5-polygon-area') return { type: 'perimeter', props: { shape: 'mixed' } }

  // ========== 六年级 ==========
  if (slug === 'g6-percent') return { type: 'percent-game', props: {} }
  if (slug === 'g6-circle') return { type: 'perimeter', props: { shape: 'mixed' } }
  if (slug === 'g6-proportion') return { type: 'percent-game', props: {} }

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

        {/* 交互式学习区域 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">🎯 互动学习</h2>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">边玩边学</span>
          </div>

          {config.type === 'number-game' && <NumberCardGame maxNumber={config.props.maxNumber} />}
          {config.type === 'math-practice' && <MathPractice operation={config.props.operation} maxNumber={config.props.maxNumber} />}
          {config.type === 'perimeter' && <PerimeterPractice shape={config.props.shape} />}
          {config.type === 'shape-explorer' && <ShapeExplorer grade={config.props.grade} />}
          {config.type === 'clock-learning' && <ClockLearning />}
          {config.type === 'money-calculator' && <MoneyCalculator maxAmount={config.props.maxAmount} />}
          {config.type === 'compare-game' && <CompareGame />}
          {config.type === 'carry-addition' && <CarryAddition />}
          {config.type === 'feynman-tutor' && <FeynmanTutor topicSlug={config.props.topicSlug} topicTitle={config.props.topicTitle} gradeId={config.props.gradeId} />}
          {config.type === 'fraction-game' && <FractionGame />}
          {config.type === 'equation-game' && <EquationGame />}
          {config.type === 'percent-game' && <PercentGame />}
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
