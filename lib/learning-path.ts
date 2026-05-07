// 学习路径系统 - 基于认知科学和建构主义学习理论
// 采用螺旋式课程设计，知识点由浅入深，循环上升

export interface LearningStage {
  id: string
  name: string
  description: string
  minAge: number
  maxAge: number
  cognitiveLevel: 'concrete' | 'representational' | 'abstract'
  prerequisites: string[]
  topics: string[]
  estimatedHours: number
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  name: string
  description: string
  checkPoints: CheckPoint[]
  reward: {
    xp: number
    badge?: string
    title?: string
  }
}

export interface CheckPoint {
  id: string
  type: 'quiz' | 'practice' | 'mastery' | 'application'
  description: string
  passingScore: number
  maxAttempts: number
}

// 布鲁姆认知目标分类
export enum BloomLevel {
  REMEMBER = 1,    // 记忆
  UNDERSTAND = 2,  // 理解
  APPLY = 3,       // 应用
  ANALYZE = 4,     // 分析
  EVALUATE = 5,    // 评价
  CREATE = 6,      // 创造
}

// 学习路径定义 - 基于皮亚杰认知发展理论
export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 'stage-1',
    name: '数感启蒙期',
    description: '建立数的概念，培养基础数感',
    minAge: 6,
    maxAge: 7,
    cognitiveLevel: 'concrete',
    prerequisites: [],
    topics: ['g1-1-20', 'g1-compare', 'g1-addition', 'g1-subtraction'],
    estimatedHours: 40,
    milestones: [
      {
        id: 'm1-1',
        name: '数的认识',
        description: '能够正确读写20以内的数',
        checkPoints: [
          { id: 'cp1', type: 'quiz', description: '20以内数的读写测试', passingScore: 90, maxAttempts: 3 },
          { id: 'cp2', type: 'practice', description: '数数练习', passingScore: 80, maxAttempts: 5 },
        ],
        reward: { xp: 100, badge: '数字小达人', title: '数数能手' },
      },
      {
        id: 'm1-2',
        name: '比较大小',
        description: '掌握数的大小比较',
        checkPoints: [
          { id: 'cp3', type: 'mastery', description: '大小比较测试', passingScore: 85, maxAttempts: 3 },
        ],
        reward: { xp: 150, badge: '比较专家' },
      },
    ],
  },
  {
    id: 'stage-2',
    name: '运算基础期',
    description: '掌握基本运算，建立运算思维',
    minAge: 7,
    maxAge: 8,
    cognitiveLevel: 'concrete',
    prerequisites: ['stage-1'],
    topics: ['g2-addition-subtraction', 'g2-multiplication-intro', 'g2-division-intro'],
    estimatedHours: 60,
    milestones: [
      {
        id: 'm2-1',
        name: '加减法精通',
        description: '100以内加减法熟练计算',
        checkPoints: [
          { id: 'cp4', type: 'mastery', description: '100以内加减法', passingScore: 95, maxAttempts: 5 },
          { id: 'cp5', type: 'application', description: '应用题解答', passingScore: 80, maxAttempts: 3 },
        ],
        reward: { xp: 200, badge: '计算小能手', title: '运算达人' },
      },
    ],
  },
  {
    id: 'stage-3',
    name: '乘法表掌握期',
    description: '熟记乘法口诀，理解乘法本质',
    minAge: 8,
    maxAge: 9,
    cognitiveLevel: 'representational',
    prerequisites: ['stage-2'],
    topics: ['g3-multiplication-table', 'g3-division', 'g3-word-problems'],
    estimatedHours: 50,
    milestones: [
      {
        id: 'm3-1',
        name: '九九乘法表',
        description: '熟练背诵并应用乘法口诀',
        checkPoints: [
          { id: 'cp6', type: 'mastery', description: '乘法口诀背诵', passingScore: 100, maxAttempts: 10 },
          { id: 'cp7', type: 'quiz', description: '乘法计算测试', passingScore: 95, maxAttempts: 5 },
        ],
        reward: { xp: 300, badge: '乘法大师', title: '口诀达人' },
      },
    ],
  },
  {
    id: 'stage-4',
    name: '多位数运算期',
    description: '掌握多位数运算，培养估算能力',
    minAge: 9,
    maxAge: 10,
    cognitiveLevel: 'representational',
    prerequisites: ['stage-3'],
    topics: ['g4-large-numbers', 'g4-multi-digit-multiply', 'g4-division'],
    estimatedHours: 70,
    milestones: [],
  },
  {
    id: 'stage-5',
    name: '分数小数期',
    description: '理解分数和小数概念',
    minAge: 10,
    maxAge: 11,
    cognitiveLevel: 'abstract',
    prerequisites: ['stage-4'],
    topics: ['g5-fractions', 'g5-decimals', 'g5-percentage'],
    estimatedHours: 80,
    milestones: [],
  },
  {
    id: 'stage-6',
    name: '综合应用期',
    description: '综合运用，解决复杂问题',
    minAge: 11,
    maxAge: 12,
    cognitiveLevel: 'abstract',
    prerequisites: ['stage-5'],
    topics: ['g6-ratio', 'g6-equations', 'g6-geometry', 'g6-statistics'],
    estimatedHours: 100,
    milestones: [],
  },
]

