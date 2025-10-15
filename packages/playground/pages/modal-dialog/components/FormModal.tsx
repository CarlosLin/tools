/**
 * FormModal Component
 * 表單對話框 - 用於收集用戶輸入
 */

import { defineComponent, ref, reactive, type PropType } from 'vue'
import BaseModal from './BaseModal'
import type { FormField, ModalSize, FormModalAction } from '../types'

export default defineComponent({
  name: 'FormModal',
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
      default: '填寫表單',
    },
    fields: {
      type: Array as PropType<FormField[]>,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<(data: Record<string, any>) => void | Promise<void>>,
      required: true,
    },
    submitText: {
      type: String,
      default: '提交',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    size: {
      type: String as PropType<ModalSize>,
      default: 'md',
    },
    onCancel: {
      type: Function as PropType<() => void>,
    },
    /** 多按鈕配置（會覆蓋 submitText/cancelText） */
    actions: {
      type: Array as PropType<FormModalAction[]>,
    },
  },
  setup(props) {
    const loading = ref(false)
    const loadingActionText = ref<string | null>(null) // 追蹤哪個按鈕正在處理
    const formData = reactive<Record<string, any>>({})
    const errors = reactive<Record<string, string>>({})

    // 初始化表單數據
    props.fields.forEach((field) => {
      formData[field.name] = field.defaultValue ?? ''
    })

    const validateField = (field: FormField): string | undefined => {
      const value = formData[field.name]

      // Required validation
      if (field.required && !value) {
        return `${field.label} 為必填項`
      }

      // Custom validation
      if (field.validation) {
        return field.validation(value)
      }

      return undefined
    }

    const handleSubmit = async (e: Event) => {
      e.preventDefault()

      // Validate all fields
      let hasErrors = false
      props.fields.forEach((field) => {
        const error = validateField(field)
        if (error) {
          errors[field.name] = error
          hasErrors = true
        } else {
          delete errors[field.name]
        }
      })

      if (hasErrors) return

      try {
        loading.value = true
        loadingActionText.value = props.submitText
        await props.onSubmit({ ...formData })
        props.onOpenChange(false)

        // Reset form
        props.fields.forEach((field) => {
          formData[field.name] = field.defaultValue ?? ''
        })
        Object.keys(errors).forEach((key) => delete errors[key])
      } catch (error) {
        console.error('Form submission failed:', error)
      } finally {
        loading.value = false
        loadingActionText.value = null
      }
    }

    const handleCancel = () => {
      if (props.onCancel) {
        props.onCancel()
      } else {
        props.onOpenChange(false)
      }
    }

    // 處理 actions 按鈕點擊
    const handleActionClick = async (action: FormModalAction) => {
      // 只有在未設定 skipValidation 或為 false 時才驗證表單
      if (!action.skipValidation) {
        let hasErrors = false
        props.fields.forEach((field) => {
          const error = validateField(field)
          if (error) {
            errors[field.name] = error
            hasErrors = true
          } else {
            delete errors[field.name]
          }
        })

        if (hasErrors) return
      }

      try {
        loading.value = true
        loadingActionText.value = action.text
        await action.onClick({ ...formData })
        props.onOpenChange(false)

        // Reset form
        props.fields.forEach((field) => {
          formData[field.name] = field.defaultValue ?? ''
        })
        Object.keys(errors).forEach((key) => delete errors[key])
      } catch (error) {
        console.error('Form action failed:', error)
      } finally {
        loading.value = false
        loadingActionText.value = null
      }
    }

    // 獲取按鈕樣式
    const getButtonVariantClass = (variant?: string) => {
      switch (variant) {
        case 'danger':
          return 'bg-red-600 hover:bg-red-700 text-white'
        case 'success':
          return 'bg-green-600 hover:bg-green-700 text-white'
        case 'warning':
          return 'bg-yellow-600 hover:bg-yellow-700 text-white'
        default:
          return 'bg-blue-600 hover:bg-blue-700 text-white'
      }
    }

    const renderField = (field: FormField) => {
      const commonClasses =
        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
      const errorClasses = errors[field.name] ? 'border-red-500' : 'border-slate-300'

      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              value={formData[field.name]}
              onInput={(e) => (formData[field.name] = (e.target as HTMLTextAreaElement).value)}
              placeholder={field.placeholder}
              rows={4}
              class={`${commonClasses} ${errorClasses}`}
            />
          )

        case 'select':
          return (
            <select
              value={formData[field.name]}
              onChange={(e) => (formData[field.name] = (e.target as HTMLSelectElement).value)}
              class={`${commonClasses} ${errorClasses}`}
            >
              <option value="">選擇...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )

        default:
          return (
            <input
              type={field.type}
              value={formData[field.name]}
              onInput={(e) => (formData[field.name] = (e.target as HTMLInputElement).value)}
              placeholder={field.placeholder}
              class={`${commonClasses} ${errorClasses}`}
            />
          )
      }
    }

    return () => (
      <BaseModal
        open={props.open}
        onOpenChange={props.onOpenChange}
        title={props.title}
        size={props.size}
      >
        {{
          default: () => (
            <form onSubmit={handleSubmit} class="space-y-4">
              {props.fields.map((field) => (
                <div key={field.name}>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {field.label}
                    {field.required && <span class="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p class="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </form>
          ),
          footer: () => (
            <div class="flex gap-3 justify-end">
              {props.actions ? (
                // 多按鈕模式
                props.actions.map((action) => (
                  <button
                    key={action.text}
                    type="button"
                    onClick={() => handleActionClick(action)}
                    disabled={loading.value}
                    class={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                      action.variant === 'default'
                        ? 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        : getButtonVariantClass(action.variant)
                    }`}
                  >
                    {loadingActionText.value === action.text ? '處理中...' : action.text}
                  </button>
                ))
              ) : (
                // 預設兩按鈕模式
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading.value}
                    class="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {props.cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading.value}
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {loadingActionText.value === props.submitText ? '提交中...' : props.submitText}
                  </button>
                </>
              )}
            </div>
          ),
        }}
      </BaseModal>
    )
  },
})
