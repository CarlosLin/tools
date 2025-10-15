/**
 * DialogContainer Component
 * 集中管理和渲染所有 Dialog
 * 根據 dialog.type 動態選擇對應的組件
 */

import { defineComponent, type PropType } from "vue";
import type {
  Dialog,
  ConfirmDialogConfig,
  FormDialogConfig,
  LightboxDialogConfig,
} from "../types";
import ConfirmModal from "./ConfirmModal";
import FormModal from "./FormModal";
import LightboxModal from "./LightboxModal";

export default defineComponent({
  name: "DialogContainer",
  props: {
    dialogs: {
      type: Array as PropType<Dialog[]>,
      required: true,
    },
    onClose: {
      type: Function as PropType<(id: string) => void>,
      required: true,
    },
  },
  setup(props) {
    const handleClose = (id: string) => {
      props.onClose(id);
    };

    return () => {
      if (props.dialogs.length === 0) return null;

      return (
        <>
          {props.dialogs.map((dialog) => {
            const isOpen = true; // Dialog 在列表中即表示開啟
            const onOpenChange = (open: boolean) => {
              if (!open) handleClose(dialog.id);
            };

            // 根據 type 渲染對應的 Dialog 組件
            // 使用類型斷言來確保 TypeScript 正確推斷類型
            switch (dialog.type) {
              case "confirm": {
                const confirmDialog = dialog as Dialog & ConfirmDialogConfig;
                return (
                  <ConfirmModal
                    key={confirmDialog.id}
                    open={isOpen}
                    onOpenChange={onOpenChange}
                    title={confirmDialog.title}
                    description={confirmDialog.description}
                    variant={confirmDialog.variant}
                    confirmText={confirmDialog.confirmText}
                    cancelText={confirmDialog.cancelText}
                    size={confirmDialog.size}
                    actions={confirmDialog.actions}
                    onConfirm={async () => {
                      await confirmDialog.onConfirm();
                      handleClose(confirmDialog.id);
                    }}
                    onCancel={() => {
                      confirmDialog.onCancel?.();
                      handleClose(confirmDialog.id);
                    }}
                  />
                );
              }

              case "form": {
                const formDialog = dialog as Dialog & FormDialogConfig;
                return (
                  <FormModal
                    key={formDialog.id}
                    open={isOpen}
                    onOpenChange={onOpenChange}
                    title={formDialog.title}
                    fields={formDialog.fields}
                    submitText={formDialog.submitText}
                    cancelText={formDialog.cancelText}
                    size={formDialog.size}
                    actions={formDialog.actions}
                    onSubmit={async (data) => {
                      await formDialog.onSubmit(data);
                      handleClose(formDialog.id);
                    }}
                    onCancel={formDialog.onCancel}
                  />
                );
              }

              case "lightbox": {
                const lightboxDialog = dialog as Dialog & LightboxDialogConfig;
                return (
                  <LightboxModal
                    key={lightboxDialog.id}
                    open={isOpen}
                    onOpenChange={onOpenChange}
                    images={lightboxDialog.images}
                    currentIndex={lightboxDialog.currentIndex}
                    onIndexChange={lightboxDialog.onIndexChange}
                  />
                );
              }

              default:
                return null;
            }
          })}
        </>
      );
    };
  },
});
