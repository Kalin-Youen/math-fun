'use client'

import { useState, useCallback, useEffect } from 'react'
import { Trophy, RotateCcw, Lightbulb } from 'lucide-react'

// 百分数游戏 - 六年级专用
export default function PercentGame() {
  const [problem, setProblem] = useState({ whole: 100, percent: 25, answer: 25 })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [showSteps, setShowSteps] = useState(false)
  const [problemType, setProblemType] = useState<'find-part' | 'find-whole' | 'find-percent'>('find-part')

  const generateProblem = useCallback(() => {
    const types: ('find-part' | 'find-whole' | 'find-percent')[] = ['find-part', 'find-whole', 'find-percent']
    const type = types[Math.floor(Math.random() * types.length)]
    
    let whole: number, percent: number, part: number
    
    if (type === 'find-part') {
      whole = [50, 100, 200, 500][Math.floor(Math.random() * 4)]
      percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)]
      part = whole * percent / 100
      setProblem({ whole, percent, answer: part })
    } else if (type === 'find-whole') {
      percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)]
      part = [10, 20, 25, 50][Math.floor(Math.random() * 4)]
      whole = part * 100 / percent
      setProblem({ whole, percent, answer: whole })
    } else {
      whole = [50, 100, 200][Math.floor(Math.random() * 3)]
      part = Math.floor(whole * [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)] / 100)
      percent = part * 100 / whole
      setProblem({ whole, percent, answer: percent })
    }
    
    setProblemType(type)
    setAnswer('')
    setShowResult(null)
    setShowSteps(false)
  }, [])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const handleSubmit = () => {
    if (!answer) return
    
    const userAnswer = parseFloat(answer)
    const isCorrect = Math.abs(userAnswer - problem.answer) < 0.01
    
    if (isCorrect) {
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

  const getQuestionText = () => {
    if (problemType === 'find-part') {
      return `${problem.whole}的${problem.percent}%是多少？`
    } else if (problemType === 'find-whole') {
      return `一个数的${problem.percent}%是${problem.answer.toFixed(0)}，这个数是多少？`
    } else {
      return `${problem.answer.toFixed(0)}是${problem.whole}的百分之几？`
    }
  }

  return (
    <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-rose-800">💯 百分数</h3>
          <p className="text-sm text-rose-600">理解百分数的应用</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      {/* 题目展示 */}
      <div className="mb-6 text-center">
        <div className="rounded-xl bg-white p-6 shadow-inner">
          <p className="text-xl font-bold text-rose-800">{getQuestionText()}</p>
        </div>
        
        {/* 可视化 */}
        <div className="mt-4">
          <div className="relative h-8 w-full rounded-full bg-rose-100">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-rose-500"
              style={{ width: `${problem.percent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-sm text-rose-600">
            <span>0%</span>
            <span>{problem.percent}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 解题步骤 */}
      {showSteps && (
        <div className="mb-4 space-y-2 rounded-xl bg-rose-100 p-4 text-sm text-rose-800">
          {problemType === 'find-part' && (
            <>
              <p><strong>解题方法：</strong>部分 = 整体 × 百分比</p>
              <p className="pl-4">{problem.whole} × {problem.percent}% = {problem.whole} × {problem.percent/100} = {problem.answer}</p>
            </>
          )}
          {problemType === 'find-whole' && (
            <>
              <p><strong>解题方法：</strong>整体 = 部分 ÷ 百分比</p>
              <p className="pl-4">{problem.answer.toFixed(0)} ÷ {problem.percent}% = {problem.answer.toFixed(0)} ÷ {problem.percent/100} = {problem.whole}</p>
            </>
          )}
          {problemType === 'find-percent' && (
            <>
              <p><strong>解题方法：</strong>百分比 = 部分 ÷ 整体 × 100%</p>
              <p className="pl-4">{problem.answer.toFixed(0)} ÷ {problem.whole} × 100% = {problem.percent}%</p>
            </>
          )}
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
              showResult === 'wrong' ? 'border-red-500 bg-red-100' : 'border-rose-300'}`}
        />
        {problemType === 'find-percent' && (
          <span className="flex items-center text-2xl font-bold text-rose-600">%</span>
        )}
        <button
          onClick={handleSubmit}
          disabled={!answer || showResult !== null}
          className="rounded-full bg-rose-500 px-6 py-2 font-bold text-white transition hover:bg-rose-600 disabled:opacity-50"
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
          <p className="font-bold">🎉 正确！答案 = {problem.answer}</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">正确答案是 {problem.answer}</p>
        </div>
      )}
    </div>
  )
}
