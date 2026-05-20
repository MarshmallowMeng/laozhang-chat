import { useEffect, useRef, useState } from 'react'
import ChatHeader from './components/ChatHeader.jsx'
import MessageBubble from './components/MessageBubble.jsx'
import InputBar from './components/InputBar.jsx'
import { sendMessage } from './services/replyService.js'
import './styles/chat.css'

const INITIAL_MESSAGES = [
  {
    id: 'm0',
    role: 'them',
    text: '哎我滴老天爷，你可算来了！姐我刚下课，嗓子都冒烟了，水都没喝一口呢！来来来，跟姐唠两句！',
    ts: Date.now()
  }
]

function formatTime(ts) {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [pending, setPending] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, pending])

  const handleSend = async (text) => {
    const userMsg = {
      id: 'u' + Date.now(),
      role: 'me',
      text,
      ts: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])
    setPending(true)
    try {
      const history = messages.map((m) => ({
        role: m.role === 'me' ? 'user' : 'assistant',
        content: m.text
      }))
      const reply = await sendMessage(text, history)
      const botMsg = {
        id: 'b' + Date.now(),
        role: 'them',
        text: reply,
        ts: Date.now()
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err' + Date.now(),
          role: 'them',
          text: '哎呀姐这会儿网卡了，再说一遍？',
          ts: Date.now()
        }
      ])
    } finally {
      setPending(false)
    }
  }

  // 把消息按时间间隔（>5min）插入分隔线
  const renderList = () => {
    const out = []
    let lastTs = 0
    for (const m of messages) {
      if (!lastTs || m.ts - lastTs > 5 * 60 * 1000) {
        out.push(
          <div key={'t' + m.id} className="time-divider">
            {formatTime(m.ts)}
          </div>
        )
      }
      lastTs = m.ts
      out.push(
        <MessageBubble key={m.id} role={m.role} text={m.text} />
      )
    }
    if (pending) {
      out.push(
        <MessageBubble key="typing" role="them" text="" typing />
      )
    }
    return out
  }

  return (
    <div className="app-shell">
      <div className="chat-frame">
        <ChatHeader title="老张" />
        <div className="chat-list" ref={listRef}>
          {renderList()}
        </div>
        <InputBar disabled={pending} onSend={handleSend} />
      </div>
    </div>
  )
}
