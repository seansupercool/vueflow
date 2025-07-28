# VueFlow 決策樹編輯器

這是一個基於 Vue 3 + TypeScript + VueFlow 的決策樹流程圖編輯器。

## 專案結構

```
src/
├── pages/           # 頁面組件
│   ├── HomePage.vue     # 首頁
│   ├── VueFlowPage.vue  # VueFlow 編輯器頁面
│   ├── TiptapPage.vue   # Tiptap 文字編輯器頁面
│   └── EditorJsPage.vue # Editor.js 區塊編輯器頁面
├── router/          # 路由設定
│   └── index.ts
├── components/      # 可重用組件
├── composable/      # 組合式函數
├── core/           # 核心類型和枚舉
├── constants/      # 常數
├── utils/          # 工具函數
├── styles/         # 樣式檔案
├── types/          # TypeScript 類型定義
└── assets/         # 靜態資源
```

## 路由設定

- `/` - 首頁，顯示歡迎訊息和導航按鈕
- `/vueflow` - VueFlow 編輯器頁面，包含完整的決策樹編輯功能
- `/tiptap` - Tiptap 文字編輯器頁面，支援豐富的文字格式化功能
- `/editorjs` - Editor.js 區塊編輯器頁面，支援結構化內容編輯

## 功能特色

### VueFlow 編輯器
- 視覺化決策樹編輯
- 節點和邊的屬性編輯
- JSON 格式的匯入/匯出功能
- 響應式設計

### Tiptap 文字編輯器
- 文字格式化（粗體、斜體、底線等）
- 文字顏色和背景色設定
- 表格功能
- 連結和圖片插入
- 多種格式匯出（純文字、HTML、JSON）

### Editor.js 區塊編輯器
- 區塊式內容編輯
- 多種內容類型（標題、段落、列表、引用等）
- 表格和圖片支援
- 連結預覽和嵌入內容
- 結構化 JSON 資料匯出

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置專案
npm run build

# 類型檢查
npm run type-check
```

## 技術棧

- Vue 3
- TypeScript
- Vue Router 4
- VueFlow
- Tiptap
- Editor.js
- SCSS
- Vite
