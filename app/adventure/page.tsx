'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Home, 
  Trophy, 
  Star, 
  Lock,
  Unlock,
  Zap,
  Target,
  Crown,
  Gem,
  Shield,
  Sword,
  Heart,
  Flame,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Timer,
  TrendingUp,
  Award,
  Map,
  Flag
} from 'lucide-react'
import { getRandomQuestions, Question } from '@/lib/questions'

// 关卡类型
interface Level {
  id: number
  name: string
  description: string
  emoji: string
  requiredStars: number
  questions: number
  difficulty: 1 | 2 | 3
  reward: {
    xp: number
    stars: number
    badge?: string
  }
  theme: string
}

// 世界/章节
interface World {
  id: number
  name: string
  emoji: string
  color: string
  levels: Level[]
}

// 玩家进度
interface PlayerProgress {
  currentLevel: number
  totalStars: number
  totalXP: number
  unlockedBadges: string[]
  completedLevels: number[]
  levelStars: Record<number, number> // 每个关卡获得的星星数
}

// 成就徽章
interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  condition: string
}

const BADGES: Badge[] = [
  { id: 'first_win', name: '初出茅庐', description: '完成第一关', emoji: '🌱', condition: '完成第1关' },
  { id: 'perfect_10', name: '十全十美', description: '连续答对10题', emoji: '💯', condition: '连对10题' },
  { id: 'speed_demon', name: '闪电侠', description: '平均每题用时少于5秒', emoji: '⚡', condition: '平均用时<5秒' },
  { id: 'star_collector', name: '星星收藏家', description: '累计获得50颗星', emoji: '⭐', condition: '获得50颗星' },
  { id: 'master', name: '数学大师', description: '完成所有关卡', emoji: '👑', condition: '通关所有关卡' },
  { id: 'no_mistake', name: '零失误', description: '一关内全部答对', emoji: '🎯', condition: '完美通关' },
]

// 游戏世界数据
const WORLDS: World[] = [
  {
    id: 1,
    name: '数字森林',
    emoji: '🌲',
    color: 'from-green-400 to-emerald-600',
    levels: [
      { id: 1, name: '入门挑战', description: '认识数字1-20', emoji: '🔢', requiredStars: 0, questions: 5, difficulty: 1, reward: { xp: 50, stars: 3 }, theme: 'forest' },
      { id: 2, name: '加法小径', description: '10以内加法', emoji: '➕', requiredStars: 0, questions: 5, difficulty: 1, reward: { xp: 60, stars: 3 }, theme: 'forest' },
      { id: 3, name: '减法溪流', description: '10以内减法', emoji: '➖', requiredStars: 3, questions: 5, difficulty: 1, reward: { xp: 70, stars: 3 }, theme: 'forest' },
      { id: 4, name: '混合迷宫', description: '10以内加减混合', emoji: '🌀', requiredStars: 6, questions: 8, difficulty: 2, reward: { xp: 100, stars: 3 }, theme: 'forest' },
      { id: 5, name: '森林守护者', description: '综合挑战', emoji: '🛡️', requiredStars: 9, questions: 10, difficulty: 2, reward: { xp: 150, stars: 5, badge: 'forest_guardian' }, theme: 'forest' },
    ]
  },
  {
    id: 2,
    name: '乘法城堡',
    emoji: '🏰',
    color: 'from-purple-400 to-indigo-600',
    levels: [
      { id: 6, name: '乘法大门', description: '2-5乘法口诀', emoji: '🚪', requiredStars: 12, questions: 8, difficulty: 2, reward: { xp: 100, stars: 3 }, theme: 'castle' },
      { id: 7, name: '口诀长廊', description: '6-9乘法口诀', emoji: '📜', requiredStars: 15, questions: 8, difficulty: 2, reward: { xp: 120, stars: 3 }, theme: 'castle' },
      { id: 8, name: '除法密室', description: '表内除法', emoji: '🔐', requiredStars: 18, questions: 8, difficulty: 2, reward: { xp: 130, stars: 3 }, theme: 'castle' },
      { id: 9, name: '混合塔楼', description: '乘除混合', emoji: '🏯', requiredStars: 21, questions: 10, difficulty: 3, reward: { xp: 180, stars: 3 }, theme: 'castle' },
      { id: 10, name: '城堡领主', description: '综合挑战', emoji: '👑', requiredStars: 24, questions: 12, difficulty: 3, reward: { xp: 250, stars: 5, badge: 'castle_lord' }, theme: 'castle' },
    ]
  },
  {
    id: 3,
    name: '智慧山峰',
    emoji: '⛰️',
    color: 'from-orange-400 to-red-600',
    levels: [
      { id: 11, name: '百以内加减', description: '100以内加减法', emoji: '🔢', requiredStars: 28, questions: 10, difficulty: 2, reward: { xp: 150, stars: 3 }, theme: 'mountain' },
      { id: 12, name: '乘法进阶', description: '多位数乘法', emoji: '✖️', requiredStars: 31, questions: 10, difficulty: 3, reward: { xp: 180, stars: 3 }, theme: 'mountain' },
      { id: 13, name: '除法挑战', description: '除数是一位数的除法', emoji: '➗', requiredStars: 34, questions: 10, difficulty: 3, reward: { xp: 200, stars: 3 }, theme: 'mountain' },
      { id: 14, name: '应用题峡谷', description: '解决实际问题', emoji: '📖', requiredStars: 37, questions: 8, difficulty: 3, reward: { xp: 220, stars: 3 }, theme: 'mountain' },
      { id: 15, name: '智慧之巅', description: '终极挑战', emoji: '🏔️', requiredStars: 40, questions: 15, difficulty: 3, reward: { xp: 500, stars: 5, badge: 'mountain_sage' }, theme: 'mountain' },
    ]
  },
]

