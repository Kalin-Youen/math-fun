'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, Lightbulb, AlertTriangle, BookOpen, BookText, Gamepad2 } from 'lucide-react'
import { getTopicBySlug, GRADES } from '@/lib/curriculum'
import { NumberCardGame, MathPractice } from '@/components/interactive-learning'

// 根据知识点 slug 判断应该使用哪种交互组件
const getInteractiveComponent = (slug: string, gradeId: number) => {
  // 数字认知类
  if (slug.includes('1-20') || slug.includes('1-100') || slug.includes('number') || slug.includes('count')) {
    return {
      type: 'number-game' as const,
      props: { maxNumber: slug.includes('1-100') || slug.includes('100') ? 100 : 20 }
    }
  }
  
  // 加法类
  if (slug.includes('add') || slug.includes('plus') || slug.includes('加法') || slug.includes('进位')) {
    return {
      type: 'math-practice' as const,
      props: { operation: 'add' as const, maxNumber: gradeId <= 1 ? 20 : gradeId <= 2 ? 100 : 1000 }
    }
  }
  
  // 减法类
  if (slug.includes('sub') || slug.includes('minus') || slug.includes('减法') || slug.includes('退位')) {
    return {
      type: 'math-practice' as const,
      props: { operation: 'subtract' as const, maxNumber: gradeId <= 1 ? 20 : gradeId <= 2 ? 100 : 1000 }
    }
  }
  
  // 乘法类
  if (slug.includes('mul') || slug.includes('times') || slug.includes('乘法') || slug.includes('口诀')) {
    return {
      type: 'math-practice' as const,
      props: { operation: 'multiply' as const, maxNumber: 9 }
    }
  }
  
  // 除法类
  if (slug.includes('div') || slug.includes('除法') || slug.includes('表内除')) {
    return {
      type: 'math-practice' as const,
      props: { operation: 'divide' as const, maxNumber: 81 }
    }
  }
  
  // 混合运算
  if (slug.includes('mixed') || slug.includes('混合')) {
    return {
      type: 'math-practice' as const,
      props: { operation: 'mixed' as const, maxNumber: gradeId <= 2 ? 20 : 100 }
    }
  }
  
  // 默认根据年级返回合适的组件
  if (gradeId <= 2) {
    return {
      type: 'number-game' as const,
      props: { maxNumber: gradeId === 1 ? 20 : 100 }
    }
  }
  
  return {
    type: 'math-practice' as const,
    props: { operation: 'mixed' as const, maxNumber: 100 }
  }
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
  const interactiveConfig = getInteractiveComponent(slug, grade.id)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/grade/${grade.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {grade.title}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
        </div>

        <header className={`mb-8 rounded-3xl border ${grade.borderColor} ${grade.bg} p-8 shadow-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full bg-white/80 px-3 py-1 text-xs font-bold ${grade.color}`}>
              {grade.emoji} {grade.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topic.emoji}</span>
            <h1 className="text-3xl font-extrabold text-slate-800">{topic.title}</h1>
          </div>
          <p className="mt-2 text-lg text-slate-600">{topic.desc}</p>
          
          {/* 教材原文入口 */}
          {topic.textbookContent && (
            <Link
              href={`/textbook/${slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
            >
              <BookText className="h-4 w-4" />
              查看教材原文
            </Link>
          )}
        </header>

        {/* ===== 交互式学习区域（核心新增） ===== */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">🎯 互动学习</h2>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
              边玩边学
            </span>
          </div>
          
          {interactiveConfig.type === 'number-game' && (
            <NumberCardGame maxNumber={interactiveConfig.props.maxNumber} />
          )}
          
          {interactiveConfig.type === 'math-practice' && (
            <MathPractice 
              operation={interactiveConfig.props.operation} 
              maxNumber={interactiveConfig.props.maxNumber}
            />
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-md">
              <div className="mb-3 flex items-center gap-2 font-bold text-emerald-700">
                <BookOpen className="h-5 w-5" />
                核心要点
              </div>
              <ul className="space-y-2">
                {topic.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold text-emerald-700">
                      {i + 1}
                    </span>
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
                    <div key={i} className="rounded-lg bg-white/70 p-3 font-mono text-sm text-amber-800">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-md">
              <div className="mb-3 flex items-center gap-2 font-bold text-sky-700">
                <Lightbulb className="h-5 w-5" />
                学习技巧
              </div>
              <ul className="space-y-2">
                {topic.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-sky-700">
                    💡 {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-md">
              <div className="mb-3 flex items-center gap-2 font-bold text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                常见错误
              </div>
              <ul className="space-y-2">
                {topic.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                    <span className="shrink-0">❌</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-md">
              <div className="mb-3 font-bold text-violet-700">📝 练习类型</div>
              <div className="flex flex-wrap gap-2">
                {topic.practiceTypes.map((pt, i) => (
                  <span key={i} className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-violet-700">
                    {pt}
                  </span>
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
                      '/number-bonds': { label: '数的组成', emoji: '🧩' },
                    }
                    const info = toolMap[tool]
                    return info ? (
                      <Link
                        key={tool}
                        href={tool}
                        className="flex items-center gap-2 rounded-xl bg-white/80 p-3 text-sm font-medium text-indigo-700 transition hover:bg-white hover:shadow"
                      >
                        <span>{info.emoji}</span>
                        {info.label}
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
