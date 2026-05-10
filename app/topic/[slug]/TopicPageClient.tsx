'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, Gamepad2, BookMarked, Calculator, ChevronRight } from 'lucide-react'
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

const getInteractiveComponent = (slug: string, gradeId: number): InteractiveConfig => {
  const feynmanSlugs = ['g1-1-20', 'g1-add-20', 'g1-sub-20', 'g1-compare', 'g1-shapes', 
    'g1-clock', 'g1-money', 'g2-mul-table', 'g2-division', 'g2-angle',
    'g3-fractions-intro', 'g3-perimeter', 'g3-area', 'g4-decimal-intro', 'g4-triangle',
    'g5-equation-problems', 'g5-fraction-ops', 'g6-percent', 'g6-circle', 'g6-proportion']
  if (feynmanSlugs.includes(slug)) return { type: 'feynman-coach', props: { topicSlug: slug } }

  // 一年级
  if (slug === 'g1-1-100') return { type: 'number-game', props: { maxNumber: 100 } }
  if (slug === 'g1-add-10') return { type: 'math-practice', props: { operation: 'add', maxNumber: 10 } }
  if (slug === 'g1-add-20-no-carry') return { type: 'math-practice', props: { operation: 'add', maxNumber: 20 } }
  if (slug === 'g1-sub-20-no-borrow') return { type: 'math-practice', props: { operation: 'subtract', maxNumber: 20 } }
  if (slug === 'g1-sort') return { type: 'number-game', props: { maxNumber: 20 } }
  if (slug === 'g1-position') return { type: 'number-game', props: { maxNumber: 10 } }

  // 二年级
  if (slug === 'g2-add-sub-100' || slug === 'g2-mental-calc' || slug === 'g2-mixed-ops') 
    return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-length' || slug === 'g2-mass' || slug === 'g2-line-segment') 
    return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
  if (slug === 'g2-observe') return { type: 'shape-explorer', props: { grade: gradeId } }
  if (slug === 'g2-data-collect') return { type: 'number-game', props: { maxNumber: 50 } }

  // 三年级
  if (slug === 'g3-multi-digit-add-sub') return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 1000 } }
  if (slug === 'g3-multi-digit-mul' || slug === 'g3-two-digit-mul') return { type: 'math-practice', props: { operation: 'multiply', maxNumber: 100 } }
  if (slug === 'g3-division') return { type: 'math-practice', props: { operation: 'divide', maxNumber: 100 } }
  if (slug === 'g3-time') return { type: 'clock-learning', props: {} }

  // 四年级
  if (slug === 'g4-large-numbers') return { type: 'number-game', props: { maxNumber: 10000 } }

  // 五年级
  if (slug === 'g5-polygon-area') return { type: 'perimeter', props: { shape: 'mixed' } }

  // 默认
  if (gradeId <= 2) return { type: 'number-game', props: { maxNumber: gradeId === 1 ? 20 : 100 } }
  return { type: 'math-practice', props: { operation: 'mixed', maxNumber: 100 } }
}

export default function TopicPageClient() {
  const params = useParams()
  const slug = params.slug as string
  const data = getTopicBySlug(slug)

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">找不到这个知识点</h1>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-white font-bold hover:bg-slate-800 transition">
            <Home className="h-4 w-4" />返回首页
          </Link>
        </div>
      </main>
    )
  }

  const { topic, grade } = data
  const config = getInteractiveComponent(slug, grade.id)
  const hasFeynman = !!feynmanTopics[slug]

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/grade/${grade.id}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition">
              <ArrowLeft className="h-4 w-4" />
              <span>{grade.title}</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{topic.title}</span>
          </div>
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 transition">
            <Home className="h-4.5 w-4.5 text-slate-500" />
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* 标题区 - 极简 */}
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${grade.bg} shadow-sm`}>
            {topic.emoji}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${grade.color} ${grade.bg}`}>{grade.emoji} {grade.title}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{topic.title}</h1>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{topic.desc}</p>
          </div>
        </div>

        {/* 学习方式 Tab - 简约胶囊 */}
        <LearningTabs slug={slug} gradeId={grade.id} config={config} hasFeynman={hasFeynman} topic={topic} />

        {/* 底部信息卡片 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 核心要点 */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              核心要点
            </h3>
            <ul className="space-y-2">
              {topic.keyPoints.map((kp, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-slate-300 mt-0.5">•</span>
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 常见错误 */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              常见错误
            </h3>
            <ul className="space-y-2">
              {topic.commonMistakes.map((m, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-rose-300 mt-0.5">✕</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 公式 */}
          {topic.formulas && topic.formulas.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                公式
              </h3>
              <div className="space-y-2">
                {topic.formulas.map((f, i) => (
                  <div key={i} className="rounded-xl bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-700 border border-slate-100">{f}</div>
                ))}
              </div>
            </div>
          )}

          {/* 学习技巧 */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              学习技巧
            </h3>
            <ul className="space-y-2">
              {topic.tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-300 mt-0.5">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

// ========== 学习方式 Tab ==========
function LearningTabs({ slug, gradeId, config, hasFeynman, topic }: { 
  slug: string; gradeId: number; config: InteractiveConfig; hasFeynman: boolean; topic: any 
}) {
  const [activeTab, setActiveTab] = useState(hasFeynman ? 'feynman' : 'interactive')

  const tabs: Array<{ id: string; label: string; emoji: string }> = []
  if (hasFeynman) tabs.push({ id: 'feynman', label: '费曼学习', emoji: '🎓' })
  tabs.push({ id: 'interactive', label: '互动练习', emoji: '🎮' })
  tabs.push({ id: 'tips', label: '知识要点', emoji: '📝' })

  return (
    <div>
      {/* Tab 栏 - 简约线条风格 */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="mr-1.5">{tab.emoji}</span>
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="animate-fade-in">
        {activeTab === 'feynman' && hasFeynman && <FeynmanCoach topicSlug={slug} />}

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

        {activeTab === 'tips' && (
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
            {/* 学习流程 */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-violet-50 px-3 py-1.5 font-medium text-violet-700 border border-violet-100">1. 费曼学习</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700 border border-indigo-100">2. 互动练习</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 border border-emerald-100">3. 巩固复习</span>
            </div>

            {/* 要点 */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">📌 核心要点</h4>
              <div className="space-y-2">
                {topic.keyPoints.map((kp: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{i + 1}</span>
                    <p className="text-sm text-slate-700">{kp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 公式 */}
            {topic.formulas && topic.formulas.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">📐 公式</h4>
                <div className="space-y-2">
                  {topic.formulas.map((f: string, i: number) => (
                    <div key={i} className="rounded-xl bg-amber-50 px-4 py-3 font-mono text-sm text-amber-800 border border-amber-100">{f}</div>
                  ))}
                </div>
              </div>
            )}

            {/* 常见错误 */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">⚠️ 常见错误</h4>
              <div className="space-y-2">
                {topic.commonMistakes.map((m: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-rose-600 rounded-xl bg-rose-50 p-3 border border-rose-100">
                    <span className="shrink-0">✕</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 学习技巧 */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">💡 学习技巧</h4>
              <div className="space-y-2">
                {topic.tips.map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 border border-blue-100">
                    <span className="shrink-0">💡</span>
                    <p className="text-sm text-blue-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
      `}</style>
    </div>
  )
}
