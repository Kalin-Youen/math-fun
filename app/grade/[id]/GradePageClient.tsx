'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'
import { GRADES, getGradeById } from '@/lib/curriculum'

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
          <Link href="/" className="rounded-full bg-indigo-500 px-6 py-2 text-white font-bold shadow">
            返回首页
          </Link>
        </div>
      </main>
    )
  }

  const totalTopics = grade.categories.reduce((sum, c) => sum + c.topics.length, 0)
  const prevGrade = gradeId > 1 ? GRADES[gradeId - 2] : null
  const nextGrade = gradeId < 6 ? GRADES[gradeId] : null

  return (
    <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            首页
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
        </div>

        <header className={`mb-8 rounded-3xl border ${grade.borderColor} ${grade.bg} p-8 text-center shadow-lg`}>
          <div className="mb-2 text-5xl">{grade.emoji}</div>
          <h1 className={`mb-2 text-4xl font-extrabold ${grade.color}`}>{grade.title}</h1>
          <p className="text-slate-500">
            {grade.categories.length}个分类 · {totalTopics}个知识点
          </p>
        </header>

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

                      {topic.relatedTools.length > 0 && (
                        <div className="mt-2 flex gap-1">
                          {topic.relatedTools.slice(0, 2).map((tool) => (
                            <span key={tool} className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-500">
                              练习→
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          {prevGrade ? (
            <Link
              href={`/grade/${prevGrade.id}`}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50"
            >
              ← {prevGrade.emoji} {prevGrade.title}
            </Link>
          ) : <div />}
          {nextGrade ? (
            <Link
              href={`/grade/${nextGrade.id}`}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50"
            >
              {nextGrade.emoji} {nextGrade.title} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  )
}
