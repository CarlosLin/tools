import { defineComponent, type PropType } from 'vue'
import type { CopyToClipboardResult } from '../types'

export const CopyButton = defineComponent({
  name: 'CopyButton',
  props: {
    copyResult: {
      type: Object as PropType<CopyToClipboardResult>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '複製',
    },
  },
  setup(props) {
    const handleCopy = () => {
      props.copyResult.copy(props.text)
    }

    return () => (
      <button
        onClick={handleCopy}
        disabled={props.copyResult.isCopied.value}
        class={`
          px-6 py-3 rounded-lg font-semibold transition-all
          ${
            props.copyResult.isCopied.value
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          }
          ${props.copyResult.error.value ? 'bg-red-500 hover:bg-red-600' : ''}
        `}
      >
        {props.copyResult.isCopied.value ? (
          <span class="flex items-center gap-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            已複製！
          </span>
        ) : (
          <span class="flex items-center gap-2">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {props.label}
          </span>
        )}
      </button>
    )
  },
})
