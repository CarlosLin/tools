/**
 * Modal & Dialog Types
 * 定義各種彈窗的型別
 */

import type { Ref } from 'vue'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type ModalVariant = 'default' | 'danger' | 'success' | 'warning'

export type DialogType = 'confirm' | 'form' | 'lightbox'

export interface BaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  size?: ModalSize
}

/**
 * Confirm Modal Button Action
 * 定義 Confirm Modal 的按鈕動作
 */
export interface ConfirmModalAction {
  text: string
  variant?: ModalVariant
  onClick: () => void | Promise<void>
}

/**
 * Form Modal Button Action
 * 定義 Form Modal 的按鈕動作（會接收表單資料）
 */
export interface FormModalAction {
  text: string
  variant?: ModalVariant
  onClick: (data: Record<string, any>) => void | Promise<void>
  /** 是否在執行前驗證表單（預設 true） */
  skipValidation?: boolean
}

export interface ConfirmModalProps extends BaseModalProps {
  variant?: ModalVariant
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  /** 多按鈕配置（可選，會覆蓋 confirmText/cancelText） */
  actions?: ConfirmModalAction[]
}

export interface FormModalProps extends BaseModalProps {
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  fields: FormField[]
  submitText?: string
  cancelText?: string
  loading?: boolean
  onCancel?: () => void
  /** 多按鈕配置（可選，會覆蓋 submitText/cancelText） */
  actions?: FormModalAction[]
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number'
  placeholder?: string
  required?: boolean
  options?: Array<{ label: string; value: string }>
  defaultValue?: string | number
  validation?: (value: any) => string | undefined
}

export interface LightboxModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: string[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

/**
 * 全局 Dialog 配置 - Confirm Dialog
 */
export interface ConfirmDialogConfig {
  type: 'confirm'
  title?: string
  description?: string
  variant?: ModalVariant
  confirmText?: string
  cancelText?: string
  size?: ModalSize
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  /** 多按鈕配置（可選，會覆蓋 confirmText/cancelText） */
  actions?: ConfirmModalAction[]
}

/**
 * 全局 Dialog 配置 - Form Dialog
 */
export interface FormDialogConfig {
  type: 'form'
  title?: string
  description?: string
  fields: FormField[]
  submitText?: string
  cancelText?: string
  size?: ModalSize
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  onCancel?: () => void
  /** 多按鈕配置（可選，會覆蓋 submitText/cancelText） */
  actions?: FormModalAction[]
}

/**
 * 全局 Dialog 配置 - Lightbox Dialog
 */
export interface LightboxDialogConfig {
  type: 'lightbox'
  images: string[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

/**
 * Dialog 聯合類型
 */
export type DialogConfig = ConfirmDialogConfig | FormDialogConfig | LightboxDialogConfig

/**
 * Dialog 實例（帶 ID）
 */
export type Dialog = (ConfirmDialogConfig | FormDialogConfig | LightboxDialogConfig) & {
  id: string
}

/**
 * useDialog Hook 返回值
 */
export interface UseDialogReturn {
  dialogs: Ref<Dialog[]>
  confirm: (config: Omit<ConfirmDialogConfig, 'type'>) => string
  form: (config: Omit<FormDialogConfig, 'type'>) => string
  lightbox: (config: Omit<LightboxDialogConfig, 'type'>) => string
  close: (id: string) => void
  closeAll: () => void
  createWorkflow: (definition: WorkflowDefinition) => WorkflowController
}


// ==================== Workflow System Types ====================

/**
 * Workflow Context - 儲存流程中的所有資料
 */
export interface WorkflowContext {
  [key: string]: any
}

/**
 * Workflow Action - 定義狀態轉換的動作
 */
export interface WorkflowAction {
  /** 下一個狀態的名稱 */
  next?: string
  /** 是否結束流程 */
  exit?: boolean
  /** 執行的動作函數 */
  action?: (context: WorkflowContext) => void | Promise<void>
  /** 按鈕樣式變體 */
  variant?: ModalVariant
}

/**
 * Workflow Form Action - 定義 Form 按鈕的動作
 *
 * @description
 * Form 的按鈕永遠會收到表單資料，驗證規則由 FormField 的 validation 和 required 決定
 */
export interface WorkflowFormAction {
  /** 下一個狀態的名稱 */
  next?: string
  /** 是否結束流程 */
  exit?: boolean
  /** 執行的動作函數（永遠收到表單資料和 context） */
  action?: (data: Record<string, any>, context: WorkflowContext) => void | Promise<void>
  /** 按鈕樣式變體 */
  variant?: ModalVariant
  /** 是否在執行前驗證表單（預設 true，取消按鈕通常設為 false） */
  skipValidation?: boolean
}

/**
 * Workflow State - Form 類型狀態
 */
export interface WorkflowFormState {
  type: 'form'
  title?: string | ((context: WorkflowContext) => string)
  description?: string | ((context: WorkflowContext) => string)
  fields: FormField[] | ((context: WorkflowContext) => FormField[])
  size?: ModalSize
  /** 多按鈕配置，key 為按鈕文字，value 為動作 */
  actions: Record<string, WorkflowFormAction>
}

/**
 * Workflow State - Confirm 類型狀態（支援多按鈕）
 */
export interface WorkflowConfirmState {
  type: 'confirm'
  title?: string | ((context: WorkflowContext) => string)
  description?: string | ((context: WorkflowContext) => string)
  size?: ModalSize
  /** 多按鈕配置，key 為按鈕文字，value 為動作 */
  actions: Record<string, WorkflowAction>
}

/**
 * Workflow State - Lightbox 類型狀態
 */
export interface WorkflowLightboxState {
  type: 'lightbox'
  images: string[] | ((context: WorkflowContext) => string[])
  currentIndex?: number
  /** 下一個狀態 */
  next?: string
}

/**
 * Workflow State 聯合類型
 */
export type WorkflowState = WorkflowFormState | WorkflowConfirmState | WorkflowLightboxState

/**
 * Workflow Definition - 完整的流程定義
 */
export interface WorkflowDefinition {
  /** 所有狀態定義 */
  states: Record<string, WorkflowState>
  /** 起始狀態名稱 */
  start: string
  /** 流程結束時的回調（可選） */
  onComplete?: (context: WorkflowContext) => void
  /** 流程取消時的回調（可選） */
  onCancel?: (context: WorkflowContext) => void
}

/**
 * Workflow Controller - 控制流程執行
 */
export interface WorkflowController {
  /** 啟動流程 */
  start: () => void
  /** 跳轉到指定狀態 */
  goTo: (stateName: string) => void
  /** 更新 context */
  updateContext: (updates: Partial<WorkflowContext>) => void
  /** 獲取當前 context */
  getContext: () => WorkflowContext
  /** 結束流程 */
  exit: () => void
  /** 當前狀態名稱 */
  currentState: Ref<string | null>
}
