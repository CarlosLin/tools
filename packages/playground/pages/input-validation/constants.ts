export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
}

export const VALIDATION_MESSAGES = {
  required: '此欄位為必填',
  email: '請輸入有效的 Email 地址',
  minLength: (length: number) => `至少需要 ${length} 個字元`,
  maxLength: (length: number) => `不能超過 ${length} 個字元`,
  password: '密碼必須包含大小寫字母、數字和特殊字元',
}

export const PASSWORD_STRENGTH_CONFIG = {
  weak: {
    label: '弱',
    color: 'bg-red-500',
    textColor: 'text-red-500',
  },
  fair: {
    label: '普通',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
  },
  good: {
    label: '良好',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
  },
  strong: {
    label: '強',
    color: 'bg-green-500',
    textColor: 'text-green-500',
  },
  veryStrong: {
    label: '非常強',
    color: 'bg-green-600',
    textColor: 'text-green-600',
  },
}
