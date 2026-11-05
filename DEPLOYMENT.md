# GitHub Pages 自動化部署指南 (GitHub Pages CI/CD Guide)

本專案經過專門設計，可以無縫發布至 GitHub Pages 並提供穩定的即時線上預覽。以下是從零建立並啟用自動化部署的詳細步驟：

---

## 1. 儲存庫設定 (Repository Settings)

1. 將本專案推送至您的 GitHub 儲存庫（預設分支為 `main` 或 `master`）。
2. 在 GitHub 網頁上進入儲存庫頁面。
3. 點擊頂部導航欄的 **Settings**（設定）。
4. 在左側選單中找到並點擊 **Pages**。
5. 在 **Build and deployment** > **Source** 下拉選單中，選取 **GitHub Actions**。

*(不需要手動選取 `gh-pages` 分支，GitHub Actions 會自動透過內建安全 Token 發布)*。

---

## 2. 靜態資源相對路徑原理 (`vite.config.ts`)

在一般靜態伺服器或子路徑環境中（例如 `https://<username>.github.io/<repository-name>/`），若使用根絕對路徑 `/assets/...` 會導致 404 資源缺失錯誤。

本專案在 `vite.config.ts` 中設定了：
```typescript
export default defineConfig(() => ({
  base: './', // 確保打包出的 HTML 引用相對路徑資源
  // ...
}));
```
這保證了：
- 在本機開發（`localhost:3000`）正常運行。
- 在 AI Studio 預覽環境正常運行。
- 在 GitHub Pages 任意儲存庫子路徑皆能正確加載 JS/CSS/圖片素材。

---

## 3. GitHub Actions 工作流流程 (`.github/workflows/deploy.yml`)

每次推送代碼至 `main` 或 `master` 時，GitHub Actions 將依序執行以下階段：

```yaml
1. Checkout 代碼
2. 安裝 Node.js 20 環境與 npm 快取
3. 執行 npm ci 安裝完整依賴
4. 執行代碼品質檢查與 Jest 單元測試：
   - npm run lint
   - npm test
5. 執行生產環境建置：
   - npm run build (產出 dist/ 資料夾)
6. 透過 actions/upload-pages-artifact 與 actions/deploy-pages 部署至 GitHub Pages
```

---

## 4. 自訂網域 (可選 Custom Domain)

如果您想將自己的網域（例如 `editor.yourdomain.com`）綁定到 GitHub Pages：
1. 在 GitHub 儲存庫 > **Settings** > **Pages** > **Custom domain** 輸入您的網域。
2. 在您的 DNS 提供商處設定 CNAME 記錄指向 `<username>.github.io`。
3. 勾選 **Enforce HTTPS** 啟用免費 SSL 憑證。

---

## 5. 常見部屬失敗原因與排查清單 (Why Deployment Fails & Checklist)

若 GitHub Actions 沒有部屬成功，請依序對照以下 5 個最常見的設定關鍵：

### 關鍵 1：GitHub Pages Source 沒有切換為「GitHub Actions」（最常見 90% 原因）
- **現象**：Actions 運行到 `deploy-pages` 步驟時報錯 `Error: Deployment request failed: 404 Not Found` 或顯示 Pages 未啟用。
- **解法**：
  1. 進入您的 GitHub 儲存庫頁面。
  2. 點擊頂部 **Settings** ➔ 左側選單 **Pages**。
  3. 找到 **Build and deployment** 下方的 **Source**。
  4. **必須將下拉選單從「Deploy from a branch」改選為「GitHub Actions」**。
  5. 點擊儲存後，到 Actions 分頁重新觸發部署即可！

### 關鍵 2：Workflow Permissions 權限不足 (403 Forbidden)
- **現象**：報錯 `403 Resource not accessible by integration` 或缺少 token write 權限。
- **解法**：
  1. 進入儲存庫 **Settings** ➔ 左側選單 **Actions** ➔ **General**。
  2. 滾動到最下方的 **Workflow permissions**。
  3. 選取 **Read and write permissions**，並勾選 **Allow GitHub Actions to create and approve pull requests**。
  4. 點擊 **Save**。

### 關鍵 3：依賴安裝衝突 (npm ERESOLVE Peer Dependency)
- **現象**：GitHub Actions 在 `Install dependencies` 步驟紅字中斷，出現 `npm error ERESOLVE could not resolve peer dependency` 或 `npm ci requires package-lock.json`。
- **已為您修復**：
  - 專案已移除不相容的舊套件，加入了根目錄 `.npmrc`（`legacy-peer-deps=true`）。
  - 已生成最新相容的 `package-lock.json`。
  - `.github/workflows/deploy.yml` 已配置安全回退指令：`npm ci --legacy-peer-deps || npm install --legacy-peer-deps`。

### 關鍵 4：推送分支名稱不符合 (Branch Mismatch)
- **現象**：Push 代碼後，Actions 完全沒有被觸發（空白無紀錄）。
- **解法**：
  - `.github/workflows/deploy.yml` 預設監聽 `main` 與 `master` 分支。
  - 請確認您推送到的是 `main` 或 `master`。
  - 若使用其他分支，或想手動測試部署：進入儲存庫 ➔ 點擊頂部 **Actions** ➔ 左側點選 **Deploy to GitHub Pages** ➔ 右側點擊 **Run workflow** 按鈕即可立即觸發。

### 關鍵 5：靜態路徑與 404 刷新白屏 (Jekyll & SPA Fallback)
- **已為您修復**：
  - `vite.config.ts` 已設定 `base: './'`，確保無論儲存庫名稱為何，所有 JS/CSS/圖片都以相對路徑正確載入。
  - 建置流程已自動加入 `.nojekyll`，避免 GitHub Pages 的 Jekyll 引擎過濾 assets 檔案。
  - 建置流程已複製 `index.html` 為 `404.html`，防止瀏覽器重新整理時出現 GitHub 404 頁面。

