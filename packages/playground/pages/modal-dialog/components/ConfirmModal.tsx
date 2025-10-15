/**
 * ConfirmModal Component
 * 確認對話框 - 用於需要用戶確認的操作
 */

import { defineComponent, ref, type PropType } from 'vue'
import BaseModal from './BaseModal'
import type { ConfirmModalProps, ModalVariant, ModalSize, ConfirmModalAction } from '../types'

const variantStyles: Record<ModalVariant, { button: string; icon: string; color: string }> = {
  default: {
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    icon: 'text-blue-600',
    color: 'blue',
  },
  danger: {
    button: 'bg-red-600 hover:bg-red-700 text-white',
    icon: 'text-red-600',
    color: 'red',
  },
  success: {
    button: 'bg-green-600 hover:bg-green-700 text-white',
    icon: 'text-green-600',
    color: 'green',
  },
  warning: {
    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    icon: 'text-yellow-600',
    color: 'yellow',
  },
}

export default defineComponent({
  name: 'ConfirmModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    onOpenChange: {
      type: Function as PropType<(open: boolean) => void>,
      required: true,
    },
    title: {
      type: String,
      default: '確認操作',
    },
    description: {
      type: String,
    },
    variant: {
      type: String as PropType<ModalVariant>,
      default: 'default',
    },
    confirmText: {
      type: String,
      default: '確認',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    onConfirm: {
      type: Function as PropType<() => void | Promise<void>>,
      required: true,
    },
    onCancel: {
      type: Function as PropType<() => void>,
    },
    size: {
      type: String as PropType<ModalSize>,
      default: 'sm',
    },
    actions: {
      type: Array as PropType<ConfirmModalAction[]>,
    },
  },
  setup(props) {
    const loading = ref(false)
    const loadingActionText = ref<string | null>(null) // 追蹤哪個按鈕正在處理

    const handleConfirm = async () => {
      try {
        loading.value = true
        loadingActionText.value = props.confirmText
        await props.onConfirm()
        props.onOpenChange(false)
      } catch (error) {
        console.error('Confirm action failed:', error)
      } finally {
        loading.value = false
        loadingActionText.value = null
      }
    }

    const handleCancel = () => {
      props.onCancel?.()
      props.onOpenChange(false)
    }

    // 處理多按鈕的點擊
    const handleActionClick = async (action: ConfirmModalAction) => {
      try {
        loading.value = true
        loadingActionText.value = action.text
        await action.onClick()
        props.onOpenChange(false)
      } catch (error) {
        console.error('Action failed:', error)
      } finally {
        loading.value = false
        loadingActionText.value = null
      }
    }

    // 根據 variant 獲取按鈕樣式
    const getButtonStyles = (variant: ModalVariant = 'default'): string => {
      return variantStyles[variant].button
    }

    return () => {
      const styles = variantStyles[props.variant]

      // Debug: 輸出 actions
      if (props.actions) {
        console.log('[ConfirmModal] Rendering with actions:', props.actions)
      }

      return (
        <BaseModal
          open={props.open}
          onOpenChange={props.onOpenChange}
          title={props.title}
          size={props.size}
        >
          {{
            default: () => (
              <div class="space-y-4">
                {/* Icon */}
                <div class={`flex justify-center ${styles.icon}`}>
                  {props.variant === 'danger' && (
                    <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                  {props.variant === 'success' && (
                    <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {props.variant === 'warning' && (
                    <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                  {props.variant === 'default' && (
                    <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>

                {/* Description */}
                {props.description && (
                  <p class="text-center text-slate-600 dark:text-slate-400">{props.description}</p>
                )}
              </div>
            ),
            footer: () => (
              <div class="flex gap-3 justify-end">
                {/* 如果有 actions 配置，使用多按鈕模式 */}
                {props.actions && props.actions.length > 0 ? (
                  props.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionClick(action)}
                      disabled={loading.value}
                      class={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                        action.variant
                          ? getButtonStyles(action.variant)
                          : index === props.actions!.length - 1
                            ? styles.button // 最後一個按鈕使用主要樣式
                            : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {loadingActionText.value === action.text
                        ? '處理中...'
                        : action.text}
                    </button>
                  ))
                ) : (
                  <>
                    {/* 預設兩按鈕模式 */}
                    <button
                      onClick={handleCancel}
                      disabled={loading.value}
                      class="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {props.cancelText}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading.value}
                      class={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${styles.button}`}
                    >
                      {loading.value ? '處理中...' : props.confirmText}
                    </button>
                  </>
                )}
              </div>
            ),
          }}
        </BaseModal>
      )
    }
  },
})
