'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Check, X, Shuffle } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

interface FlashCard {
  id: string
  front: string
  back: string
  category: string
}

const MULTIPLICATION_CARDS: FlashCard[] = Array.from({ length: 45 }, (_, i) => {
  const a = Math.floor(i / 9) + 2
  const b = (i % 9) + 2
  return {
    id: `mul-${a}-${b}`,
    front: `${a} × ${b}`,
    back: `${a} × ${b} = ${a * b}`,
    category: '乘法口诀',
  }
})

const FORMULA_CARDS: FlashCard[] = [
  { id: 'f1', front: '正方形周长', back: 'C = 4a（边长×4）', category: '周长' },
  { id: 'f2', front: '长方形周长', back: 'C = 2(长+宽)', category: '周长' },
  { id: 'f3', front: '正方形面积', back: 'S = a × a（边长×边长）', category: '面积' },
  { id: 'f4', front: '长方形面积', back: 'S = 长 × 宽', category: '面积' },
  { id: 'f5', front: '三角形面积', back: 'S = 底 × 高 ÷ 2', category: '面积' },
  { id: 'f6', front: '平行四边形面积', back: 'S = 底 × 高', category: '面积' },
  { id: 'f7', front: '梯形面积', back: 'S = (上底+下底) × 高 ÷ 2', category: '面积' },
  { id: 'f8', front: '圆的周长', back: 'C = 2πr = πd', category: '周长' },
  { id: 'f9', front: '圆的面积', back: 'S = πr²', category: '面积' },
  { id: 'f10', front: '长方体体积', back: 'V = 长×宽×高', category: '体积' },
  { id: 'f11', front: '正方体体积', back: 'V = 棱长³', category: '体积' },
  { id: 'f12', front: '圆柱体积', back: 'V = πr²h', category: '体积' },
  { id: 'f13', front: '圆锥体积', back: 'V = πr²h ÷ 3', category: '体积' },
  { id: 'f14', front: '乘法分配律', back: '(a+b)×c = a×c + b×c', category: '运算律' },
  { id: 'f15', front: '乘法交换律', back: 'a×b = b×a', category: '运算律' },
  { id: 'f16', front: '加法交换律', back: 'a+b = b+a', category: '运算律' },
  { id: 'f17', front: '1米 = ? 厘米', back: '1米 = 100厘米', category: '单位换算' },
  { id: 'f18', front: '1千克 = ? 克', back: '1千克 = 1000克', category: '单位换算' },
  { id: 'f19', front: '1时 = ? 分', back: '1时 = 60分', category: '单位换算' },
  { id: 'f20', front: '1元 = ? 角', back: '1元 = 10角', category: '单位换算' },
  { id: 'f21', front: '同分母加法', back: 'a/c + b/c = (a+b)/c', category: '分数' },
  { id: 'f22', front: '分数乘法', back: 'a/b × c/d = ac/bd', category: '分数' },
  { id: 'f23', front: '分数除法', back: 'a/b ÷ c/d = a/b × d/c', category: '分数' },
  { id: 'f24', front: '比的意义', back: 'a:b = a÷b', category: '比和比例' },
  { id: 'f25', front: '正比例', back: 'y/x = k（商一定）', category: '比和比例' },
  { id: 'f26', front: '反比例', back: 'x×y = k（积一定）', category: '比和比例' },
]

const ALL_CARDS = [...MULTIPLICATION_CARDS, ...FORMULA_CARDS]

const CATEGORIES = ['全部', '乘法口诀', '周长', '面积', '体积', '运算律', '单位换算', '分数', '比和比例']

