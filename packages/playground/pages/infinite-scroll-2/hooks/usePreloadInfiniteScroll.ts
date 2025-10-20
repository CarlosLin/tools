import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { generateMockPosts, TOTAL_POSTS, PAGE_SIZE } from '../utils/mockData'
import type { Post, PreloadConfig } from '../types'

export const usePreloadInfiniteScroll = (initialPreloadPages: number = 2) => {
  // 狀態管理
  const displayedPosts = ref<Post[]>([])
  const cache = ref(new Map<number, Post[]>())
  const currentPage = ref(0) // 當前顯示到第幾頁
  const isLoading = ref(false) // 正在顯示載入動畫
  const isPreloading = ref(false) // 正在背景預載
  const preloadedPages = ref<number[]>([]) // 已預載的頁面

  const config = ref<PreloadConfig>({
    preloadPages: initialPreloadPages,
    smoothLoadingDelay: 300, // 300ms 平滑載入延遲
  })

  const targetRef: Ref<HTMLElement | null> = ref(null)
  let observer: IntersectionObserver | null = null
  let previousIntersecting = false
  let scrollCheckTimer: number | null = null

  // 計算是否還有更多資料
  const hasMore = computed(() => displayedPosts.value.length < TOTAL_POSTS)

  // 計算已預載的頁面數量
  const cachedPagesCount = computed(() => cache.value.size)

  // 模擬 API 請求（實際應用中這會是真實的 API 呼叫）
  const fetchPage = async (page: number): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = generateMockPosts(page, PAGE_SIZE)
        resolve(posts)
      }, 800) // 模擬網路延遲
    })
  }

  // 預載指定頁面（背景執行，不阻塞 UI）
  const preloadPage = async (page: number) => {
    // 如果已經在快取中，跳過
    if (cache.value.has(page)) return

    // 如果超過總頁數，跳過
    const maxPage = Math.ceil(TOTAL_POSTS / PAGE_SIZE)
    if (page > maxPage) return

    isPreloading.value = true

    try {
      const posts = await fetchPage(page)
      cache.value.set(page, posts)

      // 更新已預載頁面列表
      if (!preloadedPages.value.includes(page)) {
        preloadedPages.value.push(page)
        preloadedPages.value.sort((a, b) => a - b)
      }
    } catch (error) {
      console.error(`預載第 ${page} 頁失敗:`, error)
    } finally {
      // 檢查是否還有其他預載任務
      const currentMaxCached = Math.max(0, ...Array.from(cache.value.keys()))
      const expectedMaxCached = currentPage.value + config.value.preloadPages
      isPreloading.value = currentMaxCached < expectedMaxCached
    }
  }

  // 預載多個頁面
  const preloadNextPages = async (fromPage: number, count: number) => {
    if (count === 0) return // 如果設定為 0，不預載

    const preloadPromises: Promise<void>[] = []

    for (let i = 1; i <= count; i++) {
      const pageToLoad = fromPage + i
      preloadPromises.push(preloadPage(pageToLoad))
    }

    await Promise.all(preloadPromises)
  }

  // 顯示下一頁（從快取取出或即時載入）
  const showNextPage = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    const nextPage = currentPage.value + 1

    try {
      // 顯示 300ms LoadingCard（平滑過渡效果）
      await new Promise(resolve => setTimeout(resolve, config.value.smoothLoadingDelay))

      // 從快取取出資料（如果有的話）
      let posts: Post[]

      if (cache.value.has(nextPage)) {
        // 從快取取出
        posts = cache.value.get(nextPage)!

        // 從快取移除（已經顯示了）
        cache.value.delete(nextPage)

        // 從預載列表移除
        const index = preloadedPages.value.indexOf(nextPage)
        if (index > -1) {
          preloadedPages.value.splice(index, 1)
        }
      } else {
        // 快取未命中，即時載入（降級行為）
        posts = await fetchPage(nextPage)
      }

      // 更新顯示的文章
      displayedPosts.value.push(...posts)
      currentPage.value = nextPage

      // 預載下 N 頁
      await preloadNextPages(nextPage, config.value.preloadPages)

    } catch (error) {
      console.error('載入下一頁失敗:', error)
    } finally {
      isLoading.value = false

      // 🔥 關鍵修正：載入完成後，檢查觸發元素是否還在視窗內
      // 如果是，自動繼續載入（解決快速滾動漏觸發問題）
      setTimeout(() => {
        checkAndLoadMore()
      }, 100)
    }
  }

  // 初始化：載入第一頁 + 預載後續頁面
  const initialize = async () => {
    isLoading.value = true

    try {
      // 載入第一頁
      const firstPagePosts = await fetchPage(1)
      displayedPosts.value = firstPagePosts
      currentPage.value = 1

      // 預載後續頁面
      await preloadNextPages(1, config.value.preloadPages)

    } catch (error) {
      console.error('初始化失敗:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 更新預載頁數設定
  const updatePreloadPages = (pages: number) => {
    config.value.preloadPages = Math.max(0, Math.min(5, pages))

    // 如果增加了預載頁數，立即預載額外的頁面
    if (pages > 0 && !isLoading.value) {
      preloadNextPages(currentPage.value, pages)
    }
  }

  // Intersection Observer 邏輯
  const checkAndLoadMore = () => {
    if (targetRef.value) {
      const rect = targetRef.value.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isVisible && !isLoading.value && hasMore.value) {
        showNextPage()
      }
    }
  }

  // 🔥 滾動監聽（備份機制，防止快速滾動漏觸發）
  const handleScroll = () => {
    if (scrollCheckTimer) {
      clearTimeout(scrollCheckTimer)
    }

    scrollCheckTimer = setTimeout(() => {
      checkAndLoadMore()
    }, 100)
  }

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting

          // 只在「從不可見變成可見」時觸發
          if (isIntersecting && !previousIntersecting && !isLoading.value) {
            showNextPage()
          }

          previousIntersecting = isIntersecting
        })
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    )

    observer.observe(targetRef.value)

    // 🔥 加入滾動監聽作為備份（解決快速滾動問題）
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value)
    }

    // 清除滾動監聽
    window.removeEventListener('scroll', handleScroll)

    if (scrollCheckTimer) {
      clearTimeout(scrollCheckTimer)
    }
  })

  return {
    // 狀態
    displayedPosts,
    currentPage,
    isLoading,
    isPreloading,
    hasMore,
    preloadedPages,
    cachedPagesCount,
    config,

    // 方法
    initialize,
    updatePreloadPages,
    checkAndLoadMore,

    // Ref
    targetRef,
  }
}
