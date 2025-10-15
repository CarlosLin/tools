import type { Ref } from 'vue'

/**
 * Toast 類型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast 位置
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/**
 * Toast 操作按鈕
 */
export interface ToastAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * Toast 資料結構
 */
export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  position?: ToastPosition
  closable?: boolean
  actions?: ToastAction[]
  timestamp: number
}

/**
 * Toast 配置選項
 */
export interface ToastOptions {
  type?: ToastType
  title?: string
  duration?: number
  position?: ToastPosition
  closable?: boolean
  actions?: ToastAction[]
}

/**
 * useToast Hook 回傳值
 */
export interface UseToastReturn {
  toasts: Ref<Toast[]>
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => void
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => void
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => void
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => void
  show: (message: string, options?: ToastOptions) => void
  remove: (id: string) => void
  clear: () => void
}
