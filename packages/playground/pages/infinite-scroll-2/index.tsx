import { defineComponent, computed, onMounted } from "vue";
import { PostCard } from "./components/PostCard";
import { LoadingCard } from "./components/LoadingCard";
import { PreloadSettings } from "./components/PreloadSettings";
import { usePreloadInfiniteScroll } from "./hooks/usePreloadInfiniteScroll";
import { TOTAL_POSTS } from "./utils/mockData";

export default defineComponent({
  name: "InfiniteScrollV2Page",
  setup() {
    const router = useRouter();

    useHead({
      title: "Infinite Scroll V2 - 預加載版本 - Feature Playground",
      meta: [
        {
          name: "description",
          content: "無限滾動載入示範 V2 - 智慧預加載機制",
        },
      ],
    });

    // 使用預加載 Hook（預設預載 2 頁）
    const {
      displayedPosts,
      currentPage,
      isLoading,
      isPreloading,
      hasMore,
      preloadedPages,
      cachedPagesCount,
      config,
      initialize,
      updatePreloadPages,
      targetRef,
    } = usePreloadInfiniteScroll(2);

    // 初始化載入
    onMounted(() => {
      initialize();
    });

    const loadedCount = computed(() => displayedPosts.value.length);
    const progress = computed(() =>
      Math.round((loadedCount.value / TOTAL_POSTS) * 100),
    );

    // 計算需要多少個 LoadingCard 來填滿當前行
    const loadingCardCount = computed(() => {
      const currentCount = displayedPosts.value.length;
      const itemsPerRow = 3; // lg:grid-cols-3
      const remainder = currentCount % itemsPerRow;

      if (remainder === 0) return 3;
      return itemsPerRow - remainder;
    });

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white py-12 px-4">
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
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full">
              <svg
                class="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span class="text-sm font-semibold text-purple-200">
                Version 2.0 - Preload Enhanced
              </span>
            </div>

            <h1 class="text-4xl font-bold text-white">
              Infinite Scroll <span class="text-purple-400">V2</span>
            </h1>
            <p class="text-slate-300">
              智慧預加載版本 - 背景預載 + 平滑載入體驗
            </p>
          </div>

          {/* Preload Settings */}
          <PreloadSettings
            preloadPages={config.value.preloadPages}
            cachedPagesCount={cachedPagesCount.value}
            preloadedPages={preloadedPages.value}
            isPreloading={isPreloading.value}
            onUpdatePreloadPages={updatePreloadPages}
          />

          {/* Progress Bar */}
          <div class="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div class="flex items-center justify-between mb-3">
              <div class="space-y-1">
                <p class="text-sm text-slate-300">
                  已載入{" "}
                  <span class="font-semibold text-white">
                    {loadedCount.value}
                  </span>{" "}
                  / {TOTAL_POSTS} 篇文章
                  {currentPage.value > 0 && (
                    <span class="ml-2 text-xs text-purple-400">
                      (第 {currentPage.value} 頁)
                    </span>
                  )}
                </p>
                <p class="text-xs text-slate-500">
                  向下滾動自動載入 - 預載機制確保流暢體驗
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-purple-400">
                  {progress.value}%
                </p>
                <p class="text-xs text-slate-500">載入進度</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress.value}%` }}
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.value.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Loading Skeletons - 僅在載入時顯示 300ms */}
            {isLoading.value &&
              Array.from({ length: loadingCardCount.value }).map((_, index) => (
                <LoadingCard key={`loading-${index}`} />
              ))}
          </div>

          {/* Trigger Element (觸發載入更多的元素) */}
          {hasMore.value && (
            <div ref={targetRef} class="flex justify-center py-8">
              <div class="flex items-center gap-3 text-slate-500 text-sm">
                {isLoading.value ? (
                  <>
                    <svg
                      class="animate-spin h-5 w-5 text-purple-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span class="text-purple-400">載入中...</span>
                  </>
                ) : (
                  <>
                    {cachedPagesCount.value > 0 ? (
                      <>
                        <span class="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span class="text-green-400">
                          已預載 {cachedPagesCount.value} 頁 - 繼續滾動...
                        </span>
                      </>
                    ) : (
                      <span>繼續向下滾動載入更多...</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* End Message */}
          {!hasMore.value && (
            <div class="text-center py-12 space-y-4">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500 mb-4">
                <svg
                  class="w-8 h-8 text-purple-400"
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
              </div>
              <h3 class="text-2xl font-semibold text-white">已載入所有內容</h3>
              <p class="text-slate-400">
                總共 {TOTAL_POSTS} 篇文章已全部載入完成
              </p>
            </div>
          )}

          {/* Info Section */}
          <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
            <h3 class="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                class="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              技術說明 - V2 升級內容
            </h3>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                <p class="font-medium text-purple-300 mb-2 flex items-center gap-2">
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
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  核心特色
                </p>
                <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm ml-2">
                  <li>智慧預加載機制（0-5 頁可調）</li>
                  <li>背景預載不阻塞 UI</li>
                  <li>300ms 平滑載入動畫</li>
                  <li>快取管理與即時顯示</li>
                  <li>預載進度即時監控</li>
                </ul>
              </div>

              <div class="bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
                <p class="font-medium text-blue-300 mb-2 flex items-center gap-2">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  V1 vs V2 差異
                </p>
                <ul class="space-y-1 text-slate-400 text-sm">
                  <li>
                    <span class="text-red-400">V1:</span> 滾動到底才請求 API
                  </li>
                  <li>
                    <span class="text-green-400">V2:</span> 預先載入後續頁面
                  </li>
                  <li>
                    <span class="text-green-400">V2:</span> 平滑過渡動畫
                  </li>
                  <li>
                    <span class="text-green-400">V2:</span> 可調整預載策略
                  </li>
                </ul>
              </div>
            </div>

            <div class="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p class="text-sm text-purple-200">
                <span class="font-semibold">💡 使用建議：</span>{" "}
                預載頁數設定為 2-3 頁可獲得最佳體驗。設定為 0
                則關閉預載功能，行為等同於 V1 版本。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
