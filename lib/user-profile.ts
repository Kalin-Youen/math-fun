'use client'

import { useState, useEffect, useCallback } from 'react'

// 用户等级系统
export interface LevelSystem {
  level: number
  currentXP: number
  maxXP: number
  totalXP: number
}

// 用户统计
export interface UserStats {
  totalQuestions: number
  correctAnswers: number
  streakDays: number
  longestStreak: number
  totalTime: number // 分钟
  lastActive: string
}

// 用户偏好
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  animationsEnabled: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  dailyGoal: number
}

// 完整用户档案
export interface UserProfile {
  name: string
  avatar: string
  level: LevelSystem
  stats: UserStats
  preferences: UserPreferences
  createdAt: string
}

const DEFAULT_PROFILE: UserProfile = {
  name: '小数学家',
  avatar: '🧑‍🎓',
  level: {
    level: 1,
    currentXP: 0,
    maxXP: 100,
    totalXP: 0,
  },
  stats: {
    totalQuestions: 0,
    correctAnswers: 0,
    streakDays: 0,
    longestStreak: 0,
    totalTime: 0,
    lastActive: new Date().toISOString(),
  },
  preferences: {
    theme: 'auto',
    soundEnabled: true,
    animationsEnabled: true,
    difficulty: 'easy',
    dailyGoal: 10,
  },
  createdAt: new Date().toISOString(),
}

// 计算升级所需XP
function calculateMaxXP(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level - 1))
}

// 获取用户档案
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const stored = localStorage.getItem('math-fun-user-profile')
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) }
    }
  } catch {}
  return DEFAULT_PROFILE
}

// 保存用户档案
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('math-fun-user-profile', JSON.stringify(profile))
  } catch {}
}

// 添加XP
export function addXP(amount: number): { leveledUp: boolean; newLevel?: number } {
  const profile = getUserProfile()
  profile.level.currentXP += amount
  profile.level.totalXP += amount
  
  let leveledUp = false
  let newLevel = profile.level.level
  
  while (profile.level.currentXP >= profile.level.maxXP) {
    profile.level.currentXP -= profile.level.maxXP
    profile.level.level++
    profile.level.maxXP = calculateMaxXP(profile.level.level)
    leveledUp = true
    newLevel = profile.level.level
  }
  
  saveUserProfile(profile)
  return { leveledUp, newLevel: leveledUp ? newLevel : undefined }
}

// 更新统计
export function updateStats(updates: Partial<UserStats>): void {
  const profile = getUserProfile()
  profile.stats = { ...profile.stats, ...updates }
  saveUserProfile(profile)
}

// 更新偏好
export function updatePreferences(updates: Partial<UserPreferences>): void {
  const profile = getUserProfile()
  profile.preferences = { ...profile.preferences, ...updates }
  saveUserProfile(profile)
}

// 检查连续打卡
export function checkStreak(): { streakMaintained: boolean; streakBroken: boolean } {
  const profile = getUserProfile()
  const lastActive = new Date(profile.stats.lastActive)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  
  let streakMaintained = false
  let streakBroken = false
  
  if (diffDays === 1) {
    // 连续打卡
    streakMaintained = true
  } else if (diffDays > 1) {
    // 断签
    streakBroken = true
    profile.stats.streakDays = 0
  }
  
  profile.stats.lastActive = today.toISOString()
  saveUserProfile(profile)
  
  return { streakMaintained, streakBroken }
}

// React Hook
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProfile(getUserProfile())
    setIsLoaded(true)
  }, [])

  const refresh = useCallback(() => {
    setProfile(getUserProfile())
  }, [])

  const addExperience = useCallback((amount: number) => {
    const result = addXP(amount)
    refresh()
    return result
  }, [refresh])

  const updateUserStats = useCallback((updates: Partial<UserStats>) => {
    updateStats(updates)
    refresh()
  }, [refresh])

  const updateUserPreferences = useCallback((updates: Partial<UserPreferences>) => {
    updatePreferences(updates)
    refresh()
  }, [refresh])

  return {
    profile,
    isLoaded,
    refresh,
    addExperience,
    updateUserStats,
    updateUserPreferences,
  }
}

// 获取等级称号
export function getLevelTitle(level: number): string {
  const titles = [
    { min: 1, max: 5, title: '数学新手' },
    { min: 6, max: 10, title: '计算小能手' },
    { min: 11, max: 20, title: '数学小达人' },
    { min: 21, max: 30, title: '算术大师' },
    { min: 31, max: 50, title: '数学之星' },
    { min: 51, max: Infinity, title: '数学传奇' },
  ]
  
  const title = titles.find(t => level >= t.min && level <= t.max)
  return title?.title || '数学新手'
}

// 获取等级颜色
export function getLevelColor(level: number): string {
  if (level < 10) return 'from-slate-400 to-slate-500'
  if (level < 20) return 'from-green-400 to-emerald-500'
  if (level < 30) return 'from-blue-400 to-indigo-500'
  if (level < 50) return 'from-purple-400 to-pink-500'
  return 'from-amber-400 via-orange-500 to-red-500'
}
