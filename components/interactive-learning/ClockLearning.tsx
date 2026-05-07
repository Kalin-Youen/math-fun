'use client'

import { useState, useEffect } from 'react'
import { Check, Trophy, RotateCcw } from 'lucide-react'

export default function ClockLearning() {
  const [hour, setHour] = useState(3)
  const [minute, setMinute] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)

  const generateTime = () => {
    const h = Math.floor(Math.random() * 12) + 1
    const m = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
    setHour(h)
    setMinute(m)
    setAnswer('')
    setShowResult(null)
  }

  useEffect(() => {
    generateTime()
  }, [])

  const handleSubmit = () => {
    if (!answer) return
    
    const [ansHour, ansMin] = answer.split(':').map(Number)
    const isCorrect = ansHour === hour && ansMin === minute
    
    if (isCorrect) {
      setScore(s => s + 10)
      setShowResult('correct')
      setTimeout(generateTime, 1500)
    } else {
      setShowResult('wrong')
      setTimeout(() => {
        setAnswer('')
        setShowResult(null)
      }, 2000)
    }
  }

  const formatTime = (h: number, m: number) => {
    return `${h}:${m.toString().padStart(2, '0')}`
  }

  // 计算时针和分针的角度
  const hourAngle = (hour % 12) * 30 + minute * 0.5
  const minuteAngle = minute * 6

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-amber-800">🕐 认识钟表</h3>
          <p className="text-sm text-amber-600">读出正确的时间</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 时钟可视化 */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-48 w-48 rounded-full border-4 border-amber-400 bg-white shadow-lg">
          {/* 时钟刻度 */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-sm font-bold text-amber-800"
              style={{
                top: `${50 - 40 * Math.cos((i + 1) * 30 * Math.PI / 180)}%`,
                left: `${50 + 40 * Math.sin((i + 1) * 30 * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {i + 1}
            </div>
          ))}
          
          {/* 时针 */}
          <div
            className="absolute left-1/2 top-1/2 h-12 w-1.5 -translate-x-1/2 origin-bottom rounded-full bg-amber-800"
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          
          {/* 分针 */}
          <div
            className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 origin-bottom rounded-full bg-amber-600"
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
          
          {/* 中心点 */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800" />
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className="text-lg font-bold text-amber-800">现在是几点几分？</p>
        <p className="text-sm text-amber-600">格式：时:分 (如 3:30)</p>
      </div>

      <div className="mb-4 flex justify-center gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="如: 3:30"
          className={`
            w-32 rounded-xl border-2 px-4 py-3 text-center text-2xl font-bold outline-none
            ${showResult === 'correct' 
              ? 'border-green-500 bg-green-100 text-green-700' 
              : showResult === 'wrong'
                ? 'border-red-500 bg-red-100 text-red-700'
                : 'border-amber-300 bg-white text-amber-800 focus:border-amber-500'
            }
          `}
        />
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      {showResult === 'correct' && (
        <div className="rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 回答正确！+10分</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是：{formatTime(hour, minute)}</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={generateTime}
          className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
