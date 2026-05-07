'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

interface Formula {
  id: string
  title: string
  emoji: string
  formulas: { name: string; formula: string; example?: string }[]
  tips: string[]
}

const FORMULAS: Formula[] = [
  {
    id: 'arithmetic',
    title: '四则运算',
    emoji: '➕',
    formulas: [
      { name: '加法交换律', formula: 'a + b = b + a', example: '3 + 5 = 5 + 3 = 8' },
      { name: '加法结合律', formula: '(a + b) + c = a + (b + c)', example: '(2 + 3) + 4 = 2 + (3 + 4) = 9' },
      { name: '乘法交换律', formula: 'a × b = b × a', example: '4 × 5 = 5 × 4 = 20' },
      { name: '乘法结合律', formula: '(a × b) × c = a × (b × c)', example: '(2 × 3) × 4 = 2 × (3 × 4) = 24' },
      { name: '乘法分配律', formula: '(a + b) × c = a×c + b×c', example: '(3 + 5) × 2 = 3×2 + 5×2 = 16' },
    ],
    tips: ['凑整是简便计算的核心', '看到25想4，看到125想8'],
  },
  {
    id: 'perimeter',
    title: '周长公式',
    emoji: '📐',
    formulas: [
      { name: '正方形周长', formula: 'C = 4a', example: '边长5cm，周长=4×5=20cm' },
      { name: '长方形周长', formula: 'C = 2(a + b)', example: '长6cm宽4cm，周长=2×(6+4)=20cm' },
      { name: '圆的周长', formula: 'C = πd = 2πr', example: '直径10cm，周长=3.14×10=31.4cm' },
      { name: '三角形周长', formula: 'C = a + b + c', example: '三边3、4、5cm，周长=12cm' },
    ],
    tips: ['周长是"围一圈"的长度', '计算时注意单位统一'],
  },
  {
    id: 'area',
    title: '面积公式',
    emoji: '📏',
    formulas: [
      { name: '正方形面积', formula: 'S = a²', example: '边长5cm，面积=5×5=25cm²' },
      { name: '长方形面积', formula: 'S = a × b', example: '长6cm宽4cm，面积=6×4=24cm²' },
      { name: '平行四边形', formula: 'S = 底 × 高', example: '底8cm高5cm，面积=40cm²' },
      { name: '三角形面积', formula: 'S = 底 × 高 ÷ 2', example: '底6cm高4cm，面积=12cm²' },
      { name: '梯形面积', formula: 'S = (上底+下底) × 高 ÷ 2', example: '上3下5高4，面积=16cm²' },
      { name: '圆的面积', formula: 'S = πr²', example: '半径3cm，面积=3.14×9=28.26cm²' },
    ],
    tips: ['面积是"铺满"的大小', '三角形和梯形记得÷2', '圆的面积用半径，不是直径'],
  },
  {
    id: 'volume',
    title: '体积公式',
    emoji: '📦',
    formulas: [
      { name: '正方体体积', formula: 'V = a³', example: '棱长4cm，体积=64cm³' },
      { name: '长方体体积', formula: 'V = 长 × 宽 × 高', example: '5×4×3=60cm³' },
      { name: '圆柱体积', formula: 'V = πr²h', example: 'r=3cm,h=5cm,V=141.3cm³' },
      { name: '圆锥体积', formula: 'V = πr²h ÷ 3', example: '与圆柱等底等高时，V圆锥=V圆柱÷3' },
    ],
    tips: ['体积是"所占空间"的大小', '圆锥体积别忘了÷3', '1升=1立方分米=1000毫升'],
  },
  {
    id: 'fraction',
    title: '分数运算',
    emoji: '🥧',
    formulas: [
      { name: '同分母加法', formula: 'a/c + b/c = (a+b)/c', example: '2/5 + 1/5 = 3/5' },
      { name: '同分母减法', formula: 'a/c - b/c = (a-b)/c', example: '4/7 - 2/7 = 2/7' },
      { name: '分数乘法', formula: 'a/b × c/d = (a×c)/(b×d)', example: '2/3 × 3/4 = 6/12 = 1/2' },
      { name: '分数除法', formula: 'a/b ÷ c/d = a/b × d/c', example: '2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12' },
      { name: '分数化小数', formula: '分子 ÷ 分母', example: '3/4 = 3 ÷ 4 = 0.75' },
    ],
    tips: ['异分母先通分', '乘除先约分更简便', '结果要化成最简分数'],
  },
  {
    id: 'unit',
    title: '单位换算',
    emoji: '🔄',
    formulas: [
      { name: '长度', formula: '1km=1000m, 1m=10dm=100cm', example: '2.5m = 250cm' },
      { name: '面积', formula: '1m²=100dm²=10000cm²', example: '3m² = 300dm²' },
      { name: '体积', formula: '1m³=1000dm³=1000000cm³', example: '2dm³ = 2000cm³' },
      { name: '重量', formula: '1t=1000kg, 1kg=1000g', example: '3.5kg = 3500g' },
      { name: '时间', formula: '1时=60分, 1分=60秒', example: '2.5时 = 150分' },
      { name: '人民币', formula: '1元=10角=100分', example: '3.5元 = 3元5角' },
    ],
    tips: ['大单位化小单位×进率', '小单位化大单位÷进率', '记住相邻单位间的进率'],
  },
  {
    id: 'ratio',
    title: '比和比例',
    emoji: '⚖️',
    formulas: [
      { name: '比的意义', formula: 'a:b = a÷b = a/b', example: '3:4 = 3÷4 = 0.75' },
      { name: '比的基本性质', formula: 'a:b = (a×c):(b×c) = (a÷c):(b÷c)', example: '4:6 = 2:3' },
      { name: '正比例', formula: 'y/x = k（一定）', example: '速度一定，路程和时间成正比例' },
      { name: '反比例', formula: 'x×y = k（一定）', example: '路程一定，速度和时间成反比例' },
    ],
    tips: ['比表示两个数的关系', '化简比和求比值不同', '判断比例看商还是看积'],
  },
  {
    id: 'percent',
    title: '百分数',
    emoji: '💯',
    formulas: [
      { name: '百分数意义', formula: '表示一个数是另一个数的百分之几', example: '50% = 50/100 = 0.5' },
      { name: '小数化百分数', formula: '小数 × 100%', example: '0.35 = 35%' },
      { name: '百分数化小数', formula: '百分数 ÷ 100', example: '75% = 0.75' },
      { name: '分数化百分数', formula: '先化小数，再×100%', example: '3/4=0.75=75%' },
      { name: '求百分率', formula: '部分÷总量×100%', example: '及格率=及格人数÷总人数×100%' },
      { name: '折扣', formula: '几折=百分之几十', example: '八折=80%，降价20%' },
    ],
    tips: ['百分数不能带单位', '百分号%相当于÷100', '折扣问题注意是降价还是现价'],
  },
]

