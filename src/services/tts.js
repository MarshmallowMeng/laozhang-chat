// 浏览器原生 TTS 封装
// 使用 Web Speech API: window.speechSynthesis

let cachedVoice = null

function getChineseFemaleVoice() {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices() || []
  const zh = voices.filter((v) => /zh|cmn|chinese/i.test(v.lang) || /zh/i.test(v.name))

  // 优先挑女声（名字里带 Female / 女 / Tingting / Xiaoxiao 之类）
  const female =
    zh.find((v) => /female|女|tingting|xiaoxiao|yaoyao|kangkang|hui/i.test(v.name)) ||
    zh[0] ||
    voices[0]
  cachedVoice = female || null
  return cachedVoice
}

// voices 是异步加载的，这里预热一下
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    getChineseFemaleVoice()
  }
}

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, { onEnd, onError } = {}) {
  if (!isSupported()) {
    onError?.(new Error('当前浏览器不支持语音播放'))
    return null
  }
  // 停止之前的
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'zh-CN'
  utter.rate = 1.05 // 老张说话比较快
  utter.pitch = 1.05
  utter.volume = 1
  const voice = getChineseFemaleVoice()
  if (voice) utter.voice = voice

  utter.onend = () => onEnd?.()
  utter.onerror = (e) => onError?.(e)
  window.speechSynthesis.speak(utter)
  return utter
}

export function stop() {
  if (!isSupported()) return
  window.speechSynthesis.cancel()
}
