import { defineComponent, type PropType } from 'vue'
import type { UserCardData } from '../types'

export const UserCard = defineComponent({
  name: 'UserCard',
  props: {
    user: {
      type: Object as PropType<UserCardData>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="border border-slate-700 rounded-lg p-6 space-y-4 bg-slate-800">
        {/* Header with Avatar */}
        <div class="flex items-center gap-4">
          <img
            src={props.user.avatar}
            alt={props.user.name}
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-white">
              {props.user.name}
            </h3>
            <p class="text-sm text-slate-400">
              {props.user.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p class="text-slate-300">
          {props.user.bio}
        </p>

        {/* Actions */}
        <div class="flex gap-2 pt-2">
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Follow
          </button>
          <button class="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white">
            Message
          </button>
        </div>
      </div>
    )
  },
})
