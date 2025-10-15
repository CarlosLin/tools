import { defineComponent, type PropType } from 'vue'
import type { Toast } from '../types'
import { TOAST_TYPE_CONFIG } from '../constants'

export const ToastItem = defineComponent({
  name: 'ToastItem',
  props: {
    toast: {
      type: Object as PropType<Toast>,
      required: true,
    },
    onClose: {
      type: Function as PropType<(id: string) => void>,
      required: true,
    },
  },
  setup(props) {
    const config = TOAST_TYPE_CONFIG[props.toast.type]

    const handleClose = () => {
      props.onClose(props.toast.id)
    }

    return () => (
      <div
        class={`
          min-w-[320px] max-w-md
          p-4 rounded-lg shadow-xl
          border-2
          ${config.bgColor}
          ${config.borderColor}
          backdrop-blur-sm
          transform transition-all duration-300
        `}
      >
        <div class="flex items-start gap-3">
          {/* Icon */}
          <div
            class={`
              flex-shrink-0
              w-6 h-6 rounded-full
              flex items-center justify-center
              font-bold text-lg
              ${config.iconColor}
            `}
          >
            {config.icon}
          </div>

          {/* Content */}
          <div class="flex-1 min-w-0">
            {props.toast.title && (
              <div
                class={`
                  font-semibold text-sm mb-1
                  ${config.iconColor}
                `}
              >
                {props.toast.title}
              </div>
            )}
            <div class="text-sm text-slate-800 dark:text-slate-200 break-words">
              {props.toast.message}
            </div>

            {/* Action Buttons */}
            {props.toast.actions && props.toast.actions.length > 0 && (
              <div class="flex gap-2 mt-3">
                {props.toast.actions.map((action, index) => {
                  const variantStyles = {
                    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
                    secondary:
                      'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200',
                    danger: 'bg-red-500 hover:bg-red-600 text-white',
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick()
                        handleClose()
                      }}
                      class={`
                        px-3 py-1.5 rounded text-xs font-semibold
                        transition-colors
                        ${variantStyles[action.variant || 'secondary']}
                      `}
                    >
                      {action.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Close Button */}
          {props.toast.closable && (
            <button
              onClick={handleClose}
              class="
                flex-shrink-0
                w-5 h-5
                flex items-center justify-center
                text-slate-400 hover:text-slate-600
                dark:text-slate-500 dark:hover:text-slate-300
                transition-colors
                rounded
                hover:bg-slate-200 dark:hover:bg-slate-700
              "
              aria-label="關閉通知"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  },
})
