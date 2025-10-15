import { defineComponent, type PropType } from 'vue'
import { Skeleton } from './Skeleton'

export const SkeletonCard = defineComponent({
  name: 'SkeletonCard',
  props: {
    hasAvatar: {
      type: Boolean,
      default: true,
    },
    lines: {
      type: Number,
      default: 3,
    },
    animation: {
      type: String as PropType<'pulse' | 'wave' | 'none'>,
      default: 'pulse',
    },
  },
  setup(props) {
    return () => (
      <div class="border border-slate-700 rounded-lg p-6 space-y-4 bg-slate-800">
        {/* Header with Avatar */}
        {props.hasAvatar && (
          <div class="flex items-center gap-4">
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              animation={props.animation}
            />
            <div class="flex-1 space-y-2">
              <Skeleton width="60%" height={16} animation={props.animation} />
              <Skeleton width="40%" height={14} animation={props.animation} />
            </div>
          </div>
        )}

        {/* Content Lines */}
        <div class="space-y-2">
          {Array.from({ length: props.lines }).map((_, index) => (
            <Skeleton
              key={index}
              width={index === props.lines - 1 ? '80%' : '100%'}
              animation={props.animation}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div class="flex gap-2 pt-2">
          <Skeleton width={80} height={32} variant="rounded" animation={props.animation} />
          <Skeleton width={80} height={32} variant="rounded" animation={props.animation} />
        </div>
      </div>
    )
  },
})
