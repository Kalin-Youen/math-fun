'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

export default function FractionsPage() {
  const [numerator, setNumerator] = useState(3)
  const [denominator, setDenominator] = useState(8)
  const [compareNum, setCompareNum] = useState(1)
  const [compareDen, setCompareDen] = useState(2)
  const [mode, setMode] = useState<'visualize' | 'compare' | 'equivalent'>('visualize')
  const { trackVisit } = useAchievements()

  useEffect(() => { trackVisit('fractions') }, [trackVisit])

  const fraction = numerator / denominator
  const compareVal = compareNum / compareDen

  const renderCircle = (num: number, den: number, size = 160, color = 'fill-amber-400') => {
    const segments = []
    for (let i = 0; i < den; i++) {
      const filled = i < num
      const startAngle = (i * 360) / den - 90
      const endAngle = ((i + 1) * 360) / den - 90
      const largeArc = (endAngle - startAngle) > 180 ? 1 : 0
      const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180)
      const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180)
      const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180)
      const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180)
      segments.push(
        <path
          key={i}
          d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
          className={filled ? color : 'fill-slate-100 stroke-slate-300'}
          strokeWidth="0.5"
        />
      )
    }
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-md">
        {segments}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1.5" />
      </svg>
    )
  }

  const renderBar = (num: number, den: number, width = 300, height = 40, color = 'bg-amber-400') => {
    const segmentWidth = width / den
    return (
      <div className="flex overflow-hidden rounded-lg border-2 border-slate-300" style={{ width, height }}>
        {Array.from({ length: den }, (_, i) => (
          <div
            key={i}
            className={`${i < num ? color : 'bg-slate-100'} border-r border-slate-200`}
            style={{ width: segmentWidth }}
          />
        ))}
      </div>
    )
  }

  const commonDenominator = (den1: number, den2: number): number => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    return (den1 * den2) / gcd(den1, den2)
  }

  const cd = commonDenominator(denominator, compareDen)
  const eqNum1 = numerator * (cd / denominator)
  const eqNum2 = compareNum * (cd / compareDen)

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🥧 分数可视化</h1>
          <div className="w-20" />
        </header>

        {/* 模式切换 */}
        <div className="mb-6 flex justify-center gap-2">
          {([
            { key: 'visualize', label: '认识分数' },
            { key: 'compare', label: '比大小' },
            { key: 'equivalent', label: '等价分数' },
          ] as const).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-xl px-4 py-2 font-medium transition ${
                mode === m.key ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md' : 'bg-white text-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'visualize' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-center text-xl font-bold text-slate-700">调整分数，观察变化</h2>
              <div className="mb-6 flex flex-col items-center gap-4">
                <div className="text-5xl font-extrabold text-amber-600">
                  {numerator} / {denominator}
                </div>
                <div className="text-2xl text-slate-500">= {fraction.toFixed(4)}</div>
              </div>

              <div className="flex flex-col items-center gap-6">
                {renderCircle(numerator, denominator, 200)}
                {renderBar(numerator, denominator, 320, 50)}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-center text-sm font-bold text-slate-600">分子（取的份数）</label>
                  <input
                    type="range" min={0} max={denominator}
                    value={numerator}
                    onChange={(e) => setNumerator(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0</span><span>{denominator}</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-center text-sm font-bold text-slate-600">分母（平均分成几份）</label>
                  <input
                    type="range" min={2} max={12}
                    value={denominator}
                    onChange={(e) => { setDenominator(parseInt(e.target.value)); if (numerator > parseInt(e.target.value)) setNumerator(parseInt(e.target.value)) }}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span><span>12</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <h3 className="mb-2 font-bold text-amber-800">💡 分数小知识</h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• <strong>分母</strong>：把整体平均分成几份</li>
                <li>• <strong>分子</strong>：取了其中的几份</li>
                <li>• 必须是<strong>平均分</strong>才能用分数表示</li>
                <li>• 分子越大，取的份数越多；分母越大，每份越小</li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'compare' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-center text-xl font-bold text-slate-700">比较两个分数的大小</h2>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{compareNum}/{compareDen}</div>
                  {renderCircle(compareNum, compareDen, 140, 'fill-blue-400')}
                  {renderBar(compareNum, compareDen, 200, 36, 'bg-blue-400')}
                </div>
                <div className="text-4xl font-bold text-slate-400">
                  {fraction > compareVal ? '>' : fraction < compareVal ? '<' : '='}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{numerator}/{denominator}</div>
                  {renderCircle(numerator, denominator, 140, 'fill-amber-400')}
                  {renderBar(numerator, denominator, 200, 36, 'bg-amber-400')}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 font-bold text-slate-700">调整分数进行对比</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 text-center font-bold text-blue-600">蓝色分数</div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600">分子: {compareNum}</label>
                    <input type="range" min={0} max={compareDen} value={compareNum} onChange={(e) => setCompareNum(parseInt(e.target.value))} className="w-full accent-blue-500" />
                    <label className="text-sm text-slate-600">分母: {compareDen}</label>
                    <input type="range" min={2} max={12} value={compareDen} onChange={(e) => { setCompareDen(parseInt(e.target.value)); if (compareNum > parseInt(e.target.value)) setCompareNum(parseInt(e.target.value)) }} className="w-full accent-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-center font-bold text-amber-600">橙色分数</div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600">分子: {numerator}</label>
                    <input type="range" min={0} max={denominator} value={numerator} onChange={(e) => setNumerator(parseInt(e.target.value))} className="w-full accent-amber-500" />
                    <label className="text-sm text-slate-600">分母: {denominator}</label>
                    <input type="range" min={2} max={12} value={denominator} onChange={(e) => { setDenominator(parseInt(e.target.value)); if (numerator > parseInt(e.target.value)) setNumerator(parseInt(e.target.value)) }} className="w-full accent-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'equivalent' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-center text-xl font-bold text-slate-700">等价分数（通分）</h2>
              <div className="mb-4 text-center">
                <span className="text-2xl font-bold text-blue-600">{compareNum}/{compareDen}</span>
                <span className="mx-3 text-xl text-slate-400">=</span>
                <span className="text-2xl font-bold text-amber-600">{eqNum1}/{cd}</span>
              </div>
              <div className="mb-4 text-center">
                <span className="text-2xl font-bold text-violet-600">{numerator}/{denominator}</span>
                <span className="mx-3 text-xl text-slate-400">=</span>
                <span className="text-2xl font-bold text-amber-600">{eqNum2}/{cd}</span>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600 mb-2">{compareNum}/{compareDen}</div>
                  {renderCircle(compareNum, compareDen, 120, 'fill-blue-400')}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-amber-600 mb-2">{eqNum1}/{cd}</div>
                  {renderCircle(eqNum1, cd, 120, 'fill-amber-400')}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-violet-600 mb-2">{eqNum2}/{cd}</div>
                  {renderCircle(eqNum2, cd, 120, 'fill-violet-400')}
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-green-50 p-3 text-center text-sm text-green-700">
                通分后分母都是 <strong>{cd}</strong>，现在可以直接比较分子大小！
                {eqNum1 > eqNum2 ? ` ${compareNum}/${compareDen} > ${numerator}/${denominator}` : eqNum1 < eqNum2 ? ` ${compareNum}/${compareDen} < ${numerator}/${denominator}` : ` ${compareNum}/${compareDen} = ${numerator}/${denominator}`}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <h3 className="mb-2 font-bold text-amber-800">💡 什么是通分？</h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• 通分就是把不同分母的分数变成<strong>相同分母</strong>的分数</li>
                <li>• 先找到两个分母的<strong>最小公倍数</strong>作为公分母</li>
                <li>• 然后分子分母同时乘以相同的数</li>
                <li>• 通分后分母相同，只需比较分子</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
