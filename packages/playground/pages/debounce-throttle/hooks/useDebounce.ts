import { ref, watch, onUnmounted, type Ref } from 'vue'
import { debounce } from '../utils/debounce'
import type { DebounceOptions, DebouncedFunction } from '../types'

/**
 * useDebounce hook
 * 返回一個 debounced 的值
 *
 * @param value 要 debounce 的值
 * @param delay 延遲時間
 * @param options 選項
 * @returns debounced 值
 */
export function useDebounce<T>(
  value: Ref<T>,
  delay: number,
  options?: DebounceOptions
): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  const updateDebouncedValue = debounce((newValue: T) => {
    debouncedValue.value = newValue
  }, delay, options)

  watch(value, (newValue) => {
    updateDebouncedValue(newValue)
  })

  onUnmounted(() => {
    updateDebouncedValue.cancel()
  })

  return debouncedValue
}

/**
 * useDebouncedFn hook
 * 返回一個 debounced 的函數
 *
 * @param fn 要 debounce 的函數
 * @param delay 延遲時間
 * @param options 選項
 * @returns debounced 函數
 */
export function useDebouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: DebounceOptions
): DebouncedFunction<T> {
  const debouncedFn = debounce(fn, delay, options)

  onUnmounted(() => {
    debouncedFn.cancel()
  })

  return debouncedFn
}
