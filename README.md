# 跟老张聊天 · LaoZhang Chat

一个微信风格的对话模拟器网页 app。对话对象「老张」——38 岁辅导机构女老师，性格大大咧咧、热心、说话夸张。

回复由**豆包大模型**（火山方舟 Ark，OpenAI 兼容接口）生成，老张的人设和语气都写在 system prompt 里。

## 快速开始

### 1. 装依赖

```bash
cd ~/CursorProject/laozhang-chat
npm install
```

### 2. 配置 .env

```bash
cp .env.example .env
```

打开 `.env`，填两个值：

- `VITE_ARK_API_KEY`：火山方舟 API Key。去 https://console.volcengine.com/ark 注册创建。
- `VITE_ARK_MODEL`：**推理接入点 ID**。注意这个**不是模型名**，是你在方舟控制台 → "在线推理" → "创建推理接入点" 里得到的 ID（形如 `ep-2024xxxx-xxxxx`）。火山方舟新用户每个模型有免费额度，够玩很久。

### 3. 启动

```bash
npm run dev
```

浏览器自动打开 http://localhost:5173 ，开整。

## 怎么调老张的语气

老张的人设全在 `src/data/laozhangPrompt.js` 里。觉得她话太长？说得不够"老张"？直接改这个文件里的规则，刷新页面立即生效。比如：

- 想让她更夸张：调高 `replyService.js` 里的 `temperature`（现在是 0.95）
- 想让她回复更短：在 prompt 里把"1-3 句"改成"1 句"，或者把 `max_tokens` 调小
- 想加新的口头禅：直接在 prompt 的"语气词"列表里加

## 切换模型

想换成 DeepSeek / Kimi / 通义？只需改两处：

1. `vite.config.js` 里 proxy 的 `target` 和 `rewrite`
2. `.env` 里的 key

代码逻辑一行不用动（OpenAI 兼容接口都是 `/chat/completions`）。

## 项目结构

```
src/
├── App.jsx                  # 主入口
├── components/
│   ├── ChatHeader.jsx
│   ├── MessageBubble.jsx    # 带 TTS 朗读按钮
│   └── InputBar.jsx
├── data/
│   ├── laozhangPrompt.js    # ⭐ 老张的人设 prompt
│   └── laozhangCorpus.js    # （旧的 mock 语料，已不使用）
├── services/
│   ├── replyService.js      # ⭐ 调豆包 API 的逻辑
│   └── tts.js               # 浏览器 TTS
└── styles/
```

## 注意

- `.env` 已在 `.gitignore` 里，不会被提交
- 这个方案 dev server 直接把 API key 放在浏览器请求里，**只适合本地自用**。要公开部署的话需要写一个简单的后端代理藏 key
- TTS 是浏览器原生的，不同系统音色不一样；想要更"老张"的声音可以接火山引擎的 TTS
