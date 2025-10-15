export interface CopyToClipboardOptions {
  /**
   * 是否使用舊版 fallback 方法
   */
  legacy?: boolean
  /**
   * 複製成功後的回調
   */
  onSuccess?: () => void
  /**
   * 複製失敗後的回調
   */
  onError?: (error: Error) => void
}

export interface CopyToClipboardResult {
  /**
   * 複製文字到剪貼簿
   */
  copy: (text: string) => Promise<void>
  /**
   * 是否已複製
   */
  isCopied: Ref<boolean>
  /**
   * 錯誤訊息
   */
  error: Ref<Error | null>
  /**
   * 重置狀態
   */
  reset: () => void
}

export interface CodeSnippet {
  id: string
  title: string
  language: string
  code: string
}

import type { Ref } from 'vue'
