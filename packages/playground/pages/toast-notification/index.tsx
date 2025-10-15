import { defineComponent, ref } from 'vue'
import { useToast } from './hooks/useToast'
import { ToastContainer } from './components/ToastContainer'
import {
  EXAMPLE_MESSAGES,
  POSITION_OPTIONS,
  DEFAULT_TOAST_POSITION,
} from './constants'
import type { ToastPosition } from './types'

export default defineComponent({
  name: 'ToastNotification',
  setup() {
    const router = useRouter()
    const toast = useToast()

    useHead({
      title: 'Toast 通知系統',
      meta: [
        {
          name: 'description',
          content:
            'Toast Notification - 通知提示、成功/錯誤訊息、自動關閉、動畫效果',
        },
      ],
    })

    // 設定
    const selectedPosition = ref<ToastPosition>(DEFAULT_TOAST_POSITION)
    const customMessage = ref('')
    const duration = ref(3000)

    // 快速觸發範例訊息
    const showRandomToast = (type: 'success' | 'error' | 'warning' | 'info') => {
      const messages = EXAMPLE_MESSAGES[type]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      toast[type](randomMessage, { position: selectedPosition.value })
    }

    // 顯示自訂訊息
    const showCustomToast = () => {
      if (!customMessage.value.trim()) return
      toast.info(customMessage.value, {
        position: selectedPosition.value,
        duration: duration.value,
      })
      customMessage.value = ''
    }

    // 顯示複雜範例
    const showComplexToast = () => {
      toast.success('操作成功', {
        title: '系統通知',
        position: selectedPosition.value,
        duration: 5000,
      })
    }

    // 顯示無限期 Toast
    const showPersistentToast = () => {
      toast.warning('此通知需要手動關閉', {
        position: selectedPosition.value,
        duration: 0,
        closable: true,
      })
    }

    // 批量測試
    const triggerMultipleToasts = () => {
      toast.success('第一則訊息', { position: selectedPosition.value })
      setTimeout(() => {
        toast.info('第二則訊息', { position: selectedPosition.value })
      }, 200)
      setTimeout(() => {
        toast.warning('第三則訊息', { position: selectedPosition.value })
      }, 400)
      setTimeout(() => {
        toast.error('第四則訊息', { position: selectedPosition.value })
      }, 600)
    }

    // Action Toast 範例
    const showUpdateToast = () => {
      toast.info('有新版本可用！', {
        title: '更新通知',
        position: selectedPosition.value,
        duration: 0,
        actions: [
          {
            label: '立即更新',
            variant: 'primary',
            onClick: () => {
              toast.success('開始更新...', { position: selectedPosition.value })
            },
          },
          {
            label: '稍後提醒',
            variant: 'secondary',
            onClick: () => {
              toast.info('已設定稍後提醒', {
                position: selectedPosition.value,
              })
            },
          },
        ],
      })
    }

    const showDeleteToast = () => {
      toast.warning('確定要刪除此項目嗎？', {
        title: '刪除確認',
        position: selectedPosition.value,
        duration: 0,
        actions: [
          {
            label: '確定刪除',
            variant: 'danger',
            onClick: () => {
              toast.success('已刪除', { position: selectedPosition.value })
            },
          },
          {
            label: '取消',
            variant: 'secondary',
            onClick: () => {
              // 直接關閉，不做任何事
            },
          },
        ],
      })
    }

    const showNavigationToast = () => {
      toast.success('操作成功！', {
        title: '提示',
        position: selectedPosition.value,
        duration: 5000,
        actions: [
          {
            label: '前往查看',
            variant: 'primary',
            onClick: () => {
              toast.info('即將跳轉...', { position: selectedPosition.value })
            },
          },
        ],
      })
    }

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* Toast Containers for all positions */}
        {POSITION_OPTIONS.map((pos) => (
          <ToastContainer
            key={pos.value}
            toasts={toast.toasts.value}
            position={pos.value}
            onClose={toast.remove}
          />
        ))}

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
              Toast Notification
            </h1>
            <p class="text-slate-300 text-lg">
              通知提示系統 - 成功/錯誤訊息、自動關閉、位置配置
            </p>
          </div>

          {/* 全局設定 */}
          <div class="mb-12 bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <h2 class="text-2xl font-bold mb-6">⚙️ 全局設定</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 位置選擇 */}
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-3">
                  顯示位置
                </label>
                <div class="grid grid-cols-3 gap-2">
                  {POSITION_OPTIONS.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => (selectedPosition.value = pos.value)}
                      class={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${
                          selectedPosition.value === pos.value
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }
                      `}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 持續時間 */}
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-3">
                  持續時間：{duration.value}ms
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={duration.value}
                  onInput={(e) =>
                    (duration.value = Number(
                      (e.target as HTMLInputElement).value,
                    ))
                  }
                  class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            </div>

            {/* 清除按鈕 */}
            <div class="mt-6 flex gap-3">
              <button
                onClick={toast.clear}
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                清除所有通知
              </button>
              <div class="text-sm text-slate-400 flex items-center">
                目前有 {toast.toasts.value.length} 則通知
              </div>
            </div>
          </div>

          {/* Demo Sections */}
          <div class="space-y-12">
            {/* 基本類型 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">🎨 四種通知類型</h2>
                <p class="text-slate-400 text-lg">
                  Success / Error / Warning / Info
                </p>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => showRandomToast('success')}
                  class="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  ✓ Success
                </button>
                <button
                  onClick={() => showRandomToast('error')}
                  class="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  ✕ Error
                </button>
                <button
                  onClick={() => showRandomToast('warning')}
                  class="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  ⚠ Warning
                </button>
                <button
                  onClick={() => showRandomToast('info')}
                  class="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  ℹ Info
                </button>
              </div>
            </div>

            {/* 自訂訊息 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">✏️ 自訂訊息</h2>
                <p class="text-slate-400 text-lg">輸入任意文字建立通知</p>
              </div>

              <div class="space-y-4">
                <input
                  type="text"
                  value={customMessage.value}
                  onInput={(e) =>
                    (customMessage.value = (e.target as HTMLInputElement).value)
                  }
                  onKeydown={(e) => {
                    if (e.key === 'Enter') showCustomToast()
                  }}
                  placeholder="輸入通知訊息..."
                  class="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={showCustomToast}
                  disabled={!customMessage.value.trim()}
                  class={`
                    w-full px-6 py-3 rounded-lg font-semibold transition-all
                    ${
                      customMessage.value.trim()
                        ? 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  顯示通知
                </button>
              </div>
            </div>

            {/* Action Toast - 帶操作按鈕 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">🎬 操作按鈕通知</h2>
                <p class="text-slate-400 text-lg">
                  帶有確認/取消、前往等操作按鈕的通知
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={showUpdateToast}
                  class="px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  🔔 更新通知
                </button>
                <button
                  onClick={showDeleteToast}
                  class="px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  🗑️ 刪除確認
                </button>
                <button
                  onClick={showNavigationToast}
                  class="px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  🧭 導航提示
                </button>
              </div>
            </div>

            {/* 進階功能 */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">🚀 進階功能</h2>
                <p class="text-slate-400 text-lg">標題、持久化、批量通知</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={showComplexToast}
                  class="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  📋 含標題通知
                </button>
                <button
                  onClick={showPersistentToast}
                  class="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  📌 持久化通知
                </button>
                <button
                  onClick={triggerMultipleToasts}
                  class="px-6 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                  🔥 批量通知
                </button>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: '6 種位置',
                description: '支援角落、中央等多種位置',
              },
              {
                icon: '⏱️',
                title: '自動關閉',
                description: '可配置持續時間或持久化',
              },
              {
                icon: '✨',
                title: '平滑動畫',
                description: '進入/退出動畫效果流暢',
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
