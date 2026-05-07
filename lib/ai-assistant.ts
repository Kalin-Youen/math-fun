// AI 辅助学习系统
// 智能出题、错题分析、个性化推荐

export interface AIQuestion {
  id: string
  type: 'calculation' | 'word_problem' | 'conceptual'
  content: string
  difficulty: number
  expectedTime: number
  knowledgePoints: string[]
  commonMistakePatterns: string[]
  hints: string[]
  solution: string
  similarQuestions?: string[]
}

export interface MistakeAnalysis {
  pattern: string
  frequency: number
  severity: 'low' | 'medium' | 'high'
  rootCause: string
  recommendations: string[]
  relatedKnowledge: string[]
  practiceQuestions: AIQuestion[]
}

export interface LearningRecommendation {
  type: 'review' | 'new' | 'practice' | 'challenge'
  topic: string
  reason: string
  priority: number
  estimatedTime: number
  suggestedQuestions: number
  adaptiveDifficulty: number
}

// AI 智能出题引擎
export class AIQuestionGenerator {
  private studentLevel: number
  private weakPoints: string[]
  private recentMistakes: string[]

  constructor(studentLevel: number, weakPoints: string[], recentMistakes: string[]) {
    this.studentLevel = studentLevel
    this.weakPoints = weakPoints
    this.recentMistakes = recentMistakes
  }

  // 生成个性化练习题
  generatePersonalizedQuestions(count: number): AIQuestion[] {
    const questions: AIQuestion[] = []
    
    // 根据薄弱点生成针对性练习
    this.weakPoints.forEach((point, index) => {
      const q = this.generateQuestionForWeakPoint(point, index)
      questions.push(q)
    })
    
    // 生成巩固练习
    const remainingCount = count - questions.length
    for (let i = 0; i < remainingCount; i++) {
      questions.push(this.generateAdaptiveQuestion(i))
    }
    
    return questions.sort(() => Math.random() - 0.5) // 随机排序
  }

  private generateQuestionForWeakPoint(point: string, index: number): AIQuestion {
    // 根据薄弱点类型生成针对性题目
    const templates: Record<string, () => AIQuestion> = {
      '进位加法': () => this.generateCarryAddition(),
      '退位减法': () => this.generateBorrowSubtraction(),
      '乘法口诀': () => this.generateMultiplication(),
      '应用题理解': () => this.generateWordProblem(),
      '分数概念': () => this.generateFractionConcept(),
    }

    const generator = templates[point] || (() => this.generateAdaptiveQuestion(index))
    return generator()
  }

  private generateCarryAddition(): AIQuestion {
    const a = Math.floor(Math.random() * 40) + 10
    const b = Math.floor(Math.random() * 40) + 10
    const sum = a + b
    
    return {
      id: `carry-${Date.now()}`,
      type: 'calculation',
      content: `${a} + ${b} = ?`,
      difficulty: this.studentLevel,
      expectedTime: 30,
      knowledgePoints: ['两位数加法', '进位'],
      commonMistakePatterns: ['忘记进位', '十位计算错误'],
      hints: ['先算个位，满十要进一', '再算十位，记得加上进位'],
      solution: `${a} + ${b} = ${sum}`,
    }
  }

  private generateBorrowSubtraction(): AIQuestion {
    const a = Math.floor(Math.random() * 50) + 30
    const b = Math.floor(Math.random() * 30) + 10
    
    return {
      id: `borrow-${Date.now()}`,
      type: 'calculation',
      content: `${a} - ${b} = ?`,
      difficulty: this.studentLevel,
      expectedTime: 35,
      knowledgePoints: ['两位数减法', '退位'],
      commonMistakePatterns: ['忘记退位', '个位计算错误'],
      hints: ['个位不够减，向十位借一', '十位借走一，记得减一'],
      solution: `${a} - ${b} = ${a - b}`,
    }
  }

