'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home, Clock, Brain, BookOpen, Target, Zap, Star, Heart, Lightbulb, Trophy, Timer, TrendingUp, Sparkles, Bookmark, CheckCircle, Users, Rocket, Eye, Edit3, Crown, Shield, Mountain, Layers, Compass, Puzzle, BookMarked, GraduationCap, Wand, Gem, Flag } from 'lucide-react'

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
  difficulty: '入门' | '进阶' | '高级'
  category: '记忆' | '方法' | '习惯' | '思维'
}

// 全网精选学习技巧 - 大幅扩充版本
const learningTips: Tip[] = [
  // ========== 记忆技巧 ==========
  {
    id: 'feynman',
    emoji: '🎓',
    title: '费曼学习法',
    subtitle: '把学会的知识教给别人',
    color: 'text-violet-700',
    bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    description: '费曼学习法的核心是用简单易懂的语言解释复杂的概念。当你能够清晰地教会别人某个知识时，说明你真正掌握了它。这是世界公认最高效的学习方法之一。',
    steps: [
      '选择一个概念或知识点',
      '用最简单的话解释给"小学生"听',
      '找出解释过程中的卡点和模糊处',
      '回去重新学习，直到能用简单语言解释',
      '用自己的话重新组织，形成完整讲解'
    ],
    适用场景: ['理解新概念', '复习旧知识', '准备考试', '深化理解'],
    效果: '将知识留存率从20%提升到90%',
    icon: BookOpen,
    difficulty: '入门',
    category: '方法'
  },
  {
    id: 'memory-palace',
    emoji: '🏰',
    title: '记忆宫殿',
    subtitle: '把记忆内容放进"宫殿"',
    color: 'text-emerald-700',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    description: '记忆宫殿是一种古老而强大的记忆技巧，通过将信息与熟悉的空间位置关联起来，让记忆变得生动有趣。古代罗马人就用这种方法记住大量信息。',
    steps: [
      '选择一个熟悉的地方（如家、学校）',
      '在这个地方选择具体的"记忆桩"（如门口、沙发、床头柜）',
      '将要记忆的内容转化为生动的、荒诞的图像',
      '将这些图像与记忆桩建立夸张的联系',
      '回忆时，在脑海中"走"一遍宫殿'
    ],
    适用场景: ['背乘法口诀', '记公式', '记历史年代', '记英语单词'],
    效果: '将记忆效率提升10倍以上',
    icon: Brain,
    difficulty: '进阶',
    category: '记忆'
  },
  {
    id: 'spaced-repetition',
    emoji: '🔄',
    title: '间隔重复',
    subtitle: '科学复习，拒绝遗忘',
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    description: '根据艾宾浩斯遗忘曲线，在即将遗忘时复习，能用最少的努力达到最好的记忆效果。这是被科学验证的最有效复习方法。',
    steps: [
      '学习新知识后，立刻复习一次（5分钟后）',
      '第2天再复习一次',
      '第4天复习',
      '第7天复习',
      '第14天复习',
      '之后每月复习一次'
    ],
    适用场景: ['背单词', '记公式', '错题复习', '考前突击'],
    效果: '用20%的努力达到80%的记忆效果',
    icon: TrendingUp,
    difficulty: '入门',
    category: '记忆'
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
      '面对大量信息时，先整体浏览一遍',
      '将信息分成3-5个一组的小块',
      '给每个小块起个名字或标记',
      '逐个击破每个小块',
      '最后将所有小块串联起来'
    ],
    适用场景: ['记电话号码', '背长课文', '学新章节', '多位数运算'],
    效果: '将记忆容量提升5倍',
    icon: Layers,
    difficulty: '入门',
    category: '记忆'
  },
  {
    id: 'association',
    emoji: '🔗',
    title: '联想记忆法',
    subtitle: '让知识串成故事',
    color: 'text-rose-700',
    bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    description: '通过联想和编故事的方式，把孤立的知识点串联起来。越荒诞、越夸张的联想，记忆越深刻。',
    steps: [
      '找出要记忆的关键词',
      '让每个关键词产生一个生动的画面',
      '把这些画面编成一个荒诞的故事',
      '故事越夸张越好（，大象在飞、房子在跳舞）',
      '回忆时，回放这个故事'
    ],
    适用场景: ['记历史事件', '记英语单词', '记数学公式', '记忆序列'],
    效果: '长期记忆率提升300%',
    icon: Sparkles,
    difficulty: '进阶',
    category: '记忆'
  },

  // ========== 方法技巧 ==========
  {
    id: 'pomodoro',
    emoji: '🍅',
    title: '番茄工作法',
    subtitle: '25分钟专注，5分钟休息',
    color: 'text-red-700',
    bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    description: '番茄工作法通过将工作时间分成25分钟的专注时段和5分钟的休息时段，帮助保持注意力集中，提高学习效率。简单易行，适合小学生。',
    steps: [
      '选择一个需要完成的任务',
      '设置25分钟计时器（可以用手机或计时器）',
      '专注完成任务，不要中断',
      '计时器响后，休息5分钟，站起来活动一下',
      '每4个番茄钟后，休息15-30分钟'
    ],
    适用场景: ['做题练习', '复习功课', '完成作业', '长期学习'],
    效果: '将专注力提升3倍，减少拖延',
    icon: Timer,
    difficulty: '入门',
    category: '方法'
  },
  {
    id: 'active-recall',
    emoji: '💪',
    title: '主动回忆',
    subtitle: '合上书本，自己说出来',
    color: 'text-orange-700',
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    description: '研究表明，主动回忆比被动阅读的记忆效果好得多。强迫自己回忆的过程会强化记忆痕迹，这是学霸们最常用的学习方法。',
    steps: [
      '阅读一段内容',
      '合上书或闭上眼睛',
      '尝试用自己的话复述或写下来',
      '标记下所有记得的内容',
      '打开书对照，找出遗漏和错误'
    ],
    适用场景: ['学新知识', '复习巩固', '做练习题', '自测检验'],
    效果: '比反复阅读效果好300%',
    icon: Zap,
    difficulty: '入门',
    category: '方法'
  },
  {
    id: ' SQ3R',
    emoji: '📖',
    title: 'SQ3R阅读法',
    subtitle: '五步高效阅读教科书',
    color: 'text-indigo-700',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    description: 'SQ3R是一种专门针对教科书的高效阅读方法，适合预习和复习数学课本。',
    steps: [
      'Survey（浏览）：先快速浏览章节标题、重点词、配图',
      'Question（提问）：写下你想从这章学到什么',
      'Read（阅读）：仔细阅读，边读边找答案',
      'Recite（复述）：合上书，说说这章讲了什么',
      'Review（复习）：做练习，检查掌握程度'
    ],
    适用场景: ['预习数学', '复习知识点', '读教科书', '准备考试'],
    效果: '阅读效率提升200%',
    icon: Eye,
    difficulty: '进阶',
    category: '方法'
  },
  {
    id: 'mind-map',
    emoji: '🗺️',
    title: '思维导图',
    subtitle: '让知识可视化、关联化',
    color: 'text-teal-700',
    bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    description: '思维导图通过图形化的方式展示知识点之间的关系，帮助理解知识结构，发现知识盲点。学霸们都在用！',
    steps: [
      '在纸中央写下主题（如：分数）',
      '从这个主题画出3-5条主分支',
      '在每个主分支写下子主题（如：分数加减、分数乘除）',
      '继续细分，画出更多分支',
      '用不同颜色、图画装饰'
    ],
    适用场景: ['整理章节内容', '复习知识点', '做学习计划', '分析应用题'],
    效果: '将知识点关联度提升200%',
    icon: Compass,
    difficulty: '进阶',
    category: '方法'
  },
  {
    id: 'preview-review',
    emoji: '🔮',
    title: '预习+复习法',
    subtitle: '黄金组合，事半功倍',
    color: 'text-purple-700',
    bgColor: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    borderColor: 'border-purple-200',
    description: '课前预习找难点，课后复习补漏洞。这是学霸们成绩好的秘诀，简单但非常有效。',
    steps: [
      '前一天晚上花10分钟预习明天要学的',
      '上课带着问题听，重点听不懂的地方',
      '课后立刻复习，趁热打铁',
      '做几道练习题检验学习效果',
      '把没搞懂的记下来，明天问老师'
    ],
    适用场景: ['课堂学习', '日常复习', '考前准备', '新章节学习'],
    效果: '学习效率提升150%',
    icon: Rocket,
    difficulty: '入门',
    category: '习惯'
  },

  // ========== 思维技巧 ==========
  {
    id: 'growth-mindset',
    emoji: '🌱',
    title: '成长型思维',
    subtitle: '相信努力会带来进步',
    color: 'text-green-700',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    description: '相信"能力可以培养"的孩子，在面对困难时更愿意尝试，最终取得更大的成就。这是斯坦福大学心理学家的研究成果。',
    steps: [
      '把"我不懂"改成"我还没学会"',
      '把"太难了"改成"需要多练习"',
      '把"我放弃了"改成"我需要换个方法"',
      '每次犯错时，想一想"这次学到了什么"',
      '记住：努力的过程比结果更重要'
    ],
    适用场景: ['面对难题', '考试失利', '学习新知识', '建立自信'],
    效果: '将抗挫折能力提升100%',
    icon: Heart,
    difficulty: '入门',
    category: '思维'
  },
  {
    id: 'metacognition',
    emoji: '🪞',
    title: '元认知策略',
    subtitle: '学会思考自己的思考',
    color: 'text-cyan-700',
    bgColor: 'bg-gradient-to-br from-cyan-50 to-sky-50',
    borderColor: 'border-cyan-200',
    description: '元认知就是"对自己思维过程的思考"。学会监控自己的学习，能及时发现和纠正问题。',
    steps: [
      '学习前问自己：我知道什么？我要学什么？',
      '学习中问自己：我理解了吗？哪里不清楚？',
      '学习后问自己：我学到了什么？还有哪些不懂？',
      '定期回顾：我用的方法有效吗？需要改进吗？',
      '总结经验：下次遇到类似问题怎么做？'
    ],
    适用场景: ['自我监控', '考试复盘', '方法优化', '长期学习'],
    效果: '学习效率提升200%',
    icon: Puzzle,
    difficulty: '高级',
    category: '思维'
  },
  {
    id: 'problem-solving',
    emoji: '🔍',
    title: '数学解题步骤',
    subtitle: '五步解决所有数学题',
    color: 'text-slate-700',
    bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
    borderColor: 'border-slate-200',
    description: '一套经过验证的数学解题流程，适用于所有类型的数学题目。跟着做，再难的题也不怕！',
    steps: [
      '第一步：读题 - 仔细读两遍，圈出关键词',
      '第二步：审题 - 这是什么类型的题？要求什么？',
      '第三步：列式 - 写出计算过程，每步写清楚',
      '第四步：计算 - 认真计算，写好验算',
      '第五步：检查 - 做完后检查一遍'
    ],
    适用场景: ['应用题', '计算题', '考试做题', '日常练习'],
    效果: '正确率提升50%',
    icon: Target,
    difficulty: '入门',
    category: '方法'
  },
  {
    id: 'error-analysis',
    emoji: '🔬',
    title: '错题分析法',
    subtitle: '从错误中学习',
    color: 'text-pink-700',
    bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    description: '错题是最好的老师！分析错题比做新题更重要。每次认真分析一道错题，胜过做十道新题。',
    steps: [
      '第一步：抄下错题，写出当时写的答案',
      '第二步：写出正确答案',
      '第三步：分析为什么会错？（粗心/概念不清/方法错误）',
      '第四步：找到解决方法',
      '第五步：同类题目练习3道'
    ],
    适用场景: ['错题复习', '考试总结', '薄弱点突破', '阶段复盘'],
    效果: '避免同类错误再次发生',
    icon: Shield,
    difficulty: '入门',
    category: '习惯'
  },

  // ========== 高级技巧 ==========
  {
    id: 'delegation',
    emoji: '👥',
    title: '小组学习法',
    subtitle: '和同学一起学习',
    color: 'text-yellow-700',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    borderColor: 'border-yellow-200',
    description: '教同学是最好的复习方式！当你能够教会别人时，你自己也会理解得更深入。',
    steps: [
      '找一个学习伙伴',
      '每人负责讲解一个知识点',
      '用简单的话把知识讲清楚',
      '对方提问，你来回答',
      '互相出题测试对方'
    ],
    适用场景: ['复习巩固', '互相监督', '讲解知识点', '考前互助'],
    效果: '知识掌握程度提升100%',
    icon: Users,
    difficulty: '进阶',
    category: '方法'
  },
  {
    id: 'multi-sensory',
    emoji: '🎭',
    title: '多感官学习法',
    subtitle: '调动所有感官学习',
    color: 'text-fuchsia-700',
    bgColor: 'bg-gradient-to-br from-fuchsia-50 to-pink-50',
    borderColor: 'border-fuchsia-200',
    description: '同时调动视觉、听觉、触觉等多种感官学习，效果比只用眼睛看好3倍！',
    steps: [
      '视觉：看课本、看视频、画图',
      '听觉：听讲解、大声朗读、唱乘法歌',
      '触觉：摆小棒、画图形、做教具',
      '动觉：站起来活动、表演数学概念',
      '组合：边看边读边写边说'
    ],
    适用场景: ['学习新概念', '记忆乘法', '理解图形', '抽象概念'],
    效果: '记忆效果提升300%',
    icon: Wand,
    difficulty: '进阶',
    category: '方法'
  },
  {
    id: 'gamification',
    emoji: '🎮',
    title: '游戏化学习',
    subtitle: '让学习变得有趣',
    color: 'text-lime-700',
    bgColor: 'bg-gradient-to-br from-lime-50 to-green-50',
    borderColor: 'border-lime-200',
    description: '把学习变成闯关游戏！设定目标、完成任务、获得奖励。学习就像玩游戏一样有趣。',
    steps: [
      '设定小目标：今天背完3个口诀',
      '完成任务获得积分或金币',
      '积累积分兑换奖励',
      '和同学比赛谁学得快',
      '记录通关成就，展示进步'
    ],
    适用场景: ['日常学习', '背乘法', '做练习', '长期坚持'],
    效果: '学习动力提升200%',
    icon: Trophy,
    difficulty: '入门',
    category: '习惯'
  },
  {
    id: 'self-testing',
    emoji: '📝',
    title: '自测检验法',
    subtitle: '用考试的方式学习',
    color: 'text-rose-700',
    bgColor: 'bg-gradient-to-br from-rose-50 to-red-50',
    borderColor: 'border-rose-200',
    description: '定期给自己出题测试，能准确发现知识漏洞。真正的学霸都是通过不断自测来保持优势的。',
    steps: [
      '学完一个章节后，合上书',
      '写出或说出来这章的所有知识点',
      '给自己出3-5道题',
      '限时完成，像考试一样',
      '批改评分，找出薄弱点'
    ],
    适用场景: ['章节复习', '考前自测', '知识梳理', '阶段检验'],
    效果: '准确发现知识漏洞',
    icon: Edit3,
    difficulty: '进阶',
    category: '方法'
  },
  {
    id: 'sleep-learning',
    emoji: '😴',
    title: '睡眠记忆法',
    subtitle: '睡前复习，事半功倍',
    color: 'text-sky-700',
    bgColor: 'bg-gradient-to-br from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    description: '睡前15分钟复习的内容，会在睡眠中自动整理强化。这是科学验证的记忆方法。',
    steps: [
      '睡前15分钟复习当天学的重点',
      '闭上眼睛回想，不要看书',
      '把重要的公式、概念在脑中过一遍',
      '带着这些内容入睡',
      '第二天醒来先回忆昨晚学了什么'
    ],
    适用场景: ['睡前复习', '强化记忆', '考试前夜', '每日总结'],
    效果: '睡眠中自动强化记忆',
    icon: Star,
    difficulty: '入门',
    category: '记忆'
  },
  {
    id: 'visualization',
    emoji: '🎨',
    title: '可视化思维',
    subtitle: '在脑中画出图像',
    color: 'text-violet-700',
    bgColor: 'bg-gradient-to-br from-violet-50 to-indigo-50',
    borderColor: 'border-violet-200',
    description: '数学问题可以在脑中形成图像。培养"数形结合"的思维习惯，很多难题会变得简单。',
    steps: [
      '读题时，在脑中画出相应的图形',
      '数字可以在脑中想象成小棒、方块',
      '应用题要想象出一个场景',
      '画不出来的，说明还没理解题意',
      '多练习让脑中的图像越来越清晰'
    ],
    适用场景: ['应用题', '几何题', '理解概念', '难题突破'],
    效果: '难题变得直观易懂',
    icon: Eye,
    difficulty: '高级',
    category: '思维'
  },
]

