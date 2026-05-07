'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, CheckCircle, X, RotateCcw, BookX } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { getMistakeRecords, removeMistakeRecord, markMistakeReviewed, MODULE_LABELS } from '@/lib/storage'

export default function MistakeBookPage() {
  const [mistakes, setMistakes] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all')
  const [selectedMistake, setSelectedMistake] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const { unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('mistake-book')
    loadMistakes()
  }, [trackVisit])

  const loadMistakes = () => {
    const records = getMistakeRecords()
    setMistakes(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }

  const handleDelete = (id: string) => {
    removeMistakeRecord(id)
    loadMistakes()
    setShowDeleteConfirm(null)
  }

  const handleReview = (id: string) => {
    markMistakeReviewed(id)
    loadMistakes()
    
    const reviewedCount = mistakes.filter(m => m.reviewed || m.id === id).length
    if (reviewedCount >= 5) {
      unlock('mistake_review_5')
    }
  }

  const filteredMistakes = mistakes.filter(m => {
    if (filter === 'unreviewed') return !m.reviewed
    if (filter === 'reviewed') return m.reviewed
    return true
  })

  const unreviewedCount = mistakes.filter(m => !m.reviewed).length
  const reviewedCount = mistakes.filter(m => m.reviewed).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📕 错题本</h1>
          <div className="w-20" />
        </header>

        {/* 统计卡片 */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-lg text-center">
            <div className="text-3xl font-bold text-slate-800">{mistakes.length}</div>
            <div className="text-sm text-slate-500">总错题数</div>
          </div>
          <div className="rounded-2xl bg-rose-100 p-5 shadow-lg text-center">
            <div className="text-3xl font-bold text-rose-600">{unreviewedCount}</div>
            <div className="text-sm text-rose-700">待复习</div>
          </div>
          <div className="rounded-2xl bg-green-100 p-5 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{reviewedCount}</div>
            <div className="text-sm text-green-700">已掌握</div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="mb-6 flex justify-center gap-2">
          {[
            { key: 'all', label: '全部', count: mistakes.length },
            { key: 'unreviewed', label: '待复习', count: unreviewedCount },
            { key: 'reviewed', label: '已掌握', count: reviewedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`rounded-xl px-4 py-2 font-medium transition ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 错题列表 */}
        {filteredMistakes.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="mb-2 text-xl font-bold text-slate-800">太棒了！</h2>
            <p className="text-slate-500">
              {filter === 'all' 
                ? '你还没有错题，继续保持！' 
                : filter === 'unreviewed' 
                ? '没有待复习的错题了！' 
                : '还没有已掌握的错题'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
              >
                查看全部
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMistakes.map((mistake) => (
              <div
                key={mistake.id}
                className={`rounded-2xl p-5 shadow-lg transition ${
                  mistake.reviewed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-lg px-2 py-1 text-xs font-bold ${
                        MODULE_LABELS[mistake.module]?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        {MODULE_LABELS[mistake.module]?.emoji} {MODULE_LABELS[mistake.module]?.label || mistake.module}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(mistake.date).toLocaleDateString()}
                      </span>
                      {mistake.reviewed && (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          已掌握
                        </span>
                      )}
                    </div>
                    <div className="mb-2 text-lg font-bold text-slate-800">
                      {mistake.question}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-red-500">
                        你的答案: {mistake.userAnswer || '(未作答)'}
                      </span>
                      <span className="text-green-600">
                        正确答案: {mistake.correctAnswer}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!mistake.reviewed ? (
                      <button
                        onClick={() => handleReview(mistake.id)}
                        className="rounded-xl bg-green-500 p-2 text-white shadow-sm transition hover:bg-green-600"
                        title="标记为已掌握"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedMistake(mistake)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                        title="重新练习"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(mistake.id)}
                      className="rounded-xl bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200"
                      title="删除"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl max-w-sm w-full">
              <h3 className="mb-4 text-lg font-bold text-slate-800">确认删除？</h3>
              <p className="mb-6 text-slate-600">删除后无法恢复，确定要删除这道错题吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 rounded-xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 重新练习弹窗 */}
        {selectedMistake && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl max-w-md w-full">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">重新练习</h3>
                <button
                  onClick={() => setSelectedMistake(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-6 text-center">
                <div className="mb-4 text-3xl font-bold text-slate-800">
                  {selectedMistake.question}
                </div>
                <input
                  type="text"
                  className="w-32 rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-2xl font-bold focus:border-indigo-400 focus:outline-none"
                  placeholder="?"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      if (input.value === selectedMistake.correctAnswer) {
                        alert('回答正确！🎉')
                        handleReview(selectedMistake.id)
                        setSelectedMistake(null)
                      } else {
                        alert('再想想，正确答案应该是 ' + selectedMistake.correctAnswer)
                      }
                    }
                  }}
                />
              </div>
              <p className="text-center text-sm text-slate-500">按回车键提交答案</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
