import { defineComponent } from 'vue'

export const DemoCard = defineComponent({
  name: 'DemoCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/50 p-6 border border-slate-200 dark:border-slate-700 transition-all">
        <div class="mb-4">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {props.title}
          </h3>
          {props.description && (
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              {props.description}
            </p>
          )}
        </div>
        <div>{slots.default?.()}</div>
      </div>
    )
  },
})
