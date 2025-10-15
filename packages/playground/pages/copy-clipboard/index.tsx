import { defineComponent, ref } from 'vue'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { CopyButton } from './components/CopyButton'
import { CodeCard } from './components/CodeCard'
import { CODE_SNIPPETS } from './constants'

export default defineComponent({
  name: 'CopyToClipboard',
  setup() {
    const router = useRouter()

    useHead({
      title: '剪貼簿複製工具',
      meta: [
        {
          name: 'description',
          content: 'Copy to Clipboard - 一鍵複製、代碼複製、Clipboard API',
        },
      ],
    })

    // 基礎文字複製
    const basicText = ref('Hello, World! 這是一段測試文字。')
    const basicCopy = useCopyToClipboard()

    // 程式碼複製 - 每個卡片獨立狀態
    const codeCopies = CODE_SNIPPETS.map(() => useCopyToClipboard())

    // URL 複製
    const urlText = ref('https://github.com/vuejs/core')
    const urlCopy = useCopyToClipboard()

    // 自訂文字複製
    const customText = ref('')
    const customCopy = useCopyToClipboard()

    // 統計資訊
    const copyCount = ref(0)
    const lastCopiedText = ref('')

    // 監聽複製成功事件
    const trackCopy = (text: string) => {
      copyCount.value++
      lastCopiedText.value = text.substring(0, 50) + (text.length > 50 ? '...' : '')
    }

    const handleBasicCopy = () => {
      basicCopy.copy(basicText.value)
      trackCopy(basicText.value)
    }

    const handleUrlCopy = () => {
      urlCopy.copy(urlText.value)
      trackCopy(urlText.value)
    }

    const handleCustomCopy = () => {
      if (customText.value.trim()) {
        customCopy.copy(customText.value)
        trackCopy(customText.value)
      }
    }

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div class="container mx-auto px-4 py-16 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            class="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <svg
              class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span class="font-medium">返回首頁</span>
          </button>

          {/* Header */}
          <div class="mb-12">
            <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Copy to Clipboard
            </h1>
            <p class="text-slate-300 text-lg">
              剪貼簿 - 一鍵複製、代碼複製
            </p>
          </div>

          {/* 統計資訊 */}
          <div class="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 class="text-slate-400 text-sm font-medium mb-2">
                複製次數
              </h3>
              <p class="text-4xl font-bold text-blue-400">{copyCount.value}</p>
            </div>
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 class="text-slate-400 text-sm font-medium mb-2">
                最後複製內容
              </h3>
              <p class="text-lg text-slate-300 font-mono truncate">
                {lastCopiedText.value || '尚未複製任何內容'}
              </p>
            </div>
          </div>

          {/* Demo Sections */}
          <div class="space-y-12">
            {/* 基礎文字複製 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">📋 基礎文字複製</h2>
                <p class="text-slate-400 text-lg">
                  使用 Clipboard API 快速複製文字
                </p>
              </div>

              <div class="space-y-6">
                <div class="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p class="text-lg text-slate-200 mb-4">{basicText.value}</p>
                  <button
                    onClick={handleBasicCopy}
                    disabled={basicCopy.isCopied.value}
                    class={`
                      px-6 py-3 rounded-lg font-semibold transition-all
                      ${
                        basicCopy.isCopied.value
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                      }
                    `}
                  >
                    {basicCopy.isCopied.value ? (
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
                        複製文字
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* URL 複製 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">🔗 URL 複製</h2>
                <p class="text-slate-400 text-lg">複製連結網址</p>
              </div>

              <div class="space-y-6">
                <div class="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div class="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={urlText.value}
                      onInput={(e) =>
                        (urlText.value = (e.target as HTMLInputElement).value)
                      }
                      class="flex-1 px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                      placeholder="輸入網址..."
                    />
                  </div>
                  <button
                    onClick={handleUrlCopy}
                    disabled={urlCopy.isCopied.value}
                    class={`
                      px-6 py-3 rounded-lg font-semibold transition-all
                      ${
                        urlCopy.isCopied.value
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                      }
                    `}
                  >
                    {urlCopy.isCopied.value ? '已複製！' : '複製 URL'}
                  </button>
                </div>
              </div>
            </div>

            {/* 自訂文字複製 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">✏️ 自訂文字複製</h2>
                <p class="text-slate-400 text-lg">輸入任意文字進行複製</p>
              </div>

              <div class="space-y-6">
                <textarea
                  value={customText.value}
                  onInput={(e) =>
                    (customText.value = (e.target as HTMLTextAreaElement).value)
                  }
                  placeholder="在這裡輸入想要複製的文字..."
                  rows={6}
                  class="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
                <button
                  onClick={handleCustomCopy}
                  disabled={!customText.value.trim() || customCopy.isCopied.value}
                  class={`
                    px-6 py-3 rounded-lg font-semibold transition-all
                    ${
                      customCopy.isCopied.value
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : customText.value.trim()
                          ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  {customCopy.isCopied.value ? '已複製！' : '複製文字'}
                </button>
              </div>
            </div>

            {/* 程式碼複製 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">💻 程式碼複製</h2>
                <p class="text-slate-400 text-lg">
                  點擊卡片右上角的按鈕複製程式碼
                </p>
              </div>

              <div class="grid grid-cols-1 gap-6">
                {CODE_SNIPPETS.map((snippet, index) => (
                  <CodeCard
                    key={snippet.id}
                    snippet={snippet}
                    copyResult={codeCopies[index]}
                    onCopy={trackCopy}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Clipboard API',
                description: '使用現代瀏覽器 API',
              },
              {
                icon: '🔄',
                title: 'Fallback 支援',
                description: '舊版瀏覽器自動降級',
              },
              {
                icon: '✅',
                title: '狀態回饋',
                description: '即時顯示複製狀態',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                class="flex items-start gap-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:transform hover:scale-105"
              >
                <span class="text-4xl">{feature.icon}</span>
                <div>
                  <h3 class="font-semibold text-white mb-2 text-lg">
                    {feature.title}
                  </h3>
                  <p class="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
