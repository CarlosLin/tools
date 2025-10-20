import { defineComponent } from 'vue'

export const LoadingCard = defineComponent({
  name: 'LoadingCard',
  setup() {
    return () => (
      <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse">
        {/* 圖片骨架 */}
        <div class="h-48 bg-slate-700" />

        {/* 內容骨架 */}
        <div class="p-6 space-y-3">
          {/* 標題骨架 */}
          <div class="space-y-2">
            <div class="h-6 bg-slate-700 rounded w-3/4" />
            <div class="h-6 bg-slate-700 rounded w-1/2" />
          </div>

          {/* 摘要骨架 */}
          <div class="space-y-2 pt-2">
            <div class="h-4 bg-slate-700 rounded w-full" />
            <div class="h-4 bg-slate-700 rounded w-5/6" />
          </div>

          {/* Meta 資訊骨架 */}
          <div class="flex items-center justify-between pt-3 border-t border-slate-700">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-slate-700" />
              <div class="space-y-1">
                <div class="h-4 bg-slate-700 rounded w-20" />
                <div class="h-3 bg-slate-700 rounded w-16" />
              </div>
            </div>

            <div class="h-4 bg-slate-700 rounded w-16" />
          </div>
        </div>
      </div>
    )
  },
})
