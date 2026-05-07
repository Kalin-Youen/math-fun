'use client'

import Link from 'next/link'
import { Calculator, Grid3X3, Sparkles, BookOpen, Clock, MessageCircle, Printer, Trophy, PenTool, Search, GitBranch, Brain, Lightbulb, Ruler, BarChart3, Calendar, BookX, Layers, Zap, Star, Target, AlertTriangle, PieChart } from 'lucide-react'
import { useAchievements } from '@/lib/achievements'
import { useUserProfile, getLevelTitle, getLevelColor } from '@/lib/user-profile'
import { getTodayStats, getStreakDays } from '@/lib/storage'

interface ModuleType {
  title: string
  desc: string
  icon: typeof Calculator
  href: string
  gradient: string
  emoji: string
  bg: string
  xpReward?: number
}

const coreModules: ModuleType[] = [
  {
    title: '速算练习',
    desc: '加减乘除限时挑战，越算越快！',
    icon: Calculator,
    href: '/speed-calc',
    gradient: 'from-orange-400 via-pink-500 to-rose-500',
    emoji: '⚡',
    bg: 'bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50',
    xpReward: 15,
  },
  {
    title: '九九乘法表',
    desc: '彩色乘法表 + 记忆小窍门',
    icon: Grid3X3,
    href: '/multiplication-table',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    emoji: '✖️',
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    xpReward: 10,
  },
  {
    title: '趣味数学',
    desc: '猜数字、找规律、比大小…',
    icon: Sparkles,
    href: '/fun',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    emoji: '🎯',
    bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
    xpReward: 12,
  },
  {
    title: '应用题',
    desc: '故事化数学应用题练习',
    icon: MessageCircle,
    href: '/word-problems',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    emoji: '📖',
    bg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50',
    xpReward: 20,
  },
]

const processModules: ModuleType[] = [
  {
    title: '竖式计算演示',
    desc: '一步一步看懂竖式，进位借位全明白',
    icon: PenTool,
    href: '/column-calc',
    gradient: 'from-indigo-400 via-violet-500 to-purple-500',
    emoji: '📐',
    bg: 'bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50',
  },
  {
    title: '审题训练',
    desc: '标注关键词、判断运算方法',
    icon: Search,
    href: '/read-carefully',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    emoji: '🔍',
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
  },
  {
    title: '解题步骤',
    desc: '读题→分析→列式→计算→检验',
    icon: GitBranch,
    href: '/solve-steps',
    gradient: 'from-teal-400 via-emerald-500 to-green-500',
    emoji: '📝',
    bg: 'bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50',
  },
  {
    title: '易错题分析',
    desc: '典型错误案例 + 避坑指南',
    icon: AlertTriangle,
    href: '/mistakes',
    gradient: 'from-red-400 via-rose-500 to-pink-500',
    emoji: '⚠️',
    bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50',
  },
]

const conceptModules: ModuleType[] = [
  {
    title: '数感训练',
    desc: '数的组成、位值、估算',
    icon: Brain,
    href: '/number-sense',
    gradient: 'from-blue-400 via-indigo-500 to-violet-500',
    emoji: '🧠',
    bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50',
  },
  {
    title: '快速问答',
    desc: '限时抢答，训练反应速度',
    icon: Zap,
    href: '/quick-quiz',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    emoji: '⚡',
    bg: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
  },
  {
    title: '抽象概念',
    desc: '用图形理解抽象数学概念',
    icon: Lightbulb,
    href: '/concepts',
    gradient: 'from-cyan-400 via-sky-500 to-blue-500',
    emoji: '💡',
    bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50',
  },
  {
    title: '数轴探索',
    desc: '在数轴上理解数的大小和运算',
    icon: Ruler,
    href: '/number-line',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    emoji: '📏',
    bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
  },
]

const toolModules: ModuleType[] = [
  {
    title: '分数可视化',
    desc: '饼图、条形图理解分数',
    icon: PieChart,
    href: '/fractions',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    emoji: '🥧',
    bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50',
  },
  {
    title: '认钟表',
    desc: '互动时钟，学习看时间',
    icon: Clock,
    href: '/clock',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    emoji: '🕐',
    bg: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
  },
  {
    title: '公式卡片',
    desc: '周长、面积、体积公式速查',
    icon: BookOpen,
    href: '/formulas',
    gradient: 'from-purple-400 via-violet-500 to-indigo-500',
    emoji: '📝',
    bg: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50',
  },
  {
    title: '打印练习册',
    desc: '生成可打印练习题',
    icon: Printer,
    href: '/worksheet',
    gradient: 'from-slate-400 via-gray-500 to-zinc-500',
    emoji: '🖨️',
    bg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
  },
]

