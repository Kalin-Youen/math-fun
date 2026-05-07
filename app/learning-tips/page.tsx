'use client'

import Link from 'next/link'
import { ArrowLeft, Home, Clock, Brain, BookOpen, Target, Zap, Star, Heart, Lightbulb, Trophy, Timer, TrendingUp, Sparkles, Bookmark, CheckCircle, Users } from 'lucide-react'

interface Tip {
  id: string
  emoji: string
  title: string
  subtitle: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  steps: string[]
 适用场景: string[]
  效果: string
  icon: typeof Brain
}

// 学习技巧数据
const learningTips: Tip[] = [
  {
    id: 'feynman',
    emoji: '🎓',
    title: '费曼学习法',
    subtitle: '把学会的知识教给别人',
    color: 'text-violet-700',
    bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    description: '费曼学习法的核心是用简单易懂的语言解释复杂的概念。当你能够清晰地教会别人某个知识时，说明你真正掌握了它。',
    steps: [
      '选择一个概念或知识点',
      '用最简单的话解释给"小学生"听',
      '找出解释过程中的卡点和模糊处',
      '回去重新学习，直到能用简单语言解释',
      '用自己的话重新组织，形成完整讲解'
    ],
    适用场景: ['理解新概念', '复习旧知识', '准备考试', '深化理解'],
    效果: '将知识留存率从20%提升到90%',
    icon: BookOpen
  },
  {
    id: 'pomodoro',
    emoji: '🍅',
    title: '番茄工作法',
    subtitle: '专注25分钟，休息5分钟',
    color: 'text-red-700',
    bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    description: '番茄工作法通过将工作时间分成25分钟的专注时段和5分钟的休息时段，帮助保持注意力集中，提高学习效率。',
    steps: [
      '选择一个需要完成的任务',
      '设置25分钟计时器',
      '专注完成任务，不要中断',
      '计时器响后，休息5分钟',
      '每4个番茄钟后，休息15-30分钟'
    ],
    适用场景: ['做题练习', '复习功课', '完成作业', '长期学习'],
    效果: '将专注力提升3倍，减少拖延',
    icon: Timer
  },
  {
    id: 'memory-palace',
    emoji: '🏰',
    title: '记忆宫殿',
    subtitle: '把记忆内容放进"宫殿"',
    color: 'text-emerald-700',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    description: '记忆宫殿是一种古老而强大的记忆技巧，通过将信息与熟悉的空间位置关联起来，让记忆变得生动有趣。',
    steps: [
      '选择一个熟悉的地方（如家）',
      '在这个地方选择具体的"记忆桩"（如门口、沙发）',
      '将要记忆的内容转化为生动的图像',
      '将这些图像与记忆桩建立联系',
      '回忆时，在脑海中"走"一遍宫殿'
    ],
    适用场景: ['背乘法口诀', '记公式', '记历史事件', '记英语单词'],
    效果: '将记忆效率提升10倍以上',
    icon: Brain
  },
  {
    id: 'spaced-repetition',
    emoji: '🔄',
    title: '间隔重复',
    subtitle: '科学复习，拒绝遗忘',
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    description: '根据遗忘曲线，在即将遗忘时复习，能用最少的努力达到最好的记忆效果。这就是为什么错题本要定期复习的原因！',
    steps: [
      '学习新知识后，当天复习一次',
      '第2天再复习一次',
      '第4天复习',
      '第7天复习',
      '之后每两周复习一次'
    ],
    适用场景: ['背单词', '记公式', '错题复习', '考前突击'],
    效果: '用20%的努力达到80%的记忆效果',
    icon: TrendingUp
  },
  {
    id: 'chunking',
    emoji: '🧩',
    title: '分块记忆',
    subtitle: '化大为小，化繁为简',
    color: 'text-amber-700',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    description: '人类工作记忆一次只能处理4-7个信息块。通过将大量信息分成小块，更容易被大脑接受和记忆。',
    steps: [
      '面对大量信息时，先整体浏览',
      '将信息分成3-5个一组的小块',
      '给每个小块起个名字或标记',
      '逐个击破每个小块',
      '最后将所有小块串联起来'
    ],
    适用场景: ['记电话号码', '背长课文', '学新章节', '多位数运算'],
    效果: '将记忆容量提升5倍',
    icon: Sparkles
  },
  {
    id: 'active-recall',
    emoji: '💪',
    title: '主动回忆',
    subtitle: '合上书本，自己说出来',
    color: 'text-rose-700',
    bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    description: '研究表明，主动回忆比被动阅读的记忆效果好得多。强迫自己回忆的过程会强化记忆痕迹。',
    steps: [
      '阅读一段内容',
      '合上书或闭上眼睛',
      '尝试用自己的话复述',
      '写下或说出来所有记得的内容',
      '打开书对照，找出遗漏'
    ],
    适用场景: ['学新知识', '复习巩固', '做练习题', '自测检验'],
    效果: '比反复阅读效果好300%',
    icon: Zap
  },
  {
    id: 'growth-mindset',
    emoji: '🌱',
    title: '成长型思维',
    subtitle: '相信努力会带来进步',
    color: 'text-green-700',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    description: '相信"能力可以培养"的孩子，在面对困难时更愿意尝试，最终取得更大的成就。数学能力的提升需要时间和努力。',
    steps: [
      '把"我不懂"改成"我还没学会"',
      '把"太难了"改成"需要多练习"',
      '把"我放弃了"改成"我需要换个方法"',
      '每次犯错时，想一想"这次学到了什么"',
      '记住：努力的过程比结果更重要'
    ],
    适用场景: ['面对难题', '考试失利', '学习新知识', '建立自信'],
    效果: '将抗挫折能力提升100%',
    icon: Heart
  },
  {
    id: 'mind-map',
    emoji: '🗺️',
    title: '思维导图',
    subtitle: '让知识可视化、关联化',
    color: 'text-indigo-700',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    description: '思维导图通过图形化的方式展示知识点之间的关系，帮助理解知识结构，发现知识盲点。',
    steps: [
      '在纸中央写下主题',
      '从这个主题画出3-5条主分支',
      '在每个主分支写下子主题',
      '继续细分，画出更多分支',
      '用不同颜色、图画装饰'
    ],
    适用场景: ['整理章节内容', '复习知识点', '做学习计划', '分析应用题'],
    效果: '将知识点关联度提升200%',
    icon: Target
  },
]

