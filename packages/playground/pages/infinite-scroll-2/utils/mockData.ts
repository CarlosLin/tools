import type { Post } from '../types'

const categories = ['技術', '設計', '產品', '創業', '生活']
const authors = ['Alice Chen', 'Bob Wang', 'Carol Lin', 'David Liu', 'Eva Wu']

const titles = [
  'Vue 3 Composition API 深度解析',
  '打造高效能的前端應用程式',
  'TypeScript 進階技巧與最佳實踐',
  '使用 Nuxt 3 建立全端應用',
  '前端性能優化實戰指南',
  'CSS Grid 與 Flexbox 完全指南',
  '響應式設計的現代化方法',
  'JavaScript 設計模式詳解',
  '前端測試策略與工具選擇',
  '建立可維護的大型專案',
]

const excerpts = [
  '探討現代前端開發的核心概念，從基礎到進階的完整指南...',
  '深入了解性能優化的各種技術，提升使用者體驗...',
  '學習如何在實際專案中應用最佳實踐，提高程式碼品質...',
  '從零開始建立一個完整的全端應用程式...',
  '掌握前端開發中最重要的技術與工具...',
]

export const generateMockPosts = (page: number, pageSize: number = 10): Post[] => {
  const startId = (page - 1) * pageSize + 1
  const posts: Post[] = []

  for (let i = 0; i < pageSize; i++) {
    const id = startId + i
    posts.push({
      id,
      title: `${titles[id % titles.length]} #${id}`,
      excerpt: excerpts[id % excerpts.length],
      author: authors[id % authors.length],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-TW'),
      category: categories[id % categories.length],
      readTime: Math.floor(Math.random() * 10) + 3,
      imageUrl: `https://picsum.photos/seed/${id}/400/250`,
    })
  }

  return posts
}

export const TOTAL_POSTS = 100 // 模擬總共 100 篇文章
export const PAGE_SIZE = 10