// 知识图谱 - 知识点之间的依赖关系
export interface KnowledgeNode {
  id: string
  name: string
  level: BloomLevel
  dependencies: string[]
  children: string[]
  estimatedMinutes: number
  difficulty: 1 | 2 | 3 | 4 | 5
}

export const KNOWLEDGE_GRAPH: KnowledgeNode[] = [
  // 基础层 - 记忆
  { id: 'number-recognition', name: '数的认识', level: BloomLevel.REMEMBER, dependencies: [], children: ['number-comparison', 'addition'], estimatedMinutes: 30, difficulty: 1 },
  { id: 'multiplication-table', name: '乘法口诀', level: BloomLevel.REMEMBER, dependencies: ['addition'], children: ['multiplication', 'division'], estimatedMinutes: 120, difficulty: 2 },
  
  // 理解层
  { id: 'number-comparison', name: '数的大小比较', level: BloomLevel.UNDERSTAND, dependencies: ['number-recognition'], children: ['subtraction'], estimatedMinutes: 20, difficulty: 1 },
  { id: 'place-value', name: '位值概念', level: BloomLevel.UNDERSTAND, dependencies: ['number-recognition'], children: ['large-numbers'], estimatedMinutes: 45, difficulty: 2 },
  
  // 应用层
  { id: 'addition', name: '加法运算', level: BloomLevel.APPLY, dependencies: ['number-recognition'], children: ['subtraction', 'multiplication-table'], estimatedMinutes: 40, difficulty: 1 },
  { id: 'subtraction', name: '减法运算', level: BloomLevel.APPLY, dependencies: ['addition', 'number-comparison'], children: ['word-problems'], estimatedMinutes: 40, difficulty: 1 },
  { id: 'multiplication', name: '乘法运算', level: BloomLevel.APPLY, dependencies: ['multiplication-table'], children: ['division', 'area-calculation'], estimatedMinutes: 60, difficulty: 2 },
  { id: 'division', name: '除法运算', level: BloomLevel.APPLY, dependencies: ['multiplication'], children: ['fractions'], estimatedMinutes: 80, difficulty: 3 },
  
  // 分析层
  { id: 'word-problems', name: '应用题分析', level: BloomLevel.ANALYZE, dependencies: ['addition', 'subtraction'], children: ['complex-problems'], estimatedMinutes: 120, difficulty: 3 },
  { id: 'fractions', name: '分数概念', level: BloomLevel.ANALYZE, dependencies: ['division'], children: ['decimals', 'ratio'], estimatedMinutes: 150, difficulty: 4 },
  
  // 评价层
  { id: 'complex-problems', name: '复杂问题求解', level: BloomLevel.EVALUATE, dependencies: ['word-problems', 'multiplication', 'division'], children: ['problem-creation'], estimatedMinutes: 200, difficulty: 4 },
  
  // 创造层
  { id: 'problem-creation', name: '编题创作', level: BloomLevel.CREATE, dependencies: ['complex-problems'], children: [], estimatedMinutes: 180, difficulty: 5 },
]

