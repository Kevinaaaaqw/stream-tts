import { useEffect, useRef, useCallback, useState } from "react";
import { filterMessage } from "../utils/ttsFilter";

interface UseYouTubeChatProps {
  apiKey: string;
  videoId: string;
  onMessage: (author: string, text: string) => void;
  enabled: boolean;
}

export function useYouTubeChat({
  apiKey,
  videoId,
  onMessage,
  enabled,
}: UseYouTubeChatProps) {
  const [status, setStatus] = useState<"idle" | "polling" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const nextPageTokenRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstPoll = useRef(true);
  const isActive = useRef(false);
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  const getLiveChatId = useCallback(async (): Promise<string> => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`
    );
    const data = await res.json();
    const liveChatId =
      data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
    if (!liveChatId) throw new Error("找不到直播聊天室，請確認 Video ID 是否正確且直播已開始");
    return liveChatId;
  }, [apiKey, videoId]);

  const poll = useCallback(
    async (liveChatId: string) => {
      if (!isActive.current) return;

      try {
        const params = new URLSearchParams({
          part: "snippet,authorDetails",
          liveChatId,
          key: apiKey,
          maxResults: "200",
          ...(nextPageTokenRef.current && {
            pageToken: nextPageTokenRef.current,
          }),
        });

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?${params}`
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        nextPageTokenRef.current = data.nextPageToken;

        // 第一次 poll 略過，避免重播舊訊息
        if (!isFirstPoll.current) {
          const items = data.items || [];
          items.forEach((item: { authorDetails?: { displayName?: string }; snippet?: { displayMessage?: string } }) => {
            const author = item.authorDetails?.displayName || "匿名";
            const message = item.snippet?.displayMessage || "";
            const filtered = filterMessage(author, message);
            if (filtered) {
              onMessageRef.current(author, filtered);
            }
          });
        } else {
          isFirstPoll.current = false;
        }

        const interval = Math.max(data.pollingIntervalMillis || 5000, 3000);
        if (isActive.current) {
          timerRef.current = setTimeout(() => poll(liveChatId), interval);
        }
      } catch (err: unknown) {
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
        isActive.current = false;
      }
    },
    [apiKey]
  );

  const start = useCallback(async () => {
    if (!apiKey || !videoId) {
      setError("請填入 API Key 和 Video ID");
      setStatus("error");
      return;
    }

    try {
      setError(null);
      setStatus("polling");
      isActive.current = true;
      isFirstPoll.current = true;
      nextPageTokenRef.current = null;

      const liveChatId = await getLiveChatId();
      poll(liveChatId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
      isActive.current = false;
    }
  }, [apiKey, videoId, getLiveChatId, poll]);

  const stop = useCallback(() => {
    isActive.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

  useEffect(() => {
    return () => {
      isActive.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { status, error, start, stop };
}