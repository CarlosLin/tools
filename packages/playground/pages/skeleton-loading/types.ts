export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
  className?: string
}

export interface SkeletonCardProps {
  hasAvatar?: boolean
  lines?: number
  animation?: 'pulse' | 'wave' | 'none'
}

export interface UserCardData {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
}
