'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Target, 
  AlertCircle,
  Calendar,
  Award,
  BookOpen,
  BarChart3,
  Brain,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Lock,
  Unlock,
  Settings,
  Bell,
  User
} from 'lucide-react'

// 学习数据类型
interface StudySession {
  date: string
  duration: number // 分钟
  topic: string
  score?: number
}

interface MistakeRecord {
  id: string
  question: string
  wrongAnswer: string
  correctAnswer: string
  topic: string
  date: string
  frequency: number
}

interface DailyStats {
  date: string
  totalTime: number
  exercisesCompleted: number
  accuracy: number
  topics: string[]
}

interface WeeklyReport {
  weekStart: string
  totalStudyTime: number
  daysActive: number
  exercisesCompleted: number
  averageAccuracy: number
  topTopics: string[]
  weakAreas: string[]
  achievements: string[]
}

// 模拟数据
const generateMockData = () => {
  const today = new Date()
  const studySessions: StudySession[] = []
  const mistakes: MistakeRecord[] = []
  const dailyStats: DailyStats[] = []
  
  // 生成过去30天的学习记录
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 每天1-3个学习时段
    const sessionsPerDay = Math.floor(Math.random() * 3) + 1
    let dailyTime = 0
    const dailyTopics: string[] = []
    
    for (let j = 0; j < sessionsPerDay; j++) {
      const topics = ['加法', '减法', '乘法', '除法', '分数', '应用题', '速算']
      const topic = topics[Math.floor(Math.random() * topics.length)]
      const duration = Math.floor(Math.random() * 20) + 10
      const score = Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : undefined
      
      studySessions.push({
        date: dateStr,
        duration,
        topic,
        score
      })
      
      dailyTime += duration
      if (!dailyTopics.includes(topic)) {
        dailyTopics.push(topic)
      }
    }
    
    dailyStats.push({
      date: dateStr,
      totalTime: dailyTime,
      exercisesCompleted: Math.floor(Math.random() * 20) + 5,
      accuracy: Math.floor(Math.random() * 20) + 75,
      topics: dailyTopics
    })
  }
  
  // 生成错题记录
  const mistakeTypes = [
    { q: '7 × 8 = ?', wrong: '54', correct: '56', topic: '乘法' },
    { q: '125 + 367 = ?', wrong: '482', correct: '492', topic: '加法' },
    { q: '1/2 + 1/4 = ?', wrong: '2/6', correct: '3/4', topic: '分数' },
    { q: '36 ÷ 4 = ?', wrong: '8', correct: '9', topic: '除法' },
    { q: '15 - 8 = ?', wrong: '8', correct: '7', topic: '减法' },
  ]
  
  for (let i = 0; i < 15; i++) {
    const mistake = mistakeTypes[Math.floor(Math.random() * mistakeTypes.length)]
    const date = new Date(today)
    date.setDate(date.getDate() - Math.floor(Math.random() * 14))
    
    mistakes.push({
      id: `mistake-${i}`,
      question: mistake.q,
      wrongAnswer: mistake.wrong,
      correctAnswer: mistake.correct,
      topic: mistake.topic,
      date: date.toISOString().split('T')[0],
      frequency: Math.floor(Math.random() * 3) + 1
    })
  }
  
  return { studySessions, mistakes, dailyStats }
}

// 生成周报告
const generateWeeklyReport = (dailyStats: DailyStats[]): WeeklyReport => {
  const totalTime = dailyStats.reduce((sum, day) => sum + day.totalTime, 0)
  const daysActive = dailyStats.filter(day => day.totalTime > 0).length
  const totalExercises = dailyStats.reduce((sum, day) => sum + day.exercisesCompleted, 0)
  const avgAccuracy = Math.round(
    dailyStats.reduce((sum, day) => sum + day.accuracy, 0) / dailyStats.length
  )
  
  // 统计主题频率
  const topicCount: Record<string, number> = {}
  dailyStats.forEach(day => {
    day.topics.forEach(topic => {
      topicCount[topic] = (topicCount[topic] || 0) + 1
    })
  })
  
  const sortedTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic)
  
  return {
    weekStart: dailyStats[0]?.date || '',
    totalStudyTime: totalTime,
    daysActive,
    exercisesCompleted: totalExercises,
    averageAccuracy: avgAccuracy,
    topTopics: sortedTopics.slice(0, 3),
    weakAreas: ['分数运算', '应用题理解'],
    achievements: ['连续学习7天', '速算达人', '准确率提升5%']
  }
}

