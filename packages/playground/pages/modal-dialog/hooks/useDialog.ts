/**
 * useDialog Hook
 * 全局 Dialog 狀態管理
 * 類似 Toast 的集中式管理方式
 */

import { ref } from 'vue'
import type {
  Dialog,
  UseDialogReturn,
  ConfirmDialogConfig,
  FormDialogConfig,
  LightboxDialogConfig,
  WorkflowDefinition,
  WorkflowController,
} from '../types'
import { createWorkflow } from './useWorkflow'

/**
 * 全局 Dialog 狀態
 */
const dialogs = ref<Dialog[]>([])

/**
 * Dialog ID 計數器
 */
let dialogId = 0

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `dialog-${Date.now()}-${dialogId++}`
}

/**
 * Global Dialog Management Hook
 * 提供集中式的對話框管理，無需在每個頁面 import 組件
 */
export function useDialog(): UseDialogReturn {
  /**
   * 打開確認對話框
   */
  const confirm = (config: Omit<ConfirmDialogConfig, 'type'>): string => {
    const id = generateId()
    const dialog: Dialog = {
      type: 'confirm',
      ...config,
      id,
    }
    dialogs.value.push(dialog)
    return id
  }

  /**
   * 打開表單對話框
   */
  const form = (config: Omit<FormDialogConfig, 'type'>): string => {
    const id = generateId()
    const dialog: Dialog = {
      type: 'form',
      ...config,
      id,
    }
    dialogs.value.push(dialog)
    return id
  }

  /**
   * 打開圖片燈箱
   */
  const lightbox = (config: Omit<LightboxDialogConfig, 'type'>): string => {
    const id = generateId()
    const dialog: Dialog = {
      type: 'lightbox',
      ...config,
      id,
    }
    dialogs.value.push(dialog)
    return id
  }

  /**
   * 關閉指定 Dialog
   */
  const close = (id: string) => {
    const index = dialogs.value.findIndex((d) => d.id === id)
    if (index !== -1) {
      dialogs.value.splice(index, 1)
    }
  }

  /**
   * 關閉所有 Dialog
   */
  const closeAll = () => {
    dialogs.value = []
  }

  /**
   * 創建一個 Workflow（State Machine）
   * 用於管理複雜的多步驟 Dialog 流程
   */
  const createWorkflowInstance = (definition: WorkflowDefinition): WorkflowController => {
    return createWorkflow(definition, {
      confirm,
      form,
      lightbox,
      close,
    })
  }

  return {
    dialogs,
    confirm,
    form,
    lightbox,
    close,
    closeAll,
    createWorkflow: createWorkflowInstance,
  }
}
