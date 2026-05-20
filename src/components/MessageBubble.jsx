import { useState } from 'react'
import { speak, stop, isSupported } from '../services/tts.js'

export default function MessageBubble({ role, text, typing = false }) {
  const isMe = role === 'me'
  const [playing, setPlaying] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)

  const handleSpeak = () => {
    if (typing) return
    if (playing) {
      stop()
      setPlaying(false)
      return
    }
    setPlaying(true)
    speak(text, {
      onEnd: () => setPlaying(false),
      onError: () => setPlaying(false)
    })
  }

  return (
    <div className={`msg-row ${isMe ? 'me' : 'them'}`}>
      {!isMe && (
        <div className="avatar" aria-label="老张">
          {avatarFailed ? (
            '张'
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}avatar.jpg`}
              alt="老张"
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
      )}
      <div className={`bubble-wrap ${isMe ? 'me' : 'them'}`}>
        <div className={`bubble ${isMe ? 'me' : 'them'}`}>
          {typing ? (
            <span className="typing" aria-label="正在输入">
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            text
          )}
          {!typing && !isMe && isSupported() && (
            <button
              className={`speaker ${playing ? 'playing' : ''}`}
              onClick={handleSpeak}
              aria-label={playing ? '停止' : '播放语音'}
            >
              {playing ? '⏸ 播放中' : '🔊 听一下'}
            </button>
          )}
        </div>
      </div>
      {isMe && (
        <div className="avatar me" aria-label="我">
          我
        </div>
      )}
    </div>
  )
}
