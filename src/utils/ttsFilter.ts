const MAX_LENGTH = 50;
const URL_REGEX = /https?:\/\/\S+|www\.\S+/gi;

export function filterMessage(author: string, message: string): string | null {
  // 移除 URL
  const cleaned = message.replace(URL_REGEX, "").trim();

  // 清理後若為空則略過
  if (!cleaned) return null;

  // 截斷過長訊息
  const truncated = cleaned.length > MAX_LENGTH ? cleaned.slice(0, MAX_LENGTH) + "..." : cleaned;

  return `${author} 說：${truncated}`;
}
