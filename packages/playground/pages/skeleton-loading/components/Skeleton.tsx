import { defineComponent, computed, type PropType, type CSSProperties } from 'vue'

export const Skeleton = defineComponent({
  name: 'Skeleton',
  props: {
    variant: {
      type: String as PropType<'text' | 'circular' | 'rectangular' | 'rounded'>,
      default: 'text',
    },
    width: {
      type: [String, Number],
      default: undefined,
    },
    height: {
      type: [String, Number],
      default: undefined,
    },
    animation: {
      type: String as PropType<'pulse' | 'wave' | 'none'>,
      default: 'pulse',
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const variantClasses = {
      text: 'h-4 rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
    }

    const animationClasses = {
      pulse: 'animate-pulse bg-slate-700',
      wave: 'animate-shimmer bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%]',
      none: 'bg-slate-700',
    }

    const style = computed<CSSProperties>(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    }))

    const classes = computed(() =>
      `${variantClasses[props.variant]} ${animationClasses[props.animation]} ${props.className}`
    )

    return () => (
      <div class={classes.value} style={style.value} />
    )
  },
})
