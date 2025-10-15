import { defineComponent, ref } from 'vue'
import { Skeleton } from './components/Skeleton'
import { SkeletonCard } from './components/SkeletonCard'
import { UserCard } from './components/UserCard'
import { useSkeletonLoading } from './hooks/useSkeletonLoading'
import type { UserCardData } from './types'

const mockUsers: UserCardData[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Frontend developer passionate about creating beautiful user interfaces and seamless user experiences.',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Full-stack engineer who loves solving complex problems with elegant solutions.',
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'UX designer focused on accessibility and inclusive design principles.',
  },
]

export default defineComponent({
  name: 'SkeletonLoadingPage',
  setup() {
    const router = useRouter()

    useHead({
      title: 'Skeleton Loading - Feature Playground',
      meta: [
        {
          name: 'description',
          content: 'Elegant loading states for better user experience',
        },
      ],
    })

    const animationType = ref<'pulse' | 'wave' | 'none'>('pulse')
    const { isLoading, reload } = useSkeletonLoading(2000)

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4">
        <div class="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
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
            <h1 class="text-4xl font-bold text-white">
              Skeleton Loading
            </h1>
            <p class="text-slate-300">
              Elegant loading states for better user experience
            </p>
          </div>

          {/* Controls */}
          <div class="bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-700 space-y-4">
            <div class="flex flex-wrap gap-4 items-center justify-between">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">
                  Animation Type
                </label>
                <div class="flex gap-2">
                  {(['pulse', 'wave', 'none'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => (animationType.value = type)}
                      class={
                        animationType.value === type
                          ? 'px-4 py-2 rounded-lg bg-blue-500 text-white transition-colors'
                          : 'px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors'
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={reload}
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Reload Demo
              </button>
            </div>
          </div>

          {/* Skeleton Variants Demo */}
          <div class="bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-700 space-y-6">
            <h2 class="text-2xl font-semibold text-white">
              Skeleton Variants
            </h2>

            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-slate-300 mb-2">
                  Text
                </p>
                <Skeleton width="100%" animation={animationType.value} />
                <Skeleton width="80%" animation={animationType.value} className="mt-2" />
                <Skeleton width="60%" animation={animationType.value} className="mt-2" />
              </div>

              <div>
                <p class="text-sm font-medium text-slate-300 mb-2">
                  Circular (Avatar)
                </p>
                <div class="flex gap-4">
                  <Skeleton variant="circular" width={40} height={40} animation={animationType.value} />
                  <Skeleton variant="circular" width={64} height={64} animation={animationType.value} />
                  <Skeleton variant="circular" width={80} height={80} animation={animationType.value} />
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-slate-300 mb-2">
                  Rectangular & Rounded
                </p>
                <div class="grid grid-cols-2 gap-4">
                  <Skeleton variant="rectangular" height={120} animation={animationType.value} />
                  <Skeleton variant="rounded" height={120} animation={animationType.value} />
                </div>
              </div>
            </div>
          </div>

          {/* User Cards Demo */}
          <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-white">
              Real-world Example: User Cards
            </h2>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading.value ? (
                <>
                  <SkeletonCard animation={animationType.value} />
                  <SkeletonCard animation={animationType.value} />
                  <SkeletonCard animation={animationType.value} />
                </>
              ) : (
                mockUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              )}
            </div>
          </div>

          {/* Usage Info */}
          <div class="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
            <h3 class="font-semibold text-blue-100 mb-2">
              💡 Usage Tips
            </h3>
            <ul class="text-blue-200 space-y-2 text-sm">
              <li>• Use skeleton screens instead of spinners for better perceived performance</li>
              <li>• Match skeleton shapes to actual content layout</li>
              <li>• Choose animation type based on your design system</li>
              <li>• Pulse animation is more subtle, wave is more engaging</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
})
