'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, RotateCcw, Lightbulb } from 'lucide-react'

// 方程求解游戏 - 五年级专用
export default function EquationGame() {
  const [equation, setEquation] = useState({ a: 3, x: 5, b: 2, result: 17 })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [showSteps, setShowSteps] = useState(false)

  const generateProblem = useCallback(() => {
    const x = Math.floor(Math.random() * 10) + 1 // 1-10
    const a = Math.floor(Math.random() * 5) + 2 // 2-6
    const b = Math.floor(Math.random() * 10) + 1 // 1-10
    const result = a * x + b
    
    setEquation({ a, x, b, result })
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
    if (userAnswer === equation.x) {
      setScore(s => s + 20)
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

  return (
    <div className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-teal-800">📐 解方程</h3>
          <p className="text-sm text-teal-600">求未知数 x 的值</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 方程展示 */}
      <div className="mb-6 text-center">
        <div className="rounded-xl bg-white p-6 shadow-inner">
          <p className="text-3xl font-bold text-teal-800">
            {equation.a}x + {equation.b} = {equation.result}
          </p>
        </div>
        <p className="mt-3 text-teal-600">求 x = ?</p>
      </div>

      {/* 解题步骤 */}
      {showSteps && (
        <div className="mb-4 space-y-2 rounded-xl bg-teal-100 p-4 text-sm text-teal-800">
          <p><strong>第一步：</strong>把 {equation.b} 移到等号右边</p>
          <p className="pl-4">{equation.a}x = {equation.result} - {equation.b} = {equation.result - equation.b}</p>
          <p><strong>第二步：</strong>两边同时除以 {equation.a}</p>
          <p className="pl-4">x = {equation.result - equation.b} ÷ {equation.a} = {equation.x}</p>
          <p className="font-bold text-teal-600">答案：x = {equation.x}</p>
        </div>
      )}

      <div className="mb-4 flex justify-center gap-2">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="x = "
          className={`w-24 rounded-xl border-2 px-4 py-2 text-center text-2xl font-bold outline-none
            ${showResult === 'correct' ? 'border-green-500 bg-green-100' : 
              showResult === 'wrong' ? 'border-red-500 bg-red-100' : 'border-teal-300'}`}
        />
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="rounded-full bg-teal-500 px-6 py-2 font-bold text-white transition hover:bg-teal-600 disabled:opacity-50"
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
          <p className="font-bold">🎉 正确！x = {equation.x}</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是 x = {equation.x}</p>
        </div>
      )}
    </div>
  )
}
