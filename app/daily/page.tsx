'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Calendar, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveDailyCheckIn, getDailyCheckIns, saveMistakeRecord } from '@/lib/storage'

interface Question {
  id: number
  question: string
  answer: string | number
  type: 'calc' | 'choice'
  options?: string[]
}

function generateDailyQuestions(): Question[] {
  const questions: Question[] = []
  
  // 5道计算题
  for (let i = 0; i < 5; i++) {
    const operators = ['+', '-', '×', '÷']
    const op = operators[Math.floor(Math.random() * operators.length)]
    let num1: number, num2: number, answer: number
    
    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * 50) + 10
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * 9) + 2
        num2 = Math.floor(Math.random() * 9) + 2
        answer = num1 * num2
        break
      case '÷':
        num2 = Math.floor(Math.random() * 8) + 2
        answer = Math.floor(Math.random() * 9) + 2
        num1 = num2 * answer
        break
      default:
        num1 = 1; num2 = 1; answer = 2
    }
    
    questions.push({
      id: i,
      question: `${num1} ${op} ${num2} = ?`,
      answer: answer,
      type: 'calc'
    })
  }
  
  // 3道选择题（概念题）
  const choiceQuestions = [
    {
      question: '25 × 4 = ?',
      answer: '100',
      options: ['80', '100', '90', '110']
    },
    {
      question: '一个正方形有（ ）条边',
      answer: '4',
      options: ['3', '4', '5', '6']
    },
    {
      question: '1米 =（ ）厘米',
      answer: '100',
      options: ['10', '100', '1000', '10000']
    },
    {
      question: '0.5 写成百分数是（ ）',
      answer: '50%',
      options: ['5%', '50%', '0.5%', '500%']
    },
    {
      question: '3/4 =（ ）',
      answer: '0.75',
      options: ['0.25', '0.5', '0.75', '1']
    }
  ]
  
  const shuffled = choiceQuestions.sort(() => Math.random() - 0.5).slice(0, 3)
  shuffled.forEach((q, i) => {
    questions.push({
      id: i + 5,
      question: q.question,
      answer: q.answer,
      type: 'choice',
      options: q.options
    })
  })
  
  // 2道应用题
  const wordProblems = [
    {
      question: '小明有15个苹果，给了小红7个，还剩几个？',
      answer: 8
    },
    {
      question: '一个长方形长8厘米，宽5厘米，周长是多少厘米？',
      answer: 26
    },
    {
      question: '一本书有120页，每天看20页，几天能看完？',
      answer: 6
    },
    {
      question: '3个小朋友分24颗糖，平均每人分几颗？',
      answer: 8
    }
  ]
  
  const shuffledWord = wordProblems.sort(() => Math.random() - 0.5).slice(0, 2)
  shuffledWord.forEach((q, i) => {
    questions.push({
      id: i + 8,
      question: q.question,
      answer: q.answer,
      type: 'calc'
    })
  })
  
  return questions
}