const learningModules: ModuleType[] = [
  {
    title: '学习仪表盘',
    desc: '进度追踪、薄弱环节、学习报告',
    icon: BarChart3,
    href: '/dashboard',
    gradient: 'from-indigo-400 via-blue-500 to-cyan-500',
    emoji: '📊',
    bg: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50',
  },
  {
    title: '每日一练',
    desc: '每天10道题+打卡，养成好习惯',
    icon: Calendar,
    href: '/daily',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    emoji: '📅',
    bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
  },
  {
    title: '错题本',
    desc: '自动收集错题，定期复习',
    icon: BookX,
    href: '/mistake-book',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    emoji: '📕',
    bg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-red-50',
  },
  {
    title: '口算闪卡',
    desc: '乘法口诀/公式闪卡快速记忆',
    icon: Layers,
    href: '/flash-cards',
    gradient: 'from-violet-400 via-fuchsia-500 to-pink-500',
    emoji: '🃏',
    bg: 'bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50',
  },
]

const resourceModules: ModuleType[] = [
  {
    title: '开源资源库',
    desc: 'GitHub教材、练习题、视频课程',
    icon: BookOpen,
    href: '/resources',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    emoji: '📚',
    bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
  },
]

function ModuleCard({ module }: { module: ModuleType }) {
  const Icon = module.icon
  return (
    <Link href={module.href} className="group block h-full">
      <div className={`relative h-full overflow-hidden rounded-2xl ${module.bg} p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl" />
        <div className="relative">
          <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} text-white shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="mb-1 text-xl">{module.emoji}</div>
          <h3 className="mb-1 text-sm font-bold text-slate-800">{module.title}</h3>
          <p className="text-xs text-slate-500">{module.desc}</p>
          {'xpReward' in module && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
              <Star className="h-3 w-3 fill-amber-500" />
              +{module.xpReward} XP
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span className="text-xl">{emoji}</span>
        {title}
      </h2>
    </div>
  )
}

export default function HomePage() {
  const { achievements, unlockedCount } = useAchievements()
  const { profile, isLoaded } = useUserProfile()
  const todayStats = getTodayStats()
  const streakDays = getStreakDays()

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 pb-8 pt-12 text-white">
        <div className="mx-auto max-w-6xl">
          {/* 用户状态栏 */}
          {isLoaded && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getLevelColor(profile.level.level)} text-lg`}>
                  {profile.avatar}
                </div>
                <div>
                  <div className="font-bold">{profile.name}</div>
                  <div className="text-xs opacity-80">{getLevelTitle(profile.level.level)}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold">{profile.level.level}</div>
                  <div className="text-xs opacity-70">等级</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{streakDays}</div>
                  <div className="text-xs opacity-70">连续打卡</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{todayStats.questionsDone}</div>
                  <div className="text-xs opacity-70">今日做题</div>
                </div>
              </div>
            </div>
          )}
          
          {/* 欢迎标题 */}
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-300" />
              小学数学乐园
            </div>
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
              让数学学习变得有趣又高效
            </h1>
            <p className="mx-auto max-w-xl text-sm opacity-90">
              覆盖小学1-6年级全部知识点，通过游戏化练习、可视化演示和智能错题本，帮助孩子建立扎实的数学基础
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1">92个知识点</span>
              <span className="rounded-full bg-white/20 px-3 py-1">22个学习模块</span>
              <span className="rounded-full bg-white/20 px-3 py-1">20个成就徽章</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能模块 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🎯" title="核心训练" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coreModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 过程模块 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🧩" title="解题过程" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 概念理解 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="💡" title="概念理解" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {conceptModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 可视化工具 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🔧" title="可视化工具" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {toolModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 学习管理 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="📊" title="学习管理" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {learningModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 开源资源 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="📚" title="开源资源" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {resourceModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 成就展示 */}
      {unlockedCount > 0 && (
        <section className="px-4 py-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-slate-700">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  我的成就 ({unlockedCount}/{achievements.length})
                </h2>
                <Link href="/dashboard" className="text-sm text-indigo-600">
                  查看全部 →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.filter(a => a.unlocked).slice(0, 6).map((a) => (
                  <span key={a.id} className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                    {a.emoji} {a.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 页脚 */}
      <footer className="px-4 py-8 text-center text-slate-500">
        <p className="text-sm">数学乐园 · 让每个孩子都能爱上数学</p>
      </footer>
    </main>
  )
}
