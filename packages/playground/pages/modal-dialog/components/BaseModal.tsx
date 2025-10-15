/**
 * BaseModal Component
 * 基礎 Modal 組件,使用 Teleport 實現彈窗
 */

import { defineComponent, Teleport, Transition, type PropType } from 'vue'
import type { ModalSize } from '../types'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

export default defineComponent({
  name: 'BaseModal',
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
    },
    size: {
      type: String as PropType<ModalSize>,
      default: 'md',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const handleBackdropClick = () => {
      props.onOpenChange(false)
    }

    const handleClose = () => {
      props.onOpenChange(false)
    }

    const handleContentClick = (e: MouseEvent) => {
      e.stopPropagation()
    }

    return () => (
      <Teleport to="body">
        <Transition
          enterActiveClass="transition-opacity duration-200"
          enterFromClass="opacity-0"
          enterToClass="opacity-100"
          leaveActiveClass="transition-opacity duration-200"
          leaveFromClass="opacity-100"
          leaveToClass="opacity-0"
        >
          {props.open && (
            <div
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={handleBackdropClick}
            >
              <Transition
                enterActiveClass="transition-all duration-200"
                enterFromClass="opacity-0 scale-95"
                enterToClass="opacity-100 scale-100"
                leaveActiveClass="transition-all duration-200"
                leaveFromClass="opacity-100 scale-100"
                leaveToClass="opacity-0 scale-95"
              >
                <div
                  class={[
                    'relative w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl',
                    sizeClasses[props.size],
                  ]}
                  onClick={handleContentClick}
                >
                  {/* Header */}
                  {(props.title || props.showClose) && (
                    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                      {props.title && (
                        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">
                          {props.title}
                        </h2>
                      )}
                      {props.showClose && (
                        <button
                          onClick={handleClose}
                          class="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          aria-label="Close"
                        >
                          <svg
                            class="w-5 h-5"
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
                  )}

                  {/* Content */}
                  <div class="px-6 py-4">{slots.default?.()}</div>

                  {/* Footer */}
                  {slots.footer && (
                    <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                      {slots.footer()}
                    </div>
                  )}
                </div>
              </Transition>
            </div>
          )}
        </Transition>
      </Teleport>
    )
  },
})
