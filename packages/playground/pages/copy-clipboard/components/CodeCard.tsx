import { defineComponent, type PropType } from 'vue'
import type { CodeSnippet, CopyToClipboardResult } from '../types'

export const CodeCard = defineComponent({
  name: 'CodeCard',
  props: {
    snippet: {
      type: Object as PropType<CodeSnippet>,
      required: true,
    },
    copyResult: {
      type: Object as PropType<CopyToClipboardResult>,
      required: true,
    },
    onCopy: {
      type: Function as PropType<(text: string) => void>,
      required: false,
    },
  },
  setup(props) {
    const handleCopy = () => {
      props.copyResult.copy(props.snippet.code)
      props.onCopy?.(props.snippet.code)
    }

    return () => (
      <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-colors">
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h3 class="text-lg font-semibold text-white">
              {props.snippet.title}
            </h3>
            <p class="text-sm text-slate-400 mt-1">
              {props.snippet.language}
            </p>
          </div>
          <button
            onClick={handleCopy}
            class={`
              px-4 py-2 rounded-lg font-medium transition-all text-sm
              ${
                props.copyResult.isCopied.value
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {props.copyResult.isCopied.value ? (
              <span class="flex items-center gap-2">
                <svg
                  class="w-4 h-4"
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
                已複製
              </span>
            ) : (
              <span class="flex items-center gap-2">
                <svg
                  class="w-4 h-4"
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
                複製代碼
              </span>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div class="relative">
          <pre class="p-6 overflow-x-auto bg-slate-900/50">
            <code class="text-sm text-slate-300 font-mono whitespace-pre">
              {props.snippet.code}
            </code>
          </pre>
        </div>
      </div>
    )
  },
})
