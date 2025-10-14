import type { DebounceOptions, DebouncedFunction } from '../types'

/**
 * Debounce function - 防抖
 * 延遲執行函數，在指定時間內如果再次觸發，則重新計時
 *
 * @param func 要執行的函數
 * @param delay 延遲時間（毫秒）
 * @param options 選項
 * @returns debounced 函數
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null
  let lastCallTime = 0
  let lastInvokeTime = 0

  function invokeFunc(args: Parameters<T>) {
    lastInvokeTime = Date.now()
    func(...args)
  }

  function clearTimers() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId)
      maxTimeoutId = null
    }
  }

  function debounced(...args: Parameters<T>) {
    const now = Date.now()
    const isInvoking = lastCallTime === 0
    lastCallTime = now

    // 如果設定了 maxWait，確保在最長等待時間後一定會執行
    if (maxWait !== undefined && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        invokeFunc(args)
        clearTimers()
      }, maxWait)
    }

    // Leading edge - 立即執行
    if (leading && isInvoking) {
      invokeFunc(args)
    }

    // 清除之前的 timer
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Trailing edge - 延遲執行
    if (trailing) {
      timeoutId = setTimeout(() => {
        const timeSinceLastInvoke = now - lastInvokeTime
        if (timeSinceLastInvoke >= delay) {
          invokeFunc(args)
        }
        clearTimers()
      }, delay)
    }
  }

  // 取消 debounce
  debounced.cancel = () => {
    clearTimers()
    lastCallTime = 0
    lastInvokeTime = 0
  }

  // 立即執行
  debounced.flush = (...args: Parameters<T>) => {
    clearTimers()
    invokeFunc(args)
  }

  return debounced
}
