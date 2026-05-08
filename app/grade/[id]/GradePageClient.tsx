'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, Gamepad2, Brain, Bot, Trophy } from 'lucide-react'
import { GRADES, getGradeById } from '@/lib/curriculum'
import LuoXiaoHei, { type LuoXiaoHeiType } from '@/components/LuoXiaoHei'

// 年级页面快捷功能
const gradeQuickTools = [
  { title: '数学大冒险', emoji: '🏆', href: '/adventure', desc: '闯关游戏', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
  { title: '智能练习', emoji: '🧠', href: '/practice', desc: 'AI出题', icon: Brain, color: 'from-indigo-400 to-purple-500' },
  { title: 'AI辅导', emoji: '🤖', href: '/ai-tutor', desc: '拍照解题', icon: Bot, color: 'from-cyan-400 to-blue-500' },
  { title: '趣味游戏', emoji: '🎮', href: '/fun', desc: '数学游戏', icon: Gamepad2, color: 'from-emerald-400 to-teal-500' },
]

// 年级对应的罗小黑类型
const gradeLuoXiaoHeiType: Record<number, LuoXiaoHeiType> = {
  1: 'grade1',
  2: 'grade2',
  3: 'grade3',
  4: 'grade4',
  5: 'grade5',
  6: 'grade6',
}

// 年级对应的罗小黑问候语
const gradeGreetings: Record<number, string[]> = {
  1: ['你好呀！我是绿色小黑，一年级的小朋友们准备好了吗？', '1-20的认识、加减法，让我们一起加油吧！'],
  2: ['二年级的同学们好！我是青色小黑！', '乘法口诀、除法，这些都可以很简单的！'],
  3: ['三年级的小朋友们好！我是蓝色小黑！', '多位数运算、分数、周长面积，我来带你学！'],
  4: ['四年级的同学们好！我是紫色小黑！', '大数、小数、三角形，这些知识很有趣！'],
  5: ['五年级的小朋友们好！我是粉色小黑！', '方程、分数运算，跟着我一起探索吧！'],
  6: ['六年级的同学们好！我是红色小黑！', '百分数、圆、比例，冲刺阶段加油！'],
}

export default function GradePageClient() {
  const params = useParams()
  const gradeId = parseInt(params.id as string, 10)
  const grade = getGradeById(gradeId)

  if (!grade) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">找不到这个年级</h1>
          <Link href="/" className="rounded-full bg-indigo-500 px-6 py-2 text-white font-bold shadow">返回首页</Link>
        </div>
      </main>
    )
  }

  const totalTopics = grade.categories.reduce((sum, c) => sum + c.topics.length, 0)
  const prevGrade = gradeId > 1 ? GRADES[gradeId - 2] : null
  const nextGrade = gradeId < 6 ? GRADES[gradeId] : null
  const luoType = gradeLuoXiaoHeiType[gradeId] || 'default'
  const greetings = gradeGreetings[gradeId] || ['欢迎来到数学乐园！']

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white">
            <ArrowLeft className="h-4 w-4" />首页
          </Link>
        </div>

        {/* 年级头部 + 罗小黑 */}
        <header className={`mb-8 rounded-3xl border ${grade.borderColor} ${grade.bg} p-8 shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* 罗小黑 */}
            <div className="shrink-0">
              <LuoXiaoHei type={luoType} size="lg" animate message={greetings[0]} />
            </div>
            {/* 年级信息 */}
            <div className="text-center sm:text-left flex-1">
              <div className="mb-2 text-5xl">{grade.emoji}</div>
              <h1 className={`mb-2 text-4xl font-extrabold ${grade.color}`}>{grade.title}</h1>
              <p className="text-slate-500">{grade.categories.length}个分类 · {totalTopics}个知识点</p>
              <p className="mt-2 text-sm text-slate-400">{greetings[1]}</p>
            </div>
          </div>
        </header>

        {/* 快捷功能入口 */}
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-700">
            <span className="text-2xl">🎮</span>游戏与工具
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gradeQuickTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.href} href={tool.href} className="group block">
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-xl shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      {tool.emoji}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-700">{tool.title}</div>
                      <div className="text-xs text-slate-400">{tool.desc}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 知识点列表 */}
        <div className="space-y-8">
          {grade.categories.map((cat) => (
            <section key={cat.name}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-700">
                <span className="text-2xl">{cat.emoji}</span>
                {cat.name}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                  {cat.topics.length}个知识点
                </span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {cat.topics.map((topic) => (
                  <Link key={topic.slug} href={`/topic/${topic.slug}`} className="group">
                    <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-2xl">{topic.emoji}</span>
                        <h3 className="text-lg font-bold text-slate-800">{topic.title}</h3>
                      </div>
                      <p className="mb-3 text-sm text-slate-500">{topic.desc}</p>

                      <div className="mb-2 flex flex-wrap gap-1">
                        {topic.keyPoints.slice(0, 3).map((kp, i) => (
                          <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {kp.length > 12 ? kp.slice(0, 12) + '…' : kp}
                          </span>
                        ))}
                      </div>

                      {topic.formulas && topic.formulas.length > 0 && (
                        <div className="rounded-lg bg-amber-50 p-2 text-xs font-mono text-amber-700">
                          {topic.formulas[0]}
                        </div>
                      )}

                      {/* 学习方法标签 */}
                      <div className="mt-2 flex gap-1">
                        <span className="rounded bg-violet-50 px-1.5 py-0.5 text-xs text-violet-500">费曼学习</span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-500">互动练习</span>
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-500">练习题</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 年级切换 */}
        <div className="mt-10 flex items-center justify-between">
          {prevGrade ? (
            <Link href={`/grade/${prevGrade.id}`} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50">
              ← {prevGrade.emoji} {prevGrade.title}
            </Link>
          ) : <div />}
          {nextGrade ? (
            <Link href={`/grade/${nextGrade.id}`} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50">
              {nextGrade.emoji} {nextGrade.title} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  )
}