export default function ParentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'mistakes' | 'time'>('overview')
  const [studyData, setStudyData] = useState<{
    studySessions: StudySession[]
    mistakes: MistakeRecord[]
    dailyStats: DailyStats[]
  } | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month'>('week')
  
  useEffect(() => {
    // 从 localStorage 加载真实数据
    const loadData = () => {
      const storedSessions = localStorage.getItem('studySessions')
      const storedMistakes = localStorage.getItem('mistakeBook')
      
      let sessions: StudySession[] = []
      let mistakes: MistakeRecord[] = []
      
      if (storedSessions) {
        try {
          sessions = JSON.parse(storedSessions)
        } catch (e) {
          console.error('解析学习记录失败')
        }
      }
      
      if (storedMistakes) {
        try {
          const mistakeBook = JSON.parse(storedMistakes)
          mistakes = mistakeBook.mistakes || []
        } catch (e) {
          console.error('解析错题记录失败')
        }
      }
      
      // 如果没有真实数据，使用模拟数据
      if (sessions.length === 0 && mistakes.length === 0) {
        const mockData = generateMockData()
        sessions = mockData.studySessions
        mistakes = mockData.mistakes
        
        // 生成每日统计
        const dailyStats = generateDailyStats(sessions)
        setStudyData({
          studySessions: sessions,
          mistakes,
          dailyStats
        })
        setWeeklyReport(generateWeeklyReport(dailyStats.slice(-7)))
      } else {
        const dailyStats = generateDailyStats(sessions)
        setStudyData({
          studySessions: sessions,
          mistakes,
          dailyStats
        })
        setWeeklyReport(generateWeeklyReport(dailyStats.slice(-7)))
      }
    }
    
    loadData()
  }, [])
  
  // 生成每日统计
  const generateDailyStats = (sessions: StudySession[]): DailyStats[] => {
    const statsMap: Record<string, DailyStats> = {}
    
    sessions.forEach(session => {
      if (!statsMap[session.date]) {
        statsMap[session.date] = {
          date: session.date,
          totalTime: 0,
          exercisesCompleted: 0,
          accuracy: 0,
          topics: []
        }
      }
      
      statsMap[session.date].totalTime += session.duration
      if (!statsMap[session.date].topics.includes(session.topic)) {
        statsMap[session.date].topics.push(session.topic)
      }
    })
    
    return Object.values(statsMap).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }
  
  // 验证密码
  const handleLogin = () => {
    // 默认密码：123456（实际应用中应该更安全）
    if (password === '123456') {
      setIsAuthenticated(true)
    } else {
      alert('密码错误，请重试')
    }
  }
  
  // 格式化时间
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
  }
  
  // 计算统计数据
  const calculateStats = () => {
    if (!studyData) return null
    
    const { studySessions, mistakes, dailyStats } = studyData
    const rangeStats = selectedTimeRange === 'week' 
      ? dailyStats.slice(-7) 
      : dailyStats.slice(-30)
    
    const totalTime = rangeStats.reduce((sum, day) => sum + day.totalTime, 0)
    const avgDailyTime = Math.round(totalTime / rangeStats.length)
    const totalExercises = rangeStats.reduce((sum, day) => sum + day.exercisesCompleted, 0)
    const avgAccuracy = Math.round(
      rangeStats.reduce((sum, day) => sum + day.accuracy, 0) / rangeStats.length
    )
    
    return {
      totalTime,
      avgDailyTime,
      totalExercises,
      avgAccuracy,
      mistakeCount: mistakes.length,
      streakDays: calculateStreak(dailyStats)
    }
  }
  
  // 计算连续学习天数
  const calculateStreak = (dailyStats: DailyStats[]) => {
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    
    for (let i = dailyStats.length - 1; i >= 0; i--) {
      if (dailyStats[i].totalTime > 0) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
  
  const stats = calculateStats()
  
  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">家长监控中心</h1>
            <p className="text-slate-500">请输入密码查看孩子学习报告</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-lg"
                placeholder="请输入密码"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all active:scale-95"
            >
              进入监控中心
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-slate-400 text-center">
            默认密码：123456
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  家长监控中心
                </h1>
                <p className="text-sm text-slate-500">了解孩子学习进度</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                title="退出登录"
              >
                <Unlock className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 时间范围选择 */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-xl p-1 shadow-sm inline-flex">
            <button
              onClick={() => setSelectedTimeRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTimeRange === 'week'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              本周
            </button>
            <button
              onClick={() => setSelectedTimeRange('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTimeRange === 'month'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              本月
            </button>
          </div>
        </div>
        
        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-slate-500">总学习时长</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatDuration(stats.totalTime)}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-slate-500">完成题目</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.totalExercises}道</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-slate-500">平均正确率</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.avgAccuracy}%</p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-slate-500">连续学习</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stats.streakDays}天</p>
            </div>
          </div>
        )}
        
        {/* 标签页导航 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: '总览', icon: BarChart3 },
              { id: 'progress', label: '学习进度', icon: TrendingUp },
              { id: 'mistakes', label: '错题分析', icon: AlertCircle },
              { id: 'time', label: '时间管理', icon: Clock3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 总览标签 */}
        {activeTab === 'overview' && weeklyReport && (
          <div className="space-y-6">
            {/* 周报告卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                {selectedTimeRange === 'week' ? '本周' : '本月'}学习报告
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-3">学习概况</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">活跃天数</span>
                      <span className="font-medium">{weeklyReport.daysActive}天</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">完成练习</span>
                      <span className="font-medium">{weeklyReport.exercisesCompleted}道</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">平均正确率</span>
                      <span className="font-medium text-green-600">{weeklyReport.averageAccuracy}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-700 mb-3">学习主题</h3>
                  <div className="flex flex-wrap gap-2">
                    {weeklyReport.topTopics.map((topic, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-slate-700 mt-4 mb-3">薄弱环节</h3>
                  <div className="flex flex-wrap gap-2">
                    {weeklyReport.weakAreas.map((area, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 成就 */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  获得成就
                </h3>
                <div className="flex flex-wrap gap-3">
                  {weeklyReport.achievements.map((achievement, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
                    >
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 学习建议 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                学习建议
              </h2>
              <ul className="space-y-2 text-indigo-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>孩子在{weeklyReport.topTopics[0]}方面表现优秀，可以继续保持</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>建议加强{weeklyReport.weakAreas[0]}的练习，每天额外安排10分钟专项训练</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>建议保持每天{Math.round(weeklyReport.totalStudyTime / weeklyReport.daysActive)}分钟的学习时间</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* 学习进度标签 */}
        {activeTab === 'progress' && studyData && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">每日学习时长</h2>
              
              {/* 简单的柱状图 */}
              <div className="space-y-3">
                {(selectedTimeRange === 'week' 
                  ? studyData.dailyStats.slice(-7) 
                  : studyData.dailyStats.slice(-14)
                ).map((day, i) => {
                  const maxTime = Math.max(...studyData.dailyStats.map(d => d.totalTime))
                  const percentage = maxTime > 0 ? (day.totalTime / maxTime) * 100 : 0
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-16 text-sm text-slate-500">
                        {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-20 text-sm font-medium text-slate-700 text-right">
                        {day.totalTime}分钟
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* 知识点掌握度 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">知识点掌握度</h2>
              
              <div className="space-y-4">
                {['加法', '减法', '乘法', '除法', '分数'].map((topic, i) => {
                  const mastery = [85, 78, 92, 65, 45][i]
                  return (
                    <div key={topic}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{topic}</span>
                        <span className={`text-sm font-medium ${
                          mastery >= 80 ? 'text-green-600' : 
                          mastery >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {mastery}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            mastery >= 80 ? 'bg-green-500' : 
                            mastery >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* 错题分析标签 */}
        {activeTab === 'mistakes' && studyData && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                错题记录
              </h2>
              
              {studyData.mistakes.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-600">太棒了！还没有错题记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studyData.mistakes.slice(0, 10).map((mistake, i) => (
                    <div 
                      key={mistake.id}
                      className="p-4 bg-red-50 border border-red-100 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2 py-1 bg-red-200 text-red-700 rounded text-xs font-medium">
                          {mistake.topic}
                        </span>
                        <span className="text-xs text-slate-400">
                          {mistake.date}
                        </span>
                      </div>
                      
                      <p className="font-medium text-slate-800 mb-2">{mistake.question}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          错答：{mistake.wrongAnswer}
                        </span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          正解：{mistake.correctAnswer}
                        </span>
                      </div>
                      
                      {mistake.frequency > 1 && (
                        <p className="mt-2 text-xs text-orange-600">
                          ⚠️ 重复错误 {mistake.frequency} 次，建议重点复习
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 错题统计 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">错题分布</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['加法', '减法', '乘法', '除法', '分数', '应用题'].map((topic, i) => {
                  const count = Math.floor(Math.random() * 5)
                  return (
                    <div key={topic} className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-2xl font-bold text-slate-800">{count}</p>
                      <p className="text-sm text-slate-500">{topic}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* 时间管理标签 */}
        {activeTab === 'time' && studyData && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">学习时段分布</h2>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                {['早上\n(6-12点)', '下午\n(12-18点)', '晚上\n(18-22点)', '其他'].map((time, i) => {
                  const percentage = [20, 35, 40, 5][i]
                  return (
                    <div key={i} className="p-4">
                      <div 
                        className="w-full aspect-square rounded-full flex items-center justify-center mb-2 mx-auto"
                        style={{
                          background: `conic-gradient(indigo ${percentage}%, #e2e8f0 ${percentage}%)`
                        }}
                      >
                        <div className="w-3/4 h-3/4 bg-white rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-700">{percentage}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 whitespace-pre-line">{time}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* 学习提醒设置 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                学习提醒设置
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-700">每日学习提醒</p>
                      <p className="text-sm text-slate-500">每天19:00提醒孩子学习</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-700">连续学习提醒</p>
                      <p className="text-sm text-slate-500">超过30分钟未学习时提醒</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-700">成就达成通知</p>
                      <p className="text-sm text-slate-500">孩子获得成就时通知家长</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
