/**
 * Modal & Dialog Demo Page
 * 展示各種彈窗功能
 */

import { defineComponent } from "vue";
import { useDialog } from "./hooks/useDialog";
import DialogContainer from "./components/DialogContainer";
import type { FormField } from "./types";

export default defineComponent({
  name: "ModalDialogPage",
  setup() {
    const router = useRouter();
    useHead({
      title: "Modal & Dialog - Match Program",
      meta: [
        {
          name: "description",
          content: "彈窗管理 - 確認框、表單彈窗、圖片燈箱",
        },
      ],
    });

    // 使用 useDialog hook
    const dialog = useDialog();

    // Form fields configuration
    const formFields: FormField[] = [
      {
        name: "username",
        label: "用戶名",
        type: "text",
        placeholder: "請輸入用戶名",
        required: true,
        validation: (value) => {
          if (value.length < 3) {
            return "用戶名至少需要 3 個字符";
          }
        },
      },
      {
        name: "email",
        label: "電子郵件",
        type: "email",
        placeholder: "example@email.com",
        required: true,
        validation: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return "請輸入有效的電子郵件";
          }
        },
      },
      {
        name: "role",
        label: "角色",
        type: "select",
        required: true,
        options: [
          { label: "管理員", value: "admin" },
          { label: "編輯", value: "editor" },
          { label: "訪客", value: "viewer" },
        ],
      },
      {
        name: "bio",
        label: "個人簡介",
        type: "textarea",
        placeholder: "介紹一下自己...",
      },
    ];

    // Sample images for lightbox
    const sampleImages = [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    ];

    // Handlers
    const handleConfirm = async () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Confirmed!");
          resolve();
        }, 1000);
      });
    };

    const handleFormSubmit = async (data: Record<string, any>) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("Form submitted:", data);
          resolve();
        }, 1000);
      });
    };

    // Dialog 處理函數
    const showConfirm = () => {
      dialog.confirm({
        title: "確認操作",
        description: "您確定要執行此操作嗎？",
        variant: "default",
        onConfirm: handleConfirm,
      });
    };

    const showDanger = () => {
      dialog.confirm({
        title: "危險操作",
        description: "此操作將永久刪除數據，且無法恢復。",
        variant: "danger",
        confirmText: "確認刪除",
        onConfirm: handleConfirm,
      });
    };

    const showSuccess = () => {
      dialog.confirm({
        title: "操作成功",
        description: "您的操作已成功完成！",
        variant: "success",
        confirmText: "好的",
        onConfirm: async () => {
          console.log("Success confirmed!");
        },
      });
    };

    const showForm = () => {
      dialog.form({
        title: "用戶資料表單",
        fields: formFields,
        onSubmit: handleFormSubmit,
      });
    };

    const showLightbox = () => {
      dialog.lightbox({
        images: sampleImages,
        currentIndex: 0,
      });
    };

    // 🆕 巢狀 Dialog 測試：Dialog A -> Dialog B
    const showNestedDialog = () => {
      dialog.form({
        title: "步驟 1：填寫基本資料",
        description: "請填寫您的基本資料，提交前會要求確認",
        fields: [
          {
            name: "name",
            label: "姓名",
            type: "text",
            required: true,
            placeholder: "請輸入姓名",
          },
          {
            name: "age",
            label: "年齡",
            type: "number",
            required: true,
            placeholder: "請輸入年齡",
          },
        ],
        submitText: "下一步：確認資料",
        onSubmit: async (data) => {
          // 不關閉 Dialog A，而是彈出 Dialog B 確認
          return new Promise<void>((resolve, reject) => {
            dialog.confirm({
              title: "步驟 2：確認提交",
              description: `確認提交以下資料嗎？\n\n姓名：${data.name}\n年齡：${data.age}`,
              variant: "default",
              confirmText: "確認提交",
              cancelText: "返回修改",
              onConfirm: async () => {
                // 模擬提交
                await new Promise((r) => setTimeout(r, 1000));
                console.log("資料已提交：", data);
                // Dialog B 會自動關閉，並關閉 Dialog A
                resolve();
              },
              onCancel: () => {
                // 取消時 reject Promise，讓 Dialog A 重置 loading 狀態
                console.log("取消提交，返回表單");
                reject(new Error("User cancelled"));
              },
            });
          });
        },
      });
    };

    // 🚀 Workflow 示範：API 資料傳遞
    const showWorkflowWithAPI = () => {
      const workflow = dialog.createWorkflow({
        states: {
          // 步驟 1：輸入 ID
          inputId: {
            type: "form",
            title: "步驟 1：輸入用戶 ID",
            description: "請輸入用戶 ID，系統將獲取用戶資料",
            fields: [
              {
                name: "userId",
                label: "用戶 ID",
                type: "text",
                required: true,
                placeholder: "請輸入 1-10 之間的數字",
                validation: (value) => {
                  const num = parseInt(value);
                  if (isNaN(num) || num < 1 || num > 10) {
                    return "請輸入 1-10 之間的數字";
                  }
                },
              },
            ],
            actions: {
              取消: {
                exit: true,
                variant: "default",
                skipValidation: true,
              },
              "獲取資料": {
                next: "showUserInfo",
                variant: "success",
                action: async (data, ctx) => {
                  console.log("📡 [步驟 1] 開始獲取用戶資料, userId:", data.userId);

                  // 🔥 模擬 API 呼叫
                  await new Promise((r) => setTimeout(r, 800));
                  const mockApiResponse = {
                    id: data.userId,
                    name: `用戶 ${data.userId}`,
                    email: `user${data.userId}@example.com`,
                    role: data.userId <= 3 ? "admin" : "user",
                    avatar: `https://i.pravatar.cc/150?img=${data.userId}`,
                    createdAt: new Date().toISOString(),
                  };

                  // 🔥 把 API 資料存到 context
                  ctx.apiData = {
                    user: mockApiResponse,
                    fetchedAt: new Date().toISOString(),
                    requestId: Math.random().toString(36).substring(7),
                  };

                  console.log("✅ [步驟 1] API 資料已存入 context:", ctx.apiData);
                },
              },
            },
          },

          // 步驟 2：顯示用戶資訊（使用 API 資料）
          showUserInfo: {
            type: "confirm",
            // 🔥 使用函數形式讀取 context 中的 API 資料
            title: (ctx) => `步驟 2：用戶資料`,
            description: (ctx) => {
              const user = ctx.apiData?.user;
              const meta = ctx.apiData;
              return `
📋 用戶資訊：
• ID: ${user?.id || "N/A"}
• 姓名: ${user?.name || "N/A"}
• 郵件: ${user?.email || "N/A"}
• 角色: ${user?.role || "N/A"}

🔍 請求資訊：
• 請求 ID: ${meta?.requestId || "N/A"}
• 獲取時間: ${meta?.fetchedAt ? new Date(meta.fetchedAt).toLocaleTimeString() : "N/A"}

是否要編輯此用戶的資料？
              `;
            },
            actions: {
              取消: {
                exit: true,
                variant: "default",
              },
              "編輯資料": {
                next: "editUser",
                variant: "default",
              },
              "確認無誤": {
                exit: true,
                variant: "success",
                action: async (ctx) => {
                  console.log("✅ [步驟 2] 用戶確認資料無誤");
                  console.log("📦 [步驟 2] 最終 context:", ctx);
                },
              },
            },
          },

          // 步驟 3：編輯用戶（使用並更新 API 資料）
          editUser: {
            type: "form",
            title: "步驟 3：編輯用戶資料",
            // 🔥 使用函數動態生成 fields，預填 API 資料
            fields: (ctx) => {
              const user = ctx.apiData?.user;
              return [
                {
                  name: "name",
                  label: "姓名",
                  type: "text",
                  required: true,
                  defaultValue: user?.name || "",
                },
                {
                  name: "email",
                  label: "電子郵件",
                  type: "email",
                  required: true,
                  defaultValue: user?.email || "",
                },
                {
                  name: "role",
                  label: "角色",
                  type: "select",
                  required: true,
                  defaultValue: user?.role || "user",
                  options: [
                    { label: "管理員", value: "admin" },
                    { label: "一般用戶", value: "user" },
                  ],
                },
              ];
            },
            actions: {
              取消: {
                next: "showUserInfo",
                variant: "default",
                skipValidation: true,
              },
              "儲存修改": {
                next: "showUserInfo",
                variant: "success",
                action: async (data, ctx) => {
                  console.log("💾 [步驟 3] 儲存用戶修改:", data);

                  // 🔥 模擬 API 更新呼叫
                  await new Promise((r) => setTimeout(r, 500));

                  // 🔥 更新 context 中的 API 資料
                  ctx.apiData.user = {
                    ...ctx.apiData.user,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  };

                  console.log("✅ [步驟 3] 用戶資料已更新:", ctx.apiData.user);
                },
              },
            },
          },
        },
        start: "inputId",
        onComplete: (ctx) => {
          console.log("🎉 Workflow 完成！最終 context:", ctx);
          dialog.confirm({
            title: "操作完成",
            description: `用戶資料操作已完成！\n\n用戶: ${ctx.apiData?.user?.name}\n請求 ID: ${ctx.apiData?.requestId}`,
            variant: "success",
            confirmText: "好的",
            onConfirm: () => {},
          });
        },
        onCancel: (ctx) => {
          console.log("❌ Workflow 已取消", ctx);
        },
      });

      workflow.start();
    };

    // 🚀 Workflow 示範：使用 State Machine 管理複雜流程
    const showWorkflowDemo = () => {
      const workflow = dialog.createWorkflow({
        states: {
          // 步驟 1：填寫基本資料
          fillBasicInfo: {
            type: "form",
            title: "步驟 1：填寫基本資料",
            description: "請輸入您的個人資料",
            fields: [
              {
                name: "name",
                label: "姓名",
                type: "text",
                required: true,
                placeholder: "請輸入姓名",
              },
              {
                name: "email",
                label: "電子郵件",
                type: "email",
                required: true,
                placeholder: "example@email.com",
              },
            ],
            actions: {
              取消: {
                exit: true,
                variant: "default",
                skipValidation: true, // 取消按鈕不需要驗證
              },
              下一步: {
                next: "confirmInfo",
                variant: "success",
                action: async (data, ctx) => {
                  console.log("✅ [步驟 1] 基本資料已填寫:", data);
                },
              },
            },
          },

          // 步驟 2：確認資料（支援 3 個按鈕）
          confirmInfo: {
            type: "confirm",
            title: (ctx) => `步驟 2：確認資料`,
            description: (ctx) =>
              `請確認以下資料：\n\n姓名：${ctx.name || "未填寫"}\n電子郵件：${ctx.email || "未填寫"}\n\n如需修改個人簡介，請點擊「編輯簡介」`,
            actions: {
              取消: {
                exit: true,
                variant: "default",
              },
              編輯簡介: {
                next: "editProfile",
                variant: "default",
              },
              確認送出: {
                action: async (ctx) => {
                  // 模擬提交
                  await new Promise((r) => setTimeout(r, 1000));
                  console.log("✅ 工作流程完成！最終資料：", ctx);
                },
                exit: true,
                variant: "success",
              },
            },
          },

          // 步驟 3：編輯個人簡介（可選步驟）
          editProfile: {
            type: "form",
            title: "步驟 3：編輯個人簡介",
            description: "補充您的個人簡介資訊",
            fields: [
              {
                name: "bio",
                label: "個人簡介",
                type: "textarea",
                placeholder: "介紹一下自己...",
              },
              {
                name: "website",
                label: "個人網站",
                type: "text",
                placeholder: "https://...",
              },
            ],
            actions: {
              取消: {
                next: "confirmInfo",
                variant: "default",
                skipValidation: true, // 取消按鈕不需要驗證
                action: async (data, ctx) => {
                  // 可以記錄用戶行為、發送分析事件等
                  console.log("📊 [步驟 3] 已記錄取消事件");
                },
              },
              儲存草稿: {
                next: "confirmInfo",
                variant: "default",
                skipValidation: true, // 草稿可以不完整，不需要驗證
                action: async (data, ctx) => {
                  console.log("💾 [步驟 3] 草稿資料:", data);
                  await new Promise((r) => setTimeout(r, 500));
                  console.log("✅ [步驟 3] 草稿已保存");
                },
              },
              確認送出: {
                next: "confirmInfo",
                variant: "success",
                // 確認送出需要驗證，不設定 skipValidation
                action: async (data, ctx) => {
                  console.log("📝 [步驟 3] 提交的資料:", data);
                  console.log("📝 [步驟 3] 當前完整 context:", ctx);
                  // 模擬 API 調用
                  await new Promise((r) => setTimeout(r, 500));
                  console.log("✅ [步驟 3] 已提交");
                },
              },
            },
          },
        },
        start: "fillBasicInfo",
        onComplete: (ctx) => {
          console.log("🎉 Workflow 成功完成！", ctx);
          dialog.confirm({
            title: "提交成功",
            description: "您的資料已成功提交！",
            variant: "success",
            confirmText: "好的",
            onConfirm: () => {},
          });
        },
        onCancel: (ctx) => {
          console.log("❌ Workflow 已取消", ctx);
        },
      });

      // 啟動 workflow
      workflow.start();
    };

    return () => (
      <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 text-white">
        <div class="container mx-auto px-4 py-16">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
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
            <h1 class="text-5xl font-bold mb-4">Modal & Dialog</h1>
            <p class="text-xl text-slate-300">
              彈窗管理 - 確認框、表單彈窗、圖片燈箱
            </p>
          </div>

          {/* 演示區 */}
          <div class="mb-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border-2 border-purple-500/50">
            <div class="mb-6">
              <h2 class="text-3xl font-bold mb-2">功能演示</h2>
              <p class="text-slate-300 text-lg mb-2">
                使用 useDialog Hook，無需 import 組件
              </p>
              <div class="bg-slate-900/50 rounded-md p-4 font-mono text-sm text-purple-300">
                <div>const dialog = useDialog()</div>
                <div>
                  dialog.confirm(&#123; title: '...', onConfirm: ... &#125;)
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={showConfirm}
                class="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
              >
                確認對話框
              </button>
              <button
                onClick={showDanger}
                class="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold"
              >
                危險操作
              </button>
              <button
                onClick={showSuccess}
                class="px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold"
              >
                成功提示
              </button>
              <button
                onClick={showForm}
                class="px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-semibold"
              >
                表單彈窗
              </button>
              <button
                onClick={showLightbox}
                class="px-6 py-4 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors font-semibold"
              >
                圖片燈箱
              </button>
              <button
                onClick={showNestedDialog}
                class="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold"
              >
                🔗 巢狀 Dialog
              </button>
              <button
                onClick={showWorkflowDemo}
                class="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors font-semibold"
              >
                🚀 Workflow 示範
              </button>
              <button
                onClick={showWorkflowWithAPI}
                class="px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg transition-colors font-semibold"
              >
                📡 API 資料流程
              </button>
              <button
                onClick={dialog.closeAll}
                class="px-6 py-4 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors font-semibold"
              >
                🗑️ 關閉所有
              </button>
            </div>

            {/* 巢狀 Dialog 說明 */}
            <div class="mt-6 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
              <h3 class="text-lg font-semibold text-indigo-300 mb-2">
                🔗 巢狀 Dialog 測試
              </h3>
              <p class="text-sm text-slate-300">
                點擊「巢狀 Dialog」測試多層對話框場景：
              </p>
              <ul class="mt-2 space-y-1 text-sm text-slate-400">
                <li>• Dialog A：填寫表單</li>
                <li>• 點擊「下一步」→ Dialog B：確認資料</li>
                <li>• Dialog B 點擊「確認」→ 兩個都關閉</li>
                <li>• Dialog B 點擊「返回」→ 只關閉 B，A 保留</li>
              </ul>
            </div>

            {/* Workflow 說明 */}
            <div class="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-lg">
              <h3 class="text-lg font-semibold text-purple-300 mb-2">
                🚀 Workflow State Machine（推薦用於複雜流程）
              </h3>
              <p class="text-sm text-slate-300 mb-2">
                使用宣告式 State Machine 管理多步驟流程，清晰易維護：
              </p>
              <ul class="mt-2 space-y-1 text-sm text-slate-400">
                <li>• 步驟 1：填寫基本資料</li>
                <li>
                  • 步驟 2：確認資料（3 個按鈕：取消 / 編輯簡介 / 確認送出）
                </li>
                <li>• 步驟 3（可選）：編輯個人簡介 → 回到步驟 2</li>
                <li>• 自動管理 context，狀態清晰可見</li>
              </ul>
              <div class="mt-3 px-3 py-2 bg-purple-500/10 rounded border border-purple-500/30">
                <p class="text-xs text-purple-300">
                  💡 適用於：註冊流程、設定嚮導、多步驟表單等複雜場景
                </p>
              </div>
            </div>
          </div>


          {/* Features Section */}
          <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <h3 class="text-2xl font-semibold mb-4">特色功能</h3>
              <ul class="space-y-2 text-slate-300">
                <li class="flex items-start">
                  <span class="text-green-400 mr-2">✓</span>
                  <span>使用 Teleport 實現彈窗渲染</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-400 mr-2">✓</span>
                  <span>支援多種尺寸和變體</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-400 mr-2">✓</span>
                  <span>完整的動畫過渡效果</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-400 mr-2">✓</span>
                  <span>焦點陷阱和鍵盤導航</span>
                </li>
                <li class="flex items-start">
                  <span class="text-green-400 mr-2">✓</span>
                  <span>表單驗證和異步處理</span>
                </li>
              </ul>
            </div>

            <div class="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <h3 class="text-2xl font-semibold mb-4">使用場景</h3>
              <ul class="space-y-2 text-slate-300">
                <li class="flex items-start">
                  <span class="text-blue-400 mr-2">→</span>
                  <span>需要用戶確認的關鍵操作</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-400 mr-2">→</span>
                  <span>快速收集用戶輸入</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-400 mr-2">→</span>
                  <span>展示詳細信息或警告</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-400 mr-2">→</span>
                  <span>圖片和媒體內容查看</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-400 mr-2">→</span>
                  <span>引導用戶完成多步驟流程</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Code Examples */}
          <div class="mt-16 space-y-8">
            {/* Workflow 範例 */}
            <div class="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border-2 border-purple-500/50">
              <h3 class="text-2xl font-semibold mb-4 text-purple-300">
                🚀 Workflow State Machine 範例（最佳解決方案）
              </h3>
              <pre class="bg-slate-900 p-4 rounded-md overflow-x-auto text-sm">
                <code class="text-purple-300">{`const workflow = dialog.createWorkflow({
  states: {
    // 步驟 1：表單（支援多按鈕）
    fillForm: {
      type: 'form',
      title: '填寫資料',
      fields: [...],
      actions: {
        取消: { exit: true },
        下一步: {
          next: 'confirm',
          action: async (data, ctx) => {
            // data 是表單資料，ctx 是全局 context
            console.log('表單資料:', data)
          }
        }
      }
    },

    // 步驟 2：確認（支援多按鈕）
    confirm: {
      type: 'confirm',
      title: (ctx) => \`確認：\${ctx.name}\`,
      description: (ctx) => \`姓名：\${ctx.name}\\n郵件：\${ctx.email}\`,
      actions: {
        取消: { exit: true },
        編輯簡介: { next: 'editProfile' }, // 跳到其他步驟
        確認送出: {
          action: async (ctx) => await submit(ctx),
          exit: true
        }
      }
    },

    // 步驟 3：可選步驟（支援多按鈕）
    editProfile: {
      type: 'form',
      fields: [...],
      actions: {
        取消: { next: 'confirm' },
        儲存草稿: {
          next: 'confirm',
          action: async (data) => await saveDraft(data)
        },
        確認送出: {
          next: 'confirm',
          action: async (data) => await saveProfile(data)
        }
      }
    }
  },
  start: 'fillForm',
  onComplete: (ctx) => console.log('完成', ctx)
})

workflow.start() // 啟動流程`}</code>
              </pre>
              <p class="mt-4 text-sm text-purple-200">
                ✨ 優點：宣告式定義、清晰易讀、自動管理
                context、支援任意複雜流程
              </p>
            </div>

            {/* 新方式範例 */}
            <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-lg p-6 border-2 border-green-500/50">
              <h3 class="text-2xl font-semibold mb-4 text-green-400">
                🆕 基礎使用範例
              </h3>
              <pre class="bg-slate-900 p-4 rounded-md overflow-x-auto text-sm">
                <code class="text-green-400">{`import { useDialog } from './hooks/useDialog'

const dialog = useDialog()

// 確認對話框
dialog.confirm({
  title: '確認刪除',
  description: '此操作無法撤銷',
  variant: 'danger',
  onConfirm: async () => {
    await deleteItem()
  }
})

// 表單對話框
dialog.form({
  title: '新增用戶',
  fields: [...],
  onSubmit: async (data) => {
    await createUser(data)
  }
})

// 巢狀 Dialog：A 中彈出 B
dialog.form({
  title: '步驟 1',
  fields: [...],
  onSubmit: async (data) => {
    return new Promise((resolve, reject) => {
      dialog.confirm({
        title: '步驟 2：確認',
        description: '確認提交嗎？',
        onConfirm: async () => {
          await submitData(data)
          resolve() // 關閉 Dialog A
        },
        onCancel: () => {
          // reject 讓 A 重置，但不關閉
          reject(new Error('Cancelled'))
        }
      })
    })
  }
})

// 關閉所有
dialog.closeAll()`}</code>
              </pre>
              <p class="mt-4 text-sm text-slate-300">
                ✨ 優點：無需 import 組件，代碼更簡潔，統一管理
              </p>
            </div>

          </div>
        </div>

        {/* Dialog Container */}
        <DialogContainer
          dialogs={dialog.dialogs.value}
          onClose={dialog.close}
        />
      </div>
    );
  },
});
