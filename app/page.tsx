'use client'

import Link from 'next/link'
import { Calculator, Grid3X3, Sparkles, BookOpen, Clock, MessageCircle, Printer, Trophy, PenTool, Search, GitBranch, Brain, Lightbulb, Ruler, BarChart3, Calendar, BookX, Layers, Zap, Star, Target, AlertTriangle, PieChart, ArrowRight, Sparkles as SparkleIcon, Crown, Rocket, BookMarked, GraduationCap, Timer, TrendingUp } from 'lucide-react'
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
  badge?: string
}

// 使用 Sparkles 作为 Map 图标
const MapIcon = Sparkles

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
    badge: '热门',
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
    badge: '必学',
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
    badge: '难点',
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
    badge: '推荐',
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
    title: '学习技巧库',
    desc: '全网精选学习方法和记忆技巧',
    icon: GraduationCap,
    href: '/learning-tips',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    emoji: '🎓',
    bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
    badge: '新',
  },
  {
    title: '知识地图',
    desc: '1-6年级数学知识点全景图',
    icon: MapIcon,
    href: '/knowledge-map',
    gradient: 'from-cyan-400 via-sky-500 to-blue-500',
    emoji: '🗺️',
    bg: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50',
  },
]

function ModuleCard({ module }: { module: ModuleType }) {
  const Icon = module.icon
  return (
    <Link href={module.href} className="group block h-full">
      <div className={`relative h-full overflow-hidden rounded-2xl ${module.bg} p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]`}>
        {/* 装饰光斑 */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-2xl transition-all duration-300 group-hover:scale-150" />
        
        {/* 标签 */}
        {module.badge && (
          <div className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            module.badge === '热门' ? 'bg-orange-100 text-orange-600' :
            module.badge === '必学' ? 'bg-emerald-100 text-emerald-600' :
            module.badge === '难点' ? 'bg-rose-100 text-rose-600' :
            module.badge === '推荐' ? 'bg-green-100 text-green-600' :
            'bg-violet-100 text-violet-600'
          }`}>
            {module.badge}
          </div>
        )}
        
        <div className="relative">
          {/* 图标 */}
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className="h-6 w-6" />
          </div>
          
          {/* 标题 */}
          <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{module.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{module.desc}</p>
          
          {/* XP 奖励 */}
          {'xpReward' in module && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-600">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>+{module.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function SectionTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <span className="text-2xl">{emoji}</span>
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <ArrowRight className="h-5 w-5 text-slate-300" />
    </div>
  )
}

// 学习技巧数据
const learningTips = [
  { icon: Timer, title: '番茄工作法', desc: '25分钟专注学习，5分钟休息' },
  { icon: TrendingUp, title: '循序渐进', desc: '从简单到复杂，稳步提升' },
  { icon: SparkleIcon, title: '费曼学习法', desc: '学会后讲给别人听' },
  { icon: Crown, title: '目标激励', desc: '设定小目标，完成后奖励自己' },
]

// 统计数据
const stats = [
  { value: '92+', label: '知识点' },
  { value: '22', label: '学习模块' },
  { value: '500+', label: '练习题' },
  { value: '∞', label: '学习乐趣' },
]

export default function HomePage() {
  const { achievements, unlockedCount } = useAchievements()
  const { profile, isLoaded } = useUserProfile()
  const todayStats = getTodayStats()
  const streakDays = getStreakDays()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section - 优化布局 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 pt-10 pb-16 text-white">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-6xl">
          {/* 用户状态栏 - 卡片式设计 */}
          {isLoaded && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getLevelColor(profile.level.level)} text-2xl shadow-lg`}>
                  {profile.avatar}
                </div>
                <div>
                  <div className="text-lg font-bold">{profile.name}</div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{getLevelTitle(profile.level.level)}</span>
                    <span>等级 {profile.level.level}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{streakDays}</div>
                  <div className="text-xs opacity-80">🔥 连续打卡</div>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{todayStats.questionsDone}</div>
                  <div className="text-xs opacity-80">📝 今日做题</div>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{profile.level.totalXP}</div>
                  <div className="text-xs opacity-80">⭐ 总经验值</div>
                </div>
              </div>
            </div>
          )}
          
          {/* 主标题区域 */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Rocket className="h-4 w-4" />
              小学数学乐园
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              让数学学习变得
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> 有趣又高效</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base opacity-95 leading-relaxed">
              覆盖小学1-6年级全部知识点，通过游戏化练习、可视化演示和智能学习系统，帮助孩子建立扎实的数学基础
            </p>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                  <div className="text-xs opacity-80 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 学习技巧提示条 */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            {learningTips.map((tip, i) => {
              const Icon = tip.icon
              return (
                <Link key={i} href="/learning-tips" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <span>{tip.title}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{tip.desc}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 核心功能模块 */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🎯" title="核心训练" subtitle="提升计算能力和解题技巧" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 学习技巧入口 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/learning-tips" className="group block overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-6 text-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold">学习技巧库</h3>
                  <p className="text-sm opacity-90">费曼学习法、记忆宫殿、番茄工作法...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium transition-transform group-hover:translate-x-2">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 过程模块 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🧩" title="解题过程" subtitle="培养良好的解题习惯" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 概念理解 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="💡" title="概念理解" subtitle="打好数学思维基础" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {conceptModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 可视化工具 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="🔧" title="可视化工具" subtitle="让抽象概念变得直观" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 学习管理 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="📊" title="学习管理" subtitle="科学追踪学习进度" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 开源资源 */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <SectionTitle emoji="📚" title="拓展资源" subtitle="更多学习内容等你探索" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resourceModules.map((m) => (
              <ModuleCard key={m.href} module={m} />
            ))}
          </div>
        </div>
      </section>

      {/* 成就展示 */}
      {unlockedCount > 0 && (
        <section className="px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    <h2 className="text-lg font-bold">我的成就</h2>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">{unlockedCount}/{achievements.length}</span>
                  </div>
                  <Link href="/dashboard" className="text-sm font-medium underline underline-offset-2">
                    查看全部 →
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 p-4">
                {achievements.filter(a => a.unlocked).slice(0, 8).map((a) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 shadow-sm">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-sm font-medium text-slate-700">{a.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 页脚 */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 text-2xl font-bold">🏆 小学数学乐园</div>
          <p className="mb-4 text-sm text-slate-400">让每个孩子都能爱上数学</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <Link href="/knowledge-map" className="hover:text-white transition-colors">知识地图</Link>
            <span>·</span>
            <Link href="/dashboard" className="hover:text-white transition-colors">学习报告</Link>
            <span>·</span>
            <Link href="/resources" className="hover:text-white transition-colors">开源资源</Link>
          </div>
          <div className="mt-6 text-xs text-slate-600">
            Built with ❤️ for Chinese elementary students
          </div>
        </div>
      </footer>
    </main>
  )
}