export default function FormulasPage() {
  const [activeCategory, setActiveCategory] = useState<string>('arithmetic')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('formulas')
  }, [trackVisit])

  const copyFormula = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const activeFormulas = FORMULAS.find(f => f.id === activeCategory)

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📝 公式卡片</h1>
          <div className="w-20" />
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* 侧边栏分类 */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <h2 className="mb-4 font-bold text-slate-700">公式分类</h2>
              <div className="space-y-2">
                {FORMULAS.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{category.emoji}</span>
                    <span className="font-medium">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 公式内容 */}
          <div className="lg:col-span-3">
            {activeFormulas && (
              <div className="rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-4xl">{activeFormulas.emoji}</span>
                  <h2 className="text-2xl font-bold text-slate-800">{activeFormulas.title}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {activeFormulas.formulas.map((f, index) => (
                    <div
                      key={index}
                      className="group relative rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 transition hover:shadow-md"
                    >
                      <div className="mb-2 font-bold text-slate-700">{f.name}</div>
                      <div className="mb-2 rounded-xl bg-white p-3 text-center">
                        <code className="text-lg font-bold text-blue-600">{f.formula}</code>
                      </div>
                      {f.example && (
                        <div className="text-sm text-slate-500">例：{f.example}</div>
                      )}
                      <button
                        onClick={() => copyFormula(f.formula, `${activeCategory}-${index}`)}
                        className="absolute right-3 top-3 rounded-lg bg-white p-2 opacity-0 shadow-sm transition hover:bg-slate-50 group-hover:opacity-100"
                        title="复制公式"
                      >
                        {copiedId === `${activeCategory}-${index}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-amber-50 p-5">
                  <h3 className="mb-3 font-bold text-amber-800">💡 使用提示</h3>
                  <ul className="space-y-2">
                    {activeFormulas.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-700">
                        <span className="mt-1 text-amber-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
