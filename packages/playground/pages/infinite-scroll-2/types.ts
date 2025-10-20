export interface Post {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  readTime: number
  imageUrl: string
}

export interface InfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

export interface PaginationState {
  page: number
  hasMore: boolean
  isLoading: boolean
}

// 預加載相關型別
export interface PreloadCache {
  page: number
  data: Post[]
  timestamp: number
}

export interface PreloadConfig {
  preloadPages: number // 預載頁數 (0-5)
  smoothLoadingDelay: number // 平滑載入延遲 (ms)
}

export interface PreloadState {
  currentPage: number
  displayedPosts: Post[]
  cache: Map<number, Post[]>
  isLoading: boolean
  isPreloading: boolean
  preloadedPages: number[]
  config: PreloadConfig
}
