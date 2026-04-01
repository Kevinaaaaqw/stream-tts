import { useState } from "react";

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

  const isConnected = status === "polling";

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stream TTS</h1>

      {/* API Key */}
      <div style={styles.field}>
        <label style={styles.label}>API Key</label>
        <input
          style={styles.input}
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          disabled={isConnected}
        />
      </div>

      {/* Video ID */}
      <div style={styles.field}>
        <label style={styles.label}>Video ID</label>
        <input
          style={styles.input}
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="直播網址中 v= 後面的字串"
          disabled={isConnected}
        />
      </div>

      {/* 狀態 */}
      <div style={styles.statusRow}>
        <span
          style={{
            ...styles.dot,
            background: status === "polling" ? "#00e676" : status === "error" ? "#ff4081" : "#555",
          }}
        />
        <span style={styles.statusText}>
          {status === "polling" ? "監聽中" : status === "error" ? "錯誤" : "未連線"}
        </span>
        {isSpeaking && <span style={styles.speakingBadge}>朗讀中</span>}
        {queueLength > 0 && <span style={styles.queueBadge}>佇列 {queueLength} 則</span>}
      </div>

      {/* 錯誤訊息 */}
      {error && <div style={styles.error}>{error}</div>}

      {/* 按鈕 */}
      <div style={styles.btnRow}>
        {!isConnected ? (
          <button style={styles.btnPrimary} onClick={handleStart}>
            開始監聽
          </button>
        ) : (
          <button style={styles.btnDanger} onClick={onStop}>
            停止
          </button>
        )}
        <button style={styles.btnSecondary} onClick={onSkip} disabled={!isSpeaking}>
          跳過
        </button>
        <button style={styles.btnSecondary} onClick={onClear} disabled={queueLength === 0 && !isSpeaking}>
          清空
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    background: "#0d0f1a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    fontFamily: "sans-serif",
    color: "#e8f0ff",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#00e5ff",
    marginBottom: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "360px",
  },
  label: {
    fontSize: "13px",
    color: "rgba(200,210,255,0.6)",
  },
  input: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,229,255,0.25)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#e8f0ff",
    fontSize: "14px",
    outline: "none",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "13px",
    color: "rgba(200,210,255,0.6)",
  },
  speakingBadge: {
    fontSize: "11px",
    background: "rgba(0,229,255,0.15)",
    color: "#00e5ff",
    border: "1px solid rgba(0,229,255,0.3)",
    borderRadius: "4px",
    padding: "2px 8px",
  },
  queueBadge: {
    fontSize: "11px",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(200,210,255,0.6)",
    borderRadius: "4px",
    padding: "2px 8px",
  },
  error: {
    background: "rgba(255,64,129,0.12)",
    border: "1px solid rgba(255,64,129,0.3)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#ff8aaa",
    width: "360px",
  },
  btnRow: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  btnPrimary: {
    background: "rgba(0,229,255,0.15)",
    border: "1px solid #00e5ff",
    borderRadius: "8px",
    color: "#00e5ff",
    padding: "10px 24px",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnDanger: {
    background: "rgba(255,64,129,0.15)",
    border: "1px solid #ff4081",
    borderRadius: "8px",
    color: "#ff4081",
    padding: "10px 24px",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,229,255,0.25)",
    borderRadius: "8px",
    color: "rgba(200,210,255,0.6)",
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
