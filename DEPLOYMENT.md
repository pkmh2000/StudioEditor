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

## 5. 常見問題排查 (Troubleshooting)

- **Q: 部署後畫面空白？**
  - 請檢查瀏覽器開發者工具（F12）的 Console。本專案已使用 `base: './'`，如有自訂路由跳轉，請使用 Hash 或 Memory 模式。
- **Q: GitHub Actions 報權限錯誤 (403 / write permissions)？**
  - 請至 **Settings** > **Actions** > **General** > **Workflow permissions**，確保勾選了 **Read and write permissions**。
