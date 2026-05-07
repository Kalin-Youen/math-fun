// Service Worker for PWA
const CACHE_NAME = 'math-fun-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/globals.css',
]

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// 拦截请求，优先从缓存获取
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return

  // 跳过 chrome-extension 请求
  if (event.request.url.startsWith('chrome-extension://')) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有，直接返回
      if (response) {
        // 后台更新缓存
        fetch(event.request).then((fetchResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
          })
        }).catch(() => {})
        return response
      }

      // 否则发起网络请求
      return fetch(event.request).then((fetchResponse) => {
        // 缓存成功的响应
        if (fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return fetchResponse
      }).catch(() => {
        // 网络失败时，返回离线页面
        if (event.request.destination === 'document') {
          return caches.match('/')
        }
      })
    })
  )
})

// 后台同步（用于离线提交的数据）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

async function syncData() {
  // 从 IndexedDB 获取离线数据并同步
  // 这里可以实现离线学习记录的同步
}

// 推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || '该学习了！',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'math-fun-reminder',
    requireInteraction: true,
    actions: [
      { action: 'study', title: '开始学习' },
      { action: 'dismiss', title: '稍后提醒' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('小学数学乐园', options)
  )
})

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'study') {
    event.waitUntil(
      clients.openWindow('/daily')
    )
  }
})
