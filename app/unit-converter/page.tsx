'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveMistakeRecord } from '@/lib/storage'

interface UnitCategory {
  name: string
  emoji: string
  units: { name: string; factor: number }[]
}

const CATEGORIES: UnitCategory[] = [
  {
    name: '长度',
    emoji: '📏',
    units: [
      { name: '千米(km)', factor: 100000 },
      { name: '米(m)', factor: 100 },
      { name: '分米(dm)', factor: 10 },
      { name: '厘米(cm)', factor: 1 },
      { name: '毫米(mm)', factor: 0.1 },
    ],
  },
  {
    name: '重量',
    emoji: '⚖️',
    units: [
      { name: '吨(t)', factor: 1000000 },
      { name: '千克(kg)', factor: 1000 },
      { name: '克(g)', factor: 1 },
    ],
  },
  {
    name: '面积',
    emoji: '📐',
    units: [
      { name: '平方米(m²)', factor: 10000 },
      { name: '平方分米(dm²)', factor: 100 },
      { name: '平方厘米(cm²)', factor: 1 },
    ],
  },
  {
    name: '体积',
    emoji: '📦',
    units: [
      { name: '立方米(m³)', factor: 1000000 },
      { name: '升(L)', factor: 1000 },
      { name: '毫升(mL)', factor: 1 },
    ],
  },
  {
    name: '时间',
    emoji: '⏰',
    units: [
      { name: '时', factor: 3600 },
      { name: '分', factor: 60 },
      { name: '秒', factor: 1 },
    ],
  },
  {
    name: '人民币',
    emoji: '💰',
    units: [
      { name: '元', factor: 100 },
      { name: '角', factor: 10 },
      { name: '分', factor: 1 },
    ],
  },
]

