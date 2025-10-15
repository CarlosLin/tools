/**
 * useWorkflow Hook
 * Dialog State Machine 實作
 * 用於管理複雜的多步驟 Dialog 流程
 */

import { ref } from 'vue'
import type {
  WorkflowDefinition,
  WorkflowController,
  WorkflowContext,
  WorkflowState,
  WorkflowFormState,
  WorkflowConfirmState,
  WorkflowLightboxState,
} from '../types'

/**
 * 創建一個 Workflow Controller
 *
 * @param definition - Workflow 定義
 * @param dialogAPI - Dialog API (confirm, form, lightbox, close)
 * @returns WorkflowController
 */
export function createWorkflow(
  definition: WorkflowDefinition,
  dialogAPI: {
    confirm: (config: any) => string
    form: (config: any) => string
    lightbox: (config: any) => string
    close: (id: string) => void
  }
): WorkflowController {
  // 當前狀態
  const currentState = ref<string | null>(null)

  // Workflow Context 儲存所有流程資料
  const context = ref<WorkflowContext>({})

  // 當前活動的 Dialog ID
  let currentDialogId: string | null = null

  /**
   * 解析值：支援靜態值或函數
   */
  const resolveValue = <T>(
    value: T | ((context: WorkflowContext) => T),
    ctx: WorkflowContext
  ): T => {
    return typeof value === 'function' ? (value as any)(ctx) : value
  }

  /**
   * 執行指定狀態
   */
  const executeState = (stateName: string) => {
    const state = definition.states[stateName]
    if (!state) {
      console.error(`[Workflow] State "${stateName}" not found`)
      return
    }

    currentState.value = stateName
    const ctx = context.value

    // 關閉之前的 dialog
    if (currentDialogId) {
      dialogAPI.close(currentDialogId)
    }

    // 根據 state type 執行對應的 dialog
    switch (state.type) {
      case 'form':
        executeFormState(state as WorkflowFormState)
        break
      case 'confirm':
        executeConfirmState(state as WorkflowConfirmState)
        break
      case 'lightbox':
        executeLightboxState(state as WorkflowLightboxState)
        break
    }
  }

  /**
   * 執行 Form State（支援多按鈕）
   */
  const executeFormState = (state: WorkflowFormState) => {
    const ctx = context.value

    // 將 Workflow actions 轉換為 FormModal actions 格式
    const actionEntries = Object.entries(state.actions)

    if (actionEntries.length === 0) {
      console.error('[Workflow] Form state must have at least one action')
      return
    }

    // 轉換為 FormModal 的 actions 格式
    const modalActions = actionEntries.map(([actionName, workflowAction]) => ({
      text: actionName,
      variant: workflowAction.variant || 'default',
      skipValidation: workflowAction.skipValidation,
      onClick: async (data: Record<string, any>) => {
        console.log('[Workflow] Form action clicked:', actionName, 'with data:', data)

        // 更新 context（合併表單資料）
        context.value = { ...context.value, ...data }
        console.log('[Workflow] Context updated:', context.value)

        // 執行 action
        if (workflowAction.action) {
          await workflowAction.action(data, context.value)
        }

        // 處理狀態轉換
        if (workflowAction.exit) {
          // 結束流程：如果有執行 action，表示是正常完成；否則是取消
          if (workflowAction.action) {
            // 有 action 執行 = 正常完成流程
            if (definition.onComplete) {
              definition.onComplete(context.value)
            }
          } else {
            // 沒有 action = 取消流程
            if (definition.onCancel) {
              definition.onCancel(context.value)
            }
          }
          currentState.value = null
          currentDialogId = null
        } else if (workflowAction.next) {
          // 跳轉到下一個狀態
          executeState(workflowAction.next)
        } else {
          // 預設：關閉但不調用任何回調（靜默關閉）
          currentState.value = null
          currentDialogId = null
        }
      },
    }))

    console.log('[Workflow] Creating form dialog with', modalActions.length, 'actions:', modalActions.map(a => a.text))

    currentDialogId = dialogAPI.form({
      title: resolveValue(state.title, ctx),
      description: resolveValue(state.description, ctx),
      fields: resolveValue(state.fields, ctx),
      size: state.size,
      actions: modalActions,
      // 提供一個 dummy onSubmit 避免錯誤（不會被調用，因為有 actions）
      onSubmit: () => {},
    })
  }

  /**
   * 執行 Confirm State（支援多按鈕）
   */
  const executeConfirmState = (state: WorkflowConfirmState) => {
    const ctx = context.value

    // 將 Workflow actions 轉換為 ConfirmModal actions 格式
    const actionEntries = Object.entries(state.actions)

    if (actionEntries.length === 0) {
      console.error('[Workflow] Confirm state must have at least one action')
      return
    }

    // 轉換為 ConfirmModal 的 actions 格式
    const modalActions = actionEntries.map(([actionName, workflowAction]) => ({
      text: actionName,
      variant: workflowAction.variant || 'default',
      onClick: async () => {
        console.log('[Workflow] Action clicked:', actionName, workflowAction)
        // 執行 action
        if (workflowAction.action) {
          await workflowAction.action(context.value)
        }

        // 處理狀態轉換
        if (workflowAction.exit) {
          // 結束流程：如果有執行 action，表示是正常完成；否則是取消
          if (workflowAction.action) {
            // 有 action 執行 = 正常完成流程
            if (definition.onComplete) {
              definition.onComplete(context.value)
            }
          } else {
            // 沒有 action = 取消流程
            if (definition.onCancel) {
              definition.onCancel(context.value)
            }
          }
          currentState.value = null
          currentDialogId = null
        } else if (workflowAction.next) {
          // 跳轉到下一個狀態
          executeState(workflowAction.next)
        } else {
          // 預設：關閉但不調用任何回調（靜默關閉）
          currentState.value = null
          currentDialogId = null
        }
      },
    }))

    console.log('[Workflow] Creating confirm dialog with', modalActions.length, 'actions:', modalActions.map(a => a.text))

    currentDialogId = dialogAPI.confirm({
      title: resolveValue(state.title, ctx),
      description: resolveValue(state.description, ctx),
      size: state.size,
      actions: modalActions,
      // 提供一個 dummy onConfirm 避免錯誤（不會被調用，因為有 actions）
      onConfirm: () => {},
    })
  }

  /**
   * 執行 Lightbox State
   */
  const executeLightboxState = (state: WorkflowLightboxState) => {
    const ctx = context.value

    currentDialogId = dialogAPI.lightbox({
      images: resolveValue(state.images, ctx),
      currentIndex: state.currentIndex || 0,
      // Lightbox 關閉時的處理
      // TODO: 需要在 DialogContainer 中處理 lightbox 關閉後的狀態轉換
    })

    // Lightbox 通常是查看後關閉，所以直接處理 next
    if (state.next) {
      // 注意：這裡可能需要更好的處理方式
      // 暫時在創建 lightbox 後立即轉換到下一個狀態
      setTimeout(() => {
        if (state.next) {
          executeState(state.next)
        } else {
          exit()
        }
      }, 0)
    }
  }

  /**
   * 結束流程
   */
  const exit = () => {
    if (currentDialogId) {
      dialogAPI.close(currentDialogId)
    }

    if (definition.onComplete) {
      definition.onComplete(context.value)
    }

    currentState.value = null
    currentDialogId = null
  }

  /**
   * 啟動流程
   */
  const start = () => {
    context.value = {}
    executeState(definition.start)
  }

  /**
   * 跳轉到指定狀態
   */
  const goTo = (stateName: string) => {
    executeState(stateName)
  }

  /**
   * 更新 context
   */
  const updateContext = (updates: Partial<WorkflowContext>) => {
    context.value = { ...context.value, ...updates }
  }

  /**
   * 獲取當前 context
   */
  const getContext = (): WorkflowContext => {
    return { ...context.value }
  }

  return {
    start,
    goTo,
    updateContext,
    getContext,
    exit,
    currentState,
  }
}
