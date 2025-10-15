import { defineComponent, ref } from 'vue'
import { useDarkMode } from './hooks/useDarkMode'
import { ThemeToggle } from './components/ThemeToggle'
import { DemoCard } from './components/DemoCard'

export default defineComponent({
  name: 'DarkMode',
  setup() {
    const router = useRouter()
    const darkMode = useDarkMode()

    useHead({
      title: '深色模式',
      meta: [
        {
          name: 'description',
          content: 'Dark Mode - 主題切換、深色模式、localStorage 持久化',
        },
      ],
    })

    // 表單示例
    const inputValue = ref('')
    const selectedOption = ref('option1')

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white transition-colors duration-300">
        <div class="container mx-auto px-4 py-16 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            class="mb-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
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
            <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Dark Mode
            </h1>
            <p class="text-slate-600 dark:text-slate-300 text-lg">
              深色模式 - 主題切換、localStorage 持久化、系統主題偵測
            </p>
          </div>

          {/* Theme Toggle */}
          <div class="mb-12">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-8 border border-slate-200 dark:border-slate-700">
              <div class="mb-6">
                <h2 class="text-2xl font-bold mb-2">🎨 主題切換</h2>
                <p class="text-slate-600 dark:text-slate-400">
                  選擇你喜歡的主題模式
                </p>
              </div>
              <ThemeToggle darkMode={darkMode} />
              <div class="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-slate-600 dark:text-slate-400">
                      當前主題：
                    </span>
                    <span class="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                      {darkMode.theme.value}
                    </span>
                  </div>
                  <div>
                    <span class="text-slate-600 dark:text-slate-400">
                      深色模式：
                    </span>
                    <span class="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                      {darkMode.isDark.value ? '是' : '否'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Sections */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Buttons Demo */}
            <DemoCard title="📋 按鈕樣式" description="不同主題下的按鈕表現">
              <div class="space-y-4">
                <button class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Primary Button
                </button>
                <button class="w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold transition-colors">
                  Secondary Button
                </button>
                <button class="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-900 dark:text-white rounded-lg font-semibold transition-colors">
                  Outline Button
                </button>
              </div>
            </DemoCard>

            {/* Forms Demo */}
            <DemoCard title="📝 表單元素" description="輸入框、選擇器等表單元素">
              <div class="space-y-4">
                <input
                  type="text"
                  value={inputValue.value}
                  onInput={(e) =>
                    (inputValue.value = (e.target as HTMLInputElement).value)
                  }
                  placeholder="輸入文字..."
                  class="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                <select
                  value={selectedOption.value}
                  onChange={(e) =>
                    (selectedOption.value = (e.target as HTMLSelectElement)
                      .value)
                  }
                  class="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                >
                  <option value="option1">選項 1</option>
                  <option value="option2">選項 2</option>
                  <option value="option3">選項 3</option>
                </select>
                <textarea
                  placeholder="輸入多行文字..."
                  rows={3}
                  class="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                />
              </div>
            </DemoCard>

            {/* Typography Demo */}
            <DemoCard title="📖 文字排版" description="標題、段落、程式碼的顯示">
              <div class="space-y-4">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
                  大標題文字
                </h3>
                <p class="text-slate-700 dark:text-slate-300">
                  這是一段普通的段落文字，用來展示在不同主題下的可讀性。
                </p>
                <code class="block px-4 py-3 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg font-mono text-sm">
                  const greeting = "Hello, Dark Mode!"
                </code>
                <div class="text-sm text-slate-500 dark:text-slate-400">
                  次要文字顏色
                </div>
              </div>
            </DemoCard>

            {/* Cards Demo */}
            <DemoCard title="🎴 卡片樣式" description="卡片在深淺模式的對比">
              <div class="space-y-3">
                <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div class="font-semibold mb-1">卡片標題</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400">
                    這是卡片內容
                  </div>
                </div>
                <div class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div class="font-semibold mb-1 text-blue-900 dark:text-blue-300">
                    漸變卡片
                  </div>
                  <div class="text-sm text-blue-700 dark:text-blue-400">
                    使用漸變背景的卡片
                  </div>
                </div>
              </div>
            </DemoCard>
          </div>

          {/* Feature Cards */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '💾',
                title: 'localStorage 持久化',
                description: '主題選擇會保存在本地',
              },
              {
                icon: '💻',
                title: '系統主題偵測',
                description: '自動偵測系統深淺模式',
              },
              {
                icon: '🎨',
                title: 'Tailwind Dark Mode',
                description: '使用 class 策略切換主題',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                class="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:transform hover:scale-105 shadow-lg dark:shadow-slate-900/50"
              >
                <span class="text-4xl">{feature.icon}</span>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                    {feature.title}
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
