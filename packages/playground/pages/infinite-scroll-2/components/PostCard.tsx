import { defineComponent, type PropType } from 'vue'
import type { Post } from '../types'

export const PostCard = defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all hover:scale-[1.02] group">
        {/* 圖片 */}
        <div class="relative h-48 overflow-hidden bg-slate-700">
          <img
            src={props.post.imageUrl}
            alt={props.post.title}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div class="absolute top-3 right-3">
            <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
              {props.post.category}
            </span>
          </div>
        </div>

        {/* 內容 */}
        <div class="p-6 space-y-3">
          <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {props.post.title}
          </h3>

          <p class="text-slate-400 text-sm line-clamp-2">
            {props.post.excerpt}
          </p>

          {/* Meta 資訊 */}
          <div class="flex items-center justify-between pt-3 border-t border-slate-700">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {props.post.author.charAt(0)}
              </div>
              <div class="text-sm">
                <p class="text-white font-medium">{props.post.author}</p>
                <p class="text-slate-500 text-xs">{props.post.date}</p>
              </div>
            </div>

            <div class="flex items-center gap-1 text-slate-400 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{props.post.readTime} 分鐘</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
