'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, RotateCcw } from 'lucide-react'

// 比较大小游戏 - 一年级专用
export default function CompareGame() {
  const [num1, setNum1] = useState(5)
  const [num2, setNum2] = useState(3)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const generateProblem = useCallback(() => {
    const n1 = Math.floor(Math.random() * 20) + 1
    let n2 = Math.floor(Math.random() * 20) + 1
    // 确保两个数不同
    while (n2 === n1) {
      n2 = Math.floor(Math.random() * 20) + 1
    }
    setNum1(n1)
    setNum2(n2)
    setSelectedAnswer(null)
    setShowResult(null)
  }, [])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const handleAnswer = (answer: '>' | '<' | '=') => {
    if (selectedAnswer) return
    
    setSelectedAnswer(answer)
    let correct = false
    
    if (num1 > num2 && answer === '>') correct = true
    if (num1 < num2 && answer === '<') correct = true
    if (num1 === num2 && answer === '=') correct = true
    
    if (correct) {
      setScore(s => s + 10 + streak * 2)
      setStreak(s => s + 1)
      setShowResult('correct')
      setTimeout(generateProblem, 1500)
    } else {
      setStreak(0)
      setShowResult('wrong')
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowResult(null)
      }, 1500)
    }
  }

  // 渲染苹果可视化
  const renderApples = (count: number, side: 'left' | 'right') => {
    const apples = []
    for (let i = 0; i < count; i++) {
      apples.push(<span key={i} className="text-2xl">🍎</span>)
    }
    return (
      <div className={`flex flex-wrap justify-center gap-1 p-2 ${side === 'left' ? 'bg-red-50' : 'bg-green-50'} rounded-xl`}>
        {apples}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-orange-800">⚖️ 比较大小</h3>
          <p className="text-sm text-orange-600">比较两个数的大小</p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 2 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-700">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="font-bold text-amber-700">{score} 分</span>
          </div>
        </div>
      </div>

      {/* 可视化比较 */}
      <div className="mb-6 grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <div className="mb-2 text-5xl font-bold text-red-600">{num1}</div>
          {renderApples(num1, 'left')}
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleAnswer('>')}
            disabled={selectedAnswer !== null}
            className={`w-16 h-16 rounded-full text-3xl font-bold shadow-lg transition-all
              ${selectedAnswer === '>' 
                ? showResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-100 hover:scale-110'
              }`}
          >
            &gt;
          </button>
          <button
            onClick={() => handleAnswer('=')}
            disabled={selectedAnswer !== null}
            className={`w-16 h-16 rounded-full text-3xl font-bold shadow-lg transition-all
              ${selectedAnswer === '=' 
                ? showResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-100 hover:scale-110'
              }`}
          >
            =
          </button>
          <button
            onClick={() => handleAnswer('<')}
            disabled={selectedAnswer !== null}
            className={`w-16 h-16 rounded-full text-3xl font-bold shadow-lg transition-all
              ${selectedAnswer === '<' 
                ? showResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-100 hover:scale-110'
              }`}
          >
            &lt;
          </button>
        </div>
        
        <div className="text-center">
          <div className="mb-2 text-5xl font-bold text-green-600">{num2}</div>
          {renderApples(num2, 'right')}
        </div>
      </div>

      {showResult === 'correct' && (
        <div className="rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 正确！{num1} {num1 > num2 ? '>' : num1 < num2 ? '<' : '='} {num2}</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再想想！</p>
          <p className="text-sm">正确答案：{num1} {num1 > num2 ? '>' : num1 < num2 ? '<' : '='} {num2}</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={generateProblem}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
