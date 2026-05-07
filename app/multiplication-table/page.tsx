'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, CheckCircle, XCircle, RotateCcw, Star, Zap, Eye, Hand, Brain, Target, Trophy, ChevronRight, Play, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'
import { savePracticeRecord, saveMistakeRecord } from '@/lib/storage'

// 手指记忆法数据
const fingerMethod: Record<number, { description: string; formula: string; fingerCount: number; result: string }> = {
  5: { description: '5的乘法只需伸出手指', formula: '5 × n = 5 + 5×(n-1)', fingerCount: 0, result: '伸手指数' },
  6: { description: '左手伸6对应的手指，右手依次数', formula: '6×1=6', fingerCount: 1, result: '伸1根=6' },
  7: { description: '两手配合，伸手指算乘积', formula: '7×1=7', fingerCount: 1, result: '伸1根=7' },
  8: { description: '伸出8对应的手指数量', formula: '8×1=8', fingerCount: 1, result: '伸1根=8' },
  9: { description: '9的乘法用手指最神奇！', formula: '9×9=81', fingerCount: 9, result: '9根手指=81' },
}

// 记忆口诀
const memoryRhymes = [
  { num: 2, rhyme: '一二的二三的二三的四就二三' },
  { num: 3, rhyme: '一三得三 二三得六 三三得九' },
  { num: 4, rhyme: '一四得四 二四得八 三四十二 四四十六' },
  { num: 5, rhyme: '一五得五 二五一十 三五十五 四五二十 五五二十五' },
  { num: 6, rhyme: '一六得六 二六十二 三六十八 四六二十四 五六三十 六六三十六' },
  { num: 7, rhyme: '一七得七 二七十四 三七二十一 四七二十八 五七三十五 六七四十二 七七四十九' },
  { num: 8, rhyme: '一八得八 二八十六 三八二十四 四八三十二 五八四十 六八四十八 七八五十六 八八六十四' },
  { num: 9, rhyme: '一九得九 二九十八 三九二十七 四九三十六 五九四十五 六九五十四 七九六十三 八九七十二 九九八十一' },
]

// 高级记忆技巧
const advancedTips = [
  { 
    title: '🎯 指算法（5-9）', 
    icon: Hand,
    color: 'from-pink-400 to-rose-500',
    steps: [
      '将两手心朝上，十指伸开',
      '从左到右给手指编号1-10（拇指为6）',
      '比如算9×7，弯下第7根手指',
      '弯指左边有6根 = 十位6',
      '弯指右边有3根 = 个位3',
      '答案：9×7=63'
    ],
    tip: '这是古人的智慧！双手就能算9的乘法'
  },
  { 
    title: '🧠 联想记忆法', 
    icon: Brain,
    color: 'from-violet-400 to-purple-500',
    steps: [
      '6×6=36 想象：溜溜球',
      '7×7=49 想象：吃葡萄（7吃7）',
      '8×8=64 想象：爸爸（8）和妈妈（8）',
      '9×9=81 想象：酒吧（9）和凳子（9）'
    ],
    tip: '编一个小故事，记忆更牢固'
  },
  { 
    title: '📐 规律发现法', 
    icon: Target,
    color: 'from-emerald-400 to-teal-500',
    steps: [
      '观察：每行结果都是前一行的和',
      '发现：积的个位+十位=9（9的乘法）',
      '口诀：9×n = 10×n - n',
      '比如：9×7 = 70-7 = 63'
    ],
    tip: '掌握规律比死记硬背更有效'
  },
  { 
    title: '⭐ 背诵顺序法', 
    icon: Star,
    color: 'from-amber-400 to-orange-500',
    steps: [
      '先背1-5的乘法（简单）',
      '再背5×5=25（关键桥梁）',
      '然后背6-9的乘法（利用交换律）',
      '最后专攻9的乘法（手指法）'
    ],
    tip: '循序渐进，事半功倍'
  },
]

// 顺口溜
const rhymes = [
  { title: '一一得一', desc: '最简单的开始' },
  { title: '一二得二', desc: '继续往下记' },
  { title: '二二得四', desc: '二二要牢记' },
  { title: '一三得三', desc: '一三慢慢来' },
  { title: '二三得六', desc: '二三如一六' },
  { title: '三三得九', desc: '三三得九九' },
]

