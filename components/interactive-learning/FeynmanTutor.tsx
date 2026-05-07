'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, RotateCcw, Volume2, MessageCircle, Lightbulb } from 'lucide-react'

interface FeynmanTutorProps {
  topicSlug: string
  topicTitle: string
  gradeId: number
}

// 应用题库
const wordProblems: Record<string, { problem: string; hint: string; steps: string[]; answer: string }[]> = {
  'g1-add-20': [
    {
      problem: '小明有8个苹果，妈妈又给了他5个，小明现在一共有多少个苹果？',
      hint: '想一想：原来有几个？又得到几个？',
      steps: ['第一步：小明原来有8个苹果', '第二步：妈妈又给了5个', '第三步：8 + 5 = 13个'],
      answer: '13个'
    },
    {
      problem: '树上有12只小鸟，飞走了4只，还剩多少只？',
      hint: '飞走了就是减少，用什么运算？',
      steps: ['第一步：树上原来有12只小鸟', '第二步：飞走了4只', '第三步：12 - 4 = 8只'],
      answer: '8只'
    }
  ],
  'g1-money': [
    {
      problem: '一支铅笔2元，一块橡皮1元，小明买了1支铅笔和2块橡皮，一共需要多少钱？',
      hint: '先算橡皮多少钱，再算总共多少钱',
      steps: ['第一步：2块橡皮 = 1 + 1 = 2元', '第二步：铅笔2元 + 橡皮2元 = 4元'],
      answer: '4元'
    }
  ],
  'g2-mul-table': [
    {
      problem: '小明有3盒糖果，每盒有7颗，一共有多少颗糖果？',
      hint: '每盒数量 × 盒数 = 总数',
      steps: ['第一步：每盒7颗糖果', '第二步：有3盒', '第三步：7 × 3 = 21颗'],
      answer: '21颗'
    }
  ],
  'g3-perimeter': [
    {
      problem: '一个长方形花坛，长是8米，宽是5米，围着花坛走一圈是多少米？',
      hint: '走一圈就是求周长，周长 = (长 + 宽) × 2',
      steps: ['第一步：长是8米，宽是5米', '第二步：周长 = (8 + 5) × 2', '第三步：13 × 2 = 26米'],
      answer: '26米'
    }
  ]
}

export default function FeynmanTutor({ topicSlug, topicTitle, gradeId }: FeynmanTutorProps) {
  const [isListening, setIsListening] = useState(false)
  const [currentProblem, setCurrentProblem] = useState(0)
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([])
  const [inputText, setInputText] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // 获取当前知识点的应用题
  const problems = wordProblems[topicSlug] || wordProblems['g1-add-20']
  const problem = problems[currentProblem % problems.length]

  useEffect(() => {
    // 初始化AI消息
    setMessages([
      { role: 'ai', content: `你好！我们来学习「${topicTitle}」吧！📖` },
      { role: 'ai', content: `请看这道题：\n\n${problem.problem}` },
      { role: 'ai', content: '你可以告诉我你的想法，或者点击麦克风说出你的答案！🎤' }
    ])
    setShowHint(false)
    setShowSteps(false)
    setCurrentStep(0)
  }, [currentProblem, topicTitle, problem])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 语音识别
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别，请使用Chrome浏览器')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'zh-CN'
    recognitionRef.current.continuous = false

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      handleSendMessage(transcript)
    }

    recognitionRef.current.onerror = () => {
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInputText('')

    // AI回复逻辑
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      
      if (lowerText.includes('不会') || lowerText.includes('不懂') || lowerText.includes('提示')) {
        setShowHint(true)
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: `💡 提示：${problem.hint}` 
        }])
      } else if (lowerText.includes('答案') || lowerText.includes('对不对')) {
        setShowSteps(true)
        setMessages(prev => [...prev, 
          { role: 'ai', content: `正确答案是：${problem.answer}` },
          { role: 'ai', content: '让我来讲解一下解题步骤：' },
          ...problem.steps.map(step => ({ role: 'ai' as const, content: step }))
        ])
      } else if (lowerText.includes(problem.answer.replace(/[个只颗元米]/g, ''))) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: '🎉 太棒了！你答对了！你能告诉我你是怎么想的吗？' 
        }])
      } else {
        // 引导孩子思考
        const responses = [
          '嗯，我听到你的想法了！能再详细说说你的思路吗？',
          '好的，那你觉得第一步应该怎么做呢？',
          '你说的有道理！那接下来呢？',
          '让我们一起分析一下这道题的条件...'
        ]
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: responses[Math.floor(Math.random() * responses.length)] 
        }])
      }
    }, 500)
  }

  const nextProblem = () => {
    setCurrentProblem(c => c + 1)
  }

  // 语音播放
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🎤📖💡🎉]/g, ''))
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-violet-800">🎓 费曼学习法</h3>
          <p className="text-sm text-violet-600">讲给AI听，真正学会</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => speak(problem.problem)}
            className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700"
          >
            <Volume2 className="h-4 w-4" />
            读题
          </button>
        </div>
      </div>

      {/* 题目展示 */}
      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-600">
            应用题 {currentProblem + 1}/{problems.length}
          </span>
        </div>
        <p className="text-lg text-slate-800">{problem.problem}</p>
        
        {showHint && (
          <div className="mt-3 rounded-lg bg-amber-50 p-2 text-amber-700">
            💡 提示：{problem.hint}
          </div>
        )}
      </div>

      {/* 对话区域 */}
      <div className="mb-4 h-64 overflow-y-auto rounded-xl bg-white p-4 shadow-inner">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-violet-500 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {msg.role === 'ai' && <span className="mr-2">🤖</span>}
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
            isListening 
              ? 'animate-pulse bg-red-500 text-white' 
              : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="说出你的想法..."
          className="flex-1 rounded-full border-2 border-violet-200 px-4 py-2 outline-none focus:border-violet-400"
        />
        
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {/* 快捷按钮 */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handleSendMessage('请给我一个提示')}
          className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700"
        >
          <Lightbulb className="h-4 w-4" />
          要提示
        </button>
        <button
          onClick={() => handleSendMessage('请告诉我答案')}
          className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700"
        >
          看答案
        </button>
        <button
          onClick={nextProblem}
          className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-sm font-bold text-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          下一题
        </button>
      </div>

      {/* 解题步骤 */}
      {showSteps && (
        <div className="mt-4 rounded-xl bg-violet-100 p-4">
          <p className="mb-2 font-bold text-violet-800">📝 解题步骤：</p>
          <div className="space-y-1">
            {problem.steps.map((step, i) => (
              <p key={i} className="text-sm text-violet-700">{step}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
