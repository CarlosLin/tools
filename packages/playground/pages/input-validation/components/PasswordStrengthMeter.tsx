import { defineComponent, computed, type PropType } from 'vue'
import type { PasswordStrength } from '../types'

export default defineComponent({
  name: 'PasswordStrengthMeter',
  props: {
    strength: {
      type: Object as PropType<PasswordStrength>,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const strengthPercentage = computed(() => {
      return (props.strength.score / 4) * 100
    })

    const showStrength = computed(() => {
      return props.password.length > 0
    })

    const getBarColor = (index: number) => {
      if (index < props.strength.score) {
        return props.strength.color
      }
      return 'bg-slate-700'
    }

    return () => {
      if (!showStrength.value) {
        return null
      }

      return (
        <div class="space-y-3">
          {/* Strength Bars */}
          <div class="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                class={`h-2 flex-1 rounded-full transition-all duration-300 ${getBarColor(index)}`}
              />
            ))}
          </div>

          {/* Strength Label */}
          {props.strength.label && (
            <div class="flex items-center justify-between">
              <span class="text-base text-slate-400">密碼強度：</span>
              <span
                class={`text-base font-semibold ${props.strength.color.replace('bg-', 'text-')}`}
              >
                {props.strength.label}
              </span>
            </div>
          )}

          {/* Suggestions */}
          {props.strength.suggestions.length > 0 && (
            <div class="space-y-2">
              <p class="text-base text-slate-400">密碼需求：</p>
              <ul class="space-y-1.5">
                {props.strength.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    class={`flex items-start gap-2 text-base transition-all duration-300 ${
                      suggestion.completed
                        ? 'text-green-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {suggestion.completed ? (
                      <svg
                        class="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        class="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    )}
                    <span
                      class={suggestion.completed ? 'line-through opacity-75' : ''}
                    >
                      {suggestion.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strong Password Indicator */}
          {props.strength.score >= 4 && (
            <div class="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <svg
                class="w-6 h-6 text-green-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-base text-green-400 font-medium">
                密碼強度良好，符合安全標準！
              </span>
            </div>
          )}
        </div>
      )
    }
  },
})