export default function MultiplicationTablePage() {
  const [selectedNum, setSelectedNum] = useState<number | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<{a: number; b: number}[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [activeTip, setActiveTip] = useState<number | null>(null)
  const [showRhymes, setShowRhymes] = useState(false)
  const [showFingerMethod, setShowFingerMethod] = useState(false)
  const { unlock, trackVisit } = useAchievements()
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    trackVisit('multiplication-table')
  }, [trackVisit])

  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.7
      window.speechSynthesis.speak(utterance)
    }
  }

  const speakRhyme = (num: number) => {
    const rhyme = memoryRhymes.find(r => r.num === num)
    if (rhyme) {
      speak(rhyme.rhyme)
    }
  }

  const startQuiz = () => {
    const questions = Array.from({ length: 20 }, () => ({
      a: Math.floor(Math.random() * 9) + 1,
      b: Math.floor(Math.random() * 9) + 1
    }))
    setQuizQuestions(questions)
    setCurrentQIndex(0)
    setScore(0)
    setWrong(0)
    setQuizMode(true)
    setQuizFinished(false)
    setUserAnswer('')
    setShowResult(false)
  }

  const submitAnswer = () => {
    const current = quizQuestions[currentQIndex]
    const correct = current.a * current.b
    const isCorrect = parseInt(userAnswer) === correct

    if (isCorrect) {
      setScore(s => s + 1)
    } else {
      setWrong(w => w + 1)
      saveMistakeRecord({
        id: Date.now().toString(),
        question: `${current.a} × ${current.b} = ?`,
        userAnswer: userAnswer,
        correctAnswer: correct.toString(),
        module: 'multiplication-table',
        date: new Date().toISOString(),
        reviewed: false,
        reviewCount: 0
      })
    }

    setShowResult(true)
    setTimeout(() => {
      if (currentQIndex < quizQuestions.length - 1) {
        setCurrentQIndex(i => i + 1)
        setUserAnswer('')
        setShowResult(false)
      } else {
        finishQuiz()
      }
    }, 1000)
  }

  const finishQuiz = () => {
    setQuizFinished(true)
    setQuizMode(false)
    savePracticeRecord({
      id: Date.now().toString(),
      module: 'multiplication-table',
      score: score,
      total: 20,
      date: new Date().toISOString()
    })
    if (score >= 18) unlock('mul_quiz_master')
    if (score >= 15) unlock('mul_quiz_advanced')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer && !showResult) {
      submitAnswer()
    }
  }

  // 测验模式
  if (quizMode && !quizFinished) {
    const current = quizQuestions[currentQIndex]
    const correct = current.a * current.b

    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <header className="mb-6 flex items-center justify-between">
            <button onClick={() => setQuizMode(false)} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-5 w-5" />
              <span>退出测验</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-slate-700">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <span className="font-bold text-slate-700">{currentQIndex + 1}/20</span>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 font-bold">{score}✓</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 font-bold">{wrong}✗</span>
            </div>
          </header>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <button onClick={() => speak(`${current.a}乘以${current.b}等于多少`)} className="mb-4 text-6xl font-bold text-slate-800">
                {current.a} × {current.b} = ?
              </button>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={showResult}
                className={`w-40 rounded-2xl border-2 px-6 py-4 text-center text-4xl font-bold focus:outline-none disabled:opacity-50 ${
                  showResult 
                    ? (parseInt(userAnswer) === correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
                    : 'border-emerald-200 bg-emerald-50 focus:border-emerald-400'
                }`}
                placeholder="?"
                autoFocus
              />
            </div>

            {showResult && (
              <div className={`mb-6 rounded-2xl p-4 text-center ${
                parseInt(userAnswer) === correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {parseInt(userAnswer) === correct ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xl font-bold">太棒了！</span>
                  </div>
                ) : (
                  <div className="text-red-700">
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="h-6 w-6" />
                      <span className="text-xl font-bold">再接再厉</span>
                    </div>
                    <p className="mt-1">正确答案：{correct}</p>
                    <p className="text-sm">大声朗读：{current.a}乘以{current.b}等于{correct}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={submitAnswer}
              disabled={!userAnswer || showResult}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 text-xl font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {showResult ? '下一题...' : '提交答案'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  // 测验完成页面
  if (quizFinished) {
    const percentage = Math.round((score / 20) * 100)
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-xl text-center">
            <div className="mb-4 text-6xl">{percentage >= 90 ? '🏆' : percentage >= 70 ? '⭐' : '💪'}</div>
            <h2 className="mb-2 text-3xl font-bold text-slate-800">
              {percentage >= 90 ? '乘法大师！' : percentage >= 70 ? '很棒！' : '继续加油！'}
            </h2>
            <p className="mb-6 text-slate-600">正确率 {percentage}%</p>
            
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-green-50 p-4">
                <div className="text-4xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-green-700">答对</div>
              </div>
              <div className="rounded-2xl bg-red-50 p-4">
                <div className="text-4xl font-bold text-red-600">{wrong}</div>
                <div className="text-sm text-red-700">答错</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={startQuiz}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-4 text-xl font-bold text-white shadow-lg"
              >
                <RotateCcw className="h-5 w-5" />
                再测一次
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 text-xl font-bold text-slate-700"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // 主页面
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">✖️ 九九乘法表</h1>
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 font-bold text-white shadow-lg"
          >
            <Play className="h-4 w-4" />
            开始测验
          </button>
        </header>

        {/* 快速选择 */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Eye className="h-5 w-5 text-emerald-500" />
            点击数字学习口诀
          </h2>
          <div className="grid grid-cols-9 gap-2">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => { setSelectedNum(n); speakRhyme(n); }}
                className={`aspect-square rounded-2xl text-xl font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1 ${
                  selectedNum === n 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 scale-110' 
                    : 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 选中数字的口诀 */}
        {selectedNum && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-800">
                {selectedNum} 的乘法口诀
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => speakRhyme(selectedNum)}
                  className="flex items-center gap-1 rounded-xl bg-amber-200 px-3 py-1 text-sm font-bold text-amber-800"
                >
                  <Volume2 className="h-4 w-4" />
                  听口诀
                </button>
                <button
                  onClick={() => setSelectedNum(null)}
                  className="rounded-xl bg-slate-200 px-3 py-1 text-sm font-bold text-slate-600"
                >
                  关闭
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => speak(`${selectedNum}乘${n}等于${selectedNum * n}`)}
                  className="flex items-center justify-between rounded-xl bg-white p-3 text-left shadow transition-all hover:shadow-md"
                >
                  <span className="font-bold text-slate-800">
                    {selectedNum} × {n} = {selectedNum * n}
                  </span>
                  <Volume2 className="h-4 w-4 text-amber-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 完整乘法表 */}
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Zap className="h-5 w-5 text-cyan-500" />
            完整乘法表（点击听发音）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-2 text-center text-sm font-bold text-white bg-gradient-to-r from-slate-600 to-slate-700 rounded-tl-xl"></th>
                  {Array.from({ length: 9 }, (_, i) => (
                    <th key={i} className="p-2 text-center text-sm font-bold text-white bg-gradient-to-r from-slate-600 to-slate-700">
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }, (_, row) => row + 1).map((row) => (
                  <tr key={row}>
                    <td className="p-2 text-center font-bold text-white bg-gradient-to-r from-slate-600 to-slate-700">
                      {row}
                    </td>
                    {Array.from({ length: 9 }, (_, col) => col + 1).map((col) => {
                      const result = row * col
                      const isSquare = row === col
                      return (
                        <td
                          key={col}
                          onClick={() => speak(`${row}乘${col}等于${result}`)}
                          className={`cursor-pointer p-2 text-center font-bold transition-all hover:scale-105 ${
                            isSquare 
                              ? 'bg-emerald-200 text-emerald-800' 
                              : row <= col 
                                ? 'bg-emerald-50 text-slate-700 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {result}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-center text-sm text-slate-500">
            💡 绿色对角线是平方数（1,4,9,16,25,36,49,64,81）
          </p>
        </div>

        {/* 学习技巧切换 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setShowRhymes(!showRhymes); setShowFingerMethod(false); }}
            className={`rounded-xl px-4 py-2 font-bold transition-all ${showRhymes ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-white text-slate-700 shadow'}`}
          >
            📜 口诀背诵
          </button>
          <button
            onClick={() => { setShowFingerMethod(!showFingerMethod); setShowRhymes(false); }}
            className={`rounded-xl px-4 py-2 font-bold transition-all ${showFingerMethod ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white' : 'bg-white text-slate-700 shadow'}`}
          >
            👋 手指算法
          </button>
        </div>

        {/* 口诀背诵 */}
        {showRhymes && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-xl">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-800">
              📜 乘法口诀（大声朗读）
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {memoryRhymes.map((rhyme) => (
                <div key={rhyme.num} className="rounded-xl bg-white p-4 shadow">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-700">{rhyme.num} 的口诀</span>
                    <button
                      onClick={() => speak(rhyme.rhyme)}
                      className="rounded-full bg-amber-100 p-2 text-amber-600 hover:bg-amber-200"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{rhyme.rhyme}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 手指算法 */}
        {showFingerMethod && (
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-pink-50 to-rose-50 p-6 shadow-xl">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-rose-800">
              👋 神奇的手指算法
            </h3>
            <div className="mb-6 text-center">
              <div className="mb-4 text-6xl">🖐️</div>
              <p className="text-rose-700">两手心朝上，十指伸开</p>
              <p className="text-sm text-rose-500">从左到右给手指编号：1-2-3-4-5（拇指为6）-7-8-9-10</p>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-4">
                <h4 className="font-bold text-rose-700">🤚 9的乘法（最神奇！）</h4>
                <p className="text-sm text-slate-600 mt-1">比如算 9×7：</p>
                <ol className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>1. 弯下第 7 根手指（第7根是左手的食指）</li>
                  <li>2. 弯指左边有 6 根手指 → 十位是 6</li>
                  <li>3. 弯指右边有 3 根手指 → 个位是 3</li>
                  <li className="font-bold text-rose-600">✨ 答案：9 × 7 = 63</li>
                </ol>
              </div>
              
              <div className="rounded-xl bg-white p-4">
                <h4 className="font-bold text-rose-700">👆 6的乘法</h4>
                <p className="text-sm text-slate-600 mt-1">6×1=6（伸1根手指）</p>
                <p className="text-sm text-slate-600">6×2=12（伸2根手指，弯的指+伸的指各代表一部分）</p>
              </div>
            </div>
          </div>
        )}

        {/* 高级记忆技巧 */}
        <div className="mb-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Brain className="h-5 w-5 text-purple-500" />
            高级记忆技巧
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {advancedTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <button
                  key={index}
                  onClick={() => setActiveTip(activeTip === index ? null : index)}
                  className={`rounded-2xl border-2 bg-gradient-to-br ${tip.color} p-4 text-left text-white shadow-lg transition-all hover:shadow-xl ${
                    activeTip === index ? 'scale-105 ring-4 ring-white/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8" />
                    <h3 className="text-lg font-bold">{tip.title}</h3>
                  </div>
                  {activeTip === index && (
                    <div className="mt-4 rounded-xl bg-white/20 p-4">
                      <ol className="space-y-2 text-sm">
                        {tip.steps.map((step, i) => (
                          <li key={i}>{i + 1}. {step}</li>
                        ))}
                      </ol>
                      <p className="mt-3 rounded-lg bg-white/30 p-2 text-sm">💡 {tip.tip}</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 规律发现 */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-50 to-purple-50 p-6 shadow-xl">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-violet-800">
            🔍 发现乘法规律
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-4">
              <div className="text-2xl mb-2">2</div>
              <p className="text-sm text-slate-600">都是偶数<br/>末尾是0/2/4/6/8</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-2xl mb-2">5</div>
              <p className="text-sm text-slate-600">末尾是0或5<br/>25、50、75结尾</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-2xl mb-2">9</div>
              <p className="text-sm text-slate-600">各位数字之和=9<br/>9×n=10n-n</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-2xl mb-2">交换</div>
              <p className="text-sm text-slate-600">3×7=7×3<br/>记住一半就够了！</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
