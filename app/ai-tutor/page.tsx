'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Home, 
  Send, 
  Camera, 
  Mic,
  Volume2,
  Brain,
  Lightbulb,
  Calculator,
  BookOpen,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  X,
  CheckCircle2,
  MessageCircle,
  History,
  Trash2,
  Download
} from 'lucide-react'

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'image' | 'voice'
  timestamp: number
  imageUrl?: string
  isAnalyzing?: boolean
}

// 解题步骤
interface SolutionStep {
  step: number
  title: string
  content: string
  formula?: string
}

// AI 响应模拟
const mockAIResponse = (question: string, imageUploaded?: boolean): { content: string; steps?: SolutionStep[] } => {
  // 根据问题内容返回不同的模拟响应
  if (imageUploaded) {
    return {
      content: '我看到你上传了一道数学题。让我来帮你分析：',
      steps: [
        { step: 1, title: '识别题目', content: '这是一道关于加减法的应用题' },
        { step: 2, title: '分析已知条件', content: '题目中给出了两个数量，需要求它们的和' },
        { step: 3, title: '列出算式', content: '根据题意，我们可以列出：15 + 8 = ?', formula: '15 + 8 = 23' },
        { step: 4, title: '计算结果', content: '15加8等于23，所以答案是23' },
      ]
    }
  }
  
  if (question.includes('乘') || question.includes('×')) {
    return {
      content: '乘法是加法的简便运算。比如 3×4，表示4个3相加：',
      steps: [
        { step: 1, title: '理解乘法含义', content: '3×4 = 3 + 3 + 3 + 3' },
        { step: 2, title: '逐步计算', content: '3+3=6，6+3=9，9+3=12' },
        { step: 3, title: '得出答案', content: '所以 3×4 = 12', formula: '3 × 4 = 12' },
      ]
    }
  }
  
  if (question.includes('除') || question.includes('÷')) {
    return {
      content: '除法是乘法的逆运算。比如 12÷3，就是想：3乘几等于12？',
      steps: [
        { step: 1, title: '理解除法含义', content: '12÷3 表示把12平均分成3份' },
        { step: 2, title: '想乘法口诀', content: '三（ ）十二，三四十二！' },
        { step: 3, title: '得出答案', content: '所以 12÷3 = 4', formula: '12 ÷ 3 = 4' },
      ]
    }
  }
  
  if (question.includes('分数') || question.includes('/')) {
    return {
      content: '分数表示一个整体的一部分。比如 1/2 表示一半。',
      steps: [
        { step: 1, title: '理解分数', content: '分母表示平均分的份数，分子表示取的份数' },
        { step: 2, title: '同分母加减', content: '分母不变，分子相加减' },
        { step: 3, title: '举例', content: '1/4 + 2/4 = 3/4', formula: '¹/₄ + ²/₄ = ³/₄' },
      ]
    }
  }
  
  // 默认响应
  return {
    content: '我来帮你解答这个问题。我们可以按照以下步骤：',
    steps: [
      { step: 1, title: '仔细读题', content: '先理解题目问的是什么，找出已知条件' },
      { step: 2, title: '分析数量关系', content: '看看这些数量之间有什么关系' },
      { step: 3, title: '选择方法', content: '根据数量关系选择合适的计算方法' },
      { step: 4, title: '计算验证', content: '算出结果后，检查是否合理' },
    ]
  }
}

