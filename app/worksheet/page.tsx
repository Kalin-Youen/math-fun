'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Printer, RotateCcw, Download } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

interface WorksheetQuestion {
  question: string
  answer: string
}

type OpType = '+' | '-' | '×' | '÷'

function generateQuestions(
  count: number,
  ops: OpType[],
  maxNum: number,
  includeBlank: boolean
): WorksheetQuestion[] {
  const questions: WorksheetQuestion[] = []
  for (let i = 0; i < count; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)]
    let num1: number, num2: number, answer: number

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * maxNum) + 1
        num2 = Math.floor(Math.random() * maxNum) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * maxNum) + 1
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 2
        num2 = Math.floor(Math.random() * Math.min(maxNum, 12)) + 2
        answer = num1 * num2
        break
      case '÷':
        num2 = Math.floor(Math.random() * 9) + 2
        answer = Math.floor(Math.random() * Math.min(maxNum, 12)) + 1
        num1 = num2 * answer
        break
      default:
        num1 = 1; num2 = 1; answer = 2
    }

    if (includeBlank && Math.random() > 0.5) {
      // Fill in the blank: __ op num2 = answer
      questions.push({
        question: `____ ${op} ${num2} = ${answer}`,
        answer: `${num1}`,
      })
    } else {
      questions.push({
        question: `${num1} ${op} ${num2} = ____`,
        answer: `${answer}`,
      })
    }
  }
  return questions
}

export default function WorksheetPage() {
  const [count, setCount] = useState(20)
  const [ops, setOps] = useState<OpType[]>(['+', '-'])
  const [maxNum, setMaxNum] = useState(100)
  const [includeBlank, setIncludeBlank] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [title, setTitle] = useState('数学练习')
  const [questions, setQuestions] = useState<WorksheetQuestion[]>([])
  const printRef = useRef<HTMLDivElement>(null)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('worksheet')
    generate()
  }, [trackVisit])

  const generate = () => {
    setQuestions(generateQuestions(count, ops, maxNum, includeBlank))
    setShowAnswers(false)
  }

  const toggleOp = (op: OpType) => {
    setOps(prev => prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op])
  }

  const handlePrint = () => {
    window.print()
  }

  const opLabel = (op: OpType) => {
    switch (op) {
      case '+': return '加法'
      case '-': return '减法'
      case '×': return '乘法'
      case '÷': return '除法'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🖨️ 打印练习册</h1>
          <div className="w-20" />
        </header>

        {/* 设置面板 */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-bold text-slate-700">⚙️ 练习设置</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* 标题 */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">练习标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-slate-400 focus:outline-none"
              />
            </div>

            {/* 题目数量 */}
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">题目数量: {count}</label>
              <input
                type="range" min={5} max={50} step={5}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-slate-500"
              />
              <div className="flex justify-between text-xs text-slate-400"><span>5</span><span>50</span></div>
            </div>

            {/* 数值范围 */}
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">数值范围: 1~{maxNum}</label>
              <input
                type="range" min={10} max={1000} step={10}
                value={maxNum}
                onChange={(e) => setMaxNum(parseInt(e.target.value))}
                className="w-full accent-slate-500"
              />
              <div className="flex justify-between text-xs text-slate-400"><span>10</span><span>1000</span></div>
            </div>

            {/* 运算类型 */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-600">运算类型</label>
              <div className="flex gap-2">
                {(['+', '-', '×', '÷'] as OpType[]).map((op) => (
                  <button
                    key={op}
                    onClick={() => toggleOp(op)}
                    className={`rounded-xl px-4 py-2 text-lg font-bold transition ${
                      ops.includes(op)
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {op} {opLabel(op)}
                  </button>
                ))}
              </div>
            </div>

            {/* 填空模式 */}
            <div className="sm:col-span-2 flex items-center gap-3">
              <label className="text-sm font-bold text-slate-600">包含填空题（求未知数）</label>
              <button
                onClick={() => setIncludeBlank(!includeBlank)}
                className={`relative h-6 w-11 rounded-full transition ${includeBlank ? 'bg-slate-800' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${includeBlank ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={generate} className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700">
              <RotateCcw className="h-4 w-4" />
              重新生成
            </button>
            <button onClick={() => setShowAnswers(!showAnswers)} className={`rounded-xl px-4 py-3 font-medium transition ${showAnswers ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {showAnswers ? '隐藏答案' : '显示答案'}
            </button>
          </div>
        </div>

        {/* 练习册预览 */}
        <div ref={printRef} className="rounded-3xl bg-white p-8 shadow-xl print:shadow-none print:rounded-none print:p-4">
          {/* 标题区域 */}
          <div className="mb-6 border-b-2 border-slate-800 pb-4">
            <h2 className="text-center text-2xl font-bold text-slate-800">{title}</h2>
            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>姓名：___________</span>
              <span>日期：___________</span>
              <span>用时：___________</span>
              <span>得分：___________</span>
            </div>
          </div>

          {/* 题目网格 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="shrink-0 text-sm font-bold text-slate-400">{i + 1}.</span>
                <span className="text-lg font-medium text-slate-800">{q.question}</span>
                {showAnswers && (
                  <span className="shrink-0 text-sm font-bold text-green-600">[{q.answer}]</span>
                )}
              </div>
            ))}
          </div>

          {/* 底部 */}
          <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400 print:block hidden">
            数学乐园 - 小学数学练习
          </div>
        </div>

        {/* 答案区域（仅打印时显示） */}
        {showAnswers && (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 print:bg-white print:p-2">
            <h3 className="mb-2 font-bold text-green-800">📋 参考答案</h3>
            <div className="grid grid-cols-4 gap-2 text-sm text-green-700 sm:grid-cols-6 lg:grid-cols-8">
              {questions.map((q, i) => (
                <span key={i}>{i + 1}. {q.answer}</span>
              ))}
            </div>
          </div>
        )}

        {/* 打印按钮 */}
        <div className="mt-6 flex justify-center gap-3 print:hidden">
          <button onClick={handlePrint} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl">
            <Printer className="h-5 w-5" />
            打印练习
          </button>
        </div>

        {/* 提示 */}
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 print:hidden">
          <h3 className="mb-2 font-bold text-amber-800">💡 使用说明</h3>
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• 选择运算类型和难度，点击"重新生成"刷新题目</li>
            <li>• 点击"打印练习"可直接打印或保存为PDF</li>
            <li>• 打印前可先"显示答案"核对，答案不会打印在练习上</li>
            <li>• 建议根据学生年级选择合适的数值范围</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
