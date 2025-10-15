/**
 * LightboxModal Component
 * 圖片燈箱 - 用於展示圖片集
 */

import { defineComponent, ref, computed, type PropType } from 'vue'
import type { LightboxModalProps } from '../types'

export default defineComponent({
  name: 'LightboxModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    onOpenChange: {
      type: Function as PropType<(open: boolean) => void>,
      required: true,
    },
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    onIndexChange: {
      type: Function as PropType<(index: number) => void>,
    },
  },
  setup(props) {
    const index = ref(props.currentIndex)

    const currentImage = computed(() => props.images[index.value])
    const hasPrev = computed(() => index.value > 0)
    const hasNext = computed(() => index.value < props.images.length - 1)

    const handlePrev = () => {
      if (hasPrev.value) {
        index.value--
        props.onIndexChange?.(index.value)
      }
    }

    const handleNext = () => {
      if (hasNext.value) {
        index.value++
        props.onIndexChange?.(index.value)
      }
    }

    const handleClose = () => {
      props.onOpenChange(false)
    }

    const handleBackdropClick = () => {
      handleClose()
    }

    const handleContentClick = (e: MouseEvent) => {
      e.stopPropagation()
    }

    return () => {
      if (!props.open) return null

      return (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image counter */}
          <div class="absolute top-4 left-4 text-white text-lg font-medium">
            {index.value + 1} / {props.images.length}
          </div>

          {/* Main content */}
          <div class="relative w-full h-full flex items-center justify-center p-12">
            {/* Previous button */}
            {hasPrev.value && (
              <button
                onClick={handlePrev}
                class="absolute left-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/30 rounded-full"
                aria-label="Previous"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <div
              class="max-w-5xl max-h-full flex items-center justify-center"
              onClick={handleContentClick}
            >
              <img
                src={currentImage.value}
                alt={`Image ${index.value + 1}`}
                class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next button */}
            {hasNext.value && (
              <button
                onClick={handleNext}
                class="absolute right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/30 rounded-full"
                aria-label="Next"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-screen-lg overflow-x-auto p-2">
            {props.images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  index.value = i
                  props.onIndexChange?.(i)
                }}
                class={[
                  'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all',
                  i === index.value
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100',
                ]}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} class="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )
    }
  },
})
