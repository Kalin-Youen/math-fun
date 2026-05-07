'use client'

import { useState, useCallback, useEffect } from 'react'
import { Check, X, RotateCcw, Trophy, Lightbulb } from 'lucide-react'

interface MoneyCalculatorProps {
  maxAmount?: number
}

const COINS = [
  { value: 1, emoji: '🪙', name: '1元' },
  { value: 0.5, emoji: '🪙', name: '5角' },
  { value: 0.1, emoji: '🪙', name: '1角' },
]

export default function MoneyCalculator({ maxAmount = 20 }: MoneyCalculatorProps) {
  const [targetAmount, setTargetAmount] = useState(5)
  const [currentAmount, setCurrentAmount] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [mode, setMode] = useState<'make' | 'calculate'>('make')
  const [selectedCoins, setSelectedCoins] = useState<number[]>([])

  const generateProblem = useCallback(() => {
    const amount = Math.floor(Math.random() * maxAmount) + 1
    setTargetAmount(amount)
    setCurrentAmount(0)
    setSelectedCoins([])
    setShowResult(null)
    setMode(Math.random() > 0.5 ? 'make' : 'calculate')
  }, [maxAmount])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const addCoin = (value: number) => {
    if (showResult) return
    
    const newAmount = currentAmount + value
    setCurrentAmount(newAmount)
    setSelectedCoins([...selectedCoins, value])
    
    // 检查是否达到目标
    if (Math.abs(newAmount - targetAmount) < 0.01) {
      setScore(s => s + 10)
      setShowResult('correct')
      setTimeout(generateProblem, 1500)
    } else if (newAmount > targetAmount) {
      setShowResult('wrong')
      setTimeout(() => {
        setCurrentAmount(0)
        setSelectedCoins([])
        setShowResult(null)
      }, 1500)
    }
  }

  const reset = () => {
    setCurrentAmount(0)
    setSelectedCoins([])
    setShowResult(null)
  }

  return (
    <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-green-800">💰 人民币计算</h3>
          <p className="text-sm text-green-600">
            {mode === 'make' ? '凑出指定金额' : '计算总金额'}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="mb-4 text-6xl">💵</div>
        <p className="text-lg font-bold text-green-800">
          目标金额: <span className="text-3xl text-green-600">{targetAmount}</span> 元
        </p>
        <p className="mt-2 text-2xl font-bold text-green-700">
          当前: {currentAmount.toFixed(1)} 元
        </p>
      </div>

      {/* 已选硬币显示 */}
      {selectedCoins.length > 0 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {selectedCoins.map((coin, i) => (
            <span key={i} className="text-2xl">
              {coin >= 1 ? '🪙' : '💰'}
            </span>
          ))}
        </div>
      )}

      {/* 硬币按钮 */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {COINS.map((coin) => (
          <button
            key={coin.value}
            onClick={() => addCoin(coin.value)}
            disabled={showResult !== null}
            className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-md transition hover:scale-105 hover:bg-green-100 disabled:opacity-50"
          >
            <span className="text-3xl">{coin.emoji}</span>
            <span className="text-sm font-bold text-green-700">{coin.name}</span>
          </button>
        ))}
      </div>

      {showResult === 'correct' && (
        <div className="rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 回答正确！+10分</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 超过了目标金额！</p>
          <p className="text-sm">当前: {currentAmount.toFixed(1)}元，目标: {targetAmount}元</p>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          重置
        </button>
        <button
          onClick={generateProblem}
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
