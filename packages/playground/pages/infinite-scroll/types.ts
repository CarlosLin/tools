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