// 学习方法论
const learningPrinciples = [
  { icon: Clock, text: '每天坚持比一次性突击更有效' },
  { icon: Star, text: '错题是最好的老师，要认真对待' },
  { icon: Lightbulb, text: '理解原理比死记硬背更重要' },
  { icon: Users, text: '教给同学是最好的复习方式' },
  { icon: Trophy, text: '设立小目标，完成后奖励自己' },
  { icon: CheckCircle, text: '做完题一定要检查，培养好习惯' },
]

export default function LearningTipsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* 导航栏 */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>

        {/* 标题区 */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700">
            <Brain className="h-4 w-4" />
            学习技巧库
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-800 sm:text-4xl">
            科学学习方法
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> 让学习更高效</span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-600">
            汇集全网精选的学习方法和记忆技巧，帮助孩子找到最适合自己的学习方式
          </p>
        </header>

        {/* 学习原则 */}
        <section className="mb-10">
          <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white shadow-xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Star className="h-5 w-5" />
              黄金学习原则
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {learningPrinciples.map((p, i) => {
                const Icon = p.icon
                return (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-white/10 p-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{p.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 学习技巧卡片 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {learningTips.map((tip) => {
            const Icon = tip.icon
            return (
              <div
                key={tip.id}
                className={`overflow-hidden rounded-2xl border ${tip.borderColor} ${tip.bgColor} shadow-lg transition-all hover:shadow-xl hover:-translate-y-1`}
              >
                {/* 头部 */}
                <div className={`border-b ${tip.borderColor} p-5`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tip.color.replace('text-', 'from-').replace('-700', '-400')} to-white shadow-sm`}>
                      <Icon className={`h-6 w-6 ${tip.color}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${tip.color}`}>{tip.title}</h3>
                      <p className="text-sm text-slate-500">{tip.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{tip.description}</p>
                </div>

                {/* 步骤 */}
                <div className="p-5">
                  <h4 className={`mb-3 flex items-center gap-2 font-bold ${tip.color}`}>
                    <CheckCircle className="h-4 w-4" />
                    具体步骤
                  </h4>
                  <ol className="space-y-2">
                    {tip.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tip.color.replace('text-', 'from-').replace('-700', '-400')} text-xs font-bold text-white`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* 底部 */}
                <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white/50 p-4">
                  <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    <Bookmark className="h-3 w-3" />
                    适用：
                  </div>
                  {tip.适用场景.map((scene, i) => (
                    <span key={i} className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                      {scene}
                    </span>
                  ))}
                  <div className="mt-2 w-full rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-2 text-xs text-green-700">
                    ✨ 效果：{tip.效果}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 学习建议 */}
        <section className="mt-10">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              给小朋友的建议
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-amber-50 p-4">
                <h3 className="mb-2 font-bold text-amber-700">🌟 每天这样做</h3>
                <ul className="space-y-1 text-sm text-amber-600">
                  <li>• 先复习再做作业</li>
                  <li>• 错题当天弄懂</li>
                  <li>• 睡前复习当天学的</li>
                  <li>• 周末总结一周内容</li>
                </ul>
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                <h3 className="mb-2 font-bold text-green-700">🎯 考试这样做</h3>
                <ul className="space-y-1 text-sm text-green-600">
                  <li>• 先易后难</li>
                  <li>• 做完检查一遍</li>
                  <li>• 不确定的做好标记</li>
                  <li>• 不会的先跳过</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 底部导航 */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            开始学习之旅
          </Link>
        </div>
      </div>
    </main>
  )
}
