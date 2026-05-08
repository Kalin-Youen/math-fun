'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Trophy,
  Rocket,
  Timer,
  TrendingUp,
  Sparkles,
  Crown,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { useAchievements } from '@/lib/achievements'
import { useUserProfile, getLevelTitle, getLevelColor } from '@/lib/user-profile'
import { getTodayStats, getStreakDays } from '@/lib/storage'
import { WelcomeLuoXiaoHei } from '@/components/LuoXiaoHei'

// 年级数据
const gradeData = [
  {
    id: 1,
    title: '一年级',
    emoji: '🌱',
    subtitle: '数数、加减法、认识图形',
    color: 'from-green-400 to-emerald-500',
    bgLight: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    topics: ['1~20的认识', '10以内加减法', '20以内进位加法', '认识图形', '认识钟表', '认识人民币'],
    icon: '🌸',
  },
  {
    id: 2,
    title: '二年级',
    emoji: '🌿',
    subtitle: '乘法口诀、除法、长度单位',
    color: 'from-teal-400 to-cyan-500',
    bgLight: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-600',
    topics: ['100以内加减法', '乘法口诀表', '表内除法', '混合运算', '长度单位', '角的初步认识'],
    icon: '🍀',
  },
  {
    id: 3,
    title: '三年级',
    emoji: '🌳',
    subtitle: '多位数运算、分数、周长面积',
    color: 'from-blue-400 to-indigo-500',
    bgLight: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    topics: ['万以内加减法', '多位数乘一位数', '两位数乘两位数', '分数初步认识', '长方形正方形周长', '面积'],
    icon: '🍃',
  },
  {
    id: 4,
    title: '四年级',
    emoji: '🌲',
    subtitle: '大数、小数、三角形、平行四边形',
    color: 'from-violet-400 to-purple-500',
    bgLight: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    topics: ['大数的认识', '小数的意义和性质', '三角形', '观察物体', '运算定律'],
    icon: '🍁',
  },
  {
    id: 5,
    title: '五年级',
    emoji: '🌴',
    subtitle: '方程、分数运算、多边形面积',
    color: 'from-orange-400 to-amber-500',
    bgLight: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    topics: ['小数乘除法', '简易方程', '多边形面积', '分数加减法', '因数与倍数'],
    icon: '🌾',
  },
  {
    id: 6,
    title: '六年级',
    emoji: '🌟',
    subtitle: '百分数、圆、比例、统计',
    color: 'from-rose-400 to-pink-500',
    bgLight: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    topics: ['百分数', '圆的周长和面积', '比例', '正比例和反比例', '统计与概率'],
    icon: '🎓',
  },
]

// 快捷功能
const quickTools = [
  { title: '数学大冒险', emoji: '🏆', href: '/adventure', desc: '闯关游戏', color: 'from-yellow-400 to-orange-500' },
  { title: '智能练习', emoji: '🧠', href: '/practice', desc: 'AI出题', color: 'from-indigo-400 to-purple-500' },
  { title: 'AI辅导', emoji: '🤖', href: '/ai-tutor', desc: '拍照解题', color: 'from-cyan-400 to-blue-500' },
  { title: '九九乘法表', emoji: '✖️', href: '/multiplication-table', desc: '记忆口诀', color: 'from-emerald-400 to-teal-500' },
  { title: '家长监控', emoji: '👨‍👩‍👧', href: '/parent-dashboard', desc: '学习报告', color: 'from-pink-400 to-rose-500' },
  { title: '学习技巧', emoji: '🎓', href: '/learning-tips', desc: '方法大全', color: 'from-violet-400 to-fuchsia-500' },
]

// 学习技巧数据
const learningTips = [
  { icon: Timer, title: '番茄工作法', desc: '25分钟专注学习' },
  { icon: TrendingUp, title: '循序渐进', desc: '从简单到复杂' },
  { icon: Sparkles, title: '费曼学习法', desc: '讲给别人听' },
  { icon: Crown, title: '目标激励', desc: '完成小目标' },
]

export default function HomePage() {
  const { achievements, unlockedCount } = useAchievements()
  const { profile, isLoaded } = useUserProfile()
  const todayStats = getTodayStats()
  const streakDays = getStreakDays()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 pt-10 pb-14 text-white">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-6xl">
          {/* 用户状态栏 */}
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
          
          {/* 主标题 */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Rocket className="h-4 w-4" />
              小学数学乐园
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              选择你的年级
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> 开始学习</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base opacity-95 leading-relaxed">
              覆盖小学1-6年级全部知识点，点击对应年级即可开始学习
            </p>
          </div>
        </div>
      </section>

      {/* 学习技巧提示条 */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* 罗小黑欢迎 */}
          <div className="mb-6">
            <WelcomeLuoXiaoHei />
          </div>
          
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

      {/* ===== 年级入口（核心区域）===== */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <span className="text-3xl">📚</span>
                选择年级
              </h2>
              <p className="mt-1 text-slate-500">点击进入对应年级，开始系统学习</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gradeData.map((grade) => (
              <Link key={grade.id} href={`/grade/${grade.id}`} className="group block">
                <div className={`relative overflow-hidden rounded-3xl border-2 ${grade.borderColor} bg-gradient-to-br ${grade.bgLight} p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]`}>
                  {/* 装饰光斑 */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-2xl transition-all duration-300 group-hover:scale-150" />
                  
                  {/* 年级标识 */}
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${grade.color} text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {grade.emoji}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {grade.title}
                        </h3>
                        <p className="text-sm text-slate-500">{grade.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
                  </div>

                  {/* 知识点标签 */}
                  <div className="relative flex flex-wrap gap-2">
                    {grade.topics.map((topic, i) => (
                      <span 
                        key={i} 
                        className={`rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors group-hover:bg-white`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* 底部统计 */}
                  <div className="relative mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{grade.topics.length}个知识点</span>
                    </div>
                    <div className={`rounded-full bg-gradient-to-r ${grade.color} px-3 py-1 text-xs font-bold text-white shadow-sm transition-all group-hover:shadow-md`}>
                      开始学习 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 快捷功能 ===== */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <span className="text-3xl">⚡</span>
                快捷功能
              </h2>
              <p className="mt-1 text-slate-500">常用工具和特色功能</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {quickTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block">
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {tool.emoji}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-700">{tool.title}</div>
                    <div className="text-xs text-slate-400">{tool.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 学习技巧入口 ===== */}
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
                  <p className="text-sm opacity-90">费曼学习法、记忆宫殿、番茄工作法... 18种学习方法</p>
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

      {/* ===== 成就展示 ===== */}
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
            <Link href="/" className="hover:text-white transition-colors">首页</Link>
            <span>·</span>
            <Link href="/dashboard" className="hover:text-white transition-colors">学习报告</Link>
            <span>·</span>
            <Link href="/parent-dashboard" className="hover:text-white transition-colors">家长监控</Link>
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
