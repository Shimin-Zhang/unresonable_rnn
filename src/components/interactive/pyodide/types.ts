export interface PyodideExecuteRequest {
  type: 'execute'
  id: string
  code: string
}

export interface PyodideExecuteResponse {
  type: 'result'
  id: string
  stdout: string
  stderr: string
  error?: string
  executionTime: number
}

export interface PyodideReadyMessage {
  type: 'ready'
}

export interface PyodideLoadingMessage {
  type: 'loading'
  stage: 'init' | 'packages' | 'ready'
}

export interface PyodideErrorMessage {
  type: 'error'
  error: string
}

export type PyodideWorkerMessage =
  | PyodideExecuteRequest

export type PyodideWorkerResponse =
  | PyodideExecuteResponse
  | PyodideReadyMessage
  | PyodideLoadingMessage
  | PyodideErrorMessage

export interface PyodideState {
  isLoading: boolean
  isReady: boolean
  loadingStage: 'init' | 'packages' | 'ready' | null
  error: string | null
}
