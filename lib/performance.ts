// 性能优化工具库 - 编程高手视角
// 包含缓存、懒加载、虚拟列表、防抖节流等优化策略

// ==================== 缓存系统 ====================

interface CacheEntry<T> {
  value: T
  timestamp: number
  expiresAt: number
}

class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private defaultTTL: number

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 默认5分钟
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry.value
  }

  set(key: string, value: T, ttl?: number): void {
    // LRU淘汰策略
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttl || this.defaultTTL),
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // 获取缓存命中率统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize * 100).toFixed(2) + '%',
    }
  }
}

// 全局缓存实例
export const globalCache = new MemoryCache<any>(200, 10 * 60 * 1000)

// ==================== 防抖节流 ====================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func(...args)
    }, wait)

    if (callNow) func(...args)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ==================== 虚拟列表 ====================

export interface VirtualListOptions {
  itemHeight: number
  overscan: number
  containerHeight: number
}

export function calculateVirtualRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualListOptions
) {
  const { itemHeight, overscan, containerHeight } = options
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount)
  
  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    totalHeight: totalItems * itemHeight,
  }
}

// ==================== 图片懒加载 ====================

export function useLazyImage() {
  const imageObserver = typeof window !== 'undefined' 
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px',
        threshold: 0.01,
      })
    : null

  return {
    observe: (element: HTMLImageElement) => imageObserver?.observe(element),
    unobserve: (element: HTMLImageElement) => imageObserver?.unobserve(element),
  }
}

// ==================== Web Worker 计算 ====================

// 复杂计算任务放入 Worker 执行
export function createMathWorker() {
  const workerCode = `
    self.onmessage = function(e) {
      const { type, data } = e.data
      
      switch(type) {
        case 'generateQuestions':
          const questions = generateQuestions(data.topic, data.count, data.difficulty)
          self.postMessage({ type: 'questions', data: questions })
          break
        case 'analyzeMistakes':
          const analysis = analyzeMistakes(data.mistakes)
          self.postMessage({ type: 'analysis', data: analysis })
          break
        case 'calculateStats':
          const stats = calculateStats(data.records)
          self.postMessage({ type: 'stats', data: stats })
          break
      }
    }
    
    function generateQuestions(topic, count, difficulty) {
      const questions = []
      for (let i = 0; i < count; i++) {
        questions.push({
          id: i,
          content: \`题目 \${i + 1}\`,
          answer: Math.floor(Math.random() * 100),
        })
      }
      return questions
    }
    
    function analyzeMistakes(mistakes) {
      const patterns = {}
      mistakes.forEach(m => {
        patterns[m.type] = (patterns[m.type] || 0) + 1
      })
      return patterns
    }
    
    function calculateStats(records) {
      const total = records.length
      const sum = records.reduce((a, b) => a + b.score, 0)
      return {
        average: sum / total,
        total,
      }
    }
  `
  
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

// ==================== 性能监控 ====================

export class PerformanceMonitor {
  private metrics: Record<string, number[]> = {}

  measure(name: string, fn: () => void): void {
    const start = performance.now()
    fn()
    const end = performance.now()
    
    if (!this.metrics[name]) {
      this.metrics[name] = []
    }
    this.metrics[name].push(end - start)
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    if (!this.metrics[name]) {
      this.metrics[name] = []
    }
    this.metrics[name].push(end - start)
    
    return result
  }

  getStats(name: string) {
    const times = this.metrics[name]
    if (!times || times.length === 0) return null
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)
    
    return {
      name,
      count: times.length,
      average: avg.toFixed(2) + 'ms',
      min: min.toFixed(2) + 'ms',
      max: max.toFixed(2) + 'ms',
    }
  }

  getAllStats() {
    return Object.keys(this.metrics).map(name => this.getStats(name))
  }

  clear(): void {
    this.metrics = {}
  }
}

export const perfMonitor = new PerformanceMonitor()

// ==================== 代码分割和预加载 ====================

// 路由级别代码分割配置
export const routeChunks = {
  dashboard: () => import('@/app/dashboard/page'),
  'speed-calc': () => import('@/app/speed-calc/page'),
  'multiplication-table': () => import('@/app/multiplication-table/page'),
  'learning-tips': () => import('@/app/learning-tips/page'),
}

