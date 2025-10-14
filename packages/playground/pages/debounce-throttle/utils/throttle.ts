import type { ThrottleOptions, ThrottledFunction } from '../types'

/**
 * Throttle function - 節流
 * 限制函數執行頻率，在指定時間內最多執行一次
 *
 * @param func 要執行的函數
 * @param delay 時間間隔（毫秒）
 * @param options 選項
 * @returns throttled 函數
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastCallTime = 0
  let lastInvokeTime = 0
  let lastArgs: Parameters<T> | null = null

  function invokeFunc(args: Parameters<T>) {
    lastInvokeTime = Date.now()
    lastArgs = null
    func(...args)
  }

  function shouldInvoke(now: number): boolean {
    const timeSinceLastInvoke = now - lastInvokeTime
    return lastInvokeTime === 0 || timeSinceLastInvoke >= delay
  }

  function clearTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const isInvoking = shouldInvoke(now)

    lastCallTime = now
    lastArgs = args

    // Leading edge - 立即執行
    if (isInvoking) {
      if (leading) {
        invokeFunc(args)
      }
      lastInvokeTime = now
    }

    // 設定 trailing edge timer
    clearTimer()
    if (trailing) {
      timeoutId = setTimeout(() => {
        const timeSinceLastCall = Date.now() - lastCallTime
        if (timeSinceLastCall < delay && lastArgs) {
          // 如果在 delay 期間內有新的呼叫，等待完整的 delay
          throttled(...lastArgs)
        } else if (lastArgs) {
          invokeFunc(lastArgs)
        }
      }, delay)
    }
  }

  // 取消 throttle
  throttled.cancel = () => {
    clearTimer()
    lastCallTime = 0
    lastInvokeTime = 0
    lastArgs = null
  }

  // 立即執行
  throttled.flush = (...args: Parameters<T>) => {
    clearTimer()
    if (lastArgs || args.length > 0) {
      invokeFunc(args.length > 0 ? args : lastArgs!)
    }
  }

  return throttled
}
