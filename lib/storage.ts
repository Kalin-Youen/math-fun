'use client'

export interface PracticeRecord {
  id: string
  module: string
  score: number
  total: number
  date: string
  details?: string
}

export interface DailyCheckIn {
  date: string
  completed: boolean
}

export interface MistakeRecord {
  id: string
  question: string
  userAnswer: string
  correctAnswer: string
  module: string
  date: string
  reviewed: boolean
  reviewCount: number
}

const RECORDS_KEY = 'math-fun-records'
const CHECKIN_KEY = 'math-fun-checkins'
const MISTAKES_KEY = 'math-fun-mistakes'

export function getPracticeRecords(): PracticeRecord[] {
  try {
    const stored = localStorage.getItem(RECORDS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function savePracticeRecord(record: PracticeRecord) {
  try {
    const records = getPracticeRecords()
    records.push(record)
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  } catch {}
}

export function getDailyCheckIns(): DailyCheckIn[] {
  try {
    const stored = localStorage.getItem(CHECKIN_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveDailyCheckIn(date: string) {
  try {
    const checkins = getDailyCheckIns()
    if (!checkins.find((c) => c.date === date)) {
      checkins.push({ date, completed: true })
      localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins))
    }
  } catch {}
}

export function getMistakeRecords(): MistakeRecord[] {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveMistakeRecord(mistake: MistakeRecord) {
  try {
    const mistakes = getMistakeRecords()
    const exists = mistakes.find(
      (m) => m.question === mistake.question && m.userAnswer === mistake.userAnswer
    )
    if (!exists) {
      mistakes.push(mistake)
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes))
    }
  } catch {}
}

export function removeMistakeRecord(id: string) {
  try {
    const mistakes = getMistakeRecords().filter((m) => m.id !== id)
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes))
  } catch {}
}

export function markMistakeReviewed(id: string) {
  try {
    const mistakes = getMistakeRecords().map((m) =>
      m.id === id ? { ...m, reviewed: true, reviewCount: m.reviewCount + 1 } : m
    )
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes))
  } catch {}
}

export function getModuleStats(module: string): { total: number; correct: number; avgScore: number } {
  const records = getPracticeRecords().filter((r) => r.module === module)
  const total = records.reduce((s, r) => s + r.total, 0)
  const correct = records.reduce((s, r) => s + r.score, 0)
  const avgScore = records.length > 0 ? Math.round((correct / total) * 100) : 0
  return { total, correct, avgScore }
}

export function getWeakModules(): { module: string; accuracy: number; count: number }[] {
  const records = getPracticeRecords()
  const moduleMap: Record<string, { correct: number; total: number }> = {}

  for (const r of records) {
    if (!moduleMap[r.module]) moduleMap[r.module] = { correct: 0, total: 0 }
    moduleMap[r.module].correct += r.score
    moduleMap[r.module].total += r.total
  }

  return Object.entries(moduleMap)
    .map(([module, data]) => ({
      module,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      count: data.total,
    }))
    .filter((m) => m.accuracy < 80 && m.count > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
}

export function getStreakDays(): number {
  const checkins = getDailyCheckIns()
  if (checkins.length === 0) return 0

  const dates = checkins
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse()

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (Math.abs(diff - 1) < 0.1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function getTodayStats(): { practiced: boolean; questionsDone: number; correctRate: number } {
  const today = new Date().toISOString().slice(0, 10)
  const records = getPracticeRecords().filter((r) => r.date.startsWith(today))
  const questionsDone = records.reduce((s, r) => s + r.total, 0)
  const correct = records.reduce((s, r) => s + r.score, 0)
  return {
    practiced: records.length > 0,
    questionsDone,
    correctRate: questionsDone > 0 ? Math.round((correct / questionsDone) * 100) : 0,
  }
}

export function getRecentRecords(days: number = 7): PracticeRecord[] {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString()
  return getPracticeRecords().filter((r) => r.date >= cutoff)
}

export const MODULE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  'speed-calc': { label: '速算练习', emoji: '⚡', color: 'bg-orange-100 text-orange-700' },
  'multiplication-table': { label: '九九乘法表', emoji: '✖️', color: 'bg-emerald-100 text-emerald-700' },
  'fun': { label: '趣味数学', emoji: '🎯', color: 'bg-violet-100 text-violet-700' },
  'word-problems': { label: '应用题', emoji: '📖', color: 'bg-rose-100 text-rose-700' },
  'column-calc': { label: '竖式计算', emoji: '📐', color: 'bg-indigo-100 text-indigo-700' },
  'read-carefully': { label: '审题训练', emoji: '🔍', color: 'bg-amber-100 text-amber-700' },
  'solve-steps': { label: '解题步骤', emoji: '📝', color: 'bg-teal-100 text-teal-700' },
  'mistakes': { label: '易错题', emoji: '⚠️', color: 'bg-red-100 text-red-700' },
  'number-sense': { label: '数感训练', emoji: '🧠', color: 'bg-fuchsia-100 text-fuchsia-700' },
  'quick-quiz': { label: '快速问答', emoji: '🎤', color: 'bg-cyan-100 text-cyan-700' },
  'concepts': { label: '抽象概念', emoji: '💡', color: 'bg-purple-100 text-purple-700' },
  'number-line': { label: '数轴探索', emoji: '📏', color: 'bg-blue-100 text-blue-700' },
  'fractions': { label: '分数可视化', emoji: '🥧', color: 'bg-amber-100 text-amber-700' },
  'clock': { label: '认钟表', emoji: '🕐', color: 'bg-sky-100 text-sky-700' },
  'formulas': { label: '公式卡片', emoji: '📝', color: 'bg-sky-100 text-sky-700' },
  'daily': { label: '每日一练', emoji: '📅', color: 'bg-green-100 text-green-700' },
}
