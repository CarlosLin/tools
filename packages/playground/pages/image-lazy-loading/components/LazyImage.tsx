import { defineComponent, ref, type PropType } from 'vue'
import { useLazyLoad } from '../hooks/useLazyLoad'
import type { LazyImageProps } from '../types'

export const LazyImage = defineComponent({
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23334155"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%2394a3b8"%3ELoading...%3C/text%3E%3C/svg%3E',
    },
    className: {
      type: String,
      default: '',
    },
    aspectRatio: {
      type: String,
      default: '16/9',
    },
    threshold: {
      type: Number,
      default: 0.1,
    },
    rootMargin: {
      type: String,
      default: '50px',
    },
  },
  setup(props) {
    const { targetRef, isVisible } = useLazyLoad(props.threshold, props.rootMargin)
    const isLoaded = ref(false)
    const hasError = ref(false)

    const handleLoad = () => {
      isLoaded.value = true
    }

    const handleError = () => {
      hasError.value = true
      console.error(`Failed to load image: ${props.src}`)
    }

    // 決定要顯示什麼圖片
    const getCurrentSrc = () => {
      // 如果載入失敗，顯示 placeholder
      if (hasError.value) return props.placeholder
      // 如果進入視窗，顯示真實圖片（開始載入）
      if (isVisible.value) return props.src
      // 還沒進入視窗，顯示 placeholder
      return props.placeholder
    }

    return () => (
      <div
        ref={targetRef}
        class={`relative overflow-hidden bg-slate-700 ${props.className}`}
        style={{ aspectRatio: props.aspectRatio }}
      >
        <img
          src={getCurrentSrc()}
          alt={props.alt}
          onLoad={handleLoad}
          onError={handleError}
          class={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded.value ? 'opacity-100' : 'opacity-50'
          }`}
        />
        {/* 顯示 spinner: 進入視窗 + 還沒載入完 + 沒錯誤 */}
        {!isLoaded.value && isVisible.value && !hasError.value && (
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* 顯示錯誤訊息 */}
        {hasError.value && (
          <div class="absolute inset-0 flex items-center justify-center bg-slate-800/80">
            <div class="text-red-400 text-sm text-center px-4">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Failed to load image
            </div>
          </div>
        )}
      </div>
    )
  },
})