// 学习原则
const learningPrinciples = [
  { icon: Clock, text: '每天坚持比一次性突击更有效' },
  { icon: Star, text: '错题是最好的老师，要认真对待' },
  { icon: Lightbulb, text: '理解原理比死记硬背更重要' },
  { icon: Users, text: '教给同学是最好的复习方式' },
  { icon: Trophy, text: '设立小目标，完成后奖励自己' },
  { icon: CheckCircle, text: '做完题一定要检查，培养好习惯' },
  { icon: Mountain, text: '由易到难，循序渐进' },
  { icon: Gem, text: '质量比数量重要' },
]

// 分类筛选
const categories = ['全部', '记忆', '方法', '习惯', '思维']
const difficulties = ['全部', '入门', '进阶', '高级']

export default function LearningTipsPage() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeDifficulty, setActiveDifficulty] = useState('全部')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTips = learningTips.filter(tip => {
    const matchCategory = activeCategory === '全部' || tip.category === activeCategory
    const matchDifficulty = activeDifficulty === '全部' || tip.difficulty === activeDifficulty
    const matchSearch = searchTerm === '' || 
      tip.title.includes(searchTerm) || 
      tip.description.includes(searchTerm) ||
      tip.steps.some(s => s.includes(searchTerm))
    return matchCategory && matchDifficulty && matchSearch
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* 导航栏 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700">
            <Brain className="h-4 w-4" />
            {learningTips.length} 个学习技巧
          </div>
        </div>

        {/* 标题区 */}
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-1.5 text-sm font-bold text-violet-700">
            <Sparkles className="h-4 w-4" />
            全网精选学习技巧
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-800 sm:text-4xl">
            科学学习方法
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> 让学习更高效</span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-600">
            汇集{learningTips.length}种经过验证的学习方法和记忆技巧，帮助孩子找到最适合自己的学习方式
          </p>
        </header>

        {/* 搜索和筛选 */}
        <div className="mb-6 space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索学习技巧..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 pl-12 text-slate-700 shadow-lg focus:border-violet-400 focus:outline-none"
            />
            <Flag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center text-sm font-medium text-slate-500">分类：</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-violet-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 难度筛选 */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center text-sm font-medium text-slate-500">难度：</span>
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  activeDifficulty === diff
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-amber-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 学习原则 */}
        <section className="mb-8">
          <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white shadow-xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Star className="h-5 w-5" />
              黄金学习原则
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* 学习技巧数量提示 */}
        <div className="mb-4 text-center text-sm text-slate-500">
          显示 {filteredTips.length} 个学习技巧
        </div>

        {/* 学习技巧卡片 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredTips.map((tip) => {
            const Icon = tip.icon
            const difficultyColor = tip.difficulty === '入门' ? 'bg-green-100 text-green-700' 
              : tip.difficulty === '进阶' ? 'bg-amber-100 text-amber-700' 
              : 'bg-rose-100 text-rose-700'
            const categoryColor = tip.category === '记忆' ? 'from-blue-400 to-cyan-400'
              : tip.category === '方法' ? 'from-emerald-400 to-teal-400'
              : tip.category === '习惯' ? 'from-amber-400 to-orange-400'
              : 'from-violet-400 to-purple-400'
            
            return (
              <div
                key={tip.id}
                className={`overflow-hidden rounded-2xl border ${tip.borderColor} ${tip.bgColor} shadow-lg transition-all hover:shadow-xl hover:-translate-y-1`}
              >
                {/* 头部 */}
                <div className={`border-b ${tip.borderColor} p-5`}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${categoryColor} text-white shadow-sm`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${tip.color}`}>{tip.title}</h3>
                        <p className="text-sm text-slate-500">{tip.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor}`}>
                        {tip.difficulty}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tip.color} bg-white/50`}>
                        {tip.category}
                      </span>
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
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${categoryColor} text-xs font-bold text-white`}>
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
                  {tip.适用场景.slice(0, 2).map((scene, i) => (
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

        {/* 空状态 */}
        {filteredTips.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">没有找到相关技巧</h3>
            <p className="text-slate-500">试试调整筛选条件或搜索关键词</p>
            <button
              onClick={() => { setActiveCategory('全部'); setActiveDifficulty('全部'); setSearchTerm(''); }}
              className="mt-4 rounded-xl bg-violet-500 px-6 py-2 font-bold text-white"
            >
              重置筛选
            </button>
          </div>
        )}

        {/* 学习建议 */}
        <section className="mt-10">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              给小朋友的建议
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-amber-700">
                  <Crown className="h-5 w-5" />
                  🌟 每天这样做
                </h3>
                <ul className="space-y-2 text-sm text-amber-600">
                  <li>• 先复习再做作业（预习+复习法）</li>
                  <li>• 错题当天弄懂（错题分析法）</li>
                  <li>• 睡前复习当天学的（睡眠记忆法）</li>
                  <li>• 周末总结一周内容</li>
                  <li>• 用番茄钟保持专注（番茄工作法）</li>
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-green-700">
                  <Flag className="h-5 w-5" />
                  🎯 考试这样做
                </h3>
                <ul className="space-y-2 text-sm text-green-600">
                  <li>• 先易后难，不会的先跳过</li>
                  <li>• 做完检查一遍（养成习惯）</li>
                  <li>• 不确定的做好标记，最后回头看</li>
                  <li>• 用学到的解题步骤做题</li>
                  <li>• 保持冷静，相信自己！</li>
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
