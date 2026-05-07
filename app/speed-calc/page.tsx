'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Clock, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveMistakeRecord } from '@/lib/storage'

interface Question {
  id: number
  num1: number
  num2: number
  operator: '+' | '-' | '×' | '÷'
  answer: number
}

const OPERATORS = ['+', '-', '×', '÷'] as const

function generateQuestion(difficulty: 'easy' | 'medium' | 'hard'): Question {
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)]
  let num1 = 1
  let num2 = 1
  let answer = 2

  switch (difficulty) {
    case 'easy':
      if (operator === '+' || operator === '-') {
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1]
        answer = operator === '+' ? num1 + num2 : num1 - num2
      } else if (operator === '×') {
        num1 = Math.floor(Math.random() * 9) + 2
        num2 = Math.floor(Math.random() * 9) + 2
        answer = num1 * num2
      } else {
        num2 = Math.floor(Math.random() * 9) + 2
        answer = Math.floor(Math.random() * 9) + 2
        num1 = num2 * answer
      }
      break
    case 'medium':
      if (operator === '+' || operator === '-') {
        num1 = Math.floor(Math.random() * 100) + 10
        num2 = Math.floor(Math.random() * 100) + 10
        if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1]
        answer = operator === '+' ? num1 + num2 : num1 - num2
      } else if (operator === '×') {
        num1 = Math.floor(Math.random() * 12) + 2
        num2 = Math.floor(Math.random() * 12) + 2
        answer = num1 * num2
      } else {
        num2 = Math.floor(Math.random() * 12) + 2
        answer = Math.floor(Math.random() * 12) + 2
        num1 = num2 * answer
      }
      break
    case 'hard':
      if (operator === '+' || operator === '-') {
        num1 = Math.floor(Math.random() * 500) + 100
        num2 = Math.floor(Math.random() * 500) + 100
        if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1]
        answer = operator === '+' ? num1 + num2 : num1 - num2
      } else if (operator === '×') {
        num1 = Math.floor(Math.random() * 20) + 10
        num2 = Math.floor(Math.random() * 20) + 5
        answer = num1 * num2
      } else {
        num2 = Math.floor(Math.random() * 20) + 5
        answer = Math.floor(Math.random() * 20) + 5
        num1 = num2 * answer
      }
      break
  }

  return { id: Date.now() + Math.random(), num1, num2, operator, answer }
}

export default function SpeedCalcPage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [isPlaying, setIsPlaying] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [results, setResults] = useState<{correct: number; wrong: number; details: any[]}>({ correct: 0, wrong: 0, details: [] })
  const { unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('speed-calc')
  }, [trackVisit])

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isPlaying && timeLeft === 0) {
      endGame()
    }
  }, [isPlaying, timeLeft])

  const startGame = () => {
    const newQuestions = Array.from({ length: 20 }, () => generateQuestion(difficulty))
    setQuestions(newQuestions)
    setCurrentIndex(0)
    setScore(0)
    setTimeLeft(60)
    setIsPlaying(true)
    setGameOver(false)
    setUserAnswer('')
    setResults({ correct: 0, wrong: 0, details: [] })
    unlock('first_speed')
  }

  const submitAnswer = () => {
    const current = questions[currentIndex]
    const isCorrect = parseInt(userAnswer) === current.answer
    
    const newDetails = [...results.details, {
      question: `${current.num1} ${current.operator} ${current.num2}`,
      userAnswer: userAnswer,
      correctAnswer: current.answer,
      isCorrect
    }]
    
    if (isCorrect) {
      setScore(s => s + 10)
      setResults(r => ({ ...r, correct: r.correct + 1, details: newDetails }))
    } else {
      setResults(r => ({ ...r, wrong: r.wrong + 1, details: newDetails }))
      saveMistakeRecord({
        id: Date.now().toString(),
        question: `${current.num1} ${current.operator} ${current.num2} = ?`,
        userAnswer: userAnswer,
        correctAnswer: current.answer.toString(),
        module: 'speed-calc',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0
      })
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setUserAnswer('')
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
    
    const totalAnswered = results.correct + results.wrong + (parseInt(userAnswer) ? 1 : 0)
    savePracticeRecord({
      id: Date.now().toString(),
      module: 'speed-calc',
      score: results.correct + (parseInt(userAnswer) === questions[currentIndex]?.answer ? 1 : 0),
      total: Math.max(totalAnswered, 1),
      date: new Date().toISOString(),
      details: JSON.stringify(results.details)
    })

    if (results.correct >= 10) unlock('speed_10')
    if (results.correct === 20) unlock('speed_perfect')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer) {
      submitAnswer()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">⚡ 速算练习</h1>
          <div className="w-20" />
        </header>

        {!isPlaying && !gameOver && (
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 text-6xl">⚡</div>
              <h2 className="mb-2 text-2xl font-bold text-slate-800">速算挑战</h2>
              <p className="text-slate-500">60秒内尽可能多地答对题目！</p>
            </div>

            <div className="mb-8">
              <label className="mb-3 block text-center font-medium text-slate-700">选择难度</label>
              <div className="flex justify-center gap-3">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-xl px-6 py-3 font-medium transition ${
                      difficulty === d
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
            >
              开始挑战 🚀
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-5 w-5" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Trophy className="h-5 w-5" />
                <span className="text-xl font-bold">{score}</span>
              </div>
              <div className="text-slate-500">
                {currentIndex + 1} / {questions.length}
              </div>
            </div>

            <div className="mb-8 text-center">
              <div className="mb-6 text-5xl font-bold text-slate-800">
                {questions[currentIndex]?.num1} {questions[currentIndex]?.operator} {questions[currentIndex]?.num2} = ?
              </div>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-40 rounded-2xl border-2 border-orange-200 bg-orange-50 px-4 py-4 text-center text-3xl font-bold text-slate-800 focus:border-orange-400 focus:outline-none"
                placeholder="?"
                autoFocus
              />
            </div>

            <button
              onClick={submitAnswer}
              disabled={!userAnswer}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              提交答案
            </button>

            <div className="mt-6 flex justify-center gap-2">
              {questions.slice(0, Math.min(currentIndex + 1, 10)).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    i < results.correct ? 'bg-green-400' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {gameOver && (
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 text-6xl">{results.correct >= 15 ? '🏆' : results.correct >= 10 ? '⭐' : '💪'}</div>
              <h2 className="mb-2 text-3xl font-bold text-slate-800">挑战结束！</h2>
              <p className="text-slate-500">用时：{60 - timeLeft}秒</p>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{results.correct}</div>
                <div className="text-sm text-green-700">答对</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{results.wrong}</div>
                <div className="text-sm text-red-700">答错</div>
              </div>
              <div className="rounded-2xl bg-orange-50 p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{score}</div>
                <div className="text-sm text-orange-700">得分</div>
              </div>
            </div>

            <div className="mb-6 max-h-60 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-3 font-bold text-slate-700">答题详情</h3>
              {results.details.map((detail, i) => (
                <div key={i} className="mb-2 flex items-center justify-between rounded-xl bg-white p-3">
                  <span className="font-medium">{detail.question} = {detail.correctAnswer}</span>
                  {detail.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-500">你的答案: {detail.userAnswer}</span>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <RotateCcw className="mr-2 inline h-5 w-5" />
                再玩一次
              </button>
              <Link
                href="/"
                className="flex-1 rounded-2xl bg-slate-100 py-4 text-center text-xl font-bold text-slate-700 transition hover:bg-slate-200"
              >
                返回首页
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
