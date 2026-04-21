import { Key, Video, ExternalLink, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";

export function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-base font-sans text-surface">
      <Navbar />
      <div className="max-w-[720px] w-full mx-auto px-6 pt-12 pb-20 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <h1 className="text-[32px] font-bold text-primary">使用說明</h1>
          <p className="text-[15px] text-muted/65 leading-relaxed">
            依照以下步驟取得必要的 API Key 與 Video ID，即可開始使用 Stream TTS。
          </p>
        </div>

        {/* API Key */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Key size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-surface">取得 YouTube Data API Key</h2>
          </div>

          <div className="flex flex-col gap-5 pl-1">
            <Step number={1} title="開啟 Google Cloud Console">
              前往{" "}
              <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-primary">
                console.cloud.google.com <ExternalLink size={12} className="inline align-middle" />
              </a>
              ，登入 Google 帳號。
            </Step>

            <Step number={2} title="建立或選擇專案">
              點選頂部專案選單 → <Chip>新增專案</Chip>，填入名稱後建立。
            </Step>

            <Step number={3} title="啟用 YouTube Data API v3">
              左側選單 → <Chip>API 和服務</Chip> → <Chip>程式庫</Chip>，搜尋{" "}
              <Chip>YouTube Data API v3</Chip>，點入後按 <Chip>啟用</Chip>。
            </Step>

            <Step number={4} title="建立 API 金鑰">
              左側選單 → <Chip>API 和服務</Chip> → <Chip>憑證</Chip> → 上方{" "}
              <Chip>+ 建立憑證</Chip> → <Chip>API 金鑰</Chip>。
            </Step>

            <Step number={5} title="複製金鑰">
              建立完成後會顯示金鑰字串（格式：<Code>AIza...</Code>），複製後貼到主控台的 <Chip>API Key</Chip> 欄位。
            </Step>
          </div>

          <div className="bg-warning/7 border border-warning/25 rounded-lg px-4 py-3 text-[13px] text-muted/75 leading-relaxed">
            <strong className="text-warning">配額提醒：</strong> 每日免費配額 10,000 點，
            <Code>liveChat.messages.list</Code> 每次消耗 5 點。
            本工具 polling 間隔設為 22 秒，可支撐約 12 小時連續使用。
          </div>
        </section>

        {/* Video ID */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Video size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-surface">取得 YouTube Video ID</h2>
          </div>

          <div className="flex flex-col gap-5 pl-1">
            <Step number={1} title="開啟直播頁面">
              在 YouTube 找到正在進行的直播，點入直播頁面。
            </Step>

            <Step number={2} title="從網址複製 Video ID">
              網址列會顯示如下格式：
              <div className="bg-white/4 border border-white/10 rounded-md px-3.5 py-2.5 font-mono text-[13px] text-muted/70 my-1.5 break-all">
                https://www.youtube.com/watch?v=<mark className="bg-primary/20 text-primary rounded px-0.5">dQw4w9WgXcQ</mark>
              </div>
              <Chip>v=</Chip> 後面那段即為 Video ID，將其複製貼到主控台的 <Chip>Video ID</Chip> 欄位。
            </Step>

            <Step number={3} title="開始監聽">
              填入 API Key 與 Video ID 後，按下 <Chip>開始監聽</Chip>，狀態變為綠色「監聽中」即代表成功。
            </Step>
          </div>
        </section>

        {/* OBS */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <ChevronRight size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-surface">加入 OBS 覆蓋層</h2>
          </div>

          <div className="flex flex-col gap-5 pl-1">
            <Step number={1} title="複製 Overlay URL">
              在主控台填入 API Key 與 Video ID 後，下方會自動產生 <Chip>OBS Browser Source URL</Chip>，點擊複製。
            </Step>

            <Step number={2} title="在 OBS 新增 Browser Source">
              OBS → 來源 → <Chip>+</Chip> → <Chip>瀏覽器</Chip>，將 URL 貼入。
              建議尺寸：<Chip>1920 × 1080</Chip>。
            </Step>

            <Step number={3} title="設定透明背景">
              自訂 CSS 欄位填入：
              <div className="bg-white/4 border border-white/10 rounded-md px-3.5 py-2.5 font-mono text-[13px] text-muted/70 my-1.5">
                <code>body {"{"} background: transparent !important; {"}"}</code>
              </div>
            </Step>

            <Step number={4} title="完成">
              回到主控台按下 <Chip>開始監聽</Chip>，聊天室訊息會即時顯示在串流畫面左下角並朗讀。
            </Step>
          </div>
        </section>

      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/40 text-primary text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="text-[15px] font-semibold text-surface">{title}</div>
        <div className="text-sm text-muted/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-primary/10 border border-primary/25 rounded px-1.5 py-px text-[13px] text-[#a8d8ff] font-mono">
      {children}
    </span>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-primary/8 border border-primary/15 rounded px-1.5 py-px font-mono text-[13px] text-[#a8d8ff]">
      {children}
    </code>
  );
}
