import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export const useLazyLoad = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
) => {
  const targetRef: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // Once loaded, stop observing
            if (observer && targetRef.value) {
              observer.unobserve(targetRef.value)
            }
          }
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

  return { targetRef, isVisible }
}
