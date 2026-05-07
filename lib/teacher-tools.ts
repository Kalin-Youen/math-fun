// 教师工具系统 - 基于一线教学经验设计
// 包含教案设计、作业管理、学情分析等功能

export interface LessonPlan {
  id: string
  title: string
  grade: number
  unit: string
  duration: number // 课时（分钟）
  objectives: LearningObjective[]
  materials: string[]
  procedure: TeachingStep[]
  differentiation: DifferentiationStrategy[]
  homework: HomeworkAssignment
  reflection?: string
}

export interface LearningObjective {
  id: string
  description: string
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
  measurable: string
  assessment: string
}

export interface TeachingStep {
  id: string
  phase: 'warmup' | 'introduction' | 'development' | 'practice' | 'summary' | 'homework'
  duration: number
  activity: string
  teacherAction: string
  studentAction: string
  materials: string[]
  differentiation?: string
}

export interface DifferentiationStrategy {
  target: 'advanced' | 'average' | 'struggling'
  adaptation: string
  support: string
  extension?: string
}

export interface HomeworkAssignment {
  basic: Question[]
  intermediate: Question[]
  advanced: Question[]
  estimatedTime: number
  tips: string[]
}

export interface Question {
  id: string
  type: 'calculation' | 'word_problem' | 'conceptual' | 'application'
  content: string
  answer: string | number
  solution: string
  difficulty: 1 | 2 | 3 | 4 | 5
  commonMistakes?: string[]
  hints?: string[]
}

// 示例教案：两位数加法
export const SAMPLE_LESSON_PLAN: LessonPlan = {
  id: 'lp-2-1',
  title: '两位数加法（进位）',
  grade: 2,
  unit: '100以内的加减法',
  duration: 40,
  objectives: [
    {
      id: 'obj1',
      description: '理解两位数加法的算理',
      bloomLevel: 'understand',
      measurable: '学生能解释为什么要进位',
      assessment: '课堂提问',
    },
    {
      id: 'obj2',
      description: '掌握两位数加法的竖式计算方法',
      bloomLevel: 'apply',
      measurable: '学生能正确计算5道进位加法题',
      assessment: '课堂练习',
    },
    {
      id: 'obj3',
      description: '解决简单的实际问题',
      bloomLevel: 'apply',
      measurable: '学生能正确解答2道应用题',
      assessment: '应用题练习',
    },
  ],
  materials: ['小棒（每人20根）', '计数器', 'PPT课件', '练习纸'],
  procedure: [
    {
      id: 'step1',
      phase: 'warmup',
      duration: 5,
      activity: '口算热身',
      teacherAction: '出示口算题：8+6, 7+5, 9+4',
      studentAction: '快速口答，回顾进位加法',
      materials: ['口算卡片'],
    },
    {
      id: 'step2',
      phase: 'introduction',
      duration: 8,
      activity: '情境导入',
      teacherAction: '创设情境：小明有28颗糖，小红给他15颗，现在有多少颗？',
      studentAction: '列式：28+15，尝试用小棒摆一摆',
      materials: ['小棒', '情境图'],
    },
    {
      id: 'step3',
      phase: 'development',
      duration: 12,
      activity: '探究算法',
      teacherAction: '引导学生发现：个位8+5=13，满十进一',
      studentAction: '用小棒演示进位过程，理解"满十进一"',
      materials: ['小棒', '计数器'],
      differentiation: '学困生：用小棒操作；中等生：计数器；优生：直接心算',
    },
    {
      id: 'step4',
      phase: 'practice',
      duration: 10,
      activity: '分层练习',
      teacherAction: '巡视指导，关注学困生',
      studentAction: '完成分层练习题',
      materials: ['练习纸'],
    },
    {
      id: 'step5',
      phase: 'summary',
      duration: 3,
      activity: '课堂小结',
      teacherAction: '引导学生总结：相同数位对齐，从个位加起，满十进一',
      studentAction: '口述计算法则',
      materials: [],
    },
    {
      id: 'step6',
      phase: 'homework',
      duration: 2,
      activity: '布置作业',
      teacherAction: '说明作业要求，强调书写规范',
      studentAction: '记录作业',
      materials: ['作业单'],
    },
  ],
  differentiation: [
    {
      target: 'struggling',
      adaptation: '提供小棒辅助，降低题目难度',
      support: '一对一辅导，强调"满十捆一捆"',
      extension: '先练不进位加法，再过渡到进位',
    },
    {
      target: 'average',
      adaptation: '正常进度，适当提示',
      support: '鼓励用计数器验证',
    },
    {
      target: 'advanced',
      adaptation: '增加心算挑战',
      support: '引导探索多种算法',
      extension: '尝试三位数加法',
    },
  ],
  homework: {
    basic: [
      {
        id: 'h1-1',
        type: 'calculation',
        content: '23 + 18 = ?',
        answer: 41,
        solution: '个位3+8=11，写1进1；十位2+1+1=4，所以是41',
        difficulty: 2,
        commonMistakes: ['忘记进位', '十位少加1'],
      },
      {
        id: 'h1-2',
        type: 'calculation',
        content: '36 + 27 = ?',
        answer: 63,
        solution: '个位6+7=13，写3进1；十位3+2+1=6，所以是63',
        difficulty: 2,
      },
    ],
    intermediate: [
      {
        id: 'h2-1',
        type: 'word_problem',
        content: '图书馆有45本故事书，又买来28本，现在有多少本？',
        answer: 73,
        solution: '45 + 28 = 73（本）',
        difficulty: 3,
        hints: ['先找出已知条件和问题', '确定用加法计算'],
      },
    ],
    advanced: [
      {
        id: 'h3-1',
        type: 'application',
        content: '小明有3张十元和8张一元，小红有2张十元和7张一元，他们一共有多少钱？',
        answer: 93,
        solution: '小明：30+8=38元，小红：20+7=27元，一共：38+27=65元',
        difficulty: 4,
      },
    ],
    estimatedTime: 20,
    tips: [
      '做竖式时，相同数位要对齐',
      '从个位算起，满十要进一',
      '做完后可以用减法验算',
    ],
  },
}