// 语音合成
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    // 取消之前的语音
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的AI数学助手。你可以问我任何数学问题，或者拍照上传题目，我会一步步帮你解答！',
      type: 'text',
      timestamp: Date.now(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [chatHistory, setChatHistory] = useState<{id: string; title: string; date: number}[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('aiChatHistory')
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved))
      } catch (e) {
        console.error('加载历史失败')
      }
    }
  }, [])
  
  // 发送消息
  const sendMessage = async (content: string, type: 'text' | 'image' = 'text') => {
    if (!content.trim() && !selectedImage) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || '[图片]',
      type,
      timestamp: Date.now(),
      imageUrl: selectedImage || undefined,
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // 模拟AI思考
    setTimeout(() => {
      const response = mockAIResponse(content, !!selectedImage)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        type: 'text',
        timestamp: Date.now(),
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      setSelectedImage(null)
      
      // 自动语音朗读
      speak(response.content)
      
      // 保存到历史
      saveToHistory(content || '图片问题')
    }, 1500)
  }
  
  // 保存到历史
  const saveToHistory = (title: string) => {
    const newHistory = [
      { id: Date.now().toString(), title: title.slice(0, 20), date: Date.now() },
      ...chatHistory.slice(0, 19)
    ]
    setChatHistory(newHistory)
    localStorage.setItem('aiChatHistory', JSON.stringify(newHistory))
  }
  
  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // 语音输入（模拟）
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // 模拟语音识别结果
      setTimeout(() => {
        setInput('3乘以4等于多少')
      }, 500)
    } else {
      setIsRecording(true)
      // 3秒后自动停止
      setTimeout(() => {
        setIsRecording(false)
        setInput('3乘以4等于多少')
      }, 3000)
    }
  }
  
  // 清空对话
  const clearChat = () => {
    if (confirm('确定要清空当前对话吗？')) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是你的AI数学助手。你可以问我任何数学问题，或者拍照上传题目，我会一步步帮你解答！',
        type: 'text',
        timestamp: Date.now(),
      }])
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">AI数学助手</h1>
                  <p className="text-xs text-slate-500">拍照解题 · 语音讲解 · 智能分析</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                title="历史记录"
              >
                <History className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={clearChat}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                title="清空对话"
              >
                <Trash2 className="w-5 h-5 text-slate-600" />
              </button>
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Home className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex max-w-6xl mx-auto">
        {/* 历史记录侧边栏 */}
        {showHistory && (
          <div className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">对话历史</h3>
            </div>
            {chatHistory.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">
                暂无历史记录
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-medium text-slate-700 text-sm truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(chat.date).toLocaleDateString('zh-CN')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* 主聊天区域 */}
        <main className="flex-1 flex flex-col h-[calc(100vh-73px)]">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* 头像 */}
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* 消息内容 */}
                  <div className={`rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white shadow-sm border border-slate-100'
                  }`}>
                    {/* 图片 */}
                    {message.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={message.imageUrl}
                          alt="上传的题目"
                          className="max-w-full rounded-xl"
                        />
                      </div>
                    )}
                    
                    {/* 文字 */}
                    <div className={`text-sm leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                      {message.content}
                    </div>
                    
                    {/* AI 语音播放按钮 */}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speak(message.content)}
                        className="mt-2 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600"
                      >
                        <Volume2 className="w-3 h-3" />
                        朗读
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 加载中 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    <span className="text-sm text-slate-500">AI正在思考...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* 输入区域 */}
          <div className="p-4 bg-white border-t border-slate-200">
            {/* 图片预览 */}
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img
                  src={selectedImage}
                  alt="预览"
                  className="h-20 rounded-xl"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {/* 拍照按钮 */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                title="拍照/上传图片"
              >
                <Camera className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* 语音按钮 */}
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording ? 'bg-red-100 text-red-500' : 'hover:bg-slate-100'
                }`}
                title="语音输入"
              >
                {isRecording ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs">录音中...</span>
                  </div>
                ) : (
                  <Mic className="w-5 h-5 text-slate-600" />
                )}
              </button>
              
              {/* 输入框 */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="输入数学问题，或拍照上传题目..."
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {/* 发送按钮 */}
              <button
                onClick={() => sendMessage(input, selectedImage ? 'image' : 'text')}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* 快捷问题 */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {['3×4怎么算', '12÷3等于几', '什么是分数', '如何解应用题'].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm whitespace-nowrap hover:bg-slate-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