export default function FlashCardsPage() {
  const [cards, setCards] = useState<FlashCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mastered, setMastered] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState('全部')
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse')
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null)
  const { unlock, trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('flash-cards')
    loadMastered()
  }, [trackVisit])

  const loadMastered = () => {
    try {
      const stored = localStorage.getItem('math-fun-mastered-cards')
      if (stored) setMastered(new Set(JSON.parse(stored)))
    } catch {}
  }

  const saveMastered = (set: Set<string>) => {
    setMastered(set)
    try {
      localStorage.setItem('math-fun-mastered-cards', JSON.stringify(Array.from(set)))
    } catch {}
    if (set.size >= 20) unlock('flash_card_20')
  }

  const filteredCards = activeCategory === '全部'
    ? cards.length > 0 ? cards : ALL_CARDS
    : ALL_CARDS.filter(c => c.category === activeCategory)

  const currentCard = filteredCards[currentIndex]

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setFlipped(false)
  }

  const toggleMaster = (id: string) => {
    const next = new Set(mastered)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    saveMastered(next)
  }

  const nextCard = () => {
    setFlipped(false)
    setQuizAnswer('')
    setQuizResult(null)
    setCurrentIndex((i) => (i + 1) % filteredCards.length)
  }

  const prevCard = () => {
    setFlipped(false)
    setQuizAnswer('')
    setQuizResult(null)
    setCurrentIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length)
  }

  const checkQuizAnswer = () => {
    if (!currentCard) return
    const correct = currentCard.back.includes(quizAnswer.trim()) || quizAnswer.trim() === currentCard.back.split('=')[1]?.trim()
    setQuizResult(correct ? 'correct' : 'wrong')
    if (correct) {
      const next = new Set(mastered)
      next.add(currentCard.id)
      saveMastered(next)
    }
  }

  const masteredCount = filteredCards.filter(c => mastered.has(c.id)).length

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 p-4">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">🃏 口算闪卡</h1>
          <div className="w-20" />
        </header>

        {/* 模式切换 */}
        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => { setMode('browse'); setFlipped(false); setQuizAnswer(''); setQuizResult(null) }}
            className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'browse' ? 'bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-md' : 'bg-white text-slate-600'}`}
          >
            浏览模式
          </button>
          <button
            onClick={() => { setMode('quiz'); setFlipped(false); setQuizAnswer(''); setQuizResult(null) }}
            className={`rounded-xl px-4 py-2 font-medium transition ${mode === 'quiz' ? 'bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-md' : 'bg-white text-slate-600'}`}
          >
            测验模式
          </button>
        </div>

        {/* 分类筛选 */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentIndex(0); setCards([]) }}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                activeCategory === cat ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 进度 */}
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span>{currentIndex + 1} / {filteredCards.length}</span>
          <span>已掌握 {masteredCount} / {filteredCards.length}</span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all" style={{ width: `${filteredCards.length > 0 ? ((currentIndex + 1) / filteredCards.length) * 100 : 0}%` }} />
        </div>

        {/* 闪卡 */}
        {currentCard && (
          <div className="mb-6">
            <div
              onClick={() => mode === 'browse' && setFlipped(!flipped)}
              className={`relative min-h-[240px] cursor-pointer rounded-3xl p-8 shadow-xl transition-all duration-500 ${
                flipped
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
                  : 'bg-white text-slate-800'
              } ${mode === 'quiz' ? 'cursor-default' : ''}`}
            >
              <div className="mb-2 text-right text-xs font-medium opacity-60">
                {currentCard.category}
              </div>
              <div className="flex min-h-[160px] items-center justify-center">
                {flipped || mode === 'quiz' ? (
                  <div className="text-center">
                    <div className="mb-2 text-xs opacity-60">{mode === 'quiz' ? '请输入答案' : '答案'}</div>
                    <div className="text-3xl font-bold">{currentCard.back}</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-2 text-xs text-slate-400">点击翻转查看答案</div>
                    <div className="text-4xl font-extrabold">{currentCard.front}</div>
                  </div>
                )}
              </div>
              {mastered.has(currentCard.id) && (
                <div className="absolute left-4 top-4 rounded-full bg-green-400 p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* 测验模式输入 */}
            {mode === 'quiz' && (
              <div className="mt-4 rounded-2xl bg-white p-4 shadow-lg">
                {quizResult === null ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && quizAnswer && checkQuizAnswer()}
                      className="flex-1 rounded-xl border-2 border-violet-200 px-4 py-3 text-center text-xl font-bold focus:border-violet-400 focus:outline-none"
                      placeholder="输入答案..."
                      autoFocus
                    />
                    <button
                      onClick={checkQuizAnswer}
                      disabled={!quizAnswer}
                      className="rounded-xl bg-violet-500 px-6 py-3 font-bold text-white disabled:opacity-50"
                    >
                      确认
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center justify-between rounded-xl p-3 ${quizResult === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`font-bold ${quizResult === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                      {quizResult === 'correct' ? '✅ 回答正确！' : `❌ 正确答案：${currentCard.back}`}
                    </span>
                    <button onClick={nextCard} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                      下一张 →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <button onClick={prevCard} className="rounded-xl bg-white p-3 shadow-md transition hover:bg-slate-50">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </button>
          <button
            onClick={() => toggleMaster(currentCard?.id || '')}
            className={`rounded-xl px-4 py-3 font-medium shadow-md transition ${
              currentCard && mastered.has(currentCard.id)
                ? 'bg-green-100 text-green-700'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {currentCard && mastered.has(currentCard.id) ? '✓ 已掌握' : '标记掌握'}
          </button>
          <button onClick={shuffleCards} className="rounded-xl bg-white p-3 shadow-md transition hover:bg-slate-50">
            <Shuffle className="h-6 w-6 text-slate-600" />
          </button>
          <button onClick={nextCard} className="rounded-xl bg-white p-3 shadow-md transition hover:bg-slate-50">
            <ChevronRight className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        {/* 已掌握卡片 */}
        {mastered.size > 0 && (
          <div className="rounded-2xl bg-green-50 p-4">
            <h3 className="mb-2 font-bold text-green-800">✅ 已掌握 ({mastered.size})</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(mastered).slice(0, 20).map((id) => {
                const card = ALL_CARDS.find(c => c.id === id)
                return card ? (
                  <span key={id} className="rounded-lg bg-green-100 px-2 py-1 text-xs text-green-700">{card.front}</span>
                ) : null
              })}
              {mastered.size > 20 && <span className="text-xs text-green-600">...还有 {mastered.size - 20} 张</span>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
