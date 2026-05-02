import type { ExecutionResponse } from './types'

export async function executeCode(code: string): Promise<ExecutionResponse> {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`)
  }
  return response.json()
}
