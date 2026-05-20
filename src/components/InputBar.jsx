import { useRef, useState } from 'react'

export default function InputBar({ disabled, onSend }) {
  const [value, setValue] = useState('')
  const taRef = useRef(null)

  const submit = () => {
    const t = value.trim()
    if (!t || disabled) return
    onSend(t)
    setValue('')
    if (taRef.current) taRef.current.style.height = '36px'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    const el = taRef.current
    if (el) {
      el.style.height = '36px'
      el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div className="chat-input-bar">
      <button className="icon-btn" aria-label="语音" tabIndex={-1}>
        🎙
      </button>
      <textarea
        ref={taRef}
        rows={1}
        placeholder="跟老张唠两句…"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKey}
      />
      <button className="icon-btn" aria-label="表情" tabIndex={-1}>
        😀
      </button>
      <button
        className="send-btn"
        disabled={disabled || !value.trim()}
        onClick={submit}
      >
        发送
      </button>
    </div>
  )
}
