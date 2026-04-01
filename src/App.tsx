import { useCallback, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { useTTSQueue } from "./hooks/useTTSQueue";
import { useYouTubeChat } from "./hooks/useYouTubeChat";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [videoId, setVideoId] = useState("");
  const [enabled, setEnabled] = useState(false);

  const { queue, isSpeaking, enqueue, skip, clearQueue } = useTTSQueue();

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

  return (
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
  );
}

export default App;
