'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle, Circle } from 'lucide-react'
import Link from 'next/link'
import { GRADES, getAllTopics } from '@/lib/curriculum'
import { useAchievements } from '@/lib/achievements'
import { getPracticeRecords } from '@/lib/storage'

export default function KnowledgeMapPage() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('knowledge-map')
    const records = getPracticeRecords()
    const modules = new Set(records.map(r => r.module))
    // 根据练习记录推断完成的知识点
    const completed = new Set<string>()
    modules.forEach(m => {
      if (m === 'speed-calc') {
        completed.add('g1-add-10')
        completed.add('g1-add-20')
        completed.add('g2-add-sub-100')
      }
      if (m === 'multiplication-table') {
        completed.add('g2-mul-table')
      }
    })
    setCompletedTopics(completed)
  }, [trackVisit])

  const allTopics = getAllTopics()
  const completedCount = completedTopics.size
  const totalCount = allTopics.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🗺️ 知识地图</h1>
          <div className="w-20" />
        </header>

        {/* 总进度 */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold text-slate-700">学习进度</span>
            <span className="text-sm text-slate-500">{completedCount}/{totalCount} 知识点</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right text-sm font-bold text-indigo-600">{progress}%</div>
        </div>

        {selectedGrade ? (
          <div>
            <button
              onClick={() => setSelectedGrade(null)}
              className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              返回年级选择
            </button>
            
            {GRADES.find(g => g.id === selectedGrade)?.categories.map((category) => (
              <div key={category.name} className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                  <span className="text-2xl">{category.emoji}</span>
                  {category.name}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.topics.map((topic) => {
                    const isCompleted = completedTopics.has(topic.slug)
                    return (
                      <div
                        key={topic.slug}
                        className={`rounded-2xl border-2 p-4 transition hover:shadow-md ${
                          isCompleted 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-slate-100 bg-slate-50'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-2xl">{topic.emoji}</span>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <h3 className="mb-1 font-bold text-slate-800">{topic.title}</h3>
                        <p className="mb-3 text-xs text-slate-500">{topic.desc}</p>
                        
                        <div className="mb-3">
                          <div className="mb-1 text-xs font-bold text-slate-600">重点：</div>
                          <ul className="space-y-1">
                            {topic.keyPoints.slice(0, 2).map((point, i) => (
                              <li key={i} className="text-xs text-slate-500">• {point}</li>
                            ))}
                          </ul>
                        </div>

                        {topic.relatedTools.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {topic.relatedTools.slice(0, 2).map((tool) => (
                              <Link
                                key={tool}
                                href={tool}
                                className="rounded-lg bg-white px-2 py-1 text-xs font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50"
                              >
                                去练习 →
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GRADES.map((grade) => {
              const topicCount = grade.categories.reduce((sum, c) => sum + c.topics.length, 0)
              const completedInGrade = grade.categories.reduce((sum, c) => 
                sum + c.topics.filter(t => completedTopics.has(t.slug)).length, 0
              )
              const gradeProgress = Math.round((completedInGrade / topicCount) * 100)
              
              return (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`rounded-3xl p-6 text-left shadow-xl transition hover:shadow-2xl hover:-translate-y-1 ${grade.bg} border-2 ${grade.borderColor}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-4xl">{grade.emoji}</span>
                    <ChevronRight className={`h-6 w-6 ${grade.color}`} />
                  </div>
                  <h2 className={`mb-2 text-2xl font-bold ${grade.color}`}>{grade.title}</h2>
                  <p className="mb-4 text-sm text-slate-600">
                    {grade.categories.length} 个单元 · {topicCount} 个知识点
                  </p>
                  <div className="rounded-xl bg-white/70 p-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-600">学习进度</span>
                      <span className={`font-bold ${grade.color}`}>{gradeProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${grade.color.replace('text-', 'bg-')}`}
                        style={{ width: `${gradeProgress}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* 学习建议 */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-amber-800">
            <BookOpen className="h-5 w-5" />
            学习建议
          </h3>
          <ul className="space-y-2 text-amber-700">
            <li>• 按照年级顺序循序渐进，打好基础再学新知识</li>
            <li>• 每个知识点都有配套练习工具，学完记得练习巩固</li>
            <li>• 错题会自动收录到错题本，定期复习很重要</li>
            <li>• 坚持每天练习10分钟，比一次性练很久效果更好</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
