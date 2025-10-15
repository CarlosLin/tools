export const THEME_STORAGE_KEY = 'theme-preference'
export const DEFAULT_THEME = 'system'

export const THEME_OPTIONS = [
  { value: 'light', label: '淺色模式', icon: '☀️' },
  { value: 'dark', label: '深色模式', icon: '🌙' },
  { value: 'system', label: '跟隨系統', icon: '💻' },
] as const

export const DEMO_COMPONENTS = [
  {
    id: 'buttons',
    title: '按鈕樣式',
    description: '不同主題下的按鈕表現',
  },
  {
    id: 'cards',
    title: '卡片樣式',
    description: '卡片在深淺模式的對比',
  },
  {
    id: 'forms',
    title: '表單元素',
    description: '輸入框、選擇器等表單元素',
  },
  {
    id: 'typography',
    title: '文字排版',
    description: '標題、段落、程式碼的顯示',
  },
] as const
