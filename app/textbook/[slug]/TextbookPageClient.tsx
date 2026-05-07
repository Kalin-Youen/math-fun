'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Home, ArrowLeft, BookOpen, Lightbulb, Pencil, ChevronRight } from 'lucide-react'
import { getTopicBySlug } from '@/lib/curriculum'

export default function TextbookPageClient() {
  const params = useParams()
  const slug = params.slug as string
  const data = getTopicBySlug(slug)

  if (!data || !data.topic.textbookContent) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">暂无教材原文</h1>
          <p className="text-slate-500 mb-6">该知识点暂时没有教材原文内容</p>
          <Link href={`/topic/${slug}`} className="rounded-full bg-indigo-500 px-6 py-2 text-white font-bold shadow">
            返回知识点
          </Link>
        </div>
      </main>
    )
  }

  const { topic, grade } = data
  const textbook = topic.textbookContent!
  if (!textbook) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* 导航栏 */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/topic/${slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回知识点
          </Link>
          <Link
            href={`/grade/${grade.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
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

        {/* 标题区 */}
        <header className={`mb-8 rounded-3xl border ${grade.borderColor} ${grade.bg} p-8 shadow-lg`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`rounded-full bg-white/80 px-3 py-1 text-xs font-bold ${grade.color}`}>
              {grade.emoji} {grade.title}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              <BookOpen className="h-3 w-3 inline mr-1" />
              教材原文
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topic.emoji}</span>
            <div>
              <p className="text-sm text-slate-500">{textbook.chapter}</p>
              <h1 className="text-2xl font-extrabold text-slate-800">{textbook.section}</h1>
            </div>
          </div>
        </header>

        {/* 教材内容 */}
        <div className="space-y-6">
          {/* 知识讲解 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              知识讲解
            </div>
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                {textbook.content}
              </pre>
            </div>
          </div>

          {/* 例题 */}
          {textbook.examples && textbook.examples.length > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-md">
              <div className="mb-4 flex items-center gap-2 font-bold text-emerald-700">
                <Lightbulb className="h-5 w-5" />
                例题精讲
              </div>
              <div className="space-y-4">
                {textbook.examples.map((example, i) => (
                  <div key={i} className="rounded-xl bg-white/70 p-4">
                    <h3 className="font-bold text-emerald-800 mb-2">{example.title}</h3>
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">
                      {example.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 练习题 */}
          {textbook.exercises && textbook.exercises.length > 0 && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-md">
              <div className="mb-4 flex items-center gap-2 font-bold text-violet-700">
                <Pencil className="h-5 w-5" />
                课后练习
              </div>
              <div className="space-y-4">
                {textbook.exercises.map((exercise, i) => (
                  <div key={i} className="rounded-xl bg-white/70 p-4">
                    <p className="text-slate-700 mb-2">{exercise.question}</p>
                    {exercise.hint && (
                      <div className="mt-2 rounded-lg bg-violet-100/50 px-3 py-2 text-sm text-violet-600">
                        <span className="font-medium">💡 提示：</span>{exercise.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部导航 */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/topic/${slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-white font-bold shadow-lg transition hover:bg-indigo-600 hover:-translate-y-0.5"
          >
            返回知识点详情
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
