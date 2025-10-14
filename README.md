# Match Program - Feature Playground

> 個人功能展示平台 - Functional Programming + TSX + SOLID 原則

## 🎯 專案特色

- ✅ **Monorepo 架構** - Turborepo + pnpm workspace
- ✅ **Functional Programming** - 使用 TSX，不使用 template
- ✅ **SOLID 原則** - 模組化、可維護
- ✅ **TypeScript** - 完整型別安全
- ✅ **Modern Stack** - Nuxt 3 + Tailwind + shadcn-vue

## 🏗️ 技術棧

| 技術 | 用途 |
|------|------|
| **Nuxt 3** | Vue 框架 |
| **TypeScript** | 型別安全 |
| **TSX** | 函數式組件 (不使用 template) |
| **Tailwind CSS** | 樣式框架 |
| **shadcn-vue** | UI 組件庫 |
| **Turborepo** | Monorepo 管理 |
| **pnpm** | 套件管理 |

## 📂 專案結構

```
match-program/
├── CLAUDE.md              # 📋 開發規範 (必讀!)
├── README.md              # 本文件
├── package.json
├── turbo.json
└── packages/
    └── playground/        # 主應用
        ├── pages/         # 功能頁面 (TSX)
        │   ├── index.vue  # 首頁導航
        │   └── [feature]/ # 各功能模組
        ├── components/    # 共享組件
        └── composables/   # 共享邏輯
```

## 🚀 快速開始

### 安裝依賴

```bash
pnpm install
```

### 啟動開發

```bash
pnpm dev
# 訪問 http://localhost:3000
```

### 其他指令

```bash
pnpm build       # 生產構建
pnpm lint        # ESLint 檢查
pnpm type-check  # TypeScript 檢查
```
### 核心原則

1. **使用 TSX，不使用 template**
2. **遵循 SOLID 原則**
3. **功能模組化 - 所有邏輯集中在功能 folder**

### 功能開發範例

```tsx
// pages/my-feature/index.tsx
import { ref } from 'vue'

export default function MyFeature() {
  const count = ref(0)

  return () => (
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold">My Feature</h1>
      <button onClick={() => count.value++}>
        Count: {count.value}
      </button>
    </div>
  )
}
```

## 🎨 UI 組件

使用 shadcn-vue 安裝組件：

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
```

## 📌 Node 版本要求

- **Node.js**: 22.x 或更高
- 使用 nvm/fnm 管理版本

```bash
nvm use 22
# 或
fnm use 22
```

**專案狀態**: 🟢 開發中
**最後更新**: 2025-10-14
