import { defineComponent, ref, watch, onUnmounted } from "vue";
import { useDebounce } from "./hooks/useDebounce";
import { useDebouncedFn } from "./hooks/useDebounce";
import { useThrottledFn } from "./hooks/useThrottle";
import {
  MOCK_SEARCH_DATA,
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_THROTTLE_DELAY,
} from "./constants";
import type { SearchResult, ApiCallLog } from "./types";

export default defineComponent({
  name: "DebounceThrottle",
  setup() {
    const router = useRouter();

    useHead({
      title: "防抖與節流小工具",
      meta: [
        {
          name: "description",
          content:
            "Debounce & Throttle 實戰演示 - 搜尋框防抖、滾動節流、API 呼叫優化",
        },
      ],
    });

    // Search demo state
    const searchQuery = ref("");
    const debouncedSearch = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);
    const searchResults = ref<SearchResult[]>([]);
    const searchCallCount = ref(0);

    // Scroll demo state
    const scrollY = ref(0);
    const throttledScrollY = ref(0);
    const scrollCallCount = ref(0);
    const throttledScrollCallCount = ref(0);

    // API call demo state
    const apiInput = ref("");
    const apiCalls = ref<ApiCallLog[]>([]);
    let apiCallId = 0;

    // Search function
    const performSearch = (query: string) => {
      searchCallCount.value++;
      if (!query.trim()) {
        searchResults.value = [];
        return;
      }

      searchResults.value = MOCK_SEARCH_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      );
    };

    // Watch debounced search
    const unwatchSearch = watch(debouncedSearch, (newQuery) => {
      performSearch(newQuery);
    });

    // Throttled scroll handler
    const handleThrottledScroll = useThrottledFn(() => {
      throttledScrollY.value = scrollY.value;
      throttledScrollCallCount.value++;
    }, DEFAULT_THROTTLE_DELAY);

    // Scroll handler
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      scrollY.value = target.scrollTop;
      scrollCallCount.value++;
      handleThrottledScroll();
    };

    // API call handlers
    const addApiCall = (
      type: "debounce" | "throttle" | "normal",
      value: string,
    ) => {
      apiCalls.value.unshift({
        id: apiCallId++,
        timestamp: Date.now(),
        type,
        value,
      });

      // Keep only last 5 calls
      if (apiCalls.value.length > 5) {
        apiCalls.value = apiCalls.value.slice(0, 5);
      }
    };

    const handleNormalApiCall = () => {
      addApiCall("normal", apiInput.value);
    };

    const handleDebouncedApiCall = useDebouncedFn(() => {
      addApiCall("debounce", apiInput.value);
    }, 500);

    const handleThrottledApiCall = useThrottledFn(() => {
      addApiCall("throttle", apiInput.value);
    }, 1000);

    onUnmounted(() => {
      unwatchSearch();
    });

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div class="container mx-auto px-4 py-16 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
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
              Debounce & Throttle
            </h1>
            <p class="text-slate-300 text-lg">
              防抖與節流 - 性能優化、搜尋、滾動事件
            </p>
          </div>

          {/* Demo Sections */}
          <div class="space-y-12">
            {/* Search Demo - Debounce */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">🔍 搜尋框 - Debounce</h2>
                <p class="text-slate-400 text-lg">
                  延遲 {DEFAULT_DEBOUNCE_DELAY}ms 執行搜尋，避免過度頻繁的查詢
                </p>
              </div>

              <div class="space-y-6">
                <div>
                  <input
                    type="text"
                    value={searchQuery.value}
                    onInput={(e) =>
                      (searchQuery.value = (e.target as HTMLInputElement).value)
                    }
                    placeholder="輸入關鍵字搜尋..."
                    class="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div class="flex flex-wrap gap-4 text-sm">
                  <div class="px-6 py-3 bg-slate-700 rounded-lg border border-slate-600">
                    <span class="text-slate-400">輸入次數：</span>
                    <span class="text-blue-400 font-semibold ml-2 text-lg">
                      {searchQuery.value.length}
                    </span>
                  </div>
                  <div class="px-6 py-3 bg-slate-700 rounded-lg border border-slate-600">
                    <span class="text-slate-400">搜尋次數：</span>
                    <span class="text-green-400 font-semibold ml-2 text-lg">
                      {searchCallCount.value}
                    </span>
                  </div>
                </div>

                {searchResults.value.length > 0 && (
                  <div class="space-y-3 pt-4">
                    <p class="text-base text-slate-400 font-medium">
                      找到 {searchResults.value.length} 筆結果：
                    </p>
                    <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {searchResults.value.map((result) => (
                        <div
                          key={result.id}
                          class="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors"
                        >
                          <h3 class="font-semibold text-white mb-1">
                            {result.title}
                          </h3>
                          <p class="text-sm text-slate-400">
                            {result.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scroll Demo - Throttle */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">📜 滾動追蹤 - Throttle</h2>
                <p class="text-slate-400 text-lg">
                  每 {DEFAULT_THROTTLE_DELAY}ms 更新一次位置，降低效能消耗
                </p>
              </div>

              <div class="space-y-6">
                <div class="flex flex-wrap gap-4 text-sm">
                  <div class="px-6 py-3 bg-slate-700 rounded-lg border border-slate-600">
                    <span class="text-slate-400">滾動觸發：</span>
                    <span class="text-blue-400 font-semibold ml-2 text-lg">
                      {scrollCallCount.value}
                    </span>
                  </div>
                  <div class="px-6 py-3 bg-slate-700 rounded-lg border border-slate-600">
                    <span class="text-slate-400">實際更新：</span>
                    <span class="text-green-400 font-semibold ml-2 text-lg">
                      {throttledScrollCallCount.value}
                    </span>
                  </div>
                  <div class="px-6 py-3 bg-slate-700 rounded-lg border border-slate-600">
                    <span class="text-slate-400">位置：</span>
                    <span class="text-purple-400 font-semibold ml-2 text-lg">
                      {Math.round(throttledScrollY.value)}px
                    </span>
                  </div>
                </div>

                <div
                  class="h-80 overflow-y-auto bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  onScroll={handleScroll}
                >
                  <div class="space-y-3">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        class={`p-5 bg-gradient-to-r ${i % 2 === 0 ? "from-blue-500 to-purple-500" : "from-purple-500 to-pink-500"} rounded-lg shadow-lg`}
                      >
                        <p class="text-white font-semibold text-lg">
                          區塊 {i + 1}
                        </p>
                        <p class="text-white/80 text-sm mt-1">
                          向下滾動查看節流效果
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* API Call Demo */}
            <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
              <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">⚡ API 呼叫比較</h2>
                <p class="text-slate-400 text-lg">
                  比較一般、Debounce、Throttle 三種方式的呼叫頻率
                </p>
              </div>

              <div class="space-y-6">
                <input
                  type="text"
                  value={apiInput.value}
                  onInput={(e) => {
                    apiInput.value = (e.target as HTMLInputElement).value;
                    handleNormalApiCall();
                    handleDebouncedApiCall();
                    handleThrottledApiCall();
                  }}
                  placeholder="輸入任意文字..."
                  class="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

                <div class="bg-slate-700/50 rounded-lg p-6 max-h-80 overflow-y-auto border border-slate-600">
                  <p class="text-base text-slate-400 mb-4 font-medium">
                    API 呼叫記錄（最新 5 筆）：
                  </p>
                  {apiCalls.value.length === 0 ? (
                    <p class="text-slate-500 text-center py-8">尚無呼叫記錄</p>
                  ) : (
                    <div class="space-y-3">
                      {apiCalls.value.map((call) => (
                        <div
                          key={call.id}
                          class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600"
                        >
                          <span
                            class={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap ${
                              call.type === "normal"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : call.type === "debounce"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-green-500/20 text-green-400 border border-green-500/30"
                            }`}
                          >
                            {call.type.toUpperCase()}
                          </span>
                          <span class="text-slate-400 text-sm">
                            {new Date(call.timestamp).toLocaleTimeString()}
                          </span>
                          <span class="text-white flex-1 truncate">
                            {call.value || "(空)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⏱️",
                title: "Debounce",
                description: "延遲執行，等待輸入完成",
              },
              {
                icon: "🎯",
                title: "Throttle",
                description: "限制頻率，固定時間執行",
              },
              {
                icon: "🚀",
                title: "效能優化",
                description: "減少不必要的函數調用",
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
    );
  },
});
