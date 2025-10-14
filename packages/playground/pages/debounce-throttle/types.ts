export interface SearchResult {
  id: number
  title: string
  description: string
}

export interface ScrollPosition {
  x: number
  y: number
  timestamp: number
}

export interface ApiCallLog {
  id: number
  timestamp: number
  type: 'debounce' | 'throttle' | 'normal'
  value: string
}

export type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: (...args: Parameters<T>) => void
}

export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: (...args: Parameters<T>) => void
}
