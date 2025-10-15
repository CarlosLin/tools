export interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  aspectRatio?: string
  threshold?: number
  rootMargin?: string
}

export interface ImageData {
  id: number
  src: string
  alt: string
  category: string
}
