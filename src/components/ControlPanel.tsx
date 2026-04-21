import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface ControlPanelProps {
  onStart: (apiKey: string, videoId: string) => void;
  onStop: () => void;
  onSkip: () => void;
  onClear: () => void;
  status: "idle" | "polling" | "error";
  error: string | null;
  isSpeaking: boolean;
  queueLength: number;
}

export function ControlPanel({
  onStart,
  onStop,
  onSkip,
  onClear,
  status,
  error,
  isSpeaking,
  queueLength,
}: ControlPanelProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("stream_tts_api_key") ?? "");
  const [videoId, setVideoId] = useState("");

  const handleStart = () => {
    localStorage.setItem("stream_tts_api_key", apiKey);
    onStart(apiKey, videoId);
  };

  const overlayUrl =
    apiKey && videoId
      ? `${window.location.origin}/overlay?apiKey=${encodeURIComponent(apiKey)}&videoId=${encodeURIComponent(videoId)}`
      : "";

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(overlayUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [overlayUrl]);

  const isConnected = status === "polling";

  const dotClass =
    status === "polling" ? "bg-success" :
    status === "error"   ? "bg-danger"  : "bg-[#555]";

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 font-sans text-surface">

      <h1 className="text-[28px] font-bold text-primary mb-2">Stream TTS</h1>

      {/* API Key */}
      <div className="flex flex-col gap-1.5 w-90">
        <label className="text-[13px] text-muted/60">API Key</label>
        <input
          className="bg-white/5 border border-primary/25 rounded-lg px-3 py-2.5 text-surface text-sm outline-none disabled:opacity-50"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          disabled={isConnected}
        />
      </div>

      {/* Video ID */}
      <div className="flex flex-col gap-1.5 w-90">
        <label className="text-[13px] text-muted/60">Video ID</label>
        <input
          className="bg-white/5 border border-primary/25 rounded-lg px-3 py-2.5 text-surface text-sm outline-none disabled:opacity-50"
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="直播網址中 v= 後面的字串"
          disabled={isConnected}
        />
      </div>

      {/* 狀態 */}
      <div className="flex items-center gap-2 mt-1">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <span className="text-[13px] text-muted/60">
          {status === "polling" ? "監聽中" : status === "error" ? "錯誤" : "未連線"}
        </span>
        {isSpeaking && (
          <span className="text-[11px] bg-primary/15 text-primary border border-primary/30 rounded px-2 py-0.5">朗讀中</span>
        )}
        {queueLength > 0 && (
          <span className="text-[11px] bg-white/8 text-muted/60 rounded px-2 py-0.5">佇列 {queueLength} 則</span>
        )}
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-danger/12 border border-danger/30 rounded-lg px-3.5 py-2.5 text-[13px] text-[#ff8aaa] w-90">
          {error}
        </div>
      )}

      {/* 按鈕 */}
      <div className="flex gap-2 mt-1">
        {!isConnected ? (
          <button className="bg-primary/15 border border-primary rounded-lg text-primary px-6 py-2.5 text-sm" onClick={handleStart}>
            開始監聽
          </button>
        ) : (
          <button className="bg-danger/15 border border-danger rounded-lg text-danger px-6 py-2.5 text-sm" onClick={onStop}>
            停止
          </button>
        )}
        <button
          className="bg-white/5 border border-primary/25 rounded-lg text-muted/60 px-5 py-2.5 text-sm disabled:opacity-40"
          onClick={onSkip}
          disabled={!isSpeaking}
        >
          跳過
        </button>
        <button
          className="bg-white/5 border border-primary/25 rounded-lg text-muted/60 px-5 py-2.5 text-sm disabled:opacity-40"
          onClick={onClear}
          disabled={queueLength === 0 && !isSpeaking}
        >
          清空
        </button>
      </div>

      {/* OBS Overlay URL */}
      {overlayUrl && (
        <div className="w-90 bg-primary/5 border border-primary/20 rounded-lg px-3.5 py-3 flex flex-col gap-2 mt-2">
          <div className="text-[11px] text-primary/60 tracking-[0.05em] uppercase">OBS Browser Source URL</div>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-[11px] text-muted/70 break-all leading-snug">{overlayUrl}</span>
            <button
              className="shrink-0 bg-primary/15 border border-primary/40 rounded-md px-3 py-1"
              onClick={handleCopy}
              title={copied ? "已複製" : "複製"}
            >
              {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
