'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, RotateCcw, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Lightbulb, MessageSquare, Star } from 'lucide-react'
import { feynmanTopics, type FeynmanTopic, type FeynmanStep } from '@/lib/feynman-learning'

interface FeynmanCoachProps {
  topicSlug: string
}

export default function FeynmanCoach({ topicSlug }: FeynmanCoachProps) {
  const topic = feynmanTopics[topicSlug]
  const [currentStep, setCurrentStep] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [studentResponse, setStudentResponse] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [stepCompleted, setStepCompleted] = useState(false)
  const [assessmentMode, setAssessmentMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [conversationLog, setConversationLog] = useState<{role: 'teacher' | 'student'; text: string}[]>([])
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationLog])

  // 初始化
  useEffect(() => {
    if (topic) {
      resetCoach()
    }
  }, [topicSlug])

  const resetCoach = () => {
    setCurrentStep(0)
    setStudentResponse('')
    setShowHint(false)
    setStepCompleted(false)
    setAssessmentMode(false)
    setCurrentQuestion(0)
    setShowSuccess(false)
    setConversationLog([
      { role: 'teacher', text: `🎓 欢迎来到费曼学习法训练！` },
      { role: 'teacher', text: `今天我们要学习：${topic?.title}` },
      { role: 'teacher', text: `📖 ${topic?.introduction}` },
      { role: 'teacher', text: `🌟 ${topic?.realLifeExample}` },
      { role: 'teacher', text: `准备好了吗？让我们开始吧！` }
    ])
  }

  // 语音识别
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

  // 语音播放
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🎓📖🌟💡✅❌⭐]/g, ''))
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  // 进入下一步
  const nextStep = () => {
    if (!topic) return
    
    if (currentStep < topic.steps.length - 1) {
      setCurrentStep(s => s + 1)
      setShowHint(false)
      setStepCompleted(false)
      setStudentResponse('')
      
      const step = topic.steps[currentStep + 1]
      setConversationLog(log => [...log, { role: 'teacher', text: `📖 步骤${currentStep + 2}：${step.teacherPrompt}` }])
    } else {
      // 进入评估模式
      setAssessmentMode(true)
      setConversationLog(log => [...log, { role: 'teacher', text: '🎯 现在进入"Teaching Mode"评估环节！' }])
    }
  }

  // 上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
      setShowHint(false)
      setStepCompleted(false)
      setStudentResponse('')
    }
  }

  // 标记步骤完成
  const completeStep = () => {
    if (!topic) return
    setStepCompleted(true)
    setConversationLog(log => [...log, 
      { role: 'student', text: studentResponse || '（口头回答）' },
      { role: 'teacher', text: '✅ ' + topic.steps[currentStep].successCriteria }
    ])
  }

  // 学生提交讲解
  const submitTeaching = () => {
    if (!studentResponse.trim()) return
    
    setConversationLog(log => [...log, { role: 'student', text: studentResponse }])
    
    // AI评估反馈
    const step = topic?.steps[currentStep]
    if (step) {
      const responses = [
        '💡 很好！你能再详细解释一下这部分吗？',
        '⭐ 讲得很清楚！还有没有其他理解方式？',
        '🌟 非常棒！如果让你教弟弟妹妹，你会怎么讲？',
        '📝 你的讲解很到位！让我们继续下一个知识点。'
      ]
      setTimeout(() => {
        setConversationLog(log => [...log, { role: 'teacher', text: responses[Math.floor(Math.random() * responses.length)] }])
      }, 1000)
    }
    
    setStudentResponse('')
  }

  // 下一个评估问题
  const nextQuestion = () => {
    if (!topic) return
    
    if (currentQuestion < topic.assessmentQuestions.length - 1) {
      setCurrentQuestion(q => q + 1)
      setConversationLog(log => [...log, { role: 'teacher', text: `❓ 问题${currentQuestion + 2}：${topic.assessmentQuestions[currentQuestion + 1]}` }])
    } else {
      setShowSuccess(true)
      setConversationLog(log => [...log, { role: 'teacher', text: '🎉 恭喜！你已经完成了这个知识点的费曼学习训练！' }])
    }
  }

  if (!topic) {
    return (
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-slate-600">这个知识点还没有费曼学习资料，即将添加！</p>
      </div>
    )
  }

  const currentStepData = topic.steps[currentStep]

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden shadow-lg">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎓</span> 费曼学习法教练
            </h3>
            <p className="text-violet-100 text-sm">用你自己的话教会别人，才是真正学会了</p>
          </div>
          <button
            onClick={resetCoach}
            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm transition hover:bg-white/30"
          >
            <RotateCcw className="h-4 w-4" />
            重新开始
          </button>
        </div>
      </div>

      {/* 进度条 */}
      {!assessmentMode && (
        <div className="bg-white px-4 py-2">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>学习进度</span>
            <span>步骤 {currentStep + 1} / {topic.steps.length}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / topic.steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 学习内容 */}
      <div className="p-4">
        {!assessmentMode ? (
          <>
            {/* 当前步骤 */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {currentStep + 1}
                </span>
                <h4 className="font-bold text-slate-800">学习步骤</h4>
              </div>
              
              <div className="space-y-4">
                {/* 老师引导 */}
                <div className="bg-violet-50 rounded-lg p-3">
                  <p className="text-sm text-violet-800">
                    <span className="font-bold mr-2">👨‍🏫 老师说：</span>
                    {currentStepData.teacherPrompt}
                  </p>
                </div>
                
                {/* 学生任务 */}
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <span className="font-bold mr-2">📝 你的任务：</span>
                    {currentStepData.studentTask}
                  </p>
                </div>

                {/* 提示 */}
                {showHint && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-bold mr-2">💡 提示：</span>
                      {currentStepData.hint}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 输入区域 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-2">用你自己的话回答或讲解：</p>
              
              <div className="flex gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    isListening 
                      ? 'animate-pulse bg-red-500 text-white' 
                      : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                
                <textarea
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="说出或写下你的回答..."
                  className="flex-1 rounded-xl border-2 border-slate-200 p-3 text-sm outline-none focus:border-violet-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => speak(currentStepData.teacherPrompt + currentStepData.studentTask)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                >
                  <Volume2 className="h-4 w-4" />
                  听老师讲解
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {showHint ? '隐藏提示' : '要提示'}
                  </button>
                  <button
                    onClick={submitTeaching}
                    disabled={!studentResponse.trim()}
                    className="flex items-center gap-1 rounded-full bg-violet-500 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    提交讲解
                  </button>
                </div>
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                上一步
              </button>
              
              <button
                onClick={completeStep}
                className="flex items-center gap-1 rounded-full bg-green-500 px-6 py-2 text-sm font-bold text-white"
              >
                <CheckCircle className="h-4 w-4" />
                我完成了
              </button>
              
              <button
                onClick={nextStep}
                className="flex items-center gap-1 rounded-full bg-violet-500 px-4 py-2 text-sm font-bold text-white"
              >
                {currentStep === topic.steps.length - 1 ? '开始评估' : '下一步'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          /* 评估模式 - Teaching Mode */
          <>
            {showSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h4 className="text-2xl font-bold text-violet-800 mb-2">太棒了！</h4>
                <p className="text-slate-600 mb-4">你已经完成了"{topic.title}"的费曼学习！</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setAssessmentMode(false)
                      setCurrentStep(0)
                      setShowSuccess(false)
                    }}
                    className="flex items-center gap-1 rounded-full bg-violet-500 px-6 py-2 text-sm font-bold text-white"
                  >
                    再学一遍
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h4 className="font-bold text-slate-800">🎯 Teaching Mode - 教学测试</h4>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">
                    下面是检验你是否真正理解的问题。请尝试用自己的话回答：
                  </p>
                  
                  <div className="bg-violet-50 rounded-lg p-4">
                    <p className="text-lg font-bold text-violet-800">
                      ❓ {topic.assessmentQuestions[currentQuestion]}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isListening 
                          ? 'animate-pulse bg-red-500 text-white' 
                          : 'bg-violet-100 text-violet-600'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <textarea
                      value={studentResponse}
                      onChange={(e) => setStudentResponse(e.target.value)}
                      placeholder="用你自己的话解释这个问题..."
                      className="flex-1 rounded-xl border-2 border-slate-200 p-2 text-sm outline-none focus:border-violet-400"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-500">
                    问题 {currentQuestion + 1} / {topic.assessmentQuestions.length}
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="flex items-center gap-1 rounded-full bg-violet-500 px-6 py-2 text-sm font-bold text-white"
                  >
                    {currentQuestion === topic.assessmentQuestions.length - 1 ? '完成学习' : '下一题'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 对话日志 */}
      <div className="bg-slate-50 p-4 max-h-48 overflow-y-auto">
        <p className="text-xs text-slate-500 mb-2 font-bold">📜 学习记录</p>
        <div className="space-y-2">
          {conversationLog.slice(-6).map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === 'teacher' ? 'text-violet-700' : 'text-amber-700'}`}>
              <span className="font-bold">{msg.role === 'teacher' ? '👨‍🏫' : '👤'} </span>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部要点提示 */}
      {!assessmentMode && (
        <div className="bg-amber-50 p-3 border-t border-amber-100">
          <p className="text-xs font-bold text-amber-700 mb-1">💡 费曼技巧：</p>
          <p className="text-xs text-amber-600">
            如果你能把这个知识点讲给10岁的小朋友听懂，你就真正掌握了！
          </p>
        </div>
      )}
    </div>
  )
}
