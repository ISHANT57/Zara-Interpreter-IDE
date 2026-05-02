export interface ExecutionResponse {
  success: boolean
  output: string[]
  error: string | null
  executionTimeMs: number
  executionId: string
  variables: Record<string, number | string | boolean>
  ast: string[]
}

export interface Example {
  name: string
  description: string
  code: string
}
