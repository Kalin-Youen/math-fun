'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Bot, User, Sparkles, Lightbulb, RotateCcw, Copy, CheckCircle, Volume2, VolumeX, BookOpen, Calculator, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestions?: string[]
}

interface QuickQuestion {
  icon: typeof Calculator
  text: string
  prompt: string
}

const quickQuestions: QuickQuestion[] = [
  { icon: Calculator, text: '帮我解这道数学题', prompt: '请帮我解这道数学题，并详细解释每一步的思路：' },
  { icon: BookOpen, text: '讲解这个知识点', prompt: '请用简单易懂的方式讲解这个数学知识点，适合小学生理解：' },
  { icon: HelpCircle, text: '检查我的答案', prompt: '请检查我的答案是否正确，如果错了请指出错误并给出正确答案：' },
  { icon: Lightbulb, text: '学习技巧建议', prompt: '请给我一些学习这个知识点的技巧和建议：' },
]

// 模拟 AI 回复
const mockAIResponses: Record<string, string> = {
  '乘法': '乘法是加法的简便运算。比如 3×4，就是 4 个 3 相加：3+3+3+3=12。\n\n💡 记忆技巧：\n• 可以画圆圈来理解，3×4 就是画 3 行，每行 4 个圆圈\n• 用乘法口诀快速计算\n• 交换律：3×4 = 4×3',
  '除法': '除法是乘法的逆运算。比如 12÷3，就是想：3 乘几等于 12？\n\n💡 解题步骤：\n1. 想乘法口诀：三（ ）十二\n2. 三四十二，所以答案是 4\n3. 验算：3×4=12 ✓',
  '应用题': '解应用题要遵循"读-审-列-算-查"五步法：\n\n1️⃣ 读题：仔细读两遍，圈出关键词\n2️⃣ 审题：确定已知条件和问题\n3️⃣ 列式：写出算式\n4️⃣ 计算：认真计算\n5️⃣ 检查：验算答案是否合理',
  '分数': '分数表示一个整体被平均分成几份，取其中的几份。\n\n🍕 用披萨理解：\n• 分母（下面）：披萨被切成几块\n• 分子（上面）：你吃了几块\n\n比如 3/4，就是披萨切成 4 块，吃了 3 块',
  '竖式': '竖式计算要注意三点：\n\n1. 相同数位对齐\n2. 从个位算起\n3. 满十进一，不够减向前借一\n\n✏️ 小提示：计算时可以在草稿纸上先算，再写到作业本上',
}

function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  
  for (const [keyword, response] of Object.entries(mockAIResponses)) {
    if (lowerInput.includes(keyword)) {
      return response
    }
  }
  
  // 默认回复
  return `我来帮你分析这个问题！\n\n根据你的描述，我建议：\n\n1️⃣ 先理解题目的意思，找出已知条件\n2️⃣ 确定需要用什么方法解决\n3️⃣ 一步一步仔细计算\n4️⃣ 做完后记得检查\n\n如果还有疑问，可以继续问我哦！💪`
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的 AI 数学辅导老师 🎓\n\n我可以帮你：\n• 解答数学题\n• 讲解知识点\n• 检查作业\n• 提供学习建议\n\n有什么数学问题，随时问我！',
      timestamp: Date.now(),
      suggestions: ['乘法怎么理解？', '除法竖式怎么做？', '应用题解题技巧'],
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 模拟 AI 思考时间
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const aiResponse = getAIResponse(content)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now(),
      suggestions: ['还有疑问', '举个例子', '换种方式讲'],
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
    
    // 自动朗读
    speak(aiResponse)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '对话已清空！有什么新的问题吗？🤔',
      timestamp: Date.now(),
    }])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="mx-auto flex h-screen max-w-4xl flex-col">
        {/* 头部 */}
        <header className="flex items-center justify-between border-b border-indigo-100 bg-white/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">AI 数学辅导</h1>
                <p className="text-xs text-slate-500">随时解答你的数学问题</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={clearChat}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 头像 */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                } text-white`}>
                  {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                {/* 消息内容 */}
                <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-white text-slate-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  </div>

                  {/* 操作按钮 */}
                  {message.role === 'assistant' && (
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        onClick={() => speak(message.content)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-500"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-500"
                      >
                        {copiedId === message.id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}

                  {/* 建议按钮 */}
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(suggestion)}
                          className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 加载中 */}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 快捷问题 */}
        <div className="border-t border-indigo-100 bg-white/50 px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((q, i) => {
              const Icon = q.icon
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(q.prompt)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {q.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* 输入框 */}
        <form onSubmit={handleSubmit} className="border-t border-indigo-100 bg-white p-4">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的数学问题..."
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              rows={2}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            💡 提示：可以拍照上传题目、语音输入，或点击上方快捷问题
          </p>
        </form>
      </div>
    </main>
  )
}
