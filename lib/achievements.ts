'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Achievement {
  id: string
  title: string
  emoji: string
  desc: string
  unlocked: boolean
  unlockedAt?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

const STORAGE_KEY = 'math-fun-achievements'

const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_speed', title: '初出茅庐', emoji: '🏃', desc: '完成第一次速算练习' },
  { id: 'speed_10', title: '速算新星', emoji: '⭐', desc: '速算练习答对10题' },
  { id: 'speed_perfect', title: '满分达人', emoji: '🏆', desc: '速算练习获得满分' },
  { id: 'mul_quiz_10', title: '乘法入门', emoji: '✖️', desc: '乘法测验答对10题' },
  { id: 'mul_quiz_30', title: '乘法高手', emoji: '🌟', desc: '乘法测验累计答对30题' },
  { id: 'guess_win', title: '猜数达人', emoji: '🔮', desc: '猜数字游戏获胜' },
  { id: 'pattern_3', title: '规律发现者', emoji: '🔍', desc: '找规律答对3题' },
  { id: 'compare_10', title: '比大小专家', emoji: '⚖️', desc: '比大小答对10题' },
  { id: 'formulas_view', title: '公式收藏家', emoji: '📝', desc: '查看过所有公式分类' },
  { id: 'all_round', title: '全面发展', emoji: '🎓', desc: '体验过所有模块' },
  { id: 'daily_first', title: '打卡新人', emoji: '📅', desc: '完成第一次每日一练' },
  { id: 'daily_streak_3', title: '三天坚持', emoji: '🔥', desc: '连续打卡3天' },
  { id: 'daily_streak_7', title: '一周达人', emoji: '💪', desc: '连续打卡7天' },
  { id: 'daily_perfect', title: '日日满分', emoji: '💯', desc: '每日一练获得满分' },
  { id: 'mistake_review_5', title: '知错能改', emoji: '📕', desc: '复习5道错题' },
  { id: 'flash_card_20', title: '闪卡达人', emoji: '🃏', desc: '掌握20张闪卡' },
  { id: 'converter_quiz', title: '换算能手', emoji: '🔄', desc: '完成单位换算测验' },
  { id: 'dashboard_view', title: '数据观察者', emoji: '📊', desc: '查看学习仪表盘' },
  { id: 'questions_100', title: '百题斩', emoji: '🗡️', desc: '累计答题100道' },
  { id: 'questions_500', title: '题海战士', emoji: '⚔️', desc: '累计答题500道' },
]

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>
        setAchievements(
          ALL_ACHIEVEMENTS.map((a) => ({
            ...a,
            unlocked: a.id in parsed,
            unlockedAt: parsed[a.id],
          }))
        )
      } else {
        setAchievements(ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })))
      }
    } catch {
      setAchievements(ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })))
    }
  }, [])

  const unlock = useCallback((id: string) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === id)
      if (!target || target.unlocked) return prev

      const now = new Date().toLocaleString('zh-CN')
      const next = prev.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: now } : a
      )

      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? JSON.parse(stored) : {}
        parsed[id] = now
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
      } catch {}

      return next
    })
  }, [])

  const trackVisit = useCallback(
    (module: string) => {
      try {
        const key = 'math-fun-visits'
        const stored = localStorage.getItem(key)
        const visits: string[] = stored ? JSON.parse(stored) : []
        if (!visits.includes(module)) {
          visits.push(module)
          localStorage.setItem(key, JSON.stringify(visits))
        }
        const allModules = [
          'speed-calc', 'multiplication-table', 'fun', 'formulas', 'fractions',
          'clock', 'word-problems', 'worksheet', 'column-calc', 'read-carefully',
          'solve-steps', 'mistakes', 'number-sense', 'quick-quiz', 'concepts',
          'number-line', 'daily', 'mistake-book', 'flash-cards', 'unit-converter',
          'dashboard',
        ]
        if (allModules.every((m) => visits.includes(m))) {
          unlock('all_round')
        }
      } catch {}
    },
    [unlock]
  )

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return { achievements, unlockedCount, unlock, trackVisit }
}
