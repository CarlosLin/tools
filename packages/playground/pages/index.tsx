import { defineComponent } from 'vue'
import { NuxtLink } from '#components'
import { useHead } from '@unhead/vue'

interface Feature {
  name: string
  path: string
  description: string
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
      },
      {
        name: 'Debounce & Throttle',
        path: '/debounce-throttle',
        description: '防抖與節流 - 性能優化、搜尋、滾動事件',
      },
      {
        name: 'Infinite Scroll',
        path: '/infinite-scroll',
        description: '無限滾動 - 列表分頁載入、虛擬滾動',
      },
      {
        name: 'File Upload',
        path: '/file-upload',
        description: '檔案上傳 - 拖拽、預覽、進度條',
      },
      {
        name: 'Dark Mode',
        path: '/dark-mode',
        description: '深色模式 - 主題切換、持久化、動畫',
      },
      {
        name: 'Toast Notification',
        path: '/toast-notification',
        description: '通知提示 - 成功/錯誤訊息、自動關閉',
      },
      {
        name: 'Modal & Dialog',
        path: '/modal-dialog',
        description: '彈窗管理 - 確認框、表單彈窗、燈箱',
      },
      {
        name: 'Skeleton Loading',
        path: '/skeleton-loading',
        description: '骨架屏 - 加載狀態優化、佔位符',
      },
      {
        name: 'Copy to Clipboard',
        path: '/copy-clipboard',
        description: '剪貼簿 - 一鍵複製、代碼複製',
      },
      {
        name: 'Virtual List',
        path: '/virtual-list',
        description: '虛擬列表 - 大數據渲染、性能優化',
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
                class="block p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-all hover:scale-105"
              >
                <h2 class="text-2xl font-semibold mb-2">{feature.name}</h2>
                <p class="text-slate-400">{feature.description}</p>
              </NuxtLink>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