// 个性化学习推荐算法
export interface LearningRecommendation {
  type: 'review' | 'new' | 'practice' | 'challenge'
  topicId: string
  reason: string
  priority: number
  estimatedTime: number
}

export function generateRecommendations(
  completedTopics: string[],
  weakTopics: string[],
  recentMistakes: string[],
  availableTime: number
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = []
  
  // 1. 优先复习薄弱知识点（艾宾浩斯遗忘曲线）
  weakTopics.forEach(topic => {
    recommendations.push({
      type: 'review',
      topicId: topic,
      reason: '根据错题分析，该知识点需要巩固',
      priority: 10,
      estimatedTime: 15,
    })
  })
  
  // 2. 推荐新知识（基于前置条件）
  KNOWLEDGE_GRAPH.forEach(node => {
    if (!completedTopics.includes(node.id)) {
      const prereqsMet = node.dependencies.every(dep => completedTopics.includes(dep))
      if (prereqsMet) {
        recommendations.push({
          type: 'new',
          topicId: node.id,
          reason: '前置知识已掌握，可以学习新内容',
          priority: 8,
          estimatedTime: node.estimatedMinutes,
        })
      }
    }
  })
  
  // 3. 针对性练习
  recentMistakes.forEach(mistake => {
    recommendations.push({
      type: 'practice',
      topicId: mistake,
      reason: '近期在该知识点上犯错，需要针对性练习',
      priority: 9,
      estimatedTime: 20,
    })
  })
  
  // 按优先级排序
  return recommendations.sort((a, b) => b.priority - a.priority)
}

// 学习分析 - 生成学习报告
export interface LearningReport {
  overallProgress: number
  masteredTopics: number
  weakAreas: string[]
  strengths: string[]
  suggestedDailyGoal: number
  nextMilestone: string
  studyStreak: number
}

export function generateLearningReport(
  completedTopics: string[],
  quizScores: Record<string, number[]>,
  studyHistory: { date: string; minutes: number }[]
): LearningReport {
  const totalTopics = KNOWLEDGE_GRAPH.length
  const masteredTopics = completedTopics.length
  const overallProgress = Math.round((masteredTopics / totalTopics) * 100)
  
  // 分析薄弱点（平均分低于70）
  const weakAreas: string[] = []
  const strengths: string[] = []
  
  Object.entries(quizScores).forEach(([topic, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    if (avg < 70) weakAreas.push(topic)
    else if (avg >= 90) strengths.push(topic)
  })
  
  // 计算学习连续天数
  const studyStreak = calculateStudyStreak(studyHistory)
  
  // 建议每日目标（根据历史平均）
  const avgDailyMinutes = studyHistory.reduce((sum, day) => sum + day.minutes, 0) / studyHistory.length || 30
  const suggestedDailyGoal = Math.round(avgDailyMinutes * 1.1)
  
  // 找到下一个里程碑
  const nextMilestone = LEARNING_STAGES.find(stage => 
    !stage.prerequisites.every(prereq => completedTopics.includes(prereq))
  )?.name || '所有阶段已完成'
  
  return {
    overallProgress,
    masteredTopics,
    weakAreas,
    strengths,
    suggestedDailyGoal,
    nextMilestone,
    studyStreak,
  }
}

function calculateStudyStreak(history: { date: string; minutes: number }[]): number {
  if (history.length === 0) return 0
  
  const dates = history.map(h => new Date(h.date).toDateString())
  const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    streak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 3600 * 24)
      if (diffDays === 1) streak++
      else break
    }
  }
  
  return streak
}
