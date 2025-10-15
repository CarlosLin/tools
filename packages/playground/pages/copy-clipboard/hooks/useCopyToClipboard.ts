import { ref, onUnmounted } from 'vue'
import { copyToClipboard } from '../utils/clipboard'
import { COPY_RESET_DELAY } from '../constants'
import type { CopyToClipboardOptions, CopyToClipboardResult } from '../types'

/**
 * useCopyToClipboard hook
 * 提供複製到剪貼簿的功能
 *
 * @param options 選項
 * @returns 複製功能和狀態
 */
export function useCopyToClipboard(
  options: CopyToClipboardOptions = {}
): CopyToClipboardResult {
  const { legacy = false, onSuccess, onError } = options

  const isCopied = ref(false)
  const error = ref<Error | null>(null)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  const clearResetTimer = () => {
    if (resetTimer) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  const reset = () => {
    clearResetTimer()
    isCopied.value = false
    error.value = null
  }

  const copy = async (text: string) => {
    reset()

    try {
      await copyToClipboard(text, { legacy })
      isCopied.value = true
      onSuccess?.()

      // 自動重置狀態
      resetTimer = setTimeout(() => {
        isCopied.value = false
      }, COPY_RESET_DELAY)
    } catch (err) {
      const copyError =
        err instanceof Error ? err : new Error('Failed to copy to clipboard')
      error.value = copyError
      onError?.(copyError)
    }
  }

  onUnmounted(() => {
    clearResetTimer()
  })

  return {
    copy,
    isCopied,
    error,
    reset,
  }
}
