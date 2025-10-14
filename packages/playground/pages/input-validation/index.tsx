import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormValidation } from './hooks/useFormValidation'
import ValidationInput from './components/ValidationInput'
import PasswordStrengthMeter from './components/PasswordStrengthMeter'
import { createEmailRules, createPasswordRules, createRequiredRule, createMinLengthRule } from './utils/validators'
import { calculatePasswordStrength } from './utils/validators'
import type { FieldConfig } from './types'

export default defineComponent({
  name: 'InputValidation',
  setup() {
    const router = useRouter()
    const showSuccessMessage = ref(false)

    // Define form fields
    const formFields: FieldConfig[] = [
      {
        name: 'username',
        label: '使用者名稱',
        type: 'text',
        placeholder: '請輸入使用者名稱',
        rules: [
          createRequiredRule(),
          createMinLengthRule(3),
        ],
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: '請輸入 Email',
        rules: createEmailRules(),
      },
      {
        name: 'password',
        label: '密碼',
        type: 'password',
        placeholder: '請輸入密碼',
        rules: createPasswordRules(),
      },
      {
        name: 'confirmPassword',
        label: '確認密碼',
        type: 'password',
        placeholder: '請再次輸入密碼',
        rules: [
          createRequiredRule(),
          {
            type: 'custom',
            message: '密碼不一致',
            validator: (value: string) => {
              return value === formState.password.value
            },
          },
        ],
      },
    ]

    // Use form validation hook
    const {
      formState,
      isFormValid,
      isFormDirty,
      setFieldValue,
      setFieldTouched,
      handleSubmit,
      resetForm,
    } = useFormValidation(formFields)

    // Calculate password strength
    const passwordStrength = computed(() => {
      return calculatePasswordStrength(formState.password.value)
    })

    // Handle form submission
    const onSubmit = (values: Record<string, string>) => {
      console.log('Form submitted:', values)
      showSuccessMessage.value = true

      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccessMessage.value = false
        resetForm()
      }, 3000)
    }

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div class="container mx-auto px-4 py-16 max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
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
              Input Validation
            </h1>
            <p class="text-slate-300 text-lg">
              表單驗證功能 - Email、密碼強度、即時驗證
            </p>
          </div>

          {/* Form */}
          <div class="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <form onSubmit={handleSubmit(onSubmit)} class="space-y-6">
              {/* Username Field */}
              <ValidationInput
                label="使用者名稱"
                name="username"
                type="text"
                placeholder="請輸入使用者名稱 (至少 3 個字元)"
                fieldState={formState.username}
                onValueChange={(value) => setFieldValue('username', value)}
                onBlur={() => setFieldTouched('username')}
              />

              {/* Email Field */}
              <ValidationInput
                label="Email"
                name="email"
                type="email"
                placeholder="example@email.com"
                fieldState={formState.email}
                onValueChange={(value) => setFieldValue('email', value)}
                onBlur={() => setFieldTouched('email')}
              />

              {/* Password Field */}
              <div class="space-y-3">
                <ValidationInput
                  label="密碼"
                  name="password"
                  type="password"
                  placeholder="請輸入密碼 (至少 8 個字元)"
                  fieldState={formState.password}
                  onValueChange={(value) => setFieldValue('password', value)}
                  onBlur={() => setFieldTouched('password')}
                />

                {/* Password Strength Meter */}
                <PasswordStrengthMeter
                  strength={passwordStrength.value}
                  password={formState.password.value}
                />
              </div>

              {/* Confirm Password Field */}
              <ValidationInput
                label="確認密碼"
                name="confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                fieldState={formState.confirmPassword}
                onValueChange={(value) => setFieldValue('confirmPassword', value)}
                onBlur={() => setFieldTouched('confirmPassword')}
              />

              {/* Success Message */}
              {showSuccessMessage.value && (
                <div class="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in">
                  <svg
                    class="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div>
                    <p class="text-green-400 font-semibold">表單提交成功！</p>
                    <p class="text-green-300 text-sm">所有欄位驗證通過</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid.value || !isFormDirty.value}
                  class={`
                    flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                    ${
                      isFormValid.value && isFormDirty.value
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  提交表單
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={!isFormDirty.value}
                  class={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200
                    ${
                      isFormDirty.value
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  重置
                </button>
              </div>
            </form>
          </div>

          {/* Features List */}
          <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: '✓',
                title: '即時驗證',
                description: '輸入時立即檢查格式',
              },
              {
                icon: '📧',
                title: 'Email 驗證',
                description: '確保 Email 格式正確',
              },
              {
                icon: '🔒',
                title: '密碼強度檢測',
                description: '視覺化密碼安全等級',
              },
              {
                icon: '🎨',
                title: '友善提示',
                description: '清楚的錯誤和成功訊息',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                class="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <span class="text-2xl">{feature.icon}</span>
                <div>
                  <h3 class="font-semibold text-white mb-1">{feature.title}</h3>
                  <p class="text-sm text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
