import { defineComponent, ref, computed } from "vue";
import { PostCard } from "./components/PostCard";
import { LoadingCard } from "./components/LoadingCard";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { generateMockPosts, TOTAL_POSTS, PAGE_SIZE } from "./utils/mockData";
import type { Post } from "./types";

export default defineComponent({
  name: "InfiniteScrollPage",
  setup() {
    const router = useRouter();

    useHead({
      title: "Infinite Scroll - Feature Playground",
      meta: [
        {
          name: "description",
          content: "無限滾動載入示範 - Intersection Observer API",
        },
      ],
    });

    const posts = ref<Post[]>([]);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const hasMore = computed(() => posts.value.length < TOTAL_POSTS);

    // 初始載入
    const { targetRef, checkAndLoadMore } = useInfiniteScroll(
      () => {
        if (isLoading.value || !hasMore.value) return;

        isLoading.value = true;

        // 模擬 API 請求延遲
        setTimeout(() => {
          const newPosts = generateMockPosts(currentPage.value, PAGE_SIZE);
          posts.value.push(...newPosts);
          currentPage.value++;
          isLoading.value = false;

          // 載入完成後，檢查觸發元素是否還在視窗內
          // 如果是，自動繼續載入
          setTimeout(() => {
            checkAndLoadMore();
          }, 100);
        }, 800);
      },
      0.1,
      "200px",
    );

    // 首次載入資料
    const loadMore = () => {
      if (isLoading.value || !hasMore.value) return;

      isLoading.value = true;

      setTimeout(() => {
        const newPosts = generateMockPosts(currentPage.value, PAGE_SIZE);
        posts.value.push(...newPosts);
        currentPage.value++;
        isLoading.value = false;
      }, 800);
    };

    // 首次載入資料
    loadMore();

    const loadedCount = computed(() => posts.value.length);
    const progress = computed(() =>
      Math.round((loadedCount.value / TOTAL_POSTS) * 100),
    );

    // 計算需要多少個 LoadingCard 來填滿當前行
    const loadingCardCount = computed(() => {
      const currentCount = posts.value.length;
      const itemsPerRow = 3; // lg:grid-cols-3
      const remainder = currentCount % itemsPerRow;

      // 如果當前行已經滿了，不需要 LoadingCard
      if (remainder === 0) return 3;

      // 需要補足的數量 = 一行能放的數量 - 當前行已有的數量
      return itemsPerRow - remainder;
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
            <h1 class="text-4xl font-bold text-white">Infinite Scroll</h1>
            <p class="text-slate-300">
              無限滾動載入 - 使用 Intersection Observer API
            </p>
          </div>

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
                </p>
                <p class="text-xs text-slate-500">向下滾動自動載入更多內容</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-400">
                  {progress.value}%
                </p>
                <p class="text-xs text-slate-500">載入進度</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                class="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress.value}%` }}
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.value.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Loading Skeletons */}
            {isLoading.value &&
              Array.from({ length: loadingCardCount.value }).map((_, index) => (
                <LoadingCard key={`loading-${index}`} />
              ))}
          </div>

          {/* Trigger Element (觸發載入更多的元素) */}
          {hasMore.value && (
            <div ref={targetRef} class="flex justify-center py-8">
              <div class="text-slate-500 text-sm">
                {isLoading.value ? "載入中..." : "繼續向下滾動載入更多..."}
              </div>
            </div>
          )}

          {/* End Message */}
          {!hasMore.value && (
            <div class="text-center py-12 space-y-4">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500 mb-4">
                <svg
                  class="w-8 h-8 text-green-400"
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
            <h3 class="text-xl font-semibold text-white">🔍 技術說明</h3>

            <div class="space-y-3 text-slate-300 text-sm">
              <div class="bg-slate-900/50 p-4 rounded-lg">
                <p class="font-medium text-white mb-2">💡 運作原理</p>
                <p class="text-slate-400">
                  使用{" "}
                  <code class="px-1 bg-slate-700 rounded">
                    Intersection Observer
                  </code>{" "}
                  監測觸發元素是否進入視窗，
                  當使用者滾動到頁面底部時自動載入下一頁資料。
                </p>
              </div>

              <div class="bg-slate-900/50 p-4 rounded-lg">
                <p class="font-medium text-white mb-2">🎯 核心特色</p>
                <ul class="list-disc list-inside space-y-1 text-slate-400 ml-2">
                  <li>自動偵測滾動位置，無需手動點擊</li>
                  <li>防止重複載入（loading 狀態控制）</li>
                  <li>優雅的載入動畫與骨架屏</li>
                  <li>載入進度即時顯示</li>
                  <li>到達底部顯示完成訊息</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
