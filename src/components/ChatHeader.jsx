export default function ChatHeader({ title = '老张' }) {
  return (
    <div className="chat-header">
      <button className="back" aria-label="返回">‹</button>
      <div className="title">{title}</div>
      <button className="menu" aria-label="更多">⋯</button>
    </div>
  )
}
