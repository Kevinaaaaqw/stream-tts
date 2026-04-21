import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTTSQueue } from "../hooks/useTTSQueue";
import { useYouTubeChat } from "../hooks/useYouTubeChat";

export function OverlayPage() {
  const [searchParams] = useSearchParams();
  const apiKey = searchParams.get("apiKey") ?? "";
  const videoId = searchParams.get("videoId") ?? "";

  const { currentItem, enqueue } = useTTSQueue();

  const handleMessage = useCallback(
    (author: string, text: string) => enqueue(author, text),
    [enqueue]
  );

  const { error } = useYouTubeChat({
    apiKey,
    videoId,
    onMessage: handleMessage,
    enabled: !!(apiKey && videoId),
  });

  if (!apiKey || !videoId) {
    return (
      <div style={styles.paramError}>
        缺少 apiKey 或 videoId 參數
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {error && <div style={styles.errorBadge}>{error}</div>}

      {currentItem && (
        <div style={styles.messageBox}>
          <span style={styles.author}>{currentItem.author}</span>
          <span style={styles.text}>{currentItem.text}</span>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: "100vw",
    height: "100vh",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: "0 32px 40px",
    boxSizing: "border-box",
    fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif",
    pointerEvents: "none",
  },
  messageBox: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    background: "rgba(0, 0, 0, 0.65)",
    border: "1px solid rgba(0,229,255,0.5)",
    borderRadius: "12px",
    padding: "14px 20px",
    maxWidth: "600px",
    backdropFilter: "blur(4px)",
    boxShadow: "0 0 20px rgba(0,229,255,0.15)",
  },
  author: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#00e5ff",
    textShadow: "0 0 8px rgba(0,229,255,0.6)",
  },
  text: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#ffffff",
    lineHeight: "1.5",
    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
    wordBreak: "break-all",
  },
  errorBadge: {
    position: "absolute" as const,
    top: "16px",
    left: "16px",
    background: "rgba(255,64,129,0.85)",
    color: "#fff",
    fontSize: "13px",
    padding: "6px 12px",
    borderRadius: "6px",
  },
  paramError: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "#0d0f1a",
    color: "#ff8aaa",
    fontSize: "16px",
    fontFamily: "sans-serif",
  },
};
