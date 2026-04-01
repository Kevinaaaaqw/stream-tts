# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 指令

```bash
npm run dev       # 啟動開發伺服器
npm run build     # TypeScript 型別檢查 + Vite 打包
npm run lint      # ESLint 檢查
npm run preview   # 預覽 build 結果
```

## 專案架構

YouTube 直播聊天室 TTS 工具。讀取 YouTube Live Chat API，將聊天訊息轉換為語音朗讀。

### 資料流

```
useYouTubeChat  →  App (handleMessage)  →  useTTSQueue  →  Web Speech API
  (polling)                                  (queue)         (speechSynthesis)
```

### 核心 Hooks

**`useYouTubeChat`** (`src/hooks/useYouTubeChat.ts`)
- 呼叫 YouTube Data API v3（`/videos` 取得 liveChatId，`/liveChat/messages` polling）
- `isActive` ref 控制 polling 生命週期，`isFirstPoll` 略過初始舊訊息
- `onMessage` 透過 ref 持有（避免 callback 變動觸發 polling 重啟）
- polling 間隔取 `pollingIntervalMillis` 與 3000ms 的最大值

**`useTTSQueue`** (`src/hooks/useTTSQueue.ts`)
- 以 `isProcessing` ref 防止同時播放多則訊息
- `playNext` 在 `setQueue` updater 內呼叫 `speechSynthesis.speak`（副作用在 updater 中，React Strict Mode 下需注意）
- 每 10 秒執行 pause/resume 防止 Chrome 長時間靜止後 TTS 中斷

### 訊息過濾

`src/utils/ttsFilter.ts`：移除 URL、略過空訊息、截斷超過 50 字的訊息，輸出格式為 `{author} 說：{text}`。

### 樣式

`ControlPanel.tsx` 使用 inline `React.CSSProperties` 物件，無外部 CSS 框架。`src/reset.css` 在 `main.tsx` 最先載入。

### 持久化

API Key 存於 `localStorage`（key: `stream_tts_api_key`），Video ID 不儲存。