// 作业管理系统
export interface HomeworkManager {
  assignments: Assignment[]
  submissions: Submission[]
  statistics: ClassStatistics
}

export interface Assignment {
  id: string
  title: string
  dueDate: string
  questions: Question[]
  totalPoints: number
  assignedTo: string[] // 学生ID列表
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  submittedAt: string
  answers: StudentAnswer[]
  score: number
  timeSpent: number
  status: 'submitted' | 'graded' | 'returned'
  teacherFeedback?: string
}

export interface StudentAnswer {
  questionId: string
  answer: string | number
  isCorrect: boolean
  points: number
  mistakes?: string[]
}

export interface ClassStatistics {
  totalStudents: number
  submittedCount: number
  averageScore: number
  passRate: number
  excellentRate: number
  commonMistakes: { mistake: string; count: number }[]
  questionAnalysis: { questionId: string; correctRate: number }[]
}

// 学情分析系统
export interface StudentProfile {
  id: string
  name: string
  grade: number
  class: string
  overallLevel: 'excellent' | 'good' | 'average' | 'needs_improvement'
  strengths: string[]
  weaknesses: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  recentPerformance: PerformanceRecord[]
  masteryMap: Record<string, number> // 知识点 -> 掌握度(0-100)
}

export interface PerformanceRecord {
  date: string
  topic: string
  score: number
  timeSpent: number
  accuracy: number
  speed: number
}

// 智能作业生成器
export function generateHomework(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
  count: number,
  includeWordProblems: boolean
): Question[] {
  const questions: Question[] = []
  
  // 根据难度生成不同类型的题目
  for (let i = 0; i < count; i++) {
    const q = generateQuestion(topic, difficulty, i)
    questions.push(q)
  }
  
  // 如果包含应用题，替换部分计算题为应用题
  if (includeWordProblems) {
    const wordProblemCount = Math.floor(count * 0.3)
    for (let i = 0; i < wordProblemCount; i++) {
      const idx = Math.floor(Math.random() * questions.length)
      questions[idx] = generateWordProblem(topic, difficulty)
    }
  }
  
  return questions
}

function generateQuestion(topic: string, difficulty: string, index: number): Question {
  // 简化的题目生成逻辑
  const diffLevel = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5
  
  if (topic.includes('addition')) {
    const a = Math.floor(Math.random() * 50) + 10
    const b = Math.floor(Math.random() * 50) + 10
    return {
      id: `q-${index}`,
      type: 'calculation',
      content: `${a} + ${b} = ?`,
      answer: a + b,
      solution: `${a} + ${b} = ${a + b}`,
      difficulty: diffLevel as 1 | 2 | 3 | 4 | 5,
    }
  }
  
  // 默认返回一个简单的加法题
  return {
    id: `q-${index}`,
    type: 'calculation',
    content: '12 + 15 = ?',
    answer: 27,
    solution: '12 + 15 = 27',
    difficulty: 1,
  }
}

function generateWordProblem(topic: string, difficulty: string): Question {
  const scenarios = [
    { item: '苹果', action: '买了', verb: '有' },
    { item: '书本', action: '借来', verb: '有' },
    { item: '糖果', action: '得到', verb: '有' },
  ]
  
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  const a = Math.floor(Math.random() * 30) + 10
  const b = Math.floor(Math.random() * 20) + 5
  
  return {
    id: `wp-${Date.now()}`,
    type: 'word_problem',
    content: `小明${scenario.action}${a}个${scenario.item}，小红${scenario.action}${b}个${scenario.item}，他们一共有多少个${scenario.item}？`,
    answer: a + b,
    solution: `${a} + ${b} = ${a + b}（个）`,
    difficulty: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4,
    hints: ['先找出已知条件', '确定用加法计算'],
  }
}

// 学情分析报告生成
export function generateStudentReport(student: StudentProfile): string {
  const recentAvg = student.recentPerformance.reduce((sum, r) => sum + r.score, 0) / student.recentPerformance.length
  
  let report = `## ${student.name} 学习分析报告\n\n`
  report += `### 整体评价\n`
  report += `最近平均成绩：${recentAvg.toFixed(1)}分\n`
  report += `学习水平：${student.overallLevel === 'excellent' ? '优秀' : student.overallLevel === 'good' ? '良好' : student.overallLevel === 'average' ? '中等' : '需加强'}\n\n`
  
  report += `### 优势领域\n`
  student.strengths.forEach(s => {
    report += `- ${s}\n`
  })
  
  report += `\n### 待提升领域\n`
  student.weaknesses.forEach(w => {
    report += `- ${w}\n`
  })
  
  report += `\n### 学习建议\n`
  if (student.weaknesses.length > 0) {
    report += `建议重点加强：${student.weaknesses.join('、')}\n`
  }
  report += `推荐学习方法：${getLearningMethodSuggestion(student.learningStyle)}\n`
  
  return report
}

function getLearningMethodSuggestion(style: string): string {
  const suggestions: Record<string, string> = {
    visual: '多看图表、思维导图，用颜色标记重点',
    auditory: '多听讲解、朗读题目，讨论交流',
    kinesthetic: '多动手操作、做题实践',
    mixed: '结合多种学习方式，找到最适合自己的',
  }
  return suggestions[style] || '多练习，多总结'
}
