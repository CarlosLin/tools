import { defineComponent, ref, type PropType } from 'vue'
import type { FieldState } from '../types'

export default defineComponent({
  name: 'ValidationInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'text' | 'email' | 'password'>,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    fieldState: {
      type: Object as PropType<FieldState>,
      required: true,
    },
    onValueChange: {
      type: Function as PropType<(value: string) => void>,
      required: true,
    },
    onBlur: {
      type: Function as PropType<() => void>,
      required: true,
    },
    showError: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const showPassword = ref(false)
    const capsLockOn = ref(false)

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      props.onValueChange(target.value)
    }

    const handleBlur = () => {
      props.onBlur()
      // Reset caps lock warning on blur
      capsLockOn.value = false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Caps Lock is on
      if (props.type === 'password') {
        capsLockOn.value = event.getModifierState('CapsLock')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Update Caps Lock state on key up
      if (props.type === 'password') {
        capsLockOn.value = event.getModifierState('CapsLock')
      }
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const getInputType = () => {
      if (props.type === 'password' && showPassword.value) {
        return 'text'
      }
      return props.type
    }

    const hasError = () => {
      return props.showError && props.fieldState.touched && props.fieldState.error
    }

    const getInputClasses = () => {
      const baseClasses = [
        'w-full',
        'px-4',
        'py-3',
        'rounded-lg',
        'border-2',
        'bg-slate-700',
        'text-white',
        'placeholder-slate-400',
        'transition-all',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'focus:ring-offset-slate-800',
      ]

      if (hasError()) {
        baseClasses.push('border-red-500', 'focus:ring-red-500')
      } else if (props.fieldState.touched && !props.fieldState.error) {
        baseClasses.push('border-green-500', 'focus:ring-green-500')
      } else {
        baseClasses.push('border-slate-600', 'focus:ring-blue-500')
      }

      return baseClasses.join(' ')
    }

    return () => (
      <div class="space-y-2">
        {/* Label */}
        <label
          for={props.name}
          class="block text-base font-medium text-slate-300"
        >
          {props.label}
        </label>

        {/* Input with Password Toggle */}
        <div class="relative">
          <input
            id={props.name}
            name={props.name}
            type={getInputType()}
            value={props.fieldState.value}
            placeholder={props.placeholder}
            class={getInputClasses()}
            onInput={handleInput}
            onBlur={handleBlur}
            onKeydown={handleKeyDown}
            onKeyup={handleKeyUp}
            aria-invalid={hasError() ? 'true' : 'false'}
            aria-describedby={hasError() ? `${props.name}-error` : undefined}
          />

          {/* Password Toggle Button */}
          {props.type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              aria-label={showPassword.value ? '隱藏密碼' : '顯示密碼'}
            >
              {showPassword.value ? (
                // Eye Off Icon
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                // Eye Icon
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Caps Lock Warning */}
        {props.type === 'password' && capsLockOn.value && (
          <div class="flex items-center gap-2 text-base text-yellow-400 animate-pulse">
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>⚠️ Caps Lock 已開啟</span>
          </div>
        )}

        {/* Error Message */}
        {hasError() && (
          <div
            id={`${props.name}-error`}
            class="flex items-center gap-2 text-base text-red-400"
            role="alert"
          >
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{props.fieldState.error}</span>
          </div>
        )}

        {/* Success Indicator */}
        {props.fieldState.touched && !props.fieldState.error && props.fieldState.value && (
          <div class="flex items-center gap-2 text-base text-green-400">
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>看起來不錯！</span>
          </div>
        )}
      </div>
    )
  },
})