// 预加载关键路由
export function prefetchRoutes(routes: (keyof typeof routeChunks)[]) {
  if (typeof window === 'undefined') return
  
  // 使用 requestIdleCallback 在浏览器空闲时预加载
  const prefetch = () => {
    routes.forEach(route => {
      const chunk = routeChunks[route]
      if (chunk) {
        chunk()
      }
    })
  }
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 2000 })
  } else {
    setTimeout(prefetch, 100)
  }
}

// ==================== 状态管理优化 ====================

// 使用 Proxy 实现自动缓存的状态管理
export function createCachedState<T extends Record<string, any>>(
  initialState: T,
  options: { ttl?: number; key?: string } = {}
) {
  const { ttl = 60000, key = 'app-state' } = options
  
  // 尝试从 localStorage 恢复
  let state: T
  try {
    const saved = localStorage.getItem(key)
    state = saved ? { ...initialState, ...JSON.parse(saved) } : initialState
  } catch {
    state = initialState
  }
  
  let saveTimeout: NodeJS.Timeout
  
  const proxy = new Proxy(state, {
    set(target, prop, value) {
      target[prop as keyof T] = value
      
      // 防抖保存
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(target))
        } catch {
          // 存储空间不足
        }
      }, 1000)
      
      return true
    },
  })
  
  return proxy
}

// ==================== 内存管理 ====================

// 自动清理过期缓存
export function setupAutoCleanup() {
  if (typeof window === 'undefined') return
  
  // 页面隐藏时清理
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 清理非关键缓存
      globalCache.clear()
    }
  })
  
  // 定期清理（每5分钟）
  setInterval(() => {
    // 清理 localStorage 中过期的数据
    const now = Date.now()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('cache-')) {
        try {
          const entry = JSON.parse(localStorage.getItem(key) || '{}')
          if (entry.expiresAt && entry.expiresAt < now) {
            localStorage.removeItem(key)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    }
  }, 5 * 60 * 1000)
}

// ==================== 网络优化 ====================

// 请求去重
const pendingRequests = new Map<string, Promise<any>>()

export function dedupeRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key)
  })
  
  pendingRequests.set(key, promise)
  return promise
}

// 批量请求合并
export class BatchRequest<T, R> {
  private queue: { item: T; resolve: (value: R) => void; reject: (reason: any) => void }[] = []
  private batchFn: (items: T[]) => Promise<R[]>
  private delay: number
  private timeout: NodeJS.Timeout | null = null

  constructor(batchFn: (items: T[]) => Promise<R[]>, delay = 50) {
    this.batchFn = batchFn
    this.delay = delay
  }

  request(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject })
      
      if (this.timeout) clearTimeout(this.timeout)
      
      this.timeout = setTimeout(() => {
        this.flush()
      }, this.delay)
    })
  }

  private async flush() {
    if (this.queue.length === 0) return
    
    const batch = [...this.queue]
    this.queue = []
    
    try {
      const items = batch.map(b => b.item)
      const results = await this.batchFn(items)
      
      batch.forEach((b, i) => {
        b.resolve(results[i])
      })
    } catch (error) {
      batch.forEach(b => b.reject(error))
    }
  }
}

// ==================== 导出工具函数 ====================

export {
  MemoryCache,
}

// 使用示例和最佳实践
export const performanceBestPractices = {
  // 1. 列表虚拟化
  virtualList: '大数据列表使用虚拟滚动',
  
  // 2. 图片优化
  imageOptimization: '使用 WebP 格式，懒加载，响应式图片',
  
  // 3. 代码分割
  codeSplitting: '路由级别自动分割，动态导入',
  
  // 4. 缓存策略
  caching: '内存缓存 + localStorage + Service Worker',
  
  // 5. 计算优化
  computation: '复杂计算放入 Web Worker',
  
  // 6. 渲染优化
  rendering: '使用 React.memo, useMemo, useCallback',
  
  // 7. 网络优化
  network: '请求去重、批量合并、HTTP/2',
}
