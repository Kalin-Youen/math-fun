'use client'

import { useState } from 'react'
import { Check, Trophy, RotateCcw } from 'lucide-react'

interface ShapeExplorerProps {
  grade: number
}

const shapes = [
  { name: '正方形', emoji: '⬜', sides: 4, corners: 4 },
  { name: '长方形', emoji: '▭', sides: 4, corners: 4 },
  { name: '三角形', emoji: '△', sides: 3, corners: 3 },
  { name: '圆形', emoji: '○', sides: 0, corners: 0 },
  { name: '五边形', emoji: '⬠', sides: 5, corners: 5 },
  { name: '六边形', emoji: '⬡', sides: 6, corners: 6 },
]

export default function ShapeExplorer({ grade }: ShapeExplorerProps) {
  const [currentShape, setCurrentShape] = useState(shapes[0])
  const [score, setScore] = useState(0)
  const [questionType, setQuestionType] = useState<'name' | 'sides' | 'corners'>('name')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)

  const generateQuestion = () => {
    const randomShape = shapes[Math.floor(Math.random() * (grade <= 1 ? 4 : shapes.length))]
    const types: ('name' | 'sides' | 'corners')[] = ['name', 'sides', 'corners']
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    setCurrentShape(randomShape)
    setQuestionType(randomType)
    setSelectedAnswer(null)
    setShowResult(null)
  }

  const handleAnswer = (answer: string | number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(String(answer))
    let isCorrect = false
    
    if (questionType === 'name') {
      isCorrect = answer === currentShape.name
    } else if (questionType === 'sides') {
      isCorrect = answer === currentShape.sides
    } else if (questionType === 'corners') {
      isCorrect = answer === currentShape.corners
    }
    
    if (isCorrect) {
      setScore(s => s + 10)
      setShowResult('correct')
      setTimeout(generateQuestion, 1500)
    } else {
      setShowResult('wrong')
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowResult(null)
      }, 1500)
    }
  }

  const getQuestionText = () => {
    if (questionType === 'name') return '这个图形叫什么名字？'
    if (questionType === 'sides') return `${currentShape.emoji} 有几条边？`
    return `${currentShape.emoji} 有几个角？`
  }

  const getOptions = () => {
    if (questionType === 'name') {
      return shapes.map(s => s.name)
    }
    return [0, 3, 4, 5, 6]
  }

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-purple-800">🔷 图形探索</h3>
          <p className="text-sm text-purple-600">认识各种几何图形</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-700">{score} 分</span>
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="mb-4 text-8xl">{currentShape.emoji}</div>
        <p className="text-lg font-bold text-purple-800">{getQuestionText()}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {getOptions().map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`
              rounded-xl p-4 text-lg font-bold shadow-md transition-all
              ${selectedAnswer === String(option)
                ? showResult === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-purple-700 hover:bg-purple-100'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {showResult === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 p-3 text-center text-green-700 animate-bounce">
          <p className="font-bold">🎉 回答正确！+10分</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 p-3 text-center text-red-700">
          <p className="font-bold">❌ 再试一次！</p>
          <p className="text-sm">
            {questionType === 'name' && `正确答案是：${currentShape.name}`}
            {questionType === 'sides' && `正确答案是：${currentShape.sides}条边`}
            {questionType === 'corners' && `正确答案是：${currentShape.corners}个角`}
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={generateQuestion}
          className="flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-600"
        >
          <RotateCcw className="h-4 w-4" />
          换一题
        </button>
      </div>
    </div>
  )
}
