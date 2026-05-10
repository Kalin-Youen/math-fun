// Cloudflare Worker - NVIDIA AI 代理
// 部署到 Cloudflare Workers，国内可访问
// 支持流式输出

export interface Env {
  NVIDIA_API_KEY: string
  NVIDIA_BASE_URL?: string
  MODEL?: string
}

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'
const DEFAULT_MODEL = 'nemotron-3-super-120b-a12b'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      })
    }

    // 只允许 POST
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    try {
      const body = await request.json()
      const { messages, temperature = 0.7, max_tokens = 2048, stream = false } = body

      if (!messages || !Array.isArray(messages)) {
        return jsonResponse({ error: 'messages is required' }, 400)
      }

      const baseUrl = env.NVIDIA_BASE_URL || DEFAULT_BASE_URL
      const model = env.MODEL || DEFAULT_MODEL

      const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          top_p: 0.9,
          stream,
        }),
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error('NVIDIA API Error:', errorText)
        return jsonResponse({ error: `NVIDIA API Error: ${apiResponse.status}`, detail: errorText }, apiResponse.status)
      }

      // 流式响应
      if (stream) {
        return new Response(apiResponse.body, {
          headers: {
            ...corsHeaders(),
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        })
      }

      // 普通响应
      const data = await apiResponse.json()
      return jsonResponse(data, 200)

    } catch (error) {
      console.error('Worker Error:', error)
      return jsonResponse({ error: 'Internal server error' }, 500)
    }
  },
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    },
  })
}
