// replyService.js
// 走 Vite 代理调用豆包（火山方舟 Ark）的 OpenAI 兼容接口。
// 浏览器请求 /api/ark/chat/completions，Vite 转发到 ark.cn-beijing.volces.com/api/v3/chat/completions

import { LAO_ZHANG_SYSTEM_PROMPT } from '../data/laozhangPrompt.js'

// ⚠️ 写死的 API Key 和模型 —— 仅本地自用，不要把这个文件传到公开仓库
const API_KEY = '7aab4c02-96e2-4e4c-a075-3c29d09dfa61'
const MODEL = 'doubao-seed-2-0-lite-260215'

// 开发环境走 Vite 代理；生产环境（GH Pages）直连火山方舟
// 注意：火山方舟 ark.cn-beijing.volces.com 是否允许浏览器跨域请求由它的 CORS 策略决定，
// 如果生产环境 CORS 失败，需要换到带后端代理的方案
const ARK_ENDPOINT = import.meta.env.DEV
  ? '/api/ark/chat/completions'
  : 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

// history 只保留最近 N 轮，避免上下文越滚越长
const MAX_HISTORY_TURNS = 12

/**
 * 发送一条用户消息，返回老张的回复
 * @param {string} userText
 * @param {Array<{role:'user'|'assistant', content:string}>} history
 * @returns {Promise<string>}
 */
export async function sendMessage(userText, history = []) {
  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS * 2)

  const messages = [
    { role: 'system', content: LAO_ZHANG_SYSTEM_PROMPT },
    ...trimmedHistory,
    { role: 'user', content: userText }
  ]

  const body = {
    model: MODEL,
    messages,
    temperature: 0.95,
    top_p: 0.9,
    max_tokens: 200,
    presence_penalty: 0.3,
    frequency_penalty: 0.3
  }

  let res
  try {
    res = await fetch(ARK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    })
  } catch (e) {
    console.error('网络错误:', e)
    return '哎呀姐这会儿网卡了，你稍等再发一遍！'
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    console.error('Ark API error:', res.status, errText)
    if (res.status === 401) {
      return '哎呀这 API key 不对，去 replyService.js 里检查一下 API_KEY！'
    }
    if (res.status === 404) {
      return '哎，模型名儿不对。replyService.js 里的 MODEL 改成你方舟里能用的模型/接入点。'
    }
    return `哎哟出错了：${res.status}，看看控制台咋回事？`
  }

  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) {
    return '哎呀我刚那话噎住了，你再说一遍？'
  }
  return reply
}
