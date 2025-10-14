export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  message: string
  value?: number | string | RegExp
  validator?: (value: string) => boolean
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'password'
  placeholder?: string
  rules: ValidationRule[]
}

export interface FieldState {
  value: string
  error: string
  touched: boolean
  dirty: boolean
}

export interface FormState {
  [key: string]: FieldState
}

export interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  suggestions: Array<{
    text: string
    completed: boolean
  }>
}
