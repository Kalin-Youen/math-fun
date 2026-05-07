'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, CheckCircle, XCircle, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveMistakeRecord } from '@/lib/storage'

export default function MultiplicationTablePage() {
  const [selectedNum, setSelectedNum] = useState<number | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<{a: number; b: number}[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const { unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('multiplication-table')
  }, [trackVisit])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const startQuiz = () => {
    const questions = Array.from({ length: 20 }, () => ({
      a: Math.floor(Math.random() * 9) + 1,
      b: Math.floor(Math.random() * 9) + 1
    }))
    setQuizQuestions(questions)
    setCurrentQIndex(0)
    setScore(0)
    setWrong(0)
    setQuizMode(true)
    setQuizFinished(false)
    setUserAnswer('')
    setShowResult(false)
  }

  const submitAnswer = () => {
    const current = quizQuestions[currentQIndex]
    const correct = current.a * current.b
    const isCorrect = parseInt(userAnswer) === correct

    if (isCorrect) {
      setScore(s => s + 1)
    } else {
      setWrong(w => w + 1)
      saveMistakeRecord({
        id: Date.now().toString(),
        question: `${current.a} × ${current.b} = ?`,
        userAnswer: userAnswer,
        correctAnswer: correct.toString(),
        module: 'multiplication-table',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0
      })
    }

    setShowResult(true)
    setTimeout(() => {
      if (currentQIndex < quizQuestions.length - 1) {
        setCurrentQIndex(i => i + 1)
        setUserAnswer('')
        setShowResult(false)
      } else {
        finishQuiz()
      }
    }, 1000)
  }

  const finishQuiz = () => {
    setQuizFinished(true)
    setQuizMode(false)
    savePracticeRecord({
      id: Date.now().toString(),
      module: 'multiplication-table',
      score: score + (parseInt(userAnswer) === quizQuestions[currentQIndex]?.a * quizQuestions[currentQIndex]?.b ? 1 : 0),
      total: 20,
      date: new Date().toISOString()
    })
    if (score >= 10) unlock('mul_quiz_10')
    if (score >= 30) unlock('mul_quiz_30')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer && !showResult) {
      submitAnswer()
    }
  }

  if (quizMode && !quizFinished) {
    const current = quizQuestions[currentQIndex]
    const correct = current.a * current.b

    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <header className="mb-6 flex items-center justify-between">
            <button onClick={() => setQuizMode(false)} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-5 w-5" />
              <span>退出测验</span>
            </button>
            <h1 className="text-xl font-bold text-slate-800">乘法口诀测验</h1>
            <div className="text-slate-600">{currentQIndex + 1}/20</div>
          </header>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mb-6 text-6xl font-bold text-slate-800">
                {current.a} × {current.b} = ?
              </div>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={showResult}
                className="w-32 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-3xl font-bold text-slate-800 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
                placeholder="?"
                autoFocus
              />
            </div>

            {showResult && (
              <div className={`mb-6 rounded-2xl p-4 text-center ${parseInt(userAnswer) === correct ? 'bg-green-100' : 'bg-red-100'}`}>
                {parseInt(userAnswer) === correct ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xl font-bold">回答正确！</span>
                  </div>
                ) : (
                  <div className="text-red-700">
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="h-6 w-6" />
                      <span className="text-xl font-bold">回答错误</span>
                    </div>
                    <p className="mt-1">正确答案是 {correct}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={submitAnswer}
              disabled={!userAnswer || showResult}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              提交答案
            </button>

            <div className="mt-6 flex justify-center gap-4">
              <div className="rounded-xl bg-green-100 px-4 py-2 text-green-700">
                ✓ {score}
              </div>
              <div className="rounded-xl bg-red-100 px-4 py-2 text-red-700">
                ✗ {wrong}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (quizFinished) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-xl text-center">
            <div className="mb-4 text-6xl">{score >= 18 ? '🏆' : score >= 15 ? '⭐' : '💪'}</div>
            <h2 className="mb-4 text-3xl font-bold text-slate-800">测验完成！</h2>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-green-50 p-4">
                <div className="text-3xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-green-700">答对</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4">
                <div className="text-3xl font-bold text-red-600">{wrong}</div>
                <div className="text-sm text-red-700">答错</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startQuiz}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 text-xl font-bold text-white shadow-lg"
              >
                再测一次
              </button>
              <Link
                href="/"
                className="flex-1 rounded-2xl bg-slate-100 py-4 text-xl font-bold text-slate-700"
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
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">✖️ 九九乘法表</h1>
          <button
            onClick={startQuiz}
            className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 font-bold text-white shadow-lg"
          >
            开始测验
          </button>
        </header>

        {selectedNum ? (
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">{selectedNum} 的乘法口诀</h2>
              <button
                onClick={() => setSelectedNum(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
              >
                返回全表
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => speak(`${selectedNum}乘${n}等于${selectedNum * n}`)}
                  className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 text-left transition hover:shadow-md"
                >
                  <span className="text-lg font-bold text-slate-800">
                    {selectedNum} × {n} = {selectedNum * n}
                  </span>
                  <Volume2 className="h-5 w-5 text-emerald-500" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">点击数字查看口诀</h2>
              <div className="grid grid-cols-9 gap-2">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedNum(n)}
                    className="aspect-square rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-slate-800">完整乘法表</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {Array.from({ length: 9 }, (_, i) => (
                        <th key={i} className="p-2 text-center text-sm font-bold text-slate-600">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((row) => (
                      <tr key={row}>
                        <td className="p-2 text-center font-bold text-slate-600">{row}</td>
                        {Array.from({ length: 9 }, (_, col) => {
                          const result = row * (col + 1)
                          const isSquare = row === col + 1
                          return (
                            <td
                              key={col}
                              onClick={() => speak(`${row}乘${col + 1}等于${result}`)}
                              className={`cursor-pointer p-2 text-center text-sm transition hover:bg-emerald-50 ${
                                isSquare ? 'bg-emerald-100 font-bold text-emerald-700' : 'text-slate-700'
                              }`}
                            >
                              {result}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg">
              <h3 className="mb-3 text-lg font-bold text-amber-800">💡 记忆小窍门</h3>
              <ul className="space-y-2 text-amber-700">
                <li>• <strong>2的倍数</strong>：都是偶数，末尾是0/2/4/6/8</li>
                <li>• <strong>5的倍数</strong>：末尾是0或5</li>
                <li>• <strong>9的倍数</strong>：各位数字之和是9（如 9×7=63，6+3=9）</li>
                <li>• <strong>交换律</strong>：3×7=7×3，记住一半就够了！</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
