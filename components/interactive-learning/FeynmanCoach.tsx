'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, Lightbulb, MessageSquare, Star } from 'lucide-react'
import { feynmanTopics } from '@/lib/feynman-learning'
import LuoXiaoHei from '@/components/LuoXiaoHei'

interface FeynmanCoachProps {
  topicSlug: string
}

export default function FeynmanCoach({ topicSlug }: FeynmanCoachProps) {
  const topic = feynmanTopics[topicSlug]
  const [currentStep, setCurrentStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [studentResponse, setStudentResponse] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [assessmentMode, setAssessmentMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [conversationLog, setConversationLog] = useState<{role: 'teacher' | 'student'; text: string}[]>([])
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationLog])

  useEffect(() => {
    if (topic) {
      resetCoach()
    }
  }, [topicSlug])

  const resetCoach = () => {
    setCurrentStep(0)
    setStudentResponse('')
    setShowHint(false)
    setAssessmentMode(false)
    setCurrentQuestion(0)
    setShowSuccess(false)
    setConversationLog([
      { role: 'teacher', text: `欢迎来到费曼学习法训练！` },
      { role: 'teacher', text: `今天我们要学习：${topic?.title}` },
      { role: 'teacher', text: topic?.introduction || '' },
      { role: 'teacher', text: topic?.realLifeExample || '' },
    ])
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('请使用Chrome浏览器以获得语音输入功能')
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'zh-CN'
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setStudentResponse(transcript)
    }
    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.onend = () => setIsListening(false)
    recognitionRef.current.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
  }

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  const nextStep = () => {
    if (!topic) return
    if (currentStep < topic.steps.length - 1) {
      setCurrentStep(s => s + 1)
      setShowHint(false)
      setStudentResponse('')
      const step = topic.steps[currentStep + 1]
      setConversationLog(log => [...log, { role: 'teacher', text: step.teacherPrompt }])
    } else {
      setAssessmentMode(true)
      setConversationLog(log => [...log, { role: 'teacher', text: '现在进入教学测试环节！' }])
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
      setShowHint(false)
      setStudentResponse('')
    }
  }

  const submitTeaching = () => {
    if (!studentResponse.trim()) return
    setConversationLog(log => [...log, { role: 'student', text: studentResponse }])
    const responses = [
      '很好！你能再详细解释一下吗？',
      '讲得很清楚！还有其他理解方式吗？',
      '非常棒！如果让你教别人，你会怎么讲？',
    ]
    setTimeout(() => {
      setConversationLog(log => [...log, { role: 'teacher', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 500)
    setStudentResponse('')
  }

  const nextQuestion = () => {
    if (!topic) return
    if (currentQuestion < topic.assessmentQuestions.length - 1) {
      setCurrentQuestion(q => q + 1)
      setConversationLog(log => [...log, { role: 'teacher', text: topic.assessmentQuestions[currentQuestion + 1] }])
    } else {
      setShowSuccess(true)
      setConversationLog(log => [...log, { role: 'teacher', text: '恭喜！你已经完成了这个知识点的费曼学习训练！' }])
    }
  }

  if (!topic) {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center">
        <LuoXiaoHei type="think" size="lg" message="这个知识点还在准备中..." />
      </div>
    )
  }

  const currentStepData = topic.steps[currentStep]

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden shadow-lg">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 text-white flex items-center gap-4">
        <LuoXiaoHei type="teacher" size="sm" />
        <div className="flex-1">
          <h3 className="text-xl font-bold">费曼学习法</h3>
          <p className="text-violet-100 text-sm">用你自己的话教会别人，才是真正学会了</p>
        </div>
        <button onClick={resetCoach} className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm hover:bg-white/30">
          <RotateCcw className="h-4 w-4" />重新开始
        </button>
      </div>

      {/* 进度条 */}
      {!assessmentMode && (
        <div className="bg-white px-4 py-2">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>学习进度</span>
            <span>步骤 {currentStep + 1} / {topic.steps.length}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all" 
              style={{ width: `${((currentStep + 1) / topic.steps.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* 学习内容 */}
      <div className="p-4">
        {!assessmentMode ? (
          <>
            {/* 罗小黑引导 */}
            <div className="flex items-start gap-4 mb-4">
              <LuoXiaoHei type="teacher" size="md" animate />
              <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">{currentStep + 1}</span>
                  <span className="font-bold text-slate-700">罗小黑老师说</span>
                </div>
                <p className="text-slate-700">{currentStepData.teacherPrompt}</p>
              </div>
            </div>

            {/* 学生任务 */}
            <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
              <p className="text-amber-800"><span className="font-bold mr-2">📝 你的任务：</span>{currentStepData.studentTask}</p>
            </div>

            {/* 提示 */}
            {showHint && currentStepData.hint && (
              <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                <p className="text-green-800"><span className="font-bold mr-2">💡 提示：</span>{currentStepData.hint}</p>
              </div>
            )}

            {/* 输入区域 */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <p className="text-sm text-slate-600 mb-2">用你自己的话回答或讲解：</p>
              <div className="flex gap-2">
                <button onClick={isListening ? stopListening : startListening}
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${isListening ? 'animate-pulse bg-red-500 text-white' : 'bg-violet-100 text-violet-600 hover:bg-violet-200'}`}>
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <textarea value={studentResponse} onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="说出或写下你的回答..." className="flex-1 rounded-xl border-2 border-slate-200 p-3 text-sm outline-none focus:border-violet-400" rows={3} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => speak(currentStepData.teacherPrompt)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                  <Volume2 className="h-4 w-4" />听老师讲解
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
                    <Lightbulb className="h-4 w-4" />{showHint ? '隐藏提示' : '要提示'}
                  </button>
                  <button onClick={submitTeaching} disabled={!studentResponse.trim()}
                    className="flex items-center gap-1 rounded-full bg-violet-500 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50">
                    <MessageSquare className="h-4 w-4" />提交讲解
                  </button>
                </div>
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between">
              <button onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />上一步
              </button>
              <button onClick={nextStep} className="flex items-center gap-1 rounded-full bg-violet-500 px-4 py-2 text-sm font-bold text-white">
                {currentStep === topic.steps.length - 1 ? '开始评估' : '下一步'}<ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          /* 评估模式 */
          <>
            {showSuccess ? (
              <div className="text-center py-8">
                <LuoXiaoHei type="success" size="xl" message="太棒了！" />
                <h4 className="text-2xl font-bold text-violet-800 mt-4 mb-2">恭喜你！</h4>
                <p className="text-slate-600 mb-4">你已经完成了"{topic.title}"的费曼学习！</p>
                <button onClick={() => { setAssessmentMode(false); setCurrentStep(0); setShowSuccess(false); }}
                  className="rounded-full bg-violet-500 px-6 py-2 text-sm font-bold text-white">再学一遍</button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4 mb-4">
                  <LuoXiaoHei type="think" size="md" animate />
                  <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span className="font-bold text-slate-700">教学测试</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">检验你是否真正理解，请用自己的话回答：</p>
                    <p className="text-lg font-bold text-violet-800">{topic.assessmentQuestions[currentQuestion]}</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <button onClick={isListening ? stopListening : startListening}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isListening ? 'animate-pulse bg-red-500 text-white' : 'bg-violet-100 text-violet-600'}`}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <textarea value={studentResponse} onChange={(e) => setStudentResponse(e.target.value)}
                    placeholder="用你自己的话解释..." className="flex-1 rounded-xl border-2 border-slate-200 p-2 text-sm outline-none focus:border-violet-400" rows={2} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-500">问题 {currentQuestion + 1} / {topic.assessmentQuestions.length}</div>
                  <button onClick={nextQuestion} className="flex items-center gap-1 rounded-full bg-violet-500 px-6 py-2 text-sm font-bold text-white">
                    {currentQuestion === topic.assessmentQuestions.length - 1 ? '完成学习' : '下一题'}<ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 对话日志 */}
      <div className="bg-slate-50 p-3 max-h-32 overflow-y-auto border-t">
        <p className="text-xs text-slate-500 mb-1 font-bold">学习记录</p>
        {conversationLog.slice(-4).map((msg, i) => (
          <div key={i} className={`text-xs ${msg.role === 'teacher' ? 'text-violet-700' : 'text-amber-700'}`}>
            <span className="font-bold">{msg.role === 'teacher' ? '🐱' : '👤'} </span>{msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
