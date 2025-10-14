import type { ValidationRule, PasswordStrength } from '../types'
import { EMAIL_REGEX, PASSWORD_REQUIREMENTS, VALIDATION_MESSAGES, PASSWORD_STRENGTH_CONFIG } from '../constants'

/**
 * Validate a single field value against a rule
 */
export function validateRule(value: string, rule: ValidationRule): string {
  switch (rule.type) {
    case 'required':
      return value.trim() === '' ? rule.message : ''

    case 'email':
      return !EMAIL_REGEX.test(value) ? rule.message : ''

    case 'minLength':
      return value.length < (rule.value as number) ? rule.message : ''

    case 'maxLength':
      return value.length > (rule.value as number) ? rule.message : ''

    case 'pattern':
      return !(rule.value as RegExp).test(value) ? rule.message : ''

    case 'custom':
      return rule.validator && !rule.validator(value) ? rule.message : ''

    default:
      return ''
  }
}

/**
 * Validate a field value against all its rules
 */
export function validateField(value: string, rules: ValidationRule[]): string {
  for (const rule of rules) {
    const error = validateRule(value, rule)
    if (error) {
      return error
    }
  }
  return ''
}

/**
 * Calculate password strength based on various criteria
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '',
      suggestions: [
        { text: '請輸入密碼', completed: false },
      ],
    }
  }

  let score = 0
  const suggestions: Array<{ text: string; completed: boolean }> = []

  // Length check
  const hasMinLength = password.length >= PASSWORD_REQUIREMENTS.minLength
  if (hasMinLength) {
    score += 1
  }
  suggestions.push({
    text: `至少需要 ${PASSWORD_REQUIREMENTS.minLength} 個字元`,
    completed: hasMinLength,
  })

  // Uppercase check
  const hasUppercase = /[A-Z]/.test(password)
  if (hasUppercase) {
    score += 1
  }
  if (PASSWORD_REQUIREMENTS.requireUppercase) {
    suggestions.push({
      text: '加入大寫字母',
      completed: hasUppercase,
    })
  }

  // Lowercase check
  const hasLowercase = /[a-z]/.test(password)
  if (hasLowercase) {
    score += 1
  }
  if (PASSWORD_REQUIREMENTS.requireLowercase) {
    suggestions.push({
      text: '加入小寫字母',
      completed: hasLowercase,
    })
  }

  // Number check
  const hasNumber = /\d/.test(password)
  if (hasNumber) {
    score += 1
  }
  if (PASSWORD_REQUIREMENTS.requireNumber) {
    suggestions.push({
      text: '加入數字',
      completed: hasNumber,
    })
  }

  // Special character check
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  if (hasSpecial) {
    score += 1
  }
  if (PASSWORD_REQUIREMENTS.requireSpecial) {
    suggestions.push({
      text: '加入特殊字元',
      completed: hasSpecial,
    })
  }

  // Determine strength level
  let config
  let label

  if (score <= 1) {
    config = PASSWORD_STRENGTH_CONFIG.weak
    label = config.label
  } else if (score === 2) {
    config = PASSWORD_STRENGTH_CONFIG.fair
    label = config.label
  } else if (score === 3) {
    config = PASSWORD_STRENGTH_CONFIG.good
    label = config.label
  } else if (score === 4) {
    config = PASSWORD_STRENGTH_CONFIG.strong
    label = config.label
  } else {
    config = PASSWORD_STRENGTH_CONFIG.veryStrong
    label = config.label
  }

  return {
    score: Math.min(score, 4),
    label,
    color: config.color,
    suggestions,
  }
}

/**
 * Create validation rules for common field types
 */
export function createEmailRules(): ValidationRule[] {
  return [
    {
      type: 'required',
      message: VALIDATION_MESSAGES.required,
    },
    {
      type: 'email',
      message: VALIDATION_MESSAGES.email,
    },
  ]
}

export function createPasswordRules(): ValidationRule[] {
  return [
    {
      type: 'required',
      message: VALIDATION_MESSAGES.required,
    },
    {
      type: 'minLength',
      value: PASSWORD_REQUIREMENTS.minLength,
      message: VALIDATION_MESSAGES.minLength(PASSWORD_REQUIREMENTS.minLength),
    },
    {
      type: 'custom',
      message: VALIDATION_MESSAGES.password,
      validator: (value: string) => {
        const hasUppercase = /[A-Z]/.test(value)
        const hasLowercase = /[a-z]/.test(value)
        const hasNumber = /\d/.test(value)
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)

        return hasUppercase && hasLowercase && hasNumber && hasSpecial
      },
    },
  ]
}

export function createRequiredRule(message?: string): ValidationRule {
  return {
    type: 'required',
    message: message || VALIDATION_MESSAGES.required,
  }
}

export function createMinLengthRule(length: number): ValidationRule {
  return {
    type: 'minLength',
    value: length,
    message: VALIDATION_MESSAGES.minLength(length),
  }
}

export function createMaxLengthRule(length: number): ValidationRule {
  return {
    type: 'maxLength',
    value: length,
    message: VALIDATION_MESSAGES.maxLength(length),
  }
}
