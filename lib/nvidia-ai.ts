// NVIDIA AI 配置
// 通过 Cloudflare Worker 代理访问，国内可用

// Worker 部署地址
const AI_PROXY_URL = 'https://math-fun-ai-proxy.3124950562.workers.dev'

export interface AIResponse {
  content: string
  error?: string
}

// 调用 NVIDIA AI API (通过 Cloudflare Worker 代理)
export async function callNVIDIAAI(prompt: string, systemPrompt?: string): Promise<AIResponse> {
  try {
    const messages = []
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      })
    }
    
    messages.push({
      role: 'user',
      content: prompt
    })

    const response = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('NVIDIA API Error:', error)
      return { content: '', error: `API Error: ${response.status}` }
    }

    const data = await response.json()
    return { content: data.choices[0]?.message?.content || '' }
  } catch (error) {
    console.error('NVIDIA AI Error:', error)
    return { content: '', error: String(error) }
  }
}

// 智能出题 - 使用真正的AI
export async function generateAIQuestion(topic: string, grade: number, difficulty: number) {
  const systemPrompt = `你是一位专业的小学数学教师，擅长为${grade}年级学生出题。
要求：
1. 题目要符合该年级教学大纲
2. 难度适中，不要太难也不要太简单
3. 提供详细的解题步骤
4. 给出2-3个提示，帮助学生思考
5. 指出常见的错误类型`

  const prompt = `请为${grade}年级学生生成一道关于"${topic}"的数学题。
难度等级：${difficulty}/5

请以JSON格式返回：
{
  "content": "题目内容",
  "answer": "正确答案",
  "solution": "详细解题步骤",
  "hints": ["提示1", "提示2"],
  "commonMistakes": ["常见错误1", "常见错误2"],
  "knowledgePoints": ["知识点1", "知识点2"]
}`

  const response = await callNVIDIAAI(prompt, systemPrompt)
  
  if (response.error) {
    return null
  }

  try {
    // 提取JSON内容
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch {
    return null
  }
}

// 错题分析 - 使用真正的AI
export async function analyzeMistakeWithAI(
  question: string,
  studentAnswer: string,
  correctAnswer: string,
  grade: number
) {
  const systemPrompt = `你是一位专业的小学数学教师，擅长分析学生的错误并给出针对性建议。`

  const prompt = `请分析以下错题：

题目：${question}
学生答案：${studentAnswer}
正确答案：${correctAnswer}
学生年级：${grade}年级

请分析：
1. 错误原因
2. 知识薄弱点
3. 改进建议
4. 推荐练习

请以JSON格式返回：
{
  "errorReason": "错误原因分析",
  "weakPoints": ["薄弱点1", "薄弱点2"],
  "suggestions": ["建议1", "建议2"],
  "recommendedPractice": ["推荐练习1", "推荐练习2"]
}`

  const response = await callNVIDIAAI(prompt, systemPrompt)
  
  if (response.error) {
    return null
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch {
    return null
  }
}

// 学习建议 - 使用真正的AI
export async function getLearningAdviceWithAI(
  weakPoints: string[],
  recentMistakes: string[],
  grade: number
) {
  const systemPrompt = `你是一位专业的小学数学教师，擅长根据学生情况制定个性化学习计划。`

  const prompt = `请为${grade}年级学生制定学习计划：

薄弱点：${weakPoints.join('、')}
近期错题：${recentMistakes.join('、')}

请提供：
1. 今日学习重点
2. 推荐练习题目
3. 学习方法建议
4. 预计学习时间

请以JSON格式返回：
{
  "todayFocus": "今日重点",
  "recommendedExercises": ["练习1", "练习2"],
  "studyTips": ["方法1", "方法2"],
  "estimatedTime": "预计时间"
}`

  const response = await callNVIDIAAI(prompt, systemPrompt)
  
  if (response.error) {
    return null
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch {
    return null
  }
}

// 拍照解题 - 使用真正的AI
export async function solvePhotoProblemWithAI(imageBase64: string, grade: number) {
  const systemPrompt = `你是一位专业的小学数学教师，擅长识别和解答数学题。`

  const prompt = `请识别并解答图片中的数学题。
学生年级：${grade}年级

请以JSON格式返回：
{
  "recognizedText": "识别出的题目",
  "solution": "详细解答步骤",
  "answer": "最终答案",
  "relatedKnowledge": ["相关知识点"]
}`

  // 通过 Worker 代理发送图片
  const response = await fetch(AI_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch {
    return null
  }
}

// 对话式辅导 - 使用真正的AI
export async function chatWithAI(message: string, context: string, grade: number) {
  const systemPrompt = `你是一位耐心友好的小学数学辅导老师，正在辅导${grade}年级学生。
特点：
1. 用简单易懂的语言解释
2. 鼓励学生思考，不直接给答案
3. 多用例子和比喻
4. 语气亲切友好`

  const prompt = `学生问题：${message}

上下文：${context}

请给出回答：`

  return await callNVIDIAAI(prompt, systemPrompt)
}

// 生成学习报告 - 使用真正的AI
export async function generateAIReport(
  studentName: string,
  studyData: {
    completedTopics: string[]
    weakPoints: string[]
    mistakes: Array<{ question: string; error: string }>
    studyTime: number
  },
  grade: number
) {
  const systemPrompt = `你是一位专业的小学数学教师，擅长撰写学生学习报告。`

  const prompt = `请为${studentName}同学（${grade}年级）生成学习报告：

学习数据：
- 已完成知识点：${studyData.completedTopics.join('、')}
- 薄弱点：${studyData.weakPoints.join('、')}
- 近期错题数：${studyData.mistakes.length}
- 学习时长：${studyData.studyTime}分钟

请生成一份详细的学习报告，包括：
1. 学习总结
2. 薄弱环节分析
3. 改进建议
4. 下阶段学习计划

请用Markdown格式输出。`

  return await callNVIDIAAI(prompt, systemPrompt)
}
