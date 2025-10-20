import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export const useInfiniteScroll = (
  onLoadMore: () => void,
  threshold: number = 0.1,
  rootMargin: string = '100px'
) => {
  const targetRef: Ref<HTMLElement | null> = ref(null)
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null
  let previousIntersecting = false // 追蹤上一次的狀態

  // 手動檢查並觸發載入（用於載入完成後）
  const checkAndLoadMore = () => {
    // 如果觸發元素還在視窗內，繼續載入
    if (isIntersecting.value) {
      previousIntersecting = false
      onLoadMore()
    }
  }

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting.value = entry.isIntersecting

          // 只在「從不可見變成可見」時觸發（避免重複觸發）
          if (entry.isIntersecting && !previousIntersecting) {
            onLoadMore()
          }

          // 更新上一次的狀態
          previousIntersecting = entry.isIntersecting
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value)
    }
  })

  return { targetRef, isIntersecting, checkAndLoadMore }
}
