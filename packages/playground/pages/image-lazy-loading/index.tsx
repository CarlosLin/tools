import { defineComponent, ref, computed } from "vue";
import { LazyImage } from "./components/LazyImage";
import type { ImageData } from "./types";

// Using Unsplash random images for demo
const mockImages: ImageData[] = [
  {
    id: 1,
    src: "https://picsum.photos/seed/1/800/600",
    alt: "Nature landscape",
    category: "Nature",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/2/800/600",
    alt: "City architecture",
    category: "City",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/3/800/600",
    alt: "Mountain view",
    category: "Nature",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/4/800/600",
    alt: "Ocean waves",
    category: "Nature",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/5/800/600",
    alt: "Urban street",
    category: "City",
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/6/800/600",
    alt: "Forest path",
    category: "Nature",
  },
  {
    id: 7,
    src: "https://picsum.photos/seed/7/800/600",
    alt: "Modern building",
    category: "City",
  },
  {
    id: 8,
    src: "https://picsum.photos/seed/8/800/600",
    alt: "Beach sunset",
    category: "Nature",
  },
  {
    id: 9,
    src: "https://picsum.photos/seed/9/800/600",
    alt: "Night city",
    category: "City",
  },
  {
    id: 10,
    src: "https://picsum.photos/seed/10/800/600",
    alt: "Desert dunes",
    category: "Nature",
  },
  {
    id: 11,
    src: "https://picsum.photos/seed/11/800/600",
    alt: "Skyscraper",
    category: "City",
  },
  {
    id: 12,
    src: "https://picsum.photos/seed/12/800/600",
    alt: "Waterfall",
    category: "Nature",
  },
  {
    id: 13,
    src: "https://picsum.photos/seed/13/800/600",
    alt: "Bridge view",
    category: "City",
  },
  {
    id: 14,
    src: "https://picsum.photos/seed/14/800/600",
    alt: "Lake reflection",
    category: "Nature",
  },
  {
    id: 15,
    src: "https://picsum.photos/seed/15/800/600",
    alt: "Street art",
    category: "City",
  },
  {
    id: 16,
    src: "https://picsum.photos/seed/16/800/600",
    alt: "Snow mountain",
    category: "Nature",
  },
  {
    id: 17,
    src: "https://picsum.photos/seed/17/800/600",
    alt: "Harbor view",
    category: "City",
  },
  {
    id: 18,
    src: "https://picsum.photos/seed/18/800/600",
    alt: "Tropical beach",
    category: "Nature",
  },
];

