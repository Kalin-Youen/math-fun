'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, BookOpen, Video, FileText, Download, Github } from 'lucide-react'
import Link from 'next/link'
import { useAchievements } from '@/lib/achievements'

interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: 'github' | 'pdf' | 'video' | 'website'
  category: string
  tags: string[]
}

const RESOURCES: Resource[] = [
  {
    id: 'chinatxt',
    title: 'ChinaTextbook - 中国教材库',
    description: 'GitHub 52k+ stars 的开源项目，提供小学到大学的PDF教材资源，包含人教版、北师大版等主流教材',
    url: 'https://github.com/TapXWorld/ChinaTextbook',
    type: 'github',
    category: '教材资源',
    tags: ['PDF', '人教版', '北师大版', '苏教版']
  },
  {
    id: 'math-drills',
    title: 'Math-Drills - 数学练习题库',
    description: '海量免费可打印的数学练习题，按年级和主题分类，支持PDF下载',
    url: 'https://www.math-drills.com/',
    type: 'website',
    category: '练习题库',
    tags: ['打印', '练习题', '免费']
  },
  {
    id: 'khan-academy',
    title: 'Khan Academy - 可汗学院',
    description: '全球知名的免费教育平台，提供小学数学视频课程和互动练习',
    url: 'https://zh.khanacademy.org/math',
    type: 'website',
    category: '视频课程',
    tags: ['视频', '互动', '免费']
  },
  {
    id: 'mathworksheets',
    title: 'K12 Math Worksheets',
    description: '针对K-12学生的数学工作表，涵盖算术、代数、几何等多个领域',
    url: 'http://www.k12mathworksheets.com/',
    type: 'website',
    category: '练习题库',
    tags: ['K12', '工作表', '可打印']
  },
  {
    id: 'teachingimage',
    title: 'Teaching Image - 视觉数学',
    description: '提供带视觉模型的数学练习册，包括数轴、分数图形等直观教具',
    url: 'http://www.teachingimage.com/',
    type: 'website',
    category: '教具资源',
    tags: ['视觉化', '分数', '数轴']
  },
  {
    id: 'mathisfun',
    title: 'Math is Fun - 数学趣味学习',
    description: '用简单有趣的方式解释数学概念，包含大量互动演示',
    url: 'https://www.mathsisfun.com/',
    type: 'website',
    category: '学习网站',
    tags: ['趣味', '互动', '英文']
  },
  {
    id: 'ixl-math',
    title: 'IXL Math - 自适应练习',
    description: '智能数学练习平台，根据学生水平自动调整难度（部分免费）',
    url: 'https://www.ixl.com/math/',
    type: 'website',
    category: '自适应学习',
    tags: ['自适应', '智能', '练习']
  },
  {
    id: 'desmos',
    title: 'Desmos - 图形计算器',
    description: '免费的在线图形计算器，适合学习函数和几何',
    url: 'https://www.desmos.com/calculator',
    type: 'website',
    category: '工具',
    tags: ['图形', '计算器', '函数']
  },
  {
    id: 'mathplayground',
    title: 'Math Playground - 数学游戏',
    description: '通过游戏学习数学，包含逻辑游戏、数学故事等',
    url: 'https://www.mathplayground.com/',
    type: 'website',
    category: '游戏学习',
    tags: ['游戏', '趣味', '逻辑']
  },
  {
    id: 'singaporemath',
    title: 'Singapore Math - 新加坡数学',
    description: '新加坡数学教学法资源，以CPA（具体-形象-抽象）方法著称',
    url: 'https://www.singaporemath.com/',
    type: 'website',
    category: '教学方法',
    tags: ['新加坡数学', 'CPA', '方法']
  },
  {
    id: 'ziml',
    title: 'ZIML - 数学竞赛题库',
    description: '美国数学竞赛练习题，适合学有余力的学生挑战',
    url: 'https://ziml.areteem.org/',
    type: 'website',
    category: '竞赛资源',
    tags: ['竞赛', '挑战', '奥数']
  },
  {
    id: 'brilliant',
    title: 'Brilliant - 思维训练',
    description: '通过互动问题培养数学思维，每日一题挑战',
    url: 'https://brilliant.org/',
    type: 'website',
    category: '思维训练',
    tags: ['思维', '每日一题', '互动']
  }
]

const CATEGORIES = Array.from(new Set(RESOURCES.map(r => r.category)))

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { trackVisit } = useAchievements()

  useEffect(() => {
    trackVisit('resources')
  }, [trackVisit])

  const filteredResources = selectedCategory
    ? RESOURCES.filter(r => r.category === selectedCategory)
    : RESOURCES

  const getIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github className="h-5 w-5" />
      case 'pdf': return <FileText className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      default: return <ExternalLink className="h-5 w-5" />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
            <span>返回首页</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">📚 开源资源库</h1>
          <div className="w-20" />
        </header>

        {/* 介绍 */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
          <h2 className="mb-2 text-xl font-bold">精选数学教育资源</h2>
          <p className="text-indigo-100">
            这里汇集了国内外优质的开源数学教育资源，包括教材、练习题、视频课程等。
            所有资源均可免费使用，助力小学数学学习！
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-4 py-2 font-medium transition ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            全部资源
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 font-medium transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 资源列表 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white p-5 shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white">
                    {getIcon(resource.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition">
                      {resource.title}
                    </h3>
                    <span className="text-xs text-slate-400">{resource.category}</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-violet-400" />
              </div>
              
              <p className="mb-3 text-sm text-slate-600 line-clamp-2">
                {resource.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-violet-50 px-2 py-1 text-xs font-medium text-violet-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* 使用提示 */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-amber-800">
            <BookOpen className="h-5 w-5" />
            使用建议
          </h3>
          <ul className="space-y-2 text-amber-700">
            <li>• <strong>ChinaTextbook</strong>：可以下载PDF教材用于备课或学生预习复习</li>
            <li>• <strong>Math-Drills</strong>：生成打印版练习题，适合课后作业</li>
            <li>• <strong>可汗学院</strong>：学生可以自主学习，视频讲解清晰易懂</li>
            <li>• <strong>Desmos</strong>：适合高年级学生学习函数图像</li>
            <li>• 建议根据学生年级和学习进度选择合适的资源</li>
          </ul>
        </div>

        {/* 贡献资源 */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
          <p className="mb-2 text-slate-600">发现更多优质资源？</p>
          <p className="text-sm text-slate-400">
            可以通过 GitHub 提交 Issue 或 PR 来添加更多教育资源
          </p>
        </div>
      </div>
    </main>
  )
}