export default function UnitConverterPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [inputValue, setInputValue] = useState('1')
  const [mode, setMode] = useState<'convert' | 'quiz'>('convert')
  const [quizValue, setQuizValue] = useState(0)
  const [quizFrom, setQuizFrom] = useState(0)
  const [quizTo, setQuizTo] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const { trackVisit } = useAchievements()

  useEffect(() => { trackVisit('unit-converter') }, [trackVisit])

  const category = CATEGORIES[activeCategory]

  const convert = (value: number, from: number, to: number) => {
    const baseValue = value * category.units[from].factor
    return baseValue / category.units[to].factor
  }

  const convertedValue = inputValue ? convert(parseFloat(inputValue), fromUnit, toUnit) : 0

  const generateQuiz = () => {
    const from = Math.floor(Math.random() * category.units.length)
    let to = Math.floor(Math.random() * category.units.length)
    while (to === from) to = Math.floor(Math.random() * category.units.length)
    const value = Math.floor(Math.random() * 50) + 1
    setQuizFrom(from)
    setQuizTo(to)
    setQuizValue(value)
    setUserAnswer('')
    setQuizResult(null)
  }

  const checkQuizAnswer = () => {
    const correct = convert(quizValue, quizFrom, quizTo)
    const userNum = parseFloat(userAnswer)
    const isCorrect = Math.abs(userNum - correct) < 0.01
    setQuizResult(isCorrect ? 'correct' : 'wrong')
    setTotal(t => t + 1)
    if (isCorrect) setScore(s => s + 1)
    else {
      saveMistakeRecord({
        id: Date.now().toString(),
        question: `${quizValue} ${category.units[quizFrom].name} = ? ${category.units[quizTo].name}`,
        userAnswer: userAnswer,
        correctAnswer: parseFloat(correct.toFixed(4)).toString(),
        module: 'unit-converter',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0,
      })
    }
  }

  const switchUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 p-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🔄 单位换算</h1>
          <div className="w-20" />
        </header>

        {/* 分类选择 */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => { setActiveCategory(i); setFromUnit(0); setToUnit(Math.min(1, cat.units.length - 1)); setInputValue('1') }}
              className={`rounded-xl px-4 py-2 font-medium transition ${activeCategory === i ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-md' : 'bg-white text-slate-600'}`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* 模式切换 */}
        <div className="mb-6 flex justify-center gap-2">
          <button onClick={() => setMode('convert')} className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'convert' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600'}`}>
            换算工具
          </button>
          <button onClick={() => { setMode('quiz'); generateQuiz(); setScore(0); setTotal(0) }} className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'quiz' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600'}`}>
            换算练习
          </button>
        </div>

        {mode === 'convert' && (
          <div className="space-y-6">
            {/* 换算器 */}
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-center text-xl font-bold text-slate-700">{category.emoji} {category.name}换算</h2>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-slate-600">从</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(parseInt(e.target.value))}
                  className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 text-lg font-bold focus:border-teal-400 focus:outline-none"
                >
                  {category.units.map((u, i) => (
                    <option key={i} value={i}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-slate-600">数值</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 text-2xl font-bold text-center focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="my-4 flex justify-center">
                <button onClick={switchUnits} className="rounded-full bg-teal-100 p-3 transition hover:bg-teal-200">
                  <RotateCcw className="h-5 w-5 text-teal-600" />
                </button>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-slate-600">到</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(parseInt(e.target.value))}
                  className="w-full rounded-xl border-2 border-teal-200 px-4 py-3 text-lg font-bold focus:border-teal-400 focus:outline-none"
                >
                  {category.units.map((u, i) => (
                    <option key={i} value={i}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 p-4 text-center">
                <div className="text-sm text-slate-500">换算结果</div>
                <div className="text-3xl font-extrabold text-teal-700">
                  {inputValue} {category.units[fromUnit].name} = {parseFloat(convertedValue.toFixed(6))} {category.units[toUnit].name}
                </div>
              </div>
            </div>

            {/* 进率表 */}
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="mb-3 font-bold text-slate-700">📊 {category.name}进率表</h3>
              <div className="space-y-2">
                {category.units.slice(0, -1).map((u, i) => {
                  const next = category.units[i + 1]
                  const ratio = u.factor / next.factor
                  return (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="font-medium text-slate-700">1 {u.name}</span>
                      <span className="text-lg font-bold text-teal-600">= {ratio}</span>
                      <span className="font-medium text-slate-700">{ratio} {next.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {mode === 'quiz' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-700">单位换算练习</h2>
                <span className="text-sm text-slate-500">得分: {score}/{total}</span>
              </div>
              <div className="mb-6 text-center">
                <div className="text-3xl font-extrabold text-slate-800">
                  {quizValue} {category.units[quizFrom].name} = ? {category.units[quizTo].name}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkQuizAnswer()}
                  className="w-40 rounded-xl border-2 border-teal-200 px-4 py-3 text-center text-2xl font-bold focus:border-teal-400 focus:outline-none"
                  placeholder="?"
                  autoFocus
                />
                <button onClick={checkQuizAnswer} disabled={!userAnswer} className="rounded-xl bg-teal-500 px-6 py-3 font-bold text-white disabled:opacity-50">
                  确认
                </button>
              </div>
              {quizResult && (
                <div className={`mt-4 rounded-xl p-3 text-center font-bold ${quizResult === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {quizResult === 'correct' ? '✅ 正确！' : `❌ 正确答案是 ${parseFloat(convert(quizValue, quizFrom, quizTo).toFixed(4))}`}
                </div>
              )}
            </div>
            <button onClick={generateQuiz} className="w-full rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 py-4 text-xl font-bold text-white shadow-lg">
              下一题
            </button>
          </div>
        )}

        {/* 提示 */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4">
          <h3 className="mb-2 font-bold text-amber-800">💡 换算口诀</h3>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• <strong>大化小，乘进率</strong>（如 3米→厘米，3×100=300）</li>
            <li>• <strong>小化大，除以进率</strong>（如 500厘米→米，500÷100=5）</li>
            <li>• 记住常用进率：1米=100厘米，1千克=1000克，1时=60分</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
