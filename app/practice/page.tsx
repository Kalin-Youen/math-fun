'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Home, 
  Clock, 
  Trophy, 
  Target, 
  Brain,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  BarChart3,
  Settings,
  Filter,
  Star,
  Zap,
  Timer,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'
import { getRandomQuestions, Question } from '@/lib/questions'

// 练习历史组件 - 只在客户端渲染
function PracticeHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('practiceHistory')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('加载历史失败')
      }
    }
  }, [])
  
  if (!mounted) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          练习历史
        </h2>
        <div className="text-center py-8 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>加载中...</p>
        </div>
      </div>
    )
  }
  
  if (history.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          练习历史
        </h2>
        <div className="text-center py-8 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>还没有练习记录，开始你的第一次练习吧！</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        练习历史
      </h2>
      <div className="space-y-3">
        {history.slice(-5).reverse().map((h: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-800">
                {new Date(h.date).toLocaleDateString('zh-CN')}
              </div>
              <div className="text-sm text-slate-500">
                {h.mode === 'smart' ? '智能练习' :
                 h.mode === 'mistake' ? '错题重练' :
                 h.mode === 'daily' ? '每日一练' : '自定义练习'}
                · {h.records?.length || 0}题
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${
                h.stats?.accuracy >= 80 ? 'text-green-600' :
                h.stats?.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {h.stats?.accuracy || 0}%
              </div>
              <div className="text-xs text-slate-400">
                正确率
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 练习模式类型
type PracticeMode = 'smart' | 'custom' | 'mistake' | 'daily'

// 练习设置
interface PracticeSettings {
  grade: number | null
  topic: string | null
  count: number
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
  timeLimit: number | null // 秒，null表示不限时
}

// 答题记录
interface AnswerRecord {
  questionId: string
  userAnswer: string
  correct: boolean
  timeSpent: number // 毫秒
  timestamp: number
}

// 练习统计
interface PracticeStats {
  totalQuestions: number
  correctCount: number
  accuracy: number
  avgTime: number // 毫秒
  totalTime: number // 毫秒
  streak: number // 连续正确数
  maxStreak: number
}

// 默认设置
const defaultSettings: PracticeSettings = {
  grade: null,
  topic: null,
  count: 10,
  difficulty: 'all',
  timeLimit: null,
}

export default function PracticePage() {
  // 状态管理
  const [mode, setMode] = useState<PracticeMode>('smart')
  const [settings, setSettings] = useState<PracticeSettings>(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  
  // 练习状态
  const [isPracticing, setIsPracticing] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [records, setRecords] = useState<AnswerRecord[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  
  // 统计
  const [stats, setStats] = useState<PracticeStats>({
    totalQuestions: 0,
    correctCount: 0,
    accuracy: 0,
    avgTime: 0,
    totalTime: 0,
    streak: 0,
    maxStreak: 0,
  })
  
  // 练习完成
  const [isFinished, setIsFinished] = useState(false)
  
  // 加载保存的设置
  useEffect(() => {
    const saved = localStorage.getItem('practiceSettings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('加载设置失败')
      }
    }
  }, [])
  
  // 保存设置
  useEffect(() => {
    localStorage.setItem('practiceSettings', JSON.stringify(settings))
  }, [settings])
  
  // 倒计时
  useEffect(() => {
    if (!isPracticing || timeLeft === null) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          // 时间到，自动提交
          if (!showResult) {
            handleSubmit()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isPracticing, timeLeft, showResult])
  
  // 开始练习
  const startPractice = useCallback(() => {
    let selectedQuestions: Question[] = []
    
    switch (mode) {
      case 'smart':
        // 智能模式：根据历史表现选择题目
        selectedQuestions = generateSmartQuestions()
        break
      case 'mistake':
        // 错题模式：从错题本中选题
        selectedQuestions = getMistakeQuestions()
        break
      case 'daily':
        // 每日一练：固定10道综合题
        selectedQuestions = getRandomQuestions(10, settings.grade || undefined)
        break
      default:
        // 自定义模式
        selectedQuestions = getRandomQuestions(settings.count, settings.grade || undefined)
        // 根据难度筛选
        if (settings.difficulty !== 'all') {
          const difficultyMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 }
          selectedQuestions = selectedQuestions.filter(
            q => q.difficulty === difficultyMap[settings.difficulty]
          )
        }
    }
    
    if (selectedQuestions.length === 0) {
      alert('该条件下暂无题目，请调整设置')
      return
    }
    
    setQuestions(selectedQuestions)
    setCurrentIndex(0)
    setRecords([])
    setIsPracticing(true)
    setIsFinished(false)
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setTimeLeft(settings.timeLimit)
    setShowResult(false)
    setUserAnswer('')
    setStats({
      totalQuestions: selectedQuestions.length,
      correctCount: 0,
      accuracy: 0,
      avgTime: 0,
      totalTime: 0,
      streak: 0,
      maxStreak: 0,
    })
  }, [mode, settings])
  
  // 智能出题算法
  const generateSmartQuestions = (): Question[] => {
    const history = getPracticeHistory()
    const weakTopics = analyzeWeakTopics(history)
    
    // 60% 薄弱知识点 + 40% 随机
    const weakQuestions = getRandomQuestions(6, settings.grade || undefined)
      .filter(q => weakTopics.includes(q.topic))
    
    const randomQuestions = getRandomQuestions(4, settings.grade || undefined)
    
    return [...weakQuestions, ...randomQuestions].slice(0, 10)
  }
  
  // 获取练习历史
  const getPracticeHistory = () => {
    const saved = localStorage.getItem('practiceHistory')
    return saved ? JSON.parse(saved) : []
  }
  
  // 分析薄弱知识点
  const analyzeWeakTopics = (history: any[]): string[] => {
    const topicStats: Record<string, { correct: number; total: number }> = {}
    
    history.forEach((record: any) => {
      record.records?.forEach((r: AnswerRecord) => {
        const question = questions.find(q => q.id === r.questionId)
        if (question) {
          if (!topicStats[question.topic]) {
            topicStats[question.topic] = { correct: 0, total: 0 }
          }
          topicStats[question.topic].total++
          if (r.correct) topicStats[question.topic].correct++
        }
      })
    })
    
    // 找出正确率低于60%的知识点
    return Object.entries(topicStats)
      .filter(([_, stats]) => stats.total >= 5 && stats.correct / stats.total < 0.6)
      .map(([topic]) => topic)
  }
  
  // 获取错题
  const getMistakeQuestions = (): Question[] => {
    const saved = localStorage.getItem('mistakeBook')
    if (!saved) return []
    
    const mistakeBook = JSON.parse(saved)
    const mistakeIds = mistakeBook.mistakes?.map((m: any) => m.id) || []
    
    // 这里简化处理，实际应该从题库中筛选
    return getRandomQuestions(10).slice(0, mistakeIds.length || 5)
  }
  
  // 提交答案
  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      alert('请输入答案')
      return
    }
    
    const currentQuestion = questions[currentIndex]
    const correct = userAnswer.trim() === currentQuestion.answer.trim()
    const timeSpent = Date.now() - questionStartTime
    
    setIsCorrect(correct)
    setShowResult(true)
    
    // 记录
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer.trim(),
      correct,
      timeSpent,
      timestamp: Date.now(),
    }
    
    const newRecords = [...records, record]
    setRecords(newRecords)
    
    // 更新统计
    setStats(prev => {
      const newCorrectCount = prev.correctCount + (correct ? 1 : 0)
      const newStreak = correct ? prev.streak + 1 : 0
      const totalTime = newRecords.reduce((sum, r) => sum + r.timeSpent, 0)
      
      return {
        ...prev,
        correctCount: newCorrectCount,
        accuracy: Math.round((newCorrectCount / newRecords.length) * 100),
        avgTime: Math.round(totalTime / newRecords.length),
        totalTime,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      }
    })
    
    // 保存到错题本
    if (!correct) {
      saveToMistakeBook(currentQuestion)
    }
  }
  
  // 保存到错题本
  const saveToMistakeBook = (question: Question) => {
    const saved = localStorage.getItem('mistakeBook')
    const mistakeBook = saved ? JSON.parse(saved) : { mistakes: [] }
    
    const existingIndex = mistakeBook.mistakes.findIndex(
      (m: any) => m.id === question.id
    )
    
    if (existingIndex >= 0) {
      mistakeBook.mistakes[existingIndex].frequency++
      mistakeBook.mistakes[existingIndex].lastWrong = Date.now()
    } else {
      mistakeBook.mistakes.push({
        id: question.id,
        question: question.question,
        answer: question.answer,
        topic: question.topic,
        grade: question.grade,
        frequency: 1,
        lastWrong: Date.now(),
      })
    }
    
    localStorage.setItem('mistakeBook', JSON.stringify(mistakeBook))
  }
  
  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setShowResult(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(settings.timeLimit)
    } else {
      finishPractice()
    }
  }
  
  // 完成练习
  const finishPractice = () => {
    setIsFinished(true)
    setIsPracticing(false)
    
    // 保存练习历史
    const history = getPracticeHistory()
    history.push({
      date: Date.now(),
      mode,
      settings,
      records,
      stats: {
        ...stats,
        finalAccuracy: stats.accuracy,
      },
    })
    localStorage.setItem('practiceHistory', JSON.stringify(history.slice(-50))) // 保留最近50次
  }
  
  // 格式化时间
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }
  
  // 当前题目
  const currentQuestion = questions[currentIndex]
  
  // 练习完成界面
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">练习完成！</h1>
              </div>
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Home className="w-6 h-6 text-slate-600" />
              </Link>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 成绩卡片 */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {stats.accuracy >= 90 ? '🏆' : stats.accuracy >= 70 ? '⭐' : '💪'}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {stats.accuracy >= 90 ? '太棒了！' : stats.accuracy >= 70 ? '做得不错！' : '继续加油！'}
              </h2>
              <p className="text-indigo-100">
                本次练习 {stats.totalQuestions} 题，答对 {stats.correctCount} 题
              </p>
            </div>
          </div>
          
          {/* 详细统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-600">{stats.accuracy}%</div>
              <div className="text-sm text-slate-500">正确率</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.correctCount}</div>
              <div className="text-sm text-slate-500">答对题数</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600">{stats.maxStreak}</div>
              <div className="text-sm text-slate-500">最高连对</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{formatTime(stats.avgTime)}</div>
              <div className="text-sm text-slate-500">平均用时</div>
            </div>
          </div>
          
          {/* 错题回顾 */}
          {records.some(r => !r.correct) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                错题回顾
              </h3>
              <div className="space-y-3">
                {records
                  .filter(r => !r.correct)
                  .map((record, i) => {
                    const question = questions.find(q => q.id === record.questionId)
                    if (!question) return null
                    return (
                      <div key={i} className="p-4 bg-red-50 rounded-xl">
                        <p className="font-medium text-slate-800 mb-2">{question.question}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-red-600">你的答案：{record.userAnswer}</span>
                          <span className="text-green-600">正确答案：{question.answer}</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsFinished(false)
                setShowSettings(true)
              }}
              className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              再练一次
            </button>
            <Link
              href="/mistake-book"
              className="flex-1 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-semibold text-center hover:bg-slate-50 transition-all"
            >
              查看错题本
            </Link>
          </div>
        </main>
      </div>
    )
  }
  
  // 练习中界面
  if (isPracticing && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* 顶部进度条 */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPracticing(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                  <h1 className="font-bold text-slate-800">
                    第 {currentIndex + 1} / {questions.length} 题
                  </h1>
                  <p className="text-sm text-slate-500">{currentQuestion.topic}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {timeLeft !== null && (
                  <div className={`flex items-center gap-1 font-mono font-bold ${
                    timeLeft < 10 ? 'text-red-500' : 'text-slate-600'
                  }`}>
                    <Timer className="w-4 h-4" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-600">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold">{stats.streak}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 题目卡片 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 1 ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty === 1 ? '简单' : 
                 currentQuestion.difficulty === 2 ? '中等' : '困难'}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {currentQuestion.type === 'calc' ? '计算' :
                 currentQuestion.type === 'choice' ? '选择' :
                 currentQuestion.type === 'fill' ? '填空' : '应用'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* 选择题选项 */}
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setUserAnswer(option)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                      userAnswer === option
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    } ${showResult && option === currentQuestion.answer ? 'ring-2 ring-green-500' : ''}`}
                  >
                    {String.fromCharCode(65 + i)}. {option}
                  </button>
                ))}
              </div>
            )}
            
            {/* 填空/计算题输入 */}
            {currentQuestion.type !== 'choice' && (
              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
                  disabled={showResult}
                  placeholder="请输入答案..."
                  className="w-full px-6 py-4 text-xl font-bold text-center border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                  autoFocus
                />
              </div>
            )}
            
            {/* 提示 */}
            {currentQuestion.hint && !showResult && (
              <div className="flex items-start gap-2 p-4 bg-yellow-50 rounded-xl mb-6">
                <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
              </div>
            )}
            
            {/* 结果反馈 */}
            {showResult && (
              <div className={`p-6 rounded-2xl mb-6 ${
                isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                      <span className="text-xl font-bold text-green-700">回答正确！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-500" />
                      <span className="text-xl font-bold text-red-700">回答错误</span>
                    </>
                  )}
                </div>
                {!isCorrect && (
                  <p className="text-slate-700">
                    正确答案是：<span className="font-bold text-green-600">{currentQuestion.answer}</span>
                  </p>
                )}
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? '下一题' : '完成练习'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* 实时统计 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{stats.accuracy}%</div>
              <div className="text-xs text-slate-500">正确率</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.correctCount}</div>
              <div className="text-xs text-slate-500">已答对</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{formatTime(stats.totalTime)}</div>
              <div className="text-xs text-slate-500">总用时</div>
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  // 设置界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <h1 className="text-xl font-bold text-slate-800">智能练习</h1>
            </div>
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Home className="w-6 h-6 text-slate-600" />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 模式选择 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { id: 'smart', icon: Brain, label: '智能练习', desc: '根据薄弱点出题' },
            { id: 'custom', icon: Settings, label: '自定义', desc: '自由设置参数' },
            { id: 'mistake', icon: RotateCcw, label: '错题重练', desc: '复习错题' },
            { id: 'daily', icon: Target, label: '每日一练', desc: '10道综合题' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as PracticeMode)}
              className={`p-6 rounded-2xl text-center transition-all ${
                mode === m.id
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:shadow-md'
              }`}
            >
              <m.icon className={`w-8 h-8 mx-auto mb-2 ${mode === m.id ? 'text-white' : 'text-indigo-500'}`} />
              <div className="font-bold">{m.label}</div>
              <div className={`text-xs ${mode === m.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {m.desc}
              </div>
            </button>
          ))}
        </div>
        
        {/* 自定义设置 */}
        {mode === 'custom' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-500" />
              练习设置
            </h2>
            
            <div className="space-y-6">
              {/* 年级选择 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">选择年级</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSettings(s => ({ ...s, grade: null }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      settings.grade === null
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    全部年级
                  </button>
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <button
                      key={g}
                      onClick={() => setSettings(s => ({ ...s, grade: g }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        settings.grade === g
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {g}年级
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 题目数量 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  题目数量：{settings.count}题
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={settings.count}
                  onChange={(e) => setSettings(s => ({ ...s, count: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5题</span>
                  <span>30题</span>
                </div>
              </div>
              
              {/* 难度选择 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">难度</label>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: '全部' },
                    { id: 'easy', label: '简单' },
                    { id: 'medium', label: '中等' },
                    { id: 'hard', label: '困难' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSettings(s => ({ ...s, difficulty: d.id as any }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        settings.difficulty === d.id
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 时间限制 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">时间限制</label>
                <div className="flex gap-2">
                  {[
                    { id: null, label: '不限时' },
                    { id: 60, label: '1分钟' },
                    { id: 120, label: '2分钟' },
                    { id: 300, label: '5分钟' },
                  ].map((t) => (
                    <button
                      key={t.id ?? 'unlimited'}
                      onClick={() => setSettings(s => ({ ...s, timeLimit: t.id }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        settings.timeLimit === t.id
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 开始按钮 */}
        <button
          onClick={startPractice}
          className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Zap className="w-6 h-6" />
          开始练习
        </button>
        
        {/* 历史记录 */}
        <PracticeHistory />
      </main>
    </div>
  )
}
