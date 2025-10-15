import { ref, onMounted, onUnmounted } from 'vue'

export const useSkeletonLoading = (delay: number = 2000) => {
  const isLoading = ref(true)
  let timer: ReturnType<typeof setTimeout> | null = null

  const startLoading = () => {
    isLoading.value = true
    timer = setTimeout(() => {
      isLoading.value = false
    }, delay)
  }

  const reload = () => {
    if (timer) {
      clearTimeout(timer)
    }
    startLoading()
  }

  onMounted(() => {
    startLoading()
  })

  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer)
    }
  })

  return { isLoading, reload }
}