  private generateMultiplication(): AIQuestion {
    const a = Math.floor(Math.random() * 8) + 2
    const b = Math.floor(Math.random() * 9) + 1
    
    return {
      id: `mult-${Date.now()}`,
      type: 'calculation',
      content: `${a} × ${b} = ?`,
      difficulty: this.studentLevel,
      expectedTime: 20,
      knowledgePoints: ['乘法口诀'],
      commonMistakePatterns: ['口诀记错', '混淆相似口诀'],
      hints: ['想乘法口诀', '可以用加法验证'],
      solution: `${a} × ${b} = ${a * b}`,
    }
  }

  private generateWordProblem(): AIQuestion {
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
      difficulty: this.studentLevel + 1,
      expectedTime: 60,
      knowledgePoints: ['应用题', '加法'],
      commonMistakePatterns: ['不理解题意', '列式错误'],
      hints: ['先找出已知条件', '确定用什么运算', '列式计算'],
      solution: `${a} + ${b} = ${a + b}（个）`,
    }
  }

  private generateFractionConcept(): AIQuestion {
    const shapes = ['圆形', '长方形', '正方形']
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const denominator = [2, 3, 4, 5][Math.floor(Math.random() * 4)]
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1
    
    return {
      id: `frac-${Date.now()}`,
      type: 'conceptual',
      content: `一个${shape}平均分成${denominator}份，涂色部分占${numerator}份，涂色部分用分数表示是（ ）`,
      difficulty: this.studentLevel,
      expectedTime: 45,
      knowledgePoints: ['分数概念', '分数表示'],
      commonMistakePatterns: ['分子分母写反', '不理解平均分'],
      hints: ['分母表示总份数', '分子表示涂色份数'],
      solution: `${numerator}/${denominator}`,
    }
  }

  private generateAdaptiveQuestion(index: number): AIQuestion {
    // 根据学生水平自适应生成题目
    if (this.studentLevel <= 2) {
      return this.generateCarryAddition()
    } else if (this.studentLevel <= 4) {
      return Math.random() > 0.5 ? this.generateMultiplication() : this.generateWordProblem()
    } else {
      return this.generateFractionConcept()
    }
  }
}

// AI 错题分析引擎
export class AIMistakeAnalyzer {
  analyzeMistakes(mistakes: { question: string; answer: string; correctAnswer: string; type: string }[]): MistakeAnalysis[] {
    const patterns = this.identifyPatterns(mistakes)
    
    return patterns.map(pattern => ({
      pattern: pattern.name,
      frequency: pattern.count,
      severity: this.calculateSeverity(pattern.count, mistakes.length),
      rootCause: this.identifyRootCause(pattern.name),
      recommendations: this.generateRecommendations(pattern.name),
      relatedKnowledge: this.identifyRelatedKnowledge(pattern.name),
      practiceQuestions: this.generatePracticeQuestions(pattern.name),
    }))
  }

  private identifyPatterns(mistakes: any[]) {
    const patterns: Record<string, number> = {}
    
    mistakes.forEach(m => {
      // 分析错误类型
      if (m.type.includes('addition') && this.isCarryError(m.answer, m.correctAnswer)) {
        patterns['进位错误'] = (patterns['进位错误'] || 0) + 1
      }
      if (m.type.includes('subtraction') && this.isBorrowError(m.answer, m.correctAnswer)) {
        patterns['退位错误'] = (patterns['退位错误'] || 0) + 1
      }
      if (m.type.includes('multiplication')) {
        patterns['乘法口诀错误'] = (patterns['乘法口诀错误'] || 0) + 1
      }
      if (m.type.includes('word_problem')) {
        patterns['应用题理解错误'] = (patterns['应用题理解错误'] || 0) + 1
      }
    })
    
    return Object.entries(patterns).map(([name, count]) => ({ name, count }))
  }

  private isCarryError(answer: string, correct: string): boolean {
    // 简化的进位错误检测
    const ans = parseInt(answer)
    const cor = parseInt(correct)
    return Math.abs(ans - cor) === 10 || Math.abs(ans - cor) === 1
  }

