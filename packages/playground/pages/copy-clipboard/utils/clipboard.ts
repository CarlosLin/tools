/**
 * 檢查瀏覽器是否支援 Clipboard API
 */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'clipboard' in navigator &&
    typeof navigator.clipboard.writeText === 'function'
  )
}

/**
 * 使用現代 Clipboard API 複製文字
 */
export async function copyWithClipboardAPI(text: string): Promise<void> {
  if (!isClipboardSupported()) {
    throw new Error('Clipboard API not supported')
  }

  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    throw new Error(
      `Failed to copy with Clipboard API: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * 使用舊版 execCommand 方法複製文字（Fallback）
 */
export function copyWithExecCommand(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'

  document.body.appendChild(textarea)

  try {
    textarea.select()
    textarea.setSelectionRange(0, text.length)

    const successful = document.execCommand('copy')
    if (!successful) {
      throw new Error('execCommand returned false')
    }
  } catch (error) {
    throw new Error(
      `Failed to copy with execCommand: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * 自動選擇最佳的複製方法
 */
export async function copyToClipboard(
  text: string,
  options?: { legacy?: boolean }
): Promise<void> {
  const useLegacy = options?.legacy ?? false

  if (useLegacy || !isClipboardSupported()) {
    copyWithExecCommand(text)
  } else {
    await copyWithClipboardAPI(text)
  }
}
