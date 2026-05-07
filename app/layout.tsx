import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '小学数学乐园',
  description: '速算练习、九九乘法表、趣味数学 — 专为小学数学教学设计',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-72x72.svg', sizes: '72x72' },
      { url: '/icons/icon-96x96.svg', sizes: '96x96' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512' },
    ],
    apple: [
      { url: '/icons/icon-192x192.svg', sizes: '180x180' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