  private isBorrowError(answer: string, correct: string): boolean {
    const ans = parseInt(answer)
    const cor = parseInt(correct)
    return Math.abs(ans - cor) === 10
  }

  private calculateSeverity(count: number, total: number): 'low' | 'medium' | 'high' {
    const ratio = count / total
    if (ratio > 0.5) return 'high'
    if (ratio > 0.2) return 'medium'
    return 'low'
  }

  private identifyRootCause(pattern: string): string {
    const causes: Record<string, string> = {
      '进位错误': '对"满十进一"的理解不够深入，或计算时注意力分散',
      '退位错误': '对"借一当十"的概念理解不清',
      '乘法口诀错误': '口诀记忆不熟练，或混淆相似口诀',
      '应用题理解错误': '阅读理解能力不足，或缺乏解题策略',
    }
    return causes[pattern] || '需要针对性练习'
  }

  private generateRecommendations(pattern: string): string[] {
    const recommendations: Record<string, string[]> = {
      '进位错误': [
        '用小棒或计数器演示进位过程',
        '多做进位加法的专项练习',
        '计算时标注进位数字',
      ],
      '退位错误': [
        '理解"借一当十"的含义',
        '用分解法练习退位减法',
        '用加法验算减法',
      ],
      '乘法口诀错误': [
        '每天背诵乘法口诀',
        '用乘法卡片进行记忆训练',
        '理解乘法的意义（几个几）',
      ],
      '应用题理解错误': [
        '练习圈画关键词',
        '学习应用题解题步骤',
        '多做同类题型的练习',
      ],
    }
    return recommendations[pattern] || ['加强基础练习']
  }

  private identifyRelatedKnowledge(pattern: string): string[] {
    const knowledge: Record<string, string[]> = {
      '进位错误': ['两位数加法', '竖式计算', '位值概念'],
      '退位错误': ['两位数减法', '借位', '位值概念'],
      '乘法口诀错误': ['乘法意义', '加法与乘法的关系'],
      '应用题理解错误': ['数量关系', '四则运算', '阅读理解'],
    }
    return knowledge[pattern] || []
  }

  private generatePracticeQuestions(pattern: string): AIQuestion[] {
    const generator = new AIQuestionGenerator(3, [pattern], [])
    return generator.generatePersonalizedQuestions(3)
  }
}

// AI 学习推荐引擎
export class AIRecommendationEngine {
  generateRecommendations(
    studentProfile: {
      level: number
      completedTopics: string[]
      weakPoints: string[]
      recentMistakes: string[]
      studyHistory: { date: string; duration: number; topic: string }[]
    }
  ): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = []
    
    // 1. 优先推荐薄弱点复习
    studentProfile.weakPoints.forEach((point, index) => {
      recommendations.push({
        type: 'review',
        topic: point,
        reason: `在"${point}"上存在薄弱环节，需要针对性巩固`,
        priority: 10 - index,
        estimatedTime: 20,
        suggestedQuestions: 5,
        adaptiveDifficulty: Math.max(1, studentProfile.level - 1),
      })
    })
    
    // 2. 推荐新知识（基于前置条件）
    const nextTopics = this.identifyNextTopics(studentProfile.completedTopics)
    nextTopics.forEach((topic, index) => {
      recommendations.push({
        type: 'new',
        topic: topic,
        reason: '前置知识已掌握，可以学习新内容',
        priority: 8 - index,
        estimatedTime: 30,
        suggestedQuestions: 8,
        adaptiveDifficulty: studentProfile.level,
      })
    })
    
