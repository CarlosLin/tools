import { defineComponent, type PropType } from "vue";

export const PreloadSettings = defineComponent({
  name: "PreloadSettings",
  props: {
    preloadPages: {
      type: Number,
      required: true,
    },
    cachedPagesCount: {
      type: Number,
      required: true,
    },
    preloadedPages: {
      type: Array as PropType<number[]>,
      required: true,
    },
    isPreloading: {
      type: Boolean,
      required: true,
    },
    onUpdatePreloadPages: {
      type: Function as PropType<(pages: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const handleSliderChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = parseInt(target.value, 10);
      props.onUpdatePreloadPages(value);
    };

    return () => (
      <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
        <div class="flex items-center justify-between">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            預加載設定
          </h3>

          {props.isPreloading && (
            <span class="flex items-center gap-2 text-sm text-purple-400">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              預載中...
            </span>
          )}
        </div>

        {/* 預載頁數滑桿 */}
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-slate-300">
              預載頁數
            </label>
            <span class="text-2xl font-bold text-purple-400">
              {props.preloadPages}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="5"
            value={props.preloadPages}
            onInput={handleSliderChange}
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-colors"
          />

          <div class="flex justify-between text-xs text-slate-500">
            <span>0 頁 (關閉)</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5 頁 (最大)</span>
          </div>
        </div>

        {/* 預載狀態資訊 */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          {/* 快取頁面數 */}
          <div class="bg-slate-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <svg
                class="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span class="text-sm font-medium text-slate-300">快取頁面</span>
            </div>
            <p class="text-2xl font-bold text-blue-400">
              {props.cachedPagesCount}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              已預載 {props.cachedPagesCount} 頁資料
            </p>
          </div>

          {/* 預載頁面列表 */}
          <div class="bg-slate-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <svg
                class="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="text-sm font-medium text-slate-300">預載頁面</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              {props.preloadedPages.length > 0 ? (
                props.preloadedPages.map((page) => (
                  <span
                    key={page}
                    class="inline-flex items-center px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30"
                  >
                    #{page}
                  </span>
                ))
              ) : (
                <span class="text-xs text-slate-500">尚無預載頁面</span>
              )}
            </div>
          </div>
        </div>

        {/* 說明文字 */}
        <div class="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-sm text-purple-200 space-y-1">
              <p class="font-medium">運作原理</p>
              <ul class="list-disc list-inside text-xs text-purple-300 space-y-0.5">
                <li>初始載入時會預先載入設定的頁數</li>
                <li>滾動時顯示 300ms LoadingCard（平滑效果）</li>
                <li>同時從快取取出資料並預載下一批頁面</li>
                <li>設定為 0 時關閉預載（等同版本 1）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
