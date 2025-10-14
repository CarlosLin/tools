import { ref, watch, onUnmounted, type Ref } from 'vue'
import { throttle } from '../utils/throttle'
import type { ThrottleOptions, ThrottledFunction } from '../types'

/**
 * useThrottle hook
 * 返回一個 throttled 的值
 *
 * @param value 要 throttle 的值
 * @param delay 時間間隔
 * @param options 選項
 * @returns throttled 值
 */
export function useThrottle<T>(
  value: Ref<T>,
  delay: number,
  options?: ThrottleOptions
): Ref<T> {
  const throttledValue = ref(value.value) as Ref<T>

  const updateThrottledValue = throttle((newValue: T) => {
    throttledValue.value = newValue
  }, delay, options)

  watch(value, (newValue) => {
    updateThrottledValue(newValue)
  })

  onUnmounted(() => {
    updateThrottledValue.cancel()
  })

  return throttledValue
}

/**
 * useThrottledFn hook
 * 返回一個 throttled 的函數
 *
 * @param fn 要 throttle 的函數
 * @param delay 時間間隔
 * @param options 選項
 * @returns throttled 函數
 */
export function useThrottledFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: ThrottleOptions
): ThrottledFunction<T> {
  const throttledFn = throttle(fn, delay, options)

  onUnmounted(() => {
    throttledFn.cancel()
  })

  return throttledFn
}