    // 3. 基于学习历史推荐
    const lastStudy = studentProfile.studyHistory[studentProfile.studyHistory.length - 1]
    if (lastStudy) {
      const daysSinceLastStudy = Math.floor(
        (Date.now() - new Date(lastStudy.date).getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysSinceLastStudy > 3) {
        recommendations.push({
          type: 'review',
          topic: lastStudy.topic,
          reason: `距离上次学习"${lastStudy.topic}"已有${daysSinceLastStudy}天，建议复习`,
          priority: 9,
          estimatedTime: 15,
          suggestedQuestions: 3,
          adaptiveDifficulty: studentProfile.level,
        })
      }
    }
    
    // 按优先级排序
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5)
  }

  private identifyNextTopics(completedTopics: string[]): string[] {
    // 知识点依赖关系
    const dependencies: Record<string, string[]> = {
      '进位加法': ['两位数加法'],
      '退位减法': ['两位数减法'],
      '乘法': ['加法', '乘法口诀'],
      '除法': ['乘法'],
      '分数': ['除法'],
    }
    
    const nextTopics: string[] = []
    
    Object.entries(dependencies).forEach(([topic, prereqs]) => {
      if (!completedTopics.includes(topic)) {
        const allPrereqsMet = prereqs.every(prereq => 
          completedTopics.some(t => t.includes(prereq))
        )
        if (allPrereqsMet) {
          nextTopics.push(topic)
        }
      }
    })
    
    return nextTopics
  }
}

// 智能学习助手
export class SmartLearningAssistant {
  private questionGenerator: AIQuestionGenerator
  private mistakeAnalyzer: AIMistakeAnalyzer
  private recommendationEngine: AIRecommendationEngine

  constructor(studentLevel: number, weakPoints: string[], recentMistakes: string[]) {
    this.questionGenerator = new AIQuestionGenerator(studentLevel, weakPoints, recentMistakes)
    this.mistakeAnalyzer = new AIMistakeAnalyzer()
    this.recommendationEngine = new AIRecommendationEngine()
  }

  // 获取今日学习任务
  getTodayTasks(): { recommendations: LearningRecommendation[]; questions: AIQuestion[] } {
    const recommendations = this.recommendationEngine.generateRecommendations({
      level: 3,
      completedTopics: [],
      weakPoints: ['进位加法'],
      recentMistakes: [],
      studyHistory: [],
    })
    
    const questions = this.questionGenerator.generatePersonalizedQuestions(10)
    
    return { recommendations, questions }
  }

  // 分析错题并给出建议
  analyzeMistakes(mistakes: any[]): MistakeAnalysis[] {
    return this.mistakeAnalyzer.analyzeMistakes(mistakes)
  }

  // 生成学习报告
  generateReport(studentData: any): string {
    const analysis = this.analyzeMistakes(studentData.mistakes)
    const recommendations = this.recommendationEngine.generateRecommendations(studentData)
    
    let report = '# AI 学习分析报告\n\n'
    
    report += '## 错题分析\n'
    analysis.forEach(a => {
      report += `### ${a.pattern}\n`
      report += `- 出现频率: ${a.frequency}次\n`
      report += `- 严重程度: ${a.severity === 'high' ? '高' : a.severity === 'medium' ? '中' : '低'}\n`
      report += `- 根本原因: ${a.rootCause}\n`
      report += `- 改进建议:\n`
      a.recommendations.forEach(r => {
        report += `  - ${r}\n`
      })
      report += '\n'
    })
    
    report += '## 今日学习建议\n'
    recommendations.forEach((r, i) => {
      report += `${i + 1}. **${r.topic}** (${r.type === 'review' ? '复习' : '新学'})\n`
      report += `   - 原因: ${r.reason}\n`
      report += `   - 预计时间: ${r.estimatedTime}分钟\n`
      report += `   - 推荐题量: ${r.suggestedQuestions}题\n\n`
    })
    
    return report
  }
}

// 导出使用示例
export const aiAssistantExample = {
  // 初始化 AI 助手
  init: `
const assistant = new SmartLearningAssistant(
  3,                    // 学生当前水平
  ['进位加法'],          // 薄弱点
  ['28+15=33']         // 近期错题
)

// 获取今日任务
const tasks = assistant.getTodayTasks()

// 分析错题
const analysis = assistant.analyzeMistakes([
  { question: '28+15', answer: '33', correctAnswer: '43', type: 'addition' }
])

// 生成学习报告
const report = assistant.generateReport(studentData)
`,
}
