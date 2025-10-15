import type { CodeSnippet } from './types'

/**
 * 複製成功後的重置延遲時間（毫秒）
 */
export const COPY_RESET_DELAY = 2000

/**
 * 示範用的程式碼片段
 */
export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    title: 'React useState Hook',
    language: 'typescript',
    code: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`,
  },
  {
    id: '2',
    title: 'Vue Composition API',
    language: 'typescript',
    code: `import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++`,
  },
  {
    id: '3',
    title: 'Async/Await Error Handling',
    language: 'typescript',
    code: `async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch:', error)
    throw error
  }
}`,
  },
  {
    id: '4',
    title: 'Tailwind CSS Button',
    language: 'html',
    code: `<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>`,
  },
]