// 默认进度
const defaultProgress: PlayerProgress = {
  currentLevel: 1,
  totalStars: 0,
  totalXP: 0,
  unlockedBadges: [],
  completedLevels: [],
  levelStars: {},
}

export default function AdventurePage() {
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress)
  const [activeWorld, setActiveWorld] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [levelStars, setLevelStars] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  
  // 加载进度
  useEffect(() => {
    const saved = localStorage.getItem('adventureProgress')
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch (e) {
        console.error('加载进度失败')
      }
    }
  }, [])
  
  // 保存进度
  useEffect(() => {
    localStorage.setItem('adventureProgress', JSON.stringify(progress))
  }, [progress])
  
  // 检查成就
  const checkAchievements = (stats: { correct: number; total: number; avgTime: number }) => {
    const newBadges: string[] = []
    
    if (progress.completedLevels.length === 0 && stats.correct > 0) {
      newBadges.push('first_win')
    }
    
    if (stats.correct >= 10) {
      newBadges.push('perfect_10')
    }
    
    if (stats.avgTime < 5000 && stats.correct === stats.total) {
      newBadges.push('speed_demon')
    }
    
    if (progress.totalStars + levelStars >= 50 && !progress.unlockedBadges.includes('star_collector')) {
      newBadges.push('star_collector')
    }
    
    if (stats.correct === stats.total) {
      newBadges.push('no_mistake')
    }
    
    // 找到第一个新徽章
    const firstNewBadge = newBadges.find(b => !progress.unlockedBadges.includes(b))
    if (firstNewBadge) {
      const badge = BADGES.find(b => b.id === firstNewBadge)
      if (badge) {
        setNewBadge(badge)
        setProgress(prev => ({
          ...prev,
          unlockedBadges: [...prev.unlockedBadges, firstNewBadge],
        }))
      }
    }
  }
  
  // 开始关卡
  const startLevel = (level: Level) => {
    if (progress.totalStars < level.requiredStars) {
      alert(`需要 ${level.requiredStars} 颗星才能解锁此关卡！`)
      return
    }
    
    setCurrentLevel(level)
    setQuestions(getRandomQuestions(level.questions, undefined).slice(0, level.questions))
    setCurrentIndex(0)
    setUserAnswer('')
    setShowResult(false)
    setLevelStars(0)
    setCorrectCount(0)
    setIsPlaying(true)
    setShowLevelComplete(false)
    setNewBadge(null)
  }
  
  // 提交答案
  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    
    const currentQuestion = questions[currentIndex]
    const correct = userAnswer.trim() === currentQuestion.answer.trim()
    
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setCorrectCount(prev => prev + 1)
    }
  }
  
  // 下一题
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      completeLevel()
    }
  }
  
  // 完成关卡
  const completeLevel = () => {
    if (!currentLevel) return
    
    const accuracy = correctCount / questions.length
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.5 ? 1 : 0
    
    setLevelStars(stars)
    setShowLevelComplete(true)
    
    // 更新进度
    setProgress(prev => {
      const newCompleted = prev.completedLevels.includes(currentLevel.id)
        ? prev.completedLevels
        : [...prev.completedLevels, currentLevel.id]
      
      const oldStars = prev.levelStars[currentLevel.id] || 0
      const starDiff = Math.max(0, stars - oldStars)
      
      return {
        ...prev,
        currentLevel: Math.max(prev.currentLevel, currentLevel.id + 1),
        totalStars: prev.totalStars + starDiff,
        totalXP: prev.totalXP + currentLevel.reward.xp,
        completedLevels: newCompleted,
        levelStars: {
          ...prev.levelStars,
          [currentLevel.id]: Math.max(oldStars, stars),
        },
      }
    })
    
    // 检查成就
    checkAchievements({
      correct: correctCount,
      total: questions.length,
      avgTime: 0, // 简化处理
    })
  }
  
  // 获取等级称号
  const getLevelTitle = (xp: number) => {
    if (xp >= 2000) return '数学大师'
    if (xp >= 1500) return '数学专家'
    if (xp >= 1000) return '数学高手'
    if (xp >= 500) return '数学学徒'
    return '数学新手'
  }
  
  // 关卡完成界面
  if (showLevelComplete && currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">关卡完成！</h2>
          <p className="text-slate-500 mb-6">{currentLevel.name}</p>
          
          {/* 星星 */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <Star 
                key={i} 
                className={`w-12 h-12 ${i <= levelStars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          
          {/* 奖励 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-600">+{currentLevel.reward.xp}</div>
              <div className="text-sm text-slate-500">经验值</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-600">+{levelStars}</div>
              <div className="text-sm text-slate-500">星星</div>
            </div>
          </div>
          
          {/* 新徽章 */}
          {newBadge && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
              <div className="text-4xl mb-2">{newBadge.emoji}</div>
              <div className="font-bold text-slate-800">获得新徽章！</div>
              <div className="text-sm text-slate-600">{newBadge.name}</div>
              <div className="text-xs text-slate-500">{newBadge.description}</div>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsPlaying(false)
                setShowLevelComplete(false)
              }}
              className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold"
            >
              继续冒险
            </button>
            <button
              onClick={() => startLevel(currentLevel)}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold"
            >
              再玩一次
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // 游戏进行中
  if (isPlaying && currentLevel && questions.length > 0) {
    const currentQuestion = questions[currentIndex]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* 进度条 */}
        <div className="fixed top-0 left-0 right-0 h-2 bg-slate-200 z-50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-2 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsPlaying(false)}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className="text-center">
                <div className="font-bold text-slate-800">{currentLevel.name}</div>
                <div className="text-sm text-slate-500">{currentIndex + 1} / {questions.length}</div>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="font-bold text-slate-700">{correctCount}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* 题目 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentLevel.emoji}</div>
              <h2 className="text-2xl font-bold text-slate-800">{currentQuestion.question}</h2>
            </div>
            
            {/* 选择题 */}
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
            
            {/* 填空题 */}
            {currentQuestion.type !== 'choice' && (
              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
                  disabled={showResult}
                  placeholder="输入答案..."
                  className="w-full px-6 py-4 text-xl font-bold text-center border-2 border-slate-200 rounded-2xl focus:border-indigo-500 outline-none"
                  autoFocus
                />
              </div>
            )}
            
            {/* 结果 */}
            {showResult && (
              <div className={`p-4 rounded-xl mb-6 text-center ${
                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">回答正确！</div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-bold">回答错误</div>
                    <div>正确答案是：{currentQuestion.answer}</div>
                  </>
                )}
              </div>
            )}
            
            {/* 按钮 */}
            <button
              onClick={showResult ? handleNext : handleSubmit}
              className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg"
            >
              {showResult ? (currentIndex < questions.length - 1 ? '下一题' : '完成关卡') : '提交答案'}
            </button>
          </div>
        </main>
      </div>
    )
  }
  
  // 主界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-800">数学大冒险</h1>
                <p className="text-sm text-slate-500">闯关升级，成为数学大师！</p>
              </div>
            </div>
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl">
              <Home className="w-6 h-6 text-slate-600" />
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 玩家信息卡 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">当前称号</div>
              <div className="text-2xl font-bold">{getLevelTitle(progress.totalXP)}</div>
              <div className="text-sm opacity-80 mt-1">{progress.totalXP} XP</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <span className="text-3xl font-bold">{progress.totalStars}</span>
              </div>
              <div className="text-sm opacity-80">累计星星</div>
            </div>
          </div>
          
          {/* 徽章展示 */}
          {progress.unlockedBadges.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-sm opacity-80 mb-2">已获得徽章</div>
              <div className="flex gap-2">
                {progress.unlockedBadges.slice(-5).map(badgeId => {
                  const badge = BADGES.find(b => b.id === badgeId)
                  return badge ? (
                    <div key={badgeId} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center" title={badge.name}>
                      <span className="text-xl">{badge.emoji}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* 世界选择 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {WORLDS.map((world, index) => (
            <button
              key={world.id}
              onClick={() => setActiveWorld(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeWorld === index
                  ? `bg-gradient-to-r ${world.color} text-white`
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{world.emoji}</span>
              <span>{world.name}</span>
            </button>
          ))}
        </div>
        
        {/* 关卡地图 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-indigo-500" />
            {WORLDS[activeWorld].name}
          </h2>
          
          <div className="space-y-4">
            {WORLDS[activeWorld].levels.map((level, index) => {
              const isUnlocked = progress.totalStars >= level.requiredStars
              const isCompleted = progress.completedLevels.includes(level.id)
              const stars = progress.levelStars[level.id] || 0
              
              return (
                <div
                  key={level.id}
                  onClick={() => isUnlocked && startLevel(level)}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? 'cursor-pointer hover:shadow-md ' + (isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-indigo-300')
                      : 'bg-slate-50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* 关卡图标 */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      isUnlocked
                        ? isCompleted ? 'bg-green-100' : 'bg-indigo-100'
                        : 'bg-slate-200'
                    }`}>
                      {isUnlocked ? level.emoji : <Lock className="w-6 h-6 text-slate-400" />}
                    </div>
                    
                    {/* 关卡信息 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{level.name}</span>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                      <p className="text-sm text-slate-500">{level.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span>{level.questions}题</span>
                        <span className={`px-2 py-0.5 rounded ${
                          level.difficulty === 1 ? 'bg-green-100 text-green-600' :
                          level.difficulty === 2 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {level.difficulty === 1 ? '简单' : level.difficulty === 2 ? '中等' : '困难'}
                        </span>
                        <span>+{level.reward.xp} XP</span>
                      </div>
                    </div>
                    
                    {/* 星星 */}
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    
                    {/* 解锁条件 */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-50/80 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <span className="text-xs text-slate-500">需要 {level.requiredStars} ⭐</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* 徽章图鉴 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            徽章图鉴
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BADGES.map(badge => {
              const isUnlocked = progress.unlockedBadges.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isUnlocked
                      ? 'bg-white border-indigo-200'
                      : 'bg-slate-50 border-slate-100 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <div className="font-bold text-slate-800">{badge.name}</div>
                  <div className="text-xs text-slate-500">{badge.description}</div>
                  {!isUnlocked && (
                    <div className="text-xs text-slate-400 mt-1">条件：{badge.condition}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
