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
      <div className="flex items-center justify-center w-screen h-screen bg-base text-[#ff8aaa] text-base font-sans">
        缺少 apiKey 或 videoId 參數
      </div>
    );
  }

  return (
    <div
      className="w-screen h-screen bg-transparent flex flex-col justify-end items-start px-8 pb-10 box-border pointer-events-none"
      style={{ fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" }}
    >
      {error && (
        <div className="absolute top-4 left-4 bg-danger/85 text-white text-[13px] px-3 py-1.5 rounded-md">
          {error}
        </div>
      )}

      {currentItem && (
        <div className="flex flex-col gap-1.5 bg-black/65 border border-primary/50 rounded-xl px-5 py-3.5 max-w-[600px] backdrop-blur-sm shadow-[0_0_20px_rgba(0,229,255,0.15)]">
          <span
            className="text-[15px] font-bold text-primary"
            style={{ textShadow: "0 0 8px rgba(0,229,255,0.6)" }}
          >
            {currentItem.author}
          </span>
          <span
            className="text-xl font-medium text-white leading-relaxed break-all"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {currentItem.text}
          </span>
        </div>
      )}
    </div>
  );
}
