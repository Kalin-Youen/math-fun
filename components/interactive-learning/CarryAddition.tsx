'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, RotateCcw, Lightbulb } from 'lucide-react'

// 进位加法演示 - 一年级专用
export default function CarryAddition() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [showSteps, setShowSteps] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(0)

  // 生成需要进位的加法题
  const generateProblem = useCallback(() => {
    // 生成个位相加超过10的两位数加法
    const n1Units = Math.floor(Math.random() * 9) + 1 // 1-9
    const n2Units = Math.floor(Math.random() * (10 - n1Units)) + (10 - n1Units) // 确保个位相加>=10
    const n1Tens = Math.floor(Math.random() * 5) + 1 // 1-5
    const n2Tens = Math.floor(Math.random() * 5) // 0-4
    
    const n1 = n1Tens * 10 + n1Units
    const n2 = n2Tens * 10 + n2Units
    
    setNum1(n1)
    setNum2(n2)
    setCorrectAnswer(n1 + n2)
    setAnswer('')
    setShowResult(null)
    setShowSteps(false)
  }, [])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const handleSubmit = () => {
    if (!answer) return
    
    const userAnswer = parseInt(answer)
    if (userAnswer === correctAnswer) {
      setScore(s => s + 15)
      setShowResult('correct')
      setTimeout(generateProblem, 2000)
    } else {
      setShowResult('wrong')
      setTimeout(() => {
        setAnswer('')
        setShowResult(null)
      }, 2000)
    }
  }

  // 计算进位过程
  const n1Units = num1 % 10
  const n1Tens = Math.floor(num1 / 10)
  const n2Units = num2 % 10
  const n2Tens = Math.floor(num2 / 10)
  const unitsSum = n1Units + n2Units
  const carry = Math.floor(unitsSum / 10)
  const unitsResult = unitsSum % 10
  const tensSum = n1Tens + n2Tens + carry

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-800">➕ 进位加法</h3>
          <p className="text-sm text-blue-600">理解进位的原理</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 竖式计算演示 */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl bg-white p-6 shadow-inner">
          {/* 进位标记 */}
          {showSteps && carry > 0 && (
            <div className="mb-1 text-center text-sm font-bold text-red-500">
              进位 {carry}
            </div>
          )}
          
          {/* 竖式 */}
          <div className="font-mono text-3xl">
            <div className="flex items-center justify-end gap-1">
              <span className="w-8 text-right">{n1Tens}</span>
              <span className="w-8 text-right">{n1Units}</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-blue-600">
              <span className="w-4">+</span>
              <span className="w-8 text-right">{n2Tens}</span>
              <span className="w-8 text-right">{n2Units}</span>
            </div>
            <div className="border-t-2 border-slate-400 my-2"></div>
            <div className="flex items-center justify-end gap-1">
              <span className="w-8 text-right">?</span>
              <span className="w-8 text-right">?</span>
            </div>
          </div>
        </div>
      </div>

      {/* 步骤演示 */}
      {showSteps && (
        <div className="mb-4 space-y-2 rounded-xl bg-blue-100 p-4 text-sm text-blue-800">
          <p><strong>第一步：</strong>个位 {n1Units} + {n2Units} = {unitsSum}</p>
          {carry > 0 && (
            <p><strong>第二步：</strong>{unitsSum} 满10，向十位进{carry}，个位写{unitsResult}</p>
          )}
          <p><strong>第三步：</strong>十位 {n1Tens} + {n2Tens}{carry > 0 ? ` + ${carry}(进位)` : ''} = {tensSum}</p>
          <p className="font-bold text-blue-600">答案：{correctAnswer}</p>
        </div>
      )}

      <div className="mb-4 flex justify-center gap-2">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="答案"
          className={`w-24 rounded-xl border-2 px-4 py-2 text-center text-2xl font-bold outline-none
            ${showResult === 'correct' ? 'border-green-500 bg-green-100' : 
              showResult === 'wrong' ? 'border-red-500 bg-red-100' : 'border-blue-300'}`}
        />
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          提交
        </button>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-2 text-sm font-bold text-amber-700"
        >
          <Lightbulb className="h-4 w-4" />
          {showSteps ? '隐藏步骤' : '显示步骤'}
        </button>
        <button
          onClick={generateProblem}
          className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>

      {showResult === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 太棒了！{num1} + {num2} = {correctAnswer}</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是 {correctAnswer}</p>
        </div>
      )}
    </div>
  )
}
