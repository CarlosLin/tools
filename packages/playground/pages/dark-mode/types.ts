export type Theme = 'light' | 'dark' | 'system'

export interface DarkModeResult {
  theme: Ref<Theme>
  isDark: Ref<boolean>
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export interface ThemeConfig {
  defaultTheme?: Theme
  storageKey?: string
}

import type { Ref } from 'vue'
