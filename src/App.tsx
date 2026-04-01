import { useCallback, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { useTTSQueue } from "./hooks/useTTSQueue";
import { useYouTubeChat } from "./hooks/useYouTubeChat";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [videoId, setVideoId] = useState("");
  const [enabled, setEnabled] = useState(false);

  const { queue, isSpeaking, currentItem, enqueue, skip, clearQueue } = useTTSQueue();

  const handleMessage = useCallback(
    (author: string, text: string) => {
      enqueue(author, text);
    },
    [enqueue],
  );

  const { status, error } = useYouTubeChat({
    apiKey,
    videoId,
    onMessage: handleMessage,
    enabled,
  });

  const handleStart = (key: string, vid: string) => {
    setApiKey(key);
    setVideoId(vid);
    setEnabled(true);
  };

  const handleStop = () => {
    setEnabled(false);
    clearQueue();
  };

  const hasContent = currentItem !== null || queue.length > 0;

  return (
    <div style={styles.root}>
      <ControlPanel
        onStart={handleStart}
        onStop={handleStop}
        onSkip={skip}
        onClear={clearQueue}
        status={status}
        error={error}
        isSpeaking={isSpeaking}
        queueLength={queue.length}
      />

      <div style={styles.queuePanel}>
        <div style={styles.queueHeader}>
          <span style={styles.queueTitle}>待播清單</span>
          {hasContent && (
            <button style={styles.clearBtn} onClick={clearQueue}>清空</button>
          )}
        </div>

        <div style={styles.queueList}>
          {!hasContent && (
            <div style={styles.empty}>目前沒有待播訊息</div>
          )}

          {currentItem && (
            <div style={styles.currentItem}>
              <div style={styles.itemHeader}>
                <span style={styles.nowBadge}>朗讀中</span>
                <span style={styles.itemAuthor}>{currentItem.author}</span>
                <button style={styles.skipBtn} onClick={skip}>跳過</button>
              </div>
              <div style={styles.itemText}>{currentItem.text}</div>
            </div>
          )}

          {queue.map((item, index) => (
            <div key={item.id} style={styles.queueItem}>
              <div style={styles.itemHeader}>
                <span style={styles.itemIndex}>{index + 1}</span>
                <span style={styles.itemAuthor}>{item.author}</span>
              </div>
              <div style={styles.itemText}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
    height: "100vh",
    background: "#0d0f1a",
    alignItems: "stretch",
  },
  queuePanel: {
    width: "320px",
    flexShrink: 0,
    borderLeft: "1px solid rgba(0,229,255,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    gap: "12px",
    overflowY: "auto",
  },
  queueHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  queueTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(200,210,255,0.5)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  clearBtn: {
    background: "transparent",
    border: "1px solid rgba(255,64,129,0.4)",
    borderRadius: "4px",
    color: "rgba(255,64,129,0.8)",
    fontSize: "12px",
    padding: "3px 10px",
    cursor: "pointer",
  },
  queueList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  empty: {
    fontSize: "13px",
    color: "rgba(200,210,255,0.25)",
    textAlign: "center" as const,
    marginTop: "32px",
  },
  currentItem: {
    background: "rgba(0,229,255,0.07)",
    border: "1px solid rgba(0,229,255,0.3)",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  queueItem: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  itemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  nowBadge: {
    fontSize: "10px",
    background: "rgba(0,229,255,0.2)",
    color: "#00e5ff",
    border: "1px solid rgba(0,229,255,0.4)",
    borderRadius: "4px",
    padding: "1px 6px",
    flexShrink: 0,
  },
  itemIndex: {
    fontSize: "11px",
    color: "rgba(200,210,255,0.3)",
    minWidth: "16px",
  },
  itemAuthor: {
    fontSize: "12px",
    color: "rgba(200,210,255,0.6)",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  skipBtn: {
    background: "transparent",
    border: "1px solid rgba(0,229,255,0.3)",
    borderRadius: "4px",
    color: "rgba(0,229,255,0.7)",
    fontSize: "11px",
    padding: "2px 8px",
    cursor: "pointer",
    flexShrink: 0,
  },
  itemText: {
    fontSize: "13px",
    color: "#e8f0ff",
    lineHeight: "1.4",
    wordBreak: "break-all" as const,
  },
};

export default App;
