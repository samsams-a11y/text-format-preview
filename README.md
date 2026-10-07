# 文字格式化工具

以 React、TypeScript 和 Vite 製作的純前端文字工具。輸入內容只在瀏覽器中處理，不需要帳號或後端。

## 本機啟動

需要 Node.js 22.12 或更新版本。

```sh
npm ci
npm run dev
```

在終端機顯示的本機網址開啟工具。

## 測試與正式 build

```sh
npm test
npm run build
npm run preview
```

正式檔案會產生在 `dist/`。

## 部署到 GitHub Pages

1. 將專案推送到 GitHub repository 的 `main` 或 `master` 分支。
2. 在 repository 的 **Settings → Pages → Build and deployment**，將來源選為 **GitHub Actions**。
3. 推送程式碼或手動啟動 `Deploy to GitHub Pages` workflow；成功後可從 Actions 或 Pages 設定頁開啟網站。

網站會由 `.github/workflows/deploy.yml` 自動建置與發佈，Vite 使用相對資產路徑，支援 GitHub Pages 的 repository 子路徑。
