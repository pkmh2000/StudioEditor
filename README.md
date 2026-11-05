# Timeline Studio — 瀏覽器即時預覽 AI 影片剪輯器 (Browser AI Video Editor)

> 基於 React 19 + TypeScript + Tailwind CSS 的高效率模組化網頁影片剪輯器，內建即時預覽、多軌時間軸、React Query 資料快取、Jest 單元測試與 GitHub Actions 自動化部署到 GitHub Pages。

---

## 🌟 核心特色 (Key Features)

- ⚡ **即時預覽功能 (Real-Time Canvas Preview)**：
  - HTML5 Canvas + Media 雙引擎合成，支援 1080p、4K、9:16 (Shorts/TikTok)、1:1 (Instagram) 多種畫幅比。
  - 即時即顯濾鏡（對比度、亮度、飽和度、模糊、復古、賽博朋克 LUT 調色）。
  - 畫布直接拖曳定位、縮放、旋轉與安全框（90% 行動安全區、80% 標題安全區、三分法則九宮格）。
- 🎞️ **多軌道時間軸編輯 (Multi-Track Timeline)**：
  - 支援主畫面軌（Visuals）、畫中畫/貼圖軌（Overlays）、字幕軌（Captions）、旁白配音軌（Voiceover）、背景音樂軌（Music）。
  - 磁吸吸附（Magnet Snapping）、片段自由拖曳移動、左右手柄精確 Trim 裁切、時間游標處一鍵裁切分割（Split, `Ctrl+B`）、複製（Duplicate, `Ctrl+D`）與刪除（Delete）。
- 📝 **智慧字幕與樣式生成器 (Subtitles & Captions)**：
  - 多種預設樣式（經典深色底框、賽博青光、電影暖黃字、醒目紅色徽章）。
  - 字體大小、顏色、背景色、對齊位置（上中下）自由調節。
- 🎵 **音訊與波形視覺化 (Audio & Waveform)**：
  - 音訊波形即時即現，音量推桿調節（0-150%）、淡入淡出（Fade In/Out）與立體聲聲像（Pan）。
- 🔄 **歷史復原與專案匯出 (History & Portability)**：
  - 完整 Undo / Redo 復原重做機制（`Ctrl+Z` / `Ctrl+Y`）。
  - 支援將剪輯專案完整匯出為 `.timeline` 檔案備份，並支援模擬渲染輸出高清 MP4 / WebM。
- 🚀 **React Query 伺服器狀態與素材快取 (@tanstack/react-query)**：
  - 透過 React Query 智慧快取素材庫、音效、旁白模板與即時搜尋結果，具備 10 分鐘 Stale Time 快取與記憶體最佳化。

---

## 🛠️ 技術架構 (Technology Stack)

| 領域 | 技術選型 | 說明 |
| :--- | :--- | :--- |
| **框架** | React 19 + TypeScript | 提供類型安全性與極致響應速度 |
| **樣式** | Tailwind CSS v4 | 專業深色 Studio 剪輯介面，符合嚴格視覺規範 |
| **資料快取** | `@tanstack/react-query` | 伺服器狀態管理、素材庫快取與快速檢索 |
| **測試** | Jest + esbuild transformer | 高覆蓋率單元測試，保障時間軸計算與時間碼準確性 |
| **代碼品質** | ESLint + TypeScript Compiler | 嚴格的靜態分析與品質把關 |
| **自動化部署** | GitHub Actions | 一鍵 Push 自動測試、建置並發布至 GitHub Pages |

---

## 🚀 部署至 GitHub Pages 指南 (GitHub Pages Deployment)

本專案已完整配置 GitHub Pages 的自動化 CI/CD 流程：

1. **靜態資源相對路徑**：
   `vite.config.ts` 中已配置 `base: './'`，確保無論部屬在根網域或 GitHub Pages 子路徑（例如 `https://<username>.github.io/<repo>/`）皆能正確加載靜態資源。