export default function DailyPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [answers, setAnswers] = useState<{questionId: number; correct: boolean; userAns: string}[]>([])
  const [completed, setCompleted] = useState(false)
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const { unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('daily')
    
    // 检查今天是否已打卡
    const checkins = getDailyCheckIns()
    const today = new Date().toISOString().slice(0, 10)
    setTodayCheckedIn(checkins.some(c => c.date === today && c.completed))
    
    // 生成今日题目
    setQuestions(generateDailyQuestions())
  }, [trackVisit])

  const submitAnswer = () => {
    const current = questions[currentIndex]
    const isCorrect = userAnswer.toString().trim() === current.answer.toString()
    
    const newAnswers = [...answers, {
      questionId: current.id,
      correct: isCorrect,
      userAns: userAnswer
    }]
    setAnswers(newAnswers)
    
    if (!isCorrect) {
      saveMistakeRecord({
        id: Date.now().toString(),
        question: current.question,
        userAnswer: userAnswer,
        correctAnswer: current.answer.toString(),
        module: 'daily',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0
      })
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setUserAnswer('')
    } else {
      finishDaily(newAnswers)
    }
  }

  const finishDaily = (finalAnswers: typeof answers) => {
    setCompleted(true)
    
    const correctCount = finalAnswers.filter(a => a.correct).length
    
    // 保存练习记录
    savePracticeRecord({
      id: Date.now().toString(),
      module: 'daily',
      score: correctCount,
      total: questions.length,
      date: new Date().toISOString()
    })
    
    // 打卡
    const today = new Date().toISOString().slice(0, 10)
    saveDailyCheckIn(today)
    setTodayCheckedIn(true)
    
    // 解锁成就
    unlock('daily_first')
    if (correctCount === questions.length) {
      unlock('daily_perfect')
    }
    
    // 检查连续打卡
    const checkins = getDailyCheckIns()
    const streak = calculateStreak(checkins)
    if (streak >= 3) unlock('daily_streak_3')
    if (streak >= 7) unlock('daily_streak_7')
  }

  const calculateStreak = (checkins: {date: string; completed: boolean}[]) => {
    const dates = checkins
      .filter(c => c.completed)
      .map(c => c.date)
      .sort()
      .reverse()
    
    if (dates.length === 0) return 0
    
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

  const restart = () => {
    setQuestions(generateDailyQuestions())
    setCurrentIndex(0)
    setUserAnswer('')
    setAnswers([])
    setCompleted(false)
  }

  const correctCount = answers.filter(a => a.correct).length
  const currentQuestion = questions[currentIndex]

  if (completed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="mx-auto max-w-2xl">
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-5 w-5" />
              <span>返回首页</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">📅 每日一练</h1>
            <div className="w-20" />
          </header>

          <div className="rounded-3xl bg-white p-8 shadow-xl text-center">
            <div className="mb-4 text-6xl">
              {correctCount === questions.length ? '🏆' : correctCount >= 8 ? '⭐' : '💪'}
            </div>
            <h2 className="mb-2 text-3xl font-bold text-slate-800">
              {correctCount === questions.length ? '完美！' : '完成今日练习！'}
            </h2>
            <p className="mb-6 text-slate-500">
              {todayCheckedIn && '✓ 已打卡'}
            </p>

            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-green-50 p-4">
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-green-700">答对</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4">
                <div className="text-3xl font-bold text-red-600">{questions.length - correctCount}</div>
                <div className="text-sm text-red-700">答错</div>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <div className="text-3xl font-bold text-amber-600">
                  {Math.round((correctCount / questions.length) * 100)}%
                </div>
                <div className="text-sm text-amber-700">正确率</div>
              </div>
            </div>

            <div className="mb-6 max-h-64 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-3 font-bold text-slate-700">答题详情</h3>
              {answers.map((ans, i) => (
                <div
                  key={i}
                  className={`mb-2 flex items-center justify-between rounded-xl p-3 ${
                    ans.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">
                    {questions.find(q => q.id === ans.questionId)?.question}
                  </span>
                  <div className="flex items-center gap-2">
                    {!ans.correct && (
                      <span className="text-xs text-red-600">
                        你的: {ans.userAns}
                      </span>
                    )}
                    {ans.correct ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={restart}
                className="flex-1 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="mr-2 inline h-5 w-5" />
                再练一次
              </button>
              <Link
                href="/"
                className="flex-1 rounded-2xl bg-slate-100 py-4 text-xl font-bold text-slate-700 transition hover:bg-slate-200"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📅 每日一练</h1>
          <div className="text-slate-500">{currentIndex + 1}/{questions.length}</div>
        </header>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          {/* 进度条 */}
          <div className="mb-6">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 题目 */}
          {currentQuestion && (
            <div className="mb-8 text-center">
              <div className="mb-6 text-2xl font-bold text-slate-800 leading-relaxed">
                {currentQuestion.question}
              </div>
              
              {currentQuestion.type === 'choice' && currentQuestion.options ? (
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setUserAnswer(option)}
                      className={`rounded-xl py-4 text-lg font-bold transition ${
                        userAnswer === option
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userAnswer && submitAnswer()}
                  className="w-40 rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-4 text-center text-3xl font-bold text-slate-800 focus:border-green-400 focus:outline-none"
                  placeholder="?"
                  autoFocus
                />
              )}
            </div>
          )}

          <button
            onClick={submitAnswer}
            disabled={!userAnswer}
            className="w-full rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
          >
            {currentIndex < questions.length - 1 ? '下一题' : '完成'}
          </button>

          {/* 已答题目状态 */}
          {answers.length > 0 && (
            <div className="mt-6 flex justify-center gap-2">
              {answers.map((ans, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    ans.correct ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 提示 */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-700">
            💡 每天练习10道题，坚持打卡养成好习惯！
          </p>
        </div>
      </div>
    </main>
  )
}
