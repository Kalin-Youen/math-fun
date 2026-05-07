'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, RotateCcw, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

interface Step {
  label: string
  carry?: number
  borrow?: number
}

function generateCalc(operator: '+' | '-' | '×') {
  let num1: number, num2: number, answer: number
  if (operator === '+') {
    num1 = Math.floor(Math.random() * 400) + 100
    num2 = Math.floor(Math.random() * 400) + 100
    answer = num1 + num2
  } else if (operator === '-') {
    num1 = Math.floor(Math.random() * 400) + 200
    num2 = Math.floor(Math.random() * 200) + 100
    answer = num1 - num2
  } else {
    num1 = Math.floor(Math.random() * 30) + 10
    num2 = Math.floor(Math.random() * 9) + 2
    answer = num1 * num2
  }
  return { num1, num2, answer }
}

function getSteps(num1: number, num2: number, answer: number, operator: '+' | '-' | '×'): Step[] {
  const steps: Step[] = []
  const n1Str = num1.toString()
  const n2Str = num2.toString()
  const aStr = answer.toString()
  const maxLen = Math.max(n1Str.length, n2Str.length, aStr.length)

  if (operator === '+') {
    for (let i = 0; i < maxLen; i++) {
      const d1 = parseInt(n1Str[n1Str.length - 1 - i] || '0')
      const d2 = parseInt(n2Str[n2Str.length - 1 - i] || '0')
      const sum = d1 + d2 + (steps[i - 1]?.carry || 0)
      const carry = Math.floor(sum / 10)
      steps.push({
        label: `${d1} + ${d2}${steps[i - 1]?.carry ? ` + ${steps[i - 1].carry}(进位)` : ''} = ${sum % 10}${carry ? `，进 ${carry}` : ''}`,
        carry,
      })
    }
  } else if (operator === '-') {
    for (let i = 0; i < maxLen; i++) {
      const d1 = parseInt(n1Str[n1Str.length - 1 - i] || '0')
      const d2 = parseInt(n2Str[n2Str.length - 1 - i] || '0')
      let actualD1 = d1
      let borrow = 0
      if (d1 < d2 + (steps[i - 1]?.borrow || 0)) {
        actualD1 = d1 + 10
        borrow = 1
      }
      const diff = actualD1 - d2 - (steps[i - 1]?.borrow || 0)
      steps.push({
        label: `${actualD1 === d1 ? d1 : `${d1}+10(借位)`} - ${d2}${steps[i - 1]?.borrow ? ` - ${steps[i - 1].borrow}(借位)` : ''} = ${diff}${borrow ? `，借 1` : ''}`,
        borrow,
      })
    }
  } else {
    const partials: number[] = []
    for (let i = 0; i < n2Str.length; i++) {
      const d2 = parseInt(n2Str[n2Str.length - 1 - i])
      const partial = num1 * d2
      partials.unshift(partial)
      steps.push({
        label: `${num1} × ${d2} = ${partial}${i > 0 ? `（左移${i}位）` : ''}`,
      })
    }
  }

  return steps
}

