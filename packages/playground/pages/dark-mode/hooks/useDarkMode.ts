import { ref, watch, onMounted, computed } from 'vue'
import type { Theme, DarkModeResult, ThemeConfig } from '../types'
import { THEME_STORAGE_KEY, DEFAULT_THEME } from '../constants'

/**
 * useDarkMode hook
 * 提供深色模式切換功能，支援 localStorage 持久化和系統主題偵測
 *
 * @param config 配置選項
 * @returns 主題狀態和切換方法
 */
export function useDarkMode(config: ThemeConfig = {}): DarkModeResult {
  const {
    defaultTheme = DEFAULT_THEME as Theme,
    storageKey = THEME_STORAGE_KEY,
  } = config

  const theme = ref<Theme>(defaultTheme)
  const systemPrefersDark = ref(false)

  // 計算是否為深色模式
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return systemPrefersDark.value
    }
    return theme.value === 'dark'
  })

  /**
   * 偵測系統主題偏好
   */
  const detectSystemTheme = () => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches

    // 監聽系統主題變化
    const handler = (e: MediaQueryListEvent) => {
      systemPrefersDark.value = e.matches
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }

  /**
   * 從 localStorage 讀取主題設定
   */
  const loadThemeFromStorage = () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        theme.value = stored as Theme
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
  }

  /**
   * 將主題設定儲存到 localStorage
   */
  const saveThemeToStorage = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }

  /**
   * 更新 HTML 根元素的 class
   */
  const updateDocumentClass = (dark: boolean) => {
    if (typeof document === 'undefined') return

    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * 設定主題
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    saveThemeToStorage(newTheme)
  }

  /**
   * 切換主題（僅在 light/dark 之間切換）
   */
  const toggleTheme = () => {
    if (theme.value === 'system') {
      setTheme(systemPrefersDark.value ? 'light' : 'dark')
    } else {
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }
  }

  // 監聽 isDark 變化，更新 document class
  watch(
    isDark,
    (dark) => {
      updateDocumentClass(dark)
    },
    { immediate: true }
  )

  // 組件掛載時初始化
  onMounted(() => {
    loadThemeFromStorage()
    detectSystemTheme()
    updateDocumentClass(isDark.value)
  })

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
