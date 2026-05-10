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
  Loader2,
  X,
  History,
  Trash2
} from 'lucide-react'
import { chatWithAI, solvePhotoProblemWithAI } from '@/lib/nvidia-ai'

// 消息类型
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'image'
  timestamp: number
  imageUrl?: string
}

// 语音合成
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
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
      content: '你好！我是小猫AI数学助手，由NVIDIA Nemotron-3-Super-120B驱动。你可以问我任何数学问题，或者拍照上传题目！',
      type: 'text',
      timestamp: Date.now(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [grade, setGrade] = useState(3)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // 发送消息 - 使用真正的NVIDIA AI
  const sendMessage = async (content: string) => {
    if (!content.trim() && !selectedImage) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || '[图片]',
      type: selectedImage ? 'image' : 'text',
      timestamp: Date.now(),
      imageUrl: selectedImage || undefined,
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      let aiContent = ''
      
      if (selectedImage) {
        // 使用AI识别图片题目
        const base64 = selectedImage.split(',')[1]
        const result = await solvePhotoProblemWithAI(base64, grade)
        if (result) {
          aiContent = `📷 识别题目：${result.recognizedText}\n\n💡 解答步骤：\n${result.solution}\n\n✅ 答案：${result.answer}\n\n📚 相关知识点：${result.relatedKnowledge?.join('、')}`
        } else {
          aiContent = '抱歉，图片识别失败，请尝试重新上传或直接用文字描述题目。'
        }
      } else {
        // 使用AI对话
        const context = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
        const response = await chatWithAI(content, context, grade)
        aiContent = response.content || '抱歉，AI响应失败，请重试。'
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        type: 'text',
        timestamp: Date.now(),
      }
      
      setMessages(prev => [...prev, aiMessage])
      speak(aiContent)
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，AI服务暂时不可用，请稍后重试。',
        type: 'text',
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
    }
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
  
  // 语音输入
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别')
      return
    }
    
    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'zh-CN'
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        setInput(text)
        setIsRecording(false)
      }
      recognition.onerror = () => {
        setIsRecording(false)
      }
      recognition.start()
    }
  }
  
  // 清空对话
  const clearChat = () => {
    if (confirm('确定要清空当前对话吗？')) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是小猫AI数学助手，由NVIDIA Nemotron-3-Super-120B驱动。你可以问我任何数学问题，或者拍照上传题目！',
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
                  <p className="text-xs text-slate-500">Powered by NVIDIA Nemotron-3</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={grade} 
                onChange={(e) => setGrade(Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm"
              >
                <option value={1}>一年级</option>
                <option value={2}>二年级</option>
                <option value={3}>三年级</option>
                <option value={4}>四年级</option>
                <option value={5}>五年级</option>
                <option value={6}>六年级</option>
              </select>
              <button onClick={clearChat} className="p-2 hover:bg-slate-100 rounded-xl">
                <Trash2 className="w-5 h-5 text-slate-600" />
              </button>
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl">
                <Home className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-73px)]">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
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
                
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white shadow-sm border border-slate-100'
                }`}>
                  {message.imageUrl && (
                    <div className="mb-3">
                      <img src={message.imageUrl} alt="题目" className="max-w-full max-h-48 rounded-xl" />
                    </div>
                  )}
                  
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <button onClick={() => speak(message.content)} className="mt-2 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600">
                      <Volume2 className="w-3 h-3" />
                      朗读
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                  <span className="text-sm text-slate-500">NVIDIA AI思考中...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* 输入区域 */}
        <div className="p-4 bg-white border-t border-slate-200">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="预览" className="h-20 rounded-xl" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-slate-100 rounded-xl transition-colors" title="拍照解题">
              <Camera className="w-5 h-5 text-slate-600" />
            </button>
            
            <button onClick={toggleRecording} className={`p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-100 text-red-500' : 'hover:bg-slate-100'}`}>
              {isRecording ? <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> : <Mic className="w-5 h-5 text-slate-600" />}
            </button>
            
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="输入数学问题，或拍照上传..."
                className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
