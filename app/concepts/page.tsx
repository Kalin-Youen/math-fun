'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'

type ConceptMode = 'place-value' | 'equivalent-fractions' | 'area-model' | 'number-bonds'

export default function ConceptsPage() {
  const [mode, setMode] = useState<ConceptMode>('place-value')
  const [pvNumber, setPvNumber] = useState(0)
  const [fracNum, setFracNum] = useState(1)
  const [fracDen, setFracDen] = useState(2)
  const [areaA, setAreaA] = useState(3)
  const [areaB, setAreaB] = useState(4)
  const [bondTotal, setBondTotal] = useState(10)
  const [bondPart, setBondPart] = useState(3)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('concepts')
  }, [trackVisit])

  useEffect(() => {
    setPvNumber(Math.floor(Math.random() * 9000) + 1000)
  }, [])

  const MODES: { key: ConceptMode; label: string; emoji: string; desc: string }[] = [
    { key: 'place-value', label: '位值模型', emoji: '🔢', desc: '千/百/十/个位各代表多少' },
    { key: 'equivalent-fractions', label: '等价分数', emoji: '🥧', desc: '不同分数表示相同的量' },
    { key: 'area-model', label: '面积模型', emoji: '📐', desc: '用面积理解乘法和分数' },
    { key: 'number-bonds', label: '数的组成', emoji: '🧩', desc: '数可以拆成哪些组合' },
  ]

  const renderPlaceValue = () => {
    const digits = pvNumber.toString().split('').map(Number)
    const posNames = ['千', '百', '十', '个']
    const posValues = digits.map((d, i) => d * Math.pow(10, 3 - i))

    return (
      <div>
        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl font-black text-slate-800">{pvNumber}</div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPvNumber(Math.max(1000, pvNumber - 1))}
              className="rounded-lg bg-slate-100 px-3 py-1 text-lg font-bold text-slate-500 hover:bg-slate-200"
            >
              -
            </button>
            <input
              type="range"
              min={1000}
              max={9999}
              value={pvNumber}
              onChange={(e) => setPvNumber(parseInt(e.target.value))}
              className="w-48 accent-violet-500"
            />
            <button
              onClick={() => setPvNumber(Math.min(9999, pvNumber + 1))}
              className="rounded-lg bg-slate-100 px-3 py-1 text-lg font-bold text-slate-500 hover:bg-slate-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {digits.map((d, i) => (
            <div key={i} className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 text-center">
              <div className="mb-1 text-xs font-bold text-violet-500">{posNames[i]}位</div>
              <div className="mb-2 text-4xl font-black text-violet-700">{d}</div>
              <div className="text-sm font-bold text-violet-600">= {posValues[i]}</div>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {Array.from({ length: Math.min(d, 9) }, (_, j) => (
                  <div key={j} className="h-3 w-3 rounded-sm bg-violet-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-violet-50 border border-violet-200 p-3 text-center text-sm text-violet-700">
          {posValues.join(' + ')} = {pvNumber}
        </div>
      </div>
    )
  }

  const renderEquivalentFractions = () => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const g = gcd(fracNum, fracDen)
    const simpNum = fracNum / g
    const simpDen = fracDen / g

    const equivalents: { num: number; den: number }[] = []
    for (let m = 1; m <= 4; m++) {
      equivalents.push({ num: simpNum * m, den: simpDen * m })
    }

    return (
      <div>
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl font-black text-orange-600">
            {fracNum}/{fracDen}
          </div>
          {g > 1 && (
            <div className="text-sm text-slate-500">
              化简 = <span className="font-bold text-emerald-600">{simpNum}/{simpDen}</span>
            </div>
          )}
        </div>

        <div className="mb-6 space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            分子：{fracNum}
          </label>
          <input
            type="range"
            min={1}
            max={fracDen - 1}
            value={fracNum}
            onChange={(e) => setFracNum(parseInt(e.target.value))}
            className="w-full accent-orange-500"
          />
          <label className="block text-sm font-bold text-slate-700">
            分母：{fracDen}
          </label>
          <input
            type="range"
            min={2}
            max={12}
            value={fracDen}
            onChange={(e) => {
              const d = parseInt(e.target.value)
              setFracDen(d)
              if (fracNum >= d) setFracNum(d - 1)
            }}
            className="w-full accent-amber-500"
          />
        </div>

        <div className="mb-4 text-center text-sm font-bold text-slate-700">等价分数</div>
        <div className="flex flex-wrap justify-center gap-3">
          {equivalents.map((eq, i) => (
            <div
              key={i}
              className={`rounded-2xl border-2 p-4 text-center ${
                eq.num === fracNum && eq.den === fracDen
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-2 text-2xl font-black text-slate-800">
                {eq.num}/{eq.den}
              </div>
              <div className="h-6 w-24 overflow-hidden rounded-lg border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400"
                  style={{ width: `${(eq.num / eq.den) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-3 text-center text-sm text-orange-700">
          💡 等价分数看起来不同，但表示的量相同！分子分母同时乘以相同的数
        </div>
      </div>
    )
  }

  const renderAreaModel = () => {
    const total = areaA * areaB
    return (
      <div>
        <div className="mb-6 text-center">
          <div className="text-4xl font-black text-slate-800">
            {areaA} × {areaB} = <span className="text-emerald-600">{total}</span>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <label className="block text-sm font-bold text-slate-700">行数（乘数）：{areaA}</label>
          <input
            type="range"
            min={1}
            max={9}
            value={areaA}
            onChange={(e) => setAreaA(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <label className="block text-sm font-bold text-slate-700">列数（被乘数）：{areaB}</label>
          <input
            type="range"
            min={1}
            max={9}
            value={areaB}
            onChange={(e) => setAreaB(parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
        </div>

        <div className="flex justify-center">
          <div className="inline-block rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-2">
            <div className="mb-1 flex">
              <div className="w-8" />
              {Array.from({ length: areaB }, (_, i) => (
                <div key={i} className="flex w-10 items-center justify-center text-xs font-bold text-emerald-600">
                  {i + 1}
                </div>
              ))}
            </div>
            {Array.from({ length: areaA }, (_, r) => (
              <div key={r} className="flex items-center">
                <div className="flex w-8 items-center justify-center text-xs font-bold text-emerald-600">
                  {r + 1}
                </div>
                {Array.from({ length: areaB }, (_, c) => (
                  <div
                    key={c}
                    className="m-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 to-teal-300 text-sm font-bold text-white shadow-sm transition-all duration-200"
                  >
                    {(r + 1) * (c + 1) <= 9 ? (r + 1) * (c + 1) : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-sm text-emerald-700">
          💡 面积模型：{areaA}行 × {areaB}列 = {total}个小格子，乘法就是数面积！
        </div>
      </div>
    )
  }

  const renderNumberBonds = () => {
    const other = bondTotal - bondPart
    const bonds: [number, number][] = []
    for (let i = 0; i <= bondTotal; i++) {
      bonds.push([i, bondTotal - i])
    }

    return (
      <div>
        <div className="mb-6 text-center">
          <div className="mb-2 text-lg text-slate-600">数的组成</div>
          <svg viewBox="0 0 300 160" className="mx-auto h-40 w-72">
            <circle cx={150} cy={30} r={28} fill="#f1f5f9" stroke="#6366f1" strokeWidth="3" />
            <text x={150} y={35} textAnchor="middle" className="text-2xl font-bold" fill="#4f46e5">
              {bondTotal}
            </text>
            <line x1={135} y1={55} x2={80} y2={110} stroke="#a5b4fc" strokeWidth="3" />
            <line x1={165} y1={55} x2={220} y2={110} stroke="#a5b4fc" strokeWidth="3" />
            <circle cx={80} cy={130} r={28} fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
            <text x={80} y={135} textAnchor="middle" className="text-2xl font-bold" fill="#d97706">
              {bondPart}
            </text>
            <circle cx={220} cy={130} r={28} fill="#dcfce7" stroke="#22c55e" strokeWidth="3" />
            <text x={220} y={135} textAnchor="middle" className="text-2xl font-bold" fill="#16a34a">
              {other}
            </text>
          </svg>
        </div>

        <div className="mb-4 space-y-2">
          <label className="block text-sm font-bold text-slate-700">总数：{bondTotal}</label>
          <input
            type="range"
            min={2}
            max={20}
            value={bondTotal}
            onChange={(e) => {
              const t = parseInt(e.target.value)
              setBondTotal(t)
              if (bondPart >= t) setBondPart(t - 1)
            }}
            className="w-full accent-indigo-500"
          />
          <label className="block text-sm font-bold text-slate-700">其中一部分：{bondPart}</label>
          <input
            type="range"
            min={0}
            max={bondTotal}
            value={bondPart}
            onChange={(e) => setBondPart(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div className="mb-2 text-center text-sm font-bold text-slate-700">{bondTotal} 的所有组成</div>
        <div className="flex flex-wrap justify-center gap-2">
          {bonds.map(([a, b], i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-1 text-sm font-medium ${
                a === bondPart || b === bondPart
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300'
                  : 'bg-slate-50 text-slate-500'
              }`}
            >
              {a} + {b}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-center text-sm text-indigo-700">
          💡 数的组成：{bondTotal} 可以拆成 {bondPart} 和 {other}，{bondPart} + {other} = {bondTotal}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <Home className="h-4 w-4" />
            首页
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="mb-2 text-5xl animate-float">💡</div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-800">抽象概念可视化</h1>
          <p className="text-slate-500">把抽象数学概念变成看得见的图！</p>
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === m.key
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'bg-white/70 text-slate-500 hover:bg-white'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
          <div className="mb-2 text-center text-sm font-bold text-violet-600">
            {MODES.find((m) => m.key === mode)?.desc}
          </div>
          {mode === 'place-value' && renderPlaceValue()}
          {mode === 'equivalent-fractions' && renderEquivalentFractions()}
          {mode === 'area-model' && renderAreaModel()}
          {mode === 'number-bonds' && renderNumberBonds()}
        </div>
      </div>
    </main>
  )
}