export default function ColumnCalcPage() {
  const [operator, setOperator] = useState<'+' | '-' | '×'>('+')
  const [calc, setCalc] = useState({ num1: 0, num2: 0, answer: 0 })
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('column-calc')
    newCalc()
  }, [trackVisit])

  const newCalc = () => {
    const c = generateCalc(operator)
    setCalc(c)
    setSteps(getSteps(c.num1, c.num2, c.answer, operator))
    setCurrentStep(-1)
    setIsPlaying(false)
  }

  const play = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsPlaying(false)
    }
  }

  const n1Str = calc.num1.toString()
  const n2Str = calc.num2.toString()
  const aStr = calc.answer.toString()
  const maxLen = Math.max(n1Str.length, n2Str.length, aStr.length)

  const renderDigit = (digit: string, colIndex: number, highlight: boolean) => {
    const isCarry = highlight && currentStep >= 0 && steps[currentStep]?.carry && colIndex === currentStep
    const isBorrow = highlight && currentStep >= 0 && steps[currentStep]?.borrow && colIndex === currentStep
    return (
      <span
        className={`inline-block w-8 text-center font-mono text-lg ${
          highlight && colIndex === currentStep
            ? 'text-indigo-600 font-bold scale-110'
            : 'text-slate-700'
        } ${isCarry ? 'text-red-500' : ''} ${isBorrow ? 'text-orange-500' : ''}`}
      >
        {digit}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📐 竖式计算演示</h1>
          <div className="w-20" />
        </header>

        {/* 运算选择 */}
        <div className="mb-6 flex justify-center gap-3">
          {(['+', '-', '×'] as const).map((op) => (
            <button
              key={op}
              onClick={() => { setOperator(op); newCalc() }}
              className={`rounded-xl px-6 py-3 text-xl font-bold transition ${
                operator === op
                  ? 'bg-gradient-to-r from-indigo-400 to-violet-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        {/* 竖式展示 */}
        <div className="mb-6 rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 text-center font-mono">
            {/* 第一行：被加/被减/被乘数 */}
            <div className="flex justify-end">
              {Array.from({ length: maxLen - n1Str.length }, (_, i) => (
                <span key={`e1-${i}`} className="inline-block w-8 text-center font-mono text-lg text-slate-300">0</span>
              ))}
              {n1Str.split('').map((d, i) => renderDigit(d, n1Str.length - 1 - i, false))}
            </div>

            {/* 第二行：运算符 + 第二个数 */}
            <div className="flex justify-end">
              <span className="inline-block w-8 text-center font-mono text-lg text-indigo-600 font-bold">{operator}</span>
              {Array.from({ length: maxLen - n2Str.length }, (_, i) => (
                <span key={`e2-${i}`} className="inline-block w-8 text-center font-mono text-lg text-slate-300">0</span>
              ))}
              {n2Str.split('').map((d, i) => renderDigit(d, n2Str.length - 1 - i, false))}
            </div>

            {/* 分隔线 */}
            <div className="my-2 border-t-2 border-slate-800" />

            {/* 乘法：部分积 */}
            {operator === '×' && (
              <div className="space-y-1">
                {Array.from({ length: n2Str.length }, (_, rowIdx) => {
                  const d2 = parseInt(n2Str[n2Str.length - 1 - rowIdx])
                  const partial = (calc.num1 * d2).toString()
                  const isActive = currentStep === rowIdx
                  return (
                    <div key={rowIdx} className={`flex justify-end transition ${isActive ? 'bg-indigo-50 rounded-lg' : ''}`}>
                      {Array.from({ length: maxLen - partial.length - rowIdx }, (_, i) => (
                        <span key={`ep-${rowIdx}-${i}`} className="inline-block w-8 text-center font-mono text-lg text-slate-300">0</span>
                      ))}
                      {partial.split('').map((d, i) => (
                        <span key={`pd-${rowIdx}-${i}`} className={`inline-block w-8 text-center font-mono text-lg ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>{d}</span>
                      ))}
                    </div>
                  )
                })}
                <div className="my-2 border-t-2 border-slate-800" />
              </div>
            )}

            {/* 结果行 */}
            <div className="flex justify-end">
              {Array.from({ length: maxLen - aStr.length }, (_, i) => (
                <span key={`e3-${i}`} className="inline-block w-8 text-center font-mono text-lg text-slate-300">0</span>
              ))}
              {aStr.split('').map((d, i) => {
                const colIdx = aStr.length - 1 - i
                const isHighlight = isPlaying && currentStep >= 0 && colIdx === currentStep
                return (
                  <span
                    key={`a-${i}`}
                    className={`inline-block w-8 text-center font-mono text-lg transition ${
                      isHighlight ? 'text-indigo-600 font-bold scale-110' : 'text-slate-800 font-bold'
                    }`}
                  >
                    {d}
                  </span>
                )
              })}
            </div>
          </div>

          {/* 进位/借位提示 */}
          {isPlaying && currentStep >= 0 && steps[currentStep] && (
            <div className="mt-4 rounded-xl bg-indigo-50 p-4 text-center">
              <div className="text-sm text-indigo-600">
                第 {currentStep + 1} 步（从右往左第 {currentStep + 1} 位）
              </div>
              <div className="mt-1 text-lg font-bold text-indigo-800">
                {steps[currentStep].label}
              </div>
              {steps[currentStep].carry && (
                <div className="mt-2 text-sm text-red-500">
                  ⬆️ 向高位进 {steps[currentStep].carry}
                </div>
              )}
              {steps[currentStep].borrow && (
                <div className="mt-2 text-sm text-orange-500">
                  ⬅️ 向高位借 1
                </div>
              )}
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="mb-6 flex justify-center gap-3">
          <button onClick={newCalc} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-slate-700 shadow-md transition hover:bg-slate-50">
            <RotateCcw className="h-5 w-5" />
            换一题
          </button>
          {!isPlaying ? (
            <button onClick={play} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 to-violet-500 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl">
              <Play className="h-5 w-5" />
              开始演示
            </button>
          ) : (
            <button onClick={nextStep} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 to-violet-500 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl">
              {currentStep < steps.length - 1 ? (
                <>下一步 <ChevronRight className="h-5 w-5" /></>
              ) : (
                '演示完成 ✓'
              )}
            </button>
          )}
        </div>

        {/* 步骤列表 */}
        <div className="rounded-2xl bg-white p-4 shadow-lg">
          <h3 className="mb-3 font-bold text-slate-700">📝 计算步骤</h3>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-3 transition ${
                  currentStep === i ? 'bg-indigo-100' : currentStep > i ? 'bg-green-50' : 'bg-slate-50'
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  currentStep === i ? 'bg-indigo-500 text-white' : currentStep > i ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {currentStep > i ? '✓' : i + 1}
                </span>
                <span className="text-sm text-slate-700">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4">
          <h3 className="mb-2 font-bold text-amber-800">💡 竖式计算要点</h3>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• <strong>相同数位对齐</strong>：个位对个位，十位对十位</li>
            <li>• <strong>从个位算起</strong>：从右往左依次计算</li>
            <li>• 加法：<strong>满十进一</strong>，减法：<strong>退一当十</strong></li>
            <li>• 乘法：用乘数的每一位分别去乘被乘数</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
