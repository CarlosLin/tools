import { defineComponent, type PropType } from 'vue'
import type { DarkModeResult, Theme } from '../types'
import { THEME_OPTIONS } from '../constants'

export const ThemeToggle = defineComponent({
  name: 'ThemeToggle',
  props: {
    darkMode: {
      type: Object as PropType<DarkModeResult>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => props.darkMode.setTheme(option.value as Theme)}
            class={`
              px-4 py-2 rounded-md font-medium transition-all text-sm
              ${
                props.darkMode.theme.value === option.value
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <span class="flex items-center gap-2">
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </span>
          </button>
        ))}
      </div>
    )
  },
})
