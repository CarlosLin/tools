import { ref } from 'vue'
import type { Toast, ToastOptions, UseToastReturn } from '../types'
import { DEFAULT_TOAST_DURATION, DEFAULT_TOAST_POSITION } from '../constants'

/**
 * 全局 Toast 狀態
 * 使用 ref 實作簡單的全局狀態管理
 */
const toasts = ref<Toast[]>([])

/**
 * Toast ID 計數器
 */
let toastId = 0

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `toast-${Date.now()}-${toastId++}`
}

/**
 * 自動移除 Timer 映射
 */
const timers = new Map<string, number>()

/**
 * Toast Notification Hook
 * 提供全局的 Toast 通知管理
 */
export function useToast(): UseToastReturn {
  /**
   * 顯示 Toast
   */
  const show = (message: string, options: ToastOptions = {}) => {
    const {
      type = 'info',
      title,
      duration = DEFAULT_TOAST_DURATION,
      position = DEFAULT_TOAST_POSITION,
      closable = true,
      actions,
    } = options

    const toast: Toast = {
      id: generateId(),
      type,
      title,
      message,
      duration,
      position,
      closable,
      actions,
      timestamp: Date.now(),
    }

    // 將新 Toast 加入列表
    toasts.value.push(toast)

    // 設定自動移除
    if (duration > 0) {
      const timer = setTimeout(() => {
        remove(toast.id)
      }, duration)
      timers.set(toast.id, timer)
    }
  }

  /**
   * 移除指定 Toast
   */
  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }

    // 清除定時器
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  /**
   * 清除所有 Toast
   */
  const clear = () => {
    toasts.value = []
    // 清除所有定時器
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
  }

  /**
   * 快捷方法：顯示成功通知
   */
  const success = (
    message: string,
    options?: Omit<ToastOptions, 'type'>,
  ) => {
    show(message, { ...options, type: 'success' })
  }

  /**
   * 快捷方法：顯示錯誤通知
   */
  const error = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    show(message, { ...options, type: 'error' })
  }

  /**
   * 快捷方法：顯示警告通知
   */
  const warning = (
    message: string,
    options?: Omit<ToastOptions, 'type'>,
  ) => {
    show(message, { ...options, type: 'warning' })
  }

  /**
   * 快捷方法：顯示提示通知
   */
  const info = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    show(message, { ...options, type: 'info' })
  }

  return {
    toasts,
    success,
    error,
    warning,
    info,
    show,
    remove,
    clear,
  }
}