2. **啟用 GitHub Actions Pages**：
   - 將專案推送到您的 GitHub 儲存庫（`main` 或 `master` 分支）。
   - 進入 GitHub 儲存庫頁面，點選 **Settings** > **Pages**。
   - 在 **Build and deployment** 下方的 **Source**，選取 **GitHub Actions**。

3. **自動化流程 (`.github/workflows/deploy.yml`)**：
   - 每次 Push 觸發後，GitHub Actions 會自動執行：
     1. 安裝依賴（`npm ci`）
     2. 語法檢查與單元測試（`npm run lint` & `npm test`）
     3. 建置發布成品（`npm run build`）
     4. 發布至 GitHub Pages 並產生線上訪問網址！

---

## 💻 本地開發與測試 (Local Development & Testing)

### 安裝依賴
```bash
npm install
```

### 啟動本機開發伺服器
```bash
npm run dev
```
瀏覽器打開 `http://localhost:3000` 即可預覽即時剪輯器。

### 執行 Jest 單元測試
```bash
npm test
```
涵蓋時間碼轉換（`formatTimecode`、`parseTimecode`）、時間軸吸附計算（`findSnapPoint`）、片段拆分演算法（`splitClipAtPlayhead`）與音訊波形產生器。

### 執行代碼檢查 (Lint)
```bash
npm run lint
```

### 專案生產建置
```bash
npm run build
```

---

## ⌨️ 快捷鍵一覽 (Keyboard Shortcuts)

| 快捷鍵 | 動作說明 |
| :--- | :--- |
| **Space** | 播放 / 暫停 (Play / Pause) |
| **Ctrl + B** / **Cmd + B** | 在目前播放頭處裁切分割片段 (Split Clip) |
| **Ctrl + D** / **Cmd + D** | 複製選取的片段 (Duplicate Clip) |
| **Backspace** / **Delete** | 刪除選取的片段 (Delete Clip) |
| **Left Arrow** | 倒退 1 個影格 (Previous Frame) |
| **Right Arrow** | 前進 1 個影格 (Next Frame) |
| **M** | 在播放頭位置新增標記 (Add Marker) |
| **S** | 開啟/關閉磁吸功能 (Toggle Snapping) |
| **Ctrl + Z** | 復原 (Undo) |
| **Ctrl + Y** / **Ctrl + Shift + Z** | 重做 (Redo) |

---

## 📁 模組化目錄結構 (Modular Directory Structure)

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自動部署腳本
├── src/
│   ├── __tests__/              # Jest 單元測試套件
│   │   └── timeline.test.ts
│   ├── components/             # 高內聚模組化組件
│   │   ├── header/             # 頂部導航與專案標題
│   │   ├── sidebar/            # 素材庫、音效、字幕生成器
│   │   ├── preview/            # 即時預覽畫布播放器與控制條
│   │   ├── inspector/          # 片段屬性調整器（濾鏡、變形、字幕、音量）
│   │   ├── timeline/           # 多軌時間軸、尺規、游標與片段
│   │   ├── export/             # 匯出彈窗與渲染器
│   │   └── modals/             # 說明文件與快捷鍵彈窗
│   ├── context/                # ProjectContext 狀態與歷史管理
│   ├── hooks/                  # useStockMedia (React Query) 快取
│   ├── services/               # 素材庫 API 與預設範例專案
│   ├── types/                  # 全專案 TypeScript 介面定義
│   ├── utils/                  # 時間碼、畫布渲染引擎與數學計算
│   ├── App.tsx                 # 主應用程式骨架
│   ├── main.tsx                # React 進入點
│   └── index.css               # Tailwind CSS v4 與自訂樣式
├── jest.config.cjs             # Jest 測試設定檔
├── eslint.config.js            # ESLint 檢查規範
├── tsconfig.json               # TypeScript 編譯設定
└── vite.config.ts              # Vite 建置與 GitHub Pages 相對路徑設定
```

---

## 📄 授權 (License)

本專案原創原始碼採用 [MIT License](LICENSE) 授權。
