'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, Target, TrendingUp, Calendar, BookX, Clock } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { getPracticeRecords, getDailyCheckIns, getMistakeRecords, getModuleStats, getWeakModules, getStreakDays, getTodayStats, getRecentRecords, MODULE_LABELS } from '@/lib/storage'

export default function DashboardPage() {
  const [records, setRecords] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([])
  const [mistakes, setMistakes] = useState<any[]>([])
  const [weakModules, setWeakModules] = useState<any[]>([])
  const [streakDays, setStreakDays] = useState(0)
  const [todayStats, setTodayStats] = useState({ practiced: false, questionsDone: 0, correctRate: 0 })
  const { achievements, unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('dashboard')
    unlock('dashboard_view')
    
    setRecords(getPracticeRecords())
    setCheckins(getDailyCheckIns())
    setMistakes(getMistakeRecords())
    setWeakModules(getWeakModules())
    setStreakDays(getStreakDays())
    setTodayStats(getTodayStats())
  }, [trackVisit, unlock])

  const totalQuestions = records.reduce((sum, r) => sum + r.total, 0)
  const totalCorrect = records.reduce((sum, r) => sum + r.score, 0)
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const moduleStats = Object.keys(MODULE_LABELS).map(key => {
    const stats = getModuleStats(key)
    return {
      key,
      ...MODULE_LABELS[key],
      ...stats
    }
  }).filter(m => m.total > 0).sort((a, b) => b.total - a.total)

  const recentRecords = getRecentRecords(7)
  const recentQuestions = recentRecords.reduce((sum, r) => sum + r.total, 0)
  const recentCorrect = recentRecords.reduce((sum, r) => sum + r.score, 0)
  const recentAccuracy = recentQuestions > 0 ? Math.round((recentCorrect / recentQuestions) * 100) : 0

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📊 学习仪表盘</h1>
          <div className="w-20" />
        </header>

        {/* 今日概览 */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-5 text-white shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-indigo-100">
              <Clock className="h-5 w-5" />
              <span className="text-sm">今日练习</span>
            </div>
            <div className="text-3xl font-bold">{todayStats.questionsDone}</div>
            <div className="text-sm text-indigo-100">道题</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-green-100">
              <Target className="h-5 w-5" />
              <span className="text-sm">正确率</span>
            </div>
            <div className="text-3xl font-bold">{todayStats.correctRate}%</div>
            <div className="text-sm text-green-100">今日</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-orange-100">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">连续打卡</span>
            </div>
            <div className="text-3xl font-bold">{streakDays}</div>
            <div className="text-sm text-orange-100">天</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-5 text-white shadow-lg">
            <div className="mb-2 flex items-center gap-2 text-purple-100">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">成就解锁</span>
            </div>
            <div className="text-3xl font-bold">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-purple-100">个徽章</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧：模块统计 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 总体统计 */}
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                学习统计
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">{totalQuestions}</div>
                  <div className="text-sm text-indigo-700">累计答题</div>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{overallAccuracy}%</div>
                  <div className="text-sm text-green-700">总正确率</div>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 text-center">
                  <div className="text-3xl font-bold text-amber-600">{recentAccuracy}%</div>
                  <div className="text-sm text-amber-700">近7天正确率</div>
                </div>
              </div>
            </div>

            {/* 模块详情 */}
            {moduleStats.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-slate-800">各模块表现</h2>
                <div className="space-y-3">
                  {moduleStats.map((module) => (
                    <div key={module.key} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                      <div className={`rounded-xl px-3 py-2 text-sm font-bold ${module.color}`}>
                        {module.emoji} {module.label}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-slate-600">{module.total} 题</span>
                          <span className={`font-bold ${module.avgScore >= 80 ? 'text-green-600' : module.avgScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {module.avgScore}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              module.avgScore >= 80 ? 'bg-green-500' : module.avgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${module.avgScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 薄弱环节 */}
            {weakModules.length > 0 && (
              <div className="rounded-3xl bg-red-50 p-6 shadow-xl border border-red-100">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-800">
                  <Target className="h-5 w-5" />
                  需要加强
                </h2>
                <div className="space-y-2">
                  {weakModules.slice(0, 3).map((m) => (
                    <div key={m.module} className="flex items-center justify-between rounded-xl bg-white p-3">
                      <span className="font-medium text-slate-700">
                        {MODULE_LABELS[m.module]?.emoji} {MODULE_LABELS[m.module]?.label || m.module}
                      </span>
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                        {m.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-red-600">建议多练习这些模块，提升正确率！</p>
              </div>
            )}
          </div>

          {/* 右侧：错题本和成就 */}
          <div className="space-y-6">
            {/* 错题统计 */}
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <BookX className="h-5 w-5 text-rose-500" />
                错题本
              </h2>
              <div className="mb-4 text-center">
                <div className="text-4xl font-bold text-rose-600">{mistakes.length}</div>
                <div className="text-sm text-slate-500">道错题</div>
              </div>
              <Link
                href="/mistake-book"
                className="block w-full rounded-xl bg-rose-100 py-3 text-center font-bold text-rose-700 transition hover:bg-rose-200"
              >
                去复习错题
              </Link>
            </div>

            {/* 成就展示 */}
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <Trophy className="h-5 w-5 text-yellow-500" />
                我的成就
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 rounded-xl p-3 transition ${
                      a.unlocked
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50'
                        : 'bg-slate-50 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{a.unlocked ? a.emoji : '🔒'}</span>
                    <div className="flex-1">
                      <div className={`font-bold ${a.unlocked ? 'text-amber-800' : 'text-slate-400'}`}>
                        {a.unlocked ? a.title : '???'}
                      </div>
                      <div className="text-xs text-slate-500">{a.desc}</div>
                    </div>
                    {a.unlocked && a.unlockedAt && (
                      <div className="text-xs text-amber-600">
                        {new Date(a.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 打卡日历 */}
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">📅 打卡记录</h2>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - 27 + i)
                  const dateStr = date.toISOString().slice(0, 10)
                  const hasCheckin = checkins.some(c => c.date === dateStr && c.completed)
                  const isToday = i === 27
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                        hasCheckin
                          ? 'bg-green-500 text-white'
                          : isToday
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                      title={dateStr}
                    >
                      {hasCheckin ? '✓' : date.getDate()}
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-500"></div> 已打卡</span>
                <span className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-indigo-500"></div> 今天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
