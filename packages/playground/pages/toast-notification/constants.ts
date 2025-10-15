import type { ToastType, ToastPosition } from './types'

/**
 * 預設 Toast 持續時間 (毫秒)
 */
export const DEFAULT_TOAST_DURATION = 3000

/**
 * 預設 Toast 位置
 */
export const DEFAULT_TOAST_POSITION: ToastPosition = 'top-right'

/**
 * Toast 類型配置
 */
export const TOAST_TYPE_CONFIG: Record<
  ToastType,
  {
    icon: string
    bgColor: string
    borderColor: string
    iconColor: string
    title: string
  }
> = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-100 dark:bg-green-950/80',
    borderColor: 'border-green-500',
    iconColor: 'text-green-600 dark:text-green-400',
    title: '成功',
  },
  error: {
    icon: '✕',
    bgColor: 'bg-red-100 dark:bg-red-950/80',
    borderColor: 'border-red-500',
    iconColor: 'text-red-600 dark:text-red-400',
    title: '錯誤',
  },
  warning: {
    icon: '⚠',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/80',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    title: '警告',
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-blue-100 dark:bg-blue-950/80',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: '提示',
  },
}

/**
 * Toast 位置樣式配置
 */
export const TOAST_POSITION_STYLES: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
}

/**
 * 可用位置選項
 */
export const POSITION_OPTIONS: {
  value: ToastPosition
  label: string
}[] = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '中上' },
  { value: 'top-right', label: '右上' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '中下' },
  { value: 'bottom-right', label: '右下' },
]

/**
 * 範例訊息
 */
export const EXAMPLE_MESSAGES = {
  success: [
    '資料儲存成功！',
    '檔案上傳完成',
    '操作已完成',
    '設定已更新',
  ],
  error: [
    '網路連線失敗',
    '權限不足',
    '資料格式錯誤',
    '操作失敗，請重試',
  ],
  warning: [
    '您的 session 即將過期',
    '磁碟空間不足',
    '請確認輸入內容',
    '此操作無法復原',
  ],
  info: [
    '系統將於 10 分鐘後維護',
    '有新版本可用',
    '您有 3 則未讀訊息',
    '資料同步中...',
  ],
}
