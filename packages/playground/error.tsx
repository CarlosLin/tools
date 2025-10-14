import { defineComponent } from 'vue'
import type { NuxtError } from '#app'

export default defineComponent({
  name: 'ErrorPage',
  props: {
    error: {
      type: Object as () => NuxtError,
      required: true,
    },
  },
  setup(props) {
    const handleError = () => clearError({ redirect: '/' })

    const is404 = props.error.statusCode === 404

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center px-4">
        <div class="max-w-2xl text-center">
          {/* Error Code */}
          <div class="mb-8">
            <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {props.error.statusCode || '500'}
            </h1>
          </div>

          {/* Error Message */}
          <div class="mb-8">
            <h2 class="text-4xl font-bold mb-4">
              {is404 ? '頁面不存在' : '發生錯誤'}
            </h2>
            <p class="text-slate-300 text-lg mb-2">
              {props.error.message || '抱歉，發生了一些問題'}
            </p>
            {is404 && (
              <p class="text-slate-400">
                您訪問的頁面可能已被移除或不存在
              </p>
            )}
          </div>

          {/* Actions */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleError}
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              返回首頁
            </button>
            {!is404 && (
              <button
                onClick={() => window.location.reload()}
                class="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
              >
                重新載入
              </button>
            )}
          </div>

          {/* Debug Info (Development) */}
          {process.dev && (
            <details class="mt-12 text-left">
              <summary class="cursor-pointer text-slate-400 hover:text-white mb-4">
                🔍 開發者資訊
              </summary>
              <pre class="bg-slate-950 p-4 rounded-lg overflow-auto text-sm text-slate-300">
                {JSON.stringify(props.error, null, 2)}
              </pre>
            </details>
          )}

          {/* Decorative Elements */}
          <div class="mt-16 flex justify-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>
    )
  },
})
