import { defineComponent, computed, type PropType } from 'vue'
import { TransitionGroup } from 'vue'
import type { Toast, ToastPosition } from '../types'
import { TOAST_POSITION_STYLES } from '../constants'
import { ToastItem } from './ToastItem'

export const ToastContainer = defineComponent({
  name: 'ToastContainer',
  props: {
    toasts: {
      type: Array as PropType<Toast[]>,
      required: true,
    },
    position: {
      type: String as PropType<ToastPosition>,
      default: 'top-right',
    },
    onClose: {
      type: Function as PropType<(id: string) => void>,
      required: true,
    },
  },
  setup(props) {
    // 根據位置過濾 Toast
    const filteredToasts = computed(() => {
      return props.toasts.filter(
        (toast) => (toast.position || 'top-right') === props.position,
      )
    })

    // 計算位置樣式
    const positionClass = computed(() => {
      return TOAST_POSITION_STYLES[props.position]
    })

    // 判斷是否在底部
    const isBottom = computed(() => {
      return props.position.startsWith('bottom')
    })

    return () => {
      if (filteredToasts.value.length === 0) return null

      return (
        <div
          class={`
            fixed z-50 flex flex-col gap-3 pointer-events-none
            ${positionClass.value}
            ${isBottom.value ? 'flex-col-reverse' : ''}
          `}
        >
          <TransitionGroup
            name="toast"
            enterActiveClass="transition-all duration-300 ease-out"
            enterFromClass="opacity-0 translate-y-2 scale-95"
            enterToClass="opacity-100 translate-y-0 scale-100"
            leaveActiveClass="transition-all duration-200 ease-in"
            leaveFromClass="opacity-100 translate-y-0 scale-100"
            leaveToClass="opacity-0 translate-y-2 scale-95"
          >
            {filteredToasts.value.map((toast) => (
              <div key={toast.id} class="pointer-events-auto">
                <ToastItem toast={toast} onClose={props.onClose} />
              </div>
            ))}
          </TransitionGroup>
        </div>
      )
    }
  },
})
