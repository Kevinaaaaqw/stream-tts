import { useCallback, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { Navbar } from "./components/Navbar";
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
    <div className="flex flex-col w-screen h-screen bg-base">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
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

        {/* 待播清單 */}
        <div className="w-80 shrink-0 border-l border-primary/10 flex flex-col py-6 px-4 gap-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted/50 tracking-[0.05em] uppercase">待播清單</span>
            {hasContent && (
              <button className="border border-danger/40 rounded text-danger/80 text-xs px-2.5 py-0.5" onClick={clearQueue}>
                清空
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {!hasContent && (
              <div className="text-[13px] text-muted/25 text-center mt-8">目前沒有待播訊息</div>
            )}

            {currentItem && (
              <div className="bg-primary/7 border border-primary/30 rounded-lg px-3 py-2.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-primary/20 text-primary border border-primary/40 rounded px-1.5 py-px shrink-0">朗讀中</span>
                  <span className="text-xs text-muted/60 flex-1 truncate">{currentItem.author}</span>
                  <button className="border border-primary/30 rounded text-primary/70 text-[11px] px-2 py-0.5 shrink-0" onClick={skip}>跳過</button>
                </div>
                <div className="text-[13px] text-surface leading-snug break-all">{currentItem.text}</div>
              </div>
            )}

            {queue.map((item, index) => (
              <div key={item.id} className="bg-white/3 border border-white/7 rounded-lg px-3 py-2.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted/30 min-w-4">{index + 1}</span>
                  <span className="text-xs text-muted/60 flex-1 truncate">{item.author}</span>
                </div>
                <div className="text-[13px] text-surface leading-snug break-all">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