export default defineComponent({
  name: "ImageLazyLoadingPage",
  setup() {
    const router = useRouter();

    useHead({
      title: "Image Lazy Loading - Feature Playground",
      meta: [
        {
          name: "description",
          content: "Efficient image loading with Intersection Observer API",
        },
      ],
    });

    const selectedCategory = ref<"All" | "Nature" | "City">("All");
    const threshold = ref(0.1);
    const rootMargin = ref(100);

    const filteredImages = computed(() => {
      if (selectedCategory.value === "All") return mockImages;
      return mockImages.filter(
        (img) => img.category === selectedCategory.value,
      );
    });

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4">
        <div class="max-w-7xl mx-auto space-y-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
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
          <div class="text-center space-y-4">
            <h1 class="text-4xl font-bold text-white">Image Lazy Loading</h1>
            <p class="text-slate-300">
              Efficient image loading with Intersection Observer API
            </p>
          </div>

          {/* Controls */}
          <div class="bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-700 space-y-6">
            {/* Category Filter */}
            <div class="flex flex-wrap gap-4 items-center justify-between">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">
                  Filter by Category
                </label>
                <div class="flex gap-2">
                  {(["All", "Nature", "City"] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => (selectedCategory.value = category)}
                      class={
                        selectedCategory.value === category
                          ? "px-4 py-2 rounded-lg bg-blue-500 text-white transition-colors"
                          : "px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div class="bg-slate-700 px-4 py-2 rounded-lg">
                <p class="text-sm text-slate-300">
                  Showing{" "}
                  <span class="font-semibold text-white">
                    {filteredImages.value.length}
                  </span>{" "}
                  images
                </p>
              </div>
            </div>

            {/* Parameter Controls */}
            <div class="border-t border-slate-700 pt-6 space-y-4">
              <h3 class="text-lg font-semibold text-white mb-4">
                🎛️ Intersection Observer 參數調整
              </h3>

              <div class="grid md:grid-cols-2 gap-6">
                {/* Threshold Control */}
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-300">
                      Threshold (門檻值)
                    </label>
                    <span class="text-blue-400 font-mono text-sm">
                      {threshold.value.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={threshold.value}
                    onInput={(e) =>
                      (threshold.value = parseFloat(
                        (e.target as HTMLInputElement).value,
                      ))
                    }
                    class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p class="text-xs text-slate-400">
                    {threshold.value === 0 && "0 = 只要有一點點進入視窗就觸發"}
                    {threshold.value === 0.1 && "0.1 = 露出 10% 就觸發 (預設)"}
                    {threshold.value > 0.1 &&
                      threshold.value < 1 &&
                      `${(threshold.value * 100).toFixed(0)}% 的元素進入視窗才觸發`}
                    {threshold.value === 1 && "1.0 = 必須完全進入視窗才觸發"}
                  </p>
                </div>

                {/* Root Margin Control */}
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-300">
                      Root Margin (提前載入距離)
                    </label>
                    <span class="text-green-400 font-mono text-sm">
                      {rootMargin.value}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="50"
                    value={rootMargin.value}
                    onInput={(e) =>
                      (rootMargin.value = parseInt(
                        (e.target as HTMLInputElement).value,
                      ))
                    }
                    class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <p class="text-xs text-slate-400">
                    {rootMargin.value === 0 &&
                      "0px = 不提前載入，圖片剛進入視窗才開始"}
                    {rootMargin.value > 0 &&
                      rootMargin.value <= 100 &&
                      `提前 ${rootMargin.value}px 就開始載入`}
                    {rootMargin.value > 100 &&
                      `提前 ${rootMargin.value}px 載入（較積極的預載）`}
                  </p>
                </div>
              </div>

              <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p class="text-blue-200 text-sm">
                  💡 <span class="font-semibold">試試看</span>
                  ：調整參數後重新載入頁面，滾動時觀察圖片載入時機的變化！
                </p>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.value.map((image) => (
              <div key={image.id} class="group">
                <LazyImage
                  src={image.src}
                  alt={image.alt}
                  className="rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                  aspectRatio="4/3"
                  threshold={threshold.value}
                  rootMargin={`${rootMargin.value}px`}
                />
                <div class="mt-3 space-y-1">
                  <h3 class="text-white font-medium">{image.alt}</h3>
                  <span class="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Details */}
          <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-6">
            <h3 class="text-xl font-semibold text-white">🔍 技術實作詳解</h3>

            {/* 運作流程 */}
            <div class="space-y-3">
              <h4 class="text-lg font-semibold text-blue-400">載入流程</h4>
              <div class="space-y-3 text-slate-300 text-sm">
                <div class="flex gap-3">
                  <span class="text-blue-400 font-mono">步驟 1</span>
                  <div>
                    <p class="font-medium text-white">初始狀態</p>
                    <p class="text-slate-400">
                      圖片尚未進入視窗，顯示輕量的 SVG 佔位符
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <span class="text-green-400 font-mono">步驟 2</span>
                  <div>
                    <p class="font-medium text-white">進入視窗</p>
                    <p class="text-slate-400">
                      Intersection Observer 偵測到圖片進入範圍，設定{" "}
                      <code class="px-1 bg-slate-700 rounded">
                        isVisible = true
                      </code>
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <span class="text-yellow-400 font-mono">步驟 3</span>
                  <div>
                    <p class="font-medium text-white">開始下載</p>
                    <p class="text-slate-400">
                      切換到真實圖片 URL，瀏覽器自動開始下載，同時顯示轉圈圈動畫
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <span class="text-purple-400 font-mono">步驟 4</span>
                  <div>
                    <p class="font-medium text-white">載入完成</p>
                    <p class="text-slate-400">
                      瀏覽器觸發{" "}
                      <code class="px-1 bg-slate-700 rounded">onLoad</code>{" "}
                      事件， 設定{" "}
                      <code class="px-1 bg-slate-700 rounded">
                        isLoaded = true
                      </code>
                      ， 圖片從半透明淡入到完全顯示
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intersection Observer 說明 */}
            <div class="border-t border-slate-700 pt-6 space-y-3">
              <h4 class="text-lg font-semibold text-green-400">
                Intersection Observer 核心概念
              </h4>
              <div class="space-y-4 text-slate-300 text-sm">
                <div class="bg-slate-900/50 p-4 rounded-lg">
                  <p class="font-medium text-white mb-2">
                    📍 什麼是 Intersection Observer？
                  </p>
                  <p class="text-slate-400">
                    這是瀏覽器提供的 API，用來
                    <span class="text-green-400">
                      自動監測元素是否進入視窗範圍
                    </span>
                    。 不需要手動監聽 scroll 事件，效能更好。
                  </p>
                </div>

                <div class="bg-slate-900/50 p-4 rounded-lg">
                  <p class="font-medium text-white mb-2">
                    🎯 Threshold (門檻值)
                  </p>
                  <p class="text-slate-400 mb-2">
                    控制元素要露出多少比例才觸發：
                  </p>
                  <ul class="list-disc list-inside space-y-1 text-slate-400 ml-2">
                    <li>
                      <code class="px-1 bg-slate-700 rounded">0.0</code> =
                      只要有一點點進入就觸發
                    </li>
                    <li>
                      <code class="px-1 bg-slate-700 rounded">0.1</code> = 露出
                      10% 才觸發（預設值）
                    </li>
                    <li>
                      <code class="px-1 bg-slate-700 rounded">0.5</code> =
                      露出一半才觸發
                    </li>
                    <li>
                      <code class="px-1 bg-slate-700 rounded">1.0</code> =
                      完全進入視窗才觸發
                    </li>
                  </ul>
                </div>

                <div class="bg-slate-900/50 p-4 rounded-lg">
                  <p class="font-medium text-white mb-2">
                    📏 Root Margin (邊界擴展)
                  </p>
                  <p class="text-slate-400 mb-2">
                    擴展視窗的偵測範圍，實現提前載入：
                  </p>
                  <ul class="list-disc list-inside space-y-1 text-slate-400 ml-2">
                    <li>
                      <code class="px-1 bg-slate-700 rounded">0px</code> =
                      剛好進入視窗才載入
                    </li>
                    <li>
                      <code class="px-1 bg-slate-700 rounded">100px</code> =
                      距離視窗 100px 就提前載入
                    </li>
                    <li>
                      <code class="px-1 bg-slate-700 rounded">500px</code> =
                      距離視窗 500px 就開始載入（更積極）
                    </li>
                  </ul>
                  <p class="text-slate-500 mt-2 italic">
                    💡 提前載入可以讓使用者滾動時，圖片已經載入好了
                  </p>
                </div>

                <div class="bg-slate-900/50 p-4 rounded-lg">
                  <p class="font-medium text-white mb-2">
                    🔄 Observer 生命週期
                  </p>
                  <div class="space-y-2 text-slate-400">
                    <p>
                      <span class="text-green-400">1. 建立：</span>
                      <code class="px-1 bg-slate-700 rounded ml-1">
                        new IntersectionObserver(callback, options)
                      </code>
                    </p>
                    <p>
                      <span class="text-blue-400">2. 開始觀察：</span>
                      <code class="px-1 bg-slate-700 rounded ml-1">
                        observer.observe(element)
                      </code>
                    </p>
                    <p>
                      <span class="text-yellow-400">3. 觸發回調：</span>
                      當元素進入視窗時自動執行 callback
                    </p>
                    <p>
                      <span class="text-purple-400">4. 停止觀察：</span>
                      <code class="px-1 bg-slate-700 rounded ml-1">
                        observer.unobserve(element)
                      </code>
                      <span class="text-slate-500 ml-1">
                        （圖片開始載入後就不需要再監測）
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 狀態管理 */}
            <div class="border-t border-slate-700 pt-6 space-y-3">
              <h4 class="text-lg font-semibold text-yellow-400">
                狀態變數說明
              </h4>
              <div class="space-y-3 text-sm">
                <div class="flex gap-3 items-start">
                  <code class="px-2 py-1 bg-blue-900/30 text-blue-300 rounded font-mono text-xs whitespace-nowrap">
                    isVisible
                  </code>
                  <p class="text-slate-400">
                    圖片是否進入視窗範圍（由 Intersection Observer 控制）
                  </p>
                </div>
                <div class="flex gap-3 items-start">
                  <code class="px-2 py-1 bg-green-900/30 text-green-300 rounded font-mono text-xs whitespace-nowrap">
                    isLoaded
                  </code>
                  <p class="text-slate-400">
                    圖片是否下載完成（由瀏覽器 onLoad 事件控制）
                  </p>
                </div>
                <div class="flex gap-3 items-start">
                  <code class="px-2 py-1 bg-red-900/30 text-red-300 rounded font-mono text-xs whitespace-nowrap">
                    hasError
                  </code>
                  <p class="text-slate-400">
                    圖片是否載入失敗（由瀏覽器 onError 事件控制）
                  </p>
                </div>
              </div>
            </div>

            {/* 測試提示 */}
            <div class="border-t border-slate-700 pt-6">
              <div class="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                <p class="text-purple-200 text-sm font-medium mb-2">
                  🧪 如何觀察運作過程？
                </p>
                <ul class="text-purple-300 space-y-1 text-sm list-disc list-inside">
                  <li>打開瀏覽器開發者工具 (F12)</li>
                  <li>切換到 Network 標籤頁</li>
                  <li>慢慢向下滾動頁面</li>
                  <li>觀察圖片只在進入視窗時才開始下載</li>
                  <li>調整上方的參數，重新整理後再次測試</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
