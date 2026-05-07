'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  title: string
  duration: string
  thumbnail?: string
  isLocked?: boolean
}

export default function VideoPlayer({ title, duration, thumbnail, isLocked }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  if (isLocked) {
    return (
      <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-sm opacity-80">完成前置关卡解锁</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden group">
      {/* 缩略图/视频区域 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg font-medium">{title}</p>
              <p className="text-sm opacity-60">视频讲解即将上线</p>
            </div>
          </div>
        )}
      </div>

      {/* 播放按钮 */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-indigo-600 ml-1" />
          </div>
        </button>
      )}

      {/* 控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* 进度条 */}
        <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
          <div 
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-sm">{duration}</span>
          </div>
          <button>
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
