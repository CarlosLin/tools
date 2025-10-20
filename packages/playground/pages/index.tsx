import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

interface Feature {
  name: string
  path: string
  description: string
  isComplete?: boolean
}

export default defineComponent({
  name: 'HomePage',
  setup() {
    useHead({
      title: '小工具',
      meta: [
        {
          name: 'description',
          content: '各種工具',
        },
      ],
    })
    const features: Feature[] = [
      {
        name: 'Input Validation',
        path: '/input-validation',
        description: '表單驗證 - Email、密碼強度、即時驗證',
        isComplete: true,
      },
      {
        name: 'Debounce & Throttle',
        path: '/debounce-throttle',
        description: '防抖與節流 - 性能優化、搜尋、滾動事件',
        isComplete: true,
      },
      {
        name: 'Infinite Scroll',
        path: '/infinite-scroll',
        description: '無限滾動 - 列表分頁載入、虛擬滾動',
        isComplete: true,
      },
      {
        name: 'Infinite Scroll V2',
        path: '/infinite-scroll-2',
        description: '無限滾動 V2 - 智慧預加載、平滑載入體驗',
        isComplete: true,
      },
      {
        name: 'File Upload',
        path: '/file-upload',
        description: '檔案上傳 - 拖拽、預覽、進度條',
        isComplete: false,
      },
      {
        name: 'Dark Mode',
        path: '/dark-mode',
        description: '深色模式 - 主題切換、持久化、動畫',
        isComplete: true,
      },
      {
        name: 'Toast Notification',
        path: '/toast-notification',
        description: '通知提示 - 成功/錯誤訊息、自動關閉',
        isComplete: true,
      },
      {
        name: 'Modal & Dialog',
        path: '/modal-dialog',
        description: '彈窗管理 - 確認框、表單彈窗、燈箱',
        isComplete: true,
      },
      {
        name: 'Skeleton Loading',
        path: '/skeleton-loading',
        description: '骨架屏 - 加載狀態優化、佔位符',
        isComplete: true,
      },
      {
        name: 'Image Lazy Loading',
        path: '/image-lazy-loading',
        description: '圖片懶加載 - Intersection Observer、性能優化',
        isComplete: true,
      },
      {
        name: 'Copy to Clipboard',
        path: '/copy-clipboard',
        description: '剪貼簿 - 一鍵複製、代碼複製',
        isComplete: true,
      },
      {
        name: 'Virtual List',
        path: '/virtual-list',
        description: '虛擬列表 - 大數據渲染、性能優化',
        isComplete: false,
      },
      {
        name: 'Animation Showcase',
        path: '/animation-showcase',
        description: '動畫展示 - CSS 動畫、過渡效果、關鍵幀',
        isComplete: false,
      },
      {
        name: 'LocalStorage Manager',
        path: '/localstorage-manager',
        description: '本地儲存管理 - CRUD、過期時間、容量管理',
        isComplete: false,
      },
      {
        name: 'i18n',
        path: '/i18n',
        description: '國際化 - 多語言切換、動態翻譯、語系管理',
        isComplete: false,
      },
      {
        name: 'PWA Features',
        path: '/pwa-features',
        description: 'PWA 功能 - Service Worker、離線模式、安裝提示',
        isComplete: false,
      },
      {
        name: 'JSON Formatter',
        path: '/json-formatter',
        description: 'JSON 格式化 - 美化、壓縮、驗證、高亮',
        isComplete: false,
      },
    ]

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div class="container mx-auto px-4 py-16">
          <h1 class="text-5xl font-bold mb-4">Feature Playground</h1>
          <p class="text-slate-300 text-lg mb-12">探索和測試各種功能模組</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <NuxtLink
                key={feature.path}
                to={feature.path}
                class="block p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-all hover:scale-105 relative"
              >
                {/* 施工中標記 */}
                {feature.isComplete === false && (
                  <div class="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500 rounded-full p-2" title="施工中">
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}

                <h2 class="text-2xl font-semibold mb-2 pr-8">{feature.name}</h2>
                <p class="text-slate-400">{feature.description}</p>

                {/* 未完成提示 */}
                {feature.isComplete === false && (
                  <span class="inline-block mt-3 px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/30">
                    🚧 開發中
                  </span>
                )}
              </NuxtLink>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
