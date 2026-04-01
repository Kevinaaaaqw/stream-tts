import { useState, useRef, useCallback, useEffect } from "react";

interface TTSItem {
  id: number;
  author: string;
  text: string;
}

export function useTTSQueue() {
  const [queue, setQueue] = useState<TTSItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentItem, setCurrentItem] = useState<TTSItem | null>(null);
  const isProcessing = useRef(false);

  const enqueue = useCallback((author: string, text: string) => {
    const item: TTSItem = {
      id: Date.now(),
      author,
      text,
    };
    setQueue((prev) => [...prev, item]);
  }, []);

  const playNext = useCallback(() => {
    if (isProcessing.current) return;

    setQueue((prev) => {
      if (prev.length === 0) {
        isProcessing.current = false;
        return prev;
      }

      const [next, ...rest] = prev;
      isProcessing.current = true;
      setIsSpeaking(true);
      setCurrentItem(next);

      const utter = new SpeechSynthesisUtterance(next.text);
      utter.lang = "zh-TW";
      utter.rate = 1.0;
      utter.volume = 1.0;

      const resumeInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      utter.onend = () => {
        clearInterval(resumeInterval);
        isProcessing.current = false;
        setIsSpeaking(false);
        setCurrentItem(null);
      };

      utter.onerror = () => {
        isProcessing.current = false;
        setIsSpeaking(false);
        setCurrentItem(null);
      };

      window.speechSynthesis.speak(utter);
      return rest;
    });
  }, []);

  // 有新訊息且沒在播 → 開始播
  useEffect(() => {
    if (!isProcessing.current) {
      playNext();
    }
  }, [queue.length, playNext]);

  // 播完 → 自動播下一則
  useEffect(() => {
    if (!isSpeaking && !isProcessing.current) {
      playNext();
    }
  }, [isSpeaking, playNext]);

  const skip = useCallback(() => {
    window.speechSynthesis.cancel();
    isProcessing.current = false;
    setIsSpeaking(false);
    setCurrentItem(null);
  }, []);

  const clearQueue = useCallback(() => {
    window.speechSynthesis.cancel();
    isProcessing.current = false;
    setQueue([]);
    setIsSpeaking(false);
    setCurrentItem(null);
  }, []);

  return { queue, isSpeaking, currentItem, enqueue, skip, clearQueue };
}
