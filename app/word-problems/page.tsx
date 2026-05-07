'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveMistakeRecord } from '@/lib/storage'

interface WordProblem {
  id: number
  story: string
  question: string
  answer: number
  unit: string
  hint: string
  steps: string[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const PROBLEMS: WordProblem[] = [
  {
    id: 1, story: '小明有15个苹果，给了小红7个。', question: '小明还剩几个苹果？', answer: 8, unit: '个',
    hint: '用减法：拿走的从总数里减去', steps: ['总数：15个', '给出去：7个', '15 - 7 = 8个'], category: '加减法', difficulty: 'easy',
  },
  {
    id: 2, story: '图书馆有故事书120本，科普书85本。', question: '一共有多少本书？', answer: 205, unit: '本',
    hint: '用加法：把两种书加起来', steps: ['故事书：120本', '科普书：85本', '120 + 85 = 205本'], category: '加减法', difficulty: 'easy',
  },
  {
    id: 3, story: '一支铅笔2元，小红买了5支。', question: '一共花了多少钱？', answer: 10, unit: '元',
    hint: '用乘法：单价×数量', steps: ['每支铅笔：2元', '买了：5支', '2 × 5 = 10元'], category: '乘除法', difficulty: 'easy',
  },
  {
    id: 4, story: '3个小朋友分24颗糖，平均每人分几颗？', question: '每人分几颗？', answer: 8, unit: '颗',
    hint: '用除法：总数÷人数', steps: ['总数：24颗', '人数：3人', '24 ÷ 3 = 8颗'], category: '乘除法', difficulty: 'easy',
  },
  {
    id: 5, story: '一本书有120页，小红每天看20页。', question: '几天能看完？', answer: 6, unit: '天',
    hint: '用除法：总页数÷每天看的页数', steps: ['总页数：120页', '每天看：20页', '120 ÷ 20 = 6天'], category: '乘除法', difficulty: 'easy',
  },
  {
    id: 6, story: '一个长方形花坛，长8米，宽5米。', question: '花坛的周长是多少米？', answer: 26, unit: '米',
    hint: '长方形周长 = (长+宽)×2', steps: ['长：8米', '宽：5米', '(8+5) × 2 = 26米'], category: '周长', difficulty: 'medium',
  },
  {
    id: 7, story: '一个正方形手帕，边长12厘米。', question: '手帕的面积是多少平方厘米？', answer: 144, unit: '平方厘米',
    hint: '正方形面积 = 边长×边长', steps: ['边长：12厘米', '12 × 12 = 144平方厘米'], category: '面积', difficulty: 'medium',
  },
  {
    id: 8, story: '小明带了50元去超市，买了一个书包花了35元，又买了一支钢笔花了8元。', question: '还剩多少钱？', answer: 7, unit: '元',
    hint: '先算花了多少，再算剩下多少', steps: ['总钱数：50元', '书包：35元', '钢笔：8元', '50 - 35 - 8 = 7元'], category: '加减法', difficulty: 'medium',
  },
  {
    id: 9, story: '教室里有4排座位，每排6个。', question: '教室里一共有多少个座位？', answer: 24, unit: '个',
    hint: '用乘法：排数×每排的个数', steps: ['排数：4排', '每排：6个', '4 × 6 = 24个'], category: '乘除法', difficulty: 'easy',
  },
  {
    id: 10, story: '果园里有苹果树48棵，梨树的棵数是苹果树的一半。', question: '梨树有多少棵？', answer: 24, unit: '棵',
    hint: '一半就是除以2', steps: ['苹果树：48棵', '梨树 = 苹果树 ÷ 2', '48 ÷ 2 = 24棵'], category: '乘除法', difficulty: 'medium',
  },
  {
    id: 11, story: '一根绳子长36米，剪成同样长的4段。', question: '每段长多少米？', answer: 9, unit: '米',
    hint: '用除法：总长÷段数', steps: ['总长：36米', '段数：4段', '36 ÷ 4 = 9米'], category: '乘除法', difficulty: 'easy',
  },
  {
    id: 12, story: '一个三角形花坛，底6米，高4米。', question: '花坛的面积是多少平方米？', answer: 12, unit: '平方米',
    hint: '三角形面积 = 底×高÷2', steps: ['底：6米', '高：4米', '6 × 4 ÷ 2 = 12平方米'], category: '面积', difficulty: 'medium',
  },
  {
    id: 13, story: '小明看一本书，第一天看了全书的1/4，第二天看了全书的1/3。', question: '两天一共看了全书的几分之几？', answer: 7, unit: '/12',
    hint: '先通分再相加：1/4+1/3=3/12+4/12', steps: ['第一天：1/4 = 3/12', '第二天：1/3 = 4/12', '3/12 + 4/12 = 7/12'], category: '分数', difficulty: 'hard',
  },
  {
    id: 14, story: '学校买了6箱苹果，每箱有24个，平均分给8个班。', question: '每个班分到多少个苹果？', answer: 18, unit: '个',
    hint: '先算总数，再平均分', steps: ['6箱，每箱24个', '总数：6 × 24 = 144个', '每班：144 ÷ 8 = 18个'], category: '乘除法', difficulty: 'hard',
  },
  {
    id: 15, story: '一个长方形游泳池，长50米，宽25米。', question: '游泳池的面积是多少平方米？', answer: 1250, unit: '平方米',
    hint: '长方形面积 = 长×宽', steps: ['长：50米', '宽：25米', '50 × 25 = 1250平方米'], category: '面积', difficulty: 'medium',
  },
  {
    id: 16, story: '小华有30元，用去了3/5。', question: '用去了多少元？', answer: 18, unit: '元',
    hint: '求一个数的几分之几是多少，用乘法', steps: ['总数：30元', '用去了3/5', '30 × 3/5 = 18元'], category: '分数', difficulty: 'hard',
  },
]

const CATEGORIES = ['全部', '加减法', '乘除法', '周长', '面积', '分数']
const DIFFICULTIES = ['全部', 'easy', 'medium', 'hard']

export default function WordProblemsPage() {
  const [filteredProblems, setFilteredProblems] = useState<WordProblem[]>(PROBLEMS)
  const [currentProblem, setCurrentProblem] = useState<WordProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeDifficulty, setActiveDifficulty] = useState('全部')
  const { trackVisit } = useAchievements()

  useEffect(() => { trackVisit('word-problems') }, [trackVisit])

  const filterProblems = () => {
    let filtered = [...PROBLEMS]
    if (activeCategory !== '全部') filtered = filtered.filter(p => p.category === activeCategory)
    if (activeDifficulty !== '全部') filtered = filtered.filter(p => p.difficulty === activeDifficulty)
    setFilteredProblems(filtered)
  }

  useEffect(() => { filterProblems() }, [activeCategory, activeDifficulty])

  const startProblem = (problem: WordProblem) => {
    setCurrentProblem(problem)
    setUserAnswer('')
    setShowHint(false)
    setShowSteps(false)
    setResult(null)
  }

  const nextRandom = () => {
    const pool = filteredProblems.length > 0 ? filteredProblems : PROBLEMS
    const p = pool[Math.floor(Math.random() * pool.length)]
    startProblem(p)
  }

  const checkAnswer = () => {
    if (!currentProblem) return
    const isCorrect = parseFloat(userAnswer) === currentProblem.answer
    setResult(isCorrect ? 'correct' : 'wrong')
    setTotal(t => t + 1)
    if (isCorrect) {
      setScore(s => s + 1)
    } else {
      saveMistakeRecord({
        id: Date.now().toString(),
        question: currentProblem.story + currentProblem.question,
        userAnswer: userAnswer,
        correctAnswer: `${currentProblem.answer} ${currentProblem.unit}`,
        module: 'word-problems',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0,
      })
    }
    setShowSteps(true)
  }

  const diffLabel = (d: string) => d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难'
  const diffColor = (d: string) => d === 'easy' ? 'bg-green-100 text-green-700' : d === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'

  if (currentProblem) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-4">
        <div className="mx-auto max-w-2xl">
          <header className="mb-6 flex items-center justify-between">
            <button onClick={() => setCurrentProblem(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-5 w-5" />
              <span>返回列表</span>
            </button>
            <span className="text-sm text-slate-500">得分: {score}/{total}</span>
            <div className="w-20" />
          </header>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            {/* 难度和分类标签 */}
            <div className="mb-4 flex gap-2">
              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${diffColor(currentProblem.difficulty)}`}>{diffLabel(currentProblem.difficulty)}</span>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{currentProblem.category}</span>
            </div>

            {/* 题目 */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-50 to-rose-50 p-5">
              <p className="mb-3 text-lg leading-relaxed text-slate-700">{currentProblem.story}</p>
              <p className="text-xl font-bold text-slate-800">{currentProblem.question}</p>
            </div>

            {/* 提示 */}
            {showHint && (
              <div className="mb-4 rounded-xl bg-yellow-50 p-3 flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-sm text-yellow-700">{currentProblem.hint}</span>
              </div>
            )}

            {/* 输入 */}
            {result === null && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
                  className="flex-1 rounded-xl border-2 border-orange-200 px-4 py-3 text-xl font-bold focus:border-orange-400 focus:outline-none"
                  placeholder="输入答案（只需填数字）"
                  autoFocus
                />
                <button onClick={checkAnswer} disabled={!userAnswer} className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white disabled:opacity-50">
                  提交
                </button>
              </div>
            )}

            {/* 结果 */}
            {result && (
              <div className={`mb-4 rounded-xl p-4 ${result === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`flex items-center gap-2 font-bold ${result === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                  {result === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  {result === 'correct' ? '回答正确！' : `正确答案是 ${currentProblem.answer} ${currentProblem.unit}`}
                </div>
              </div>
            )}

            {/* 解题步骤 */}
            {showSteps && (
              <div className="mb-4 rounded-xl bg-blue-50 p-4">
                <h3 className="mb-2 font-bold text-blue-800">📝 解题步骤</h3>
                <div className="space-y-1">
                  {currentProblem.steps.map((step, i) => (
                    <div key={i} className="text-sm text-blue-700">第{i + 1}步：{step}</div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-2">
              {!showHint && result === null && (
                <button onClick={() => setShowHint(true)} className="rounded-xl bg-yellow-100 px-4 py-2 font-medium text-yellow-700">
                  <Lightbulb className="mr-1 inline h-4 w-4" /> 看提示
                </button>
              )}
              <button onClick={nextRandom} className="flex-1 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 py-3 font-bold text-white">
                下一题 <ChevronRight className="inline h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-4">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📖 应用题专区</h1>
          <div className="w-20" />
        </header>

        {/* 随机一题 */}
        <button onClick={nextRandom} className="mb-6 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-rose-500 py-4 text-xl font-bold text-white shadow-lg transition hover:shadow-xl">
          🎲 随机一题
        </button>

        {/* 筛选 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`rounded-lg px-3 py-1 text-sm font-medium ${activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-slate-600'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setActiveDifficulty(d)} className={`rounded-lg px-3 py-1 text-sm font-medium ${activeDifficulty === d ? 'bg-rose-500 text-white' : 'bg-white text-slate-600'}`}>
              {d === '全部' ? '全部难度' : diffLabel(d)}
            </button>
          ))}
        </div>

        {/* 题目列表 */}
        <div className="space-y-3">
          {filteredProblems.map((p) => (
            <button
              key={p.id}
              onClick={() => startProblem(p)}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${diffColor(p.difficulty)}`}>{diffLabel(p.difficulty)}</span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{p.category}</span>
              </div>
              <p className="text-sm text-slate-700 line-clamp-2">{p.story} {p.question}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
