/**
 * Workflow-related API methods for Dify client
 */

import type {
  DifyConfiguration,
  GetWorkflowLogsParams,
  GetWorkflowLogsResult,
  GetWorkflowParams,
  GetWorkflowResult,
  StopWorkflowTaskParams,
  StopWorkflowTaskResult,
  WorkflowChunkResponse,
  WorkflowCompletionResponse,
  WorkflowRunParams,
} from './types.js';

import { buildURL, createHeaders, handleResponse, handleStreamResponse } from './utils.js';

/**
 * Workflow API methods
 */
export class WorkflowAPI {
  constructor(private config: DifyConfiguration) {}

  /**
   * Run a workflow
   * @param params - Workflow run parameters
   * @returns Promise resolving to workflow completion response or stream chunks
   */
  async runWorkflow(params: WorkflowRunParams): Promise<WorkflowCompletionResponse | WorkflowChunkResponse[]> {
    const url = buildURL(this.config.baseUrl, 'v1/workflows/run');
    const isStreaming = params.response_mode === 'streaming';

    // Handle streaming mode
    if (isStreaming) {
      return this.handleWorkflowStream(params, url);
    }

    // Handle blocking mode
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
      body: JSON.stringify(params),
    });

    return handleResponse<WorkflowCompletionResponse>(response);
  }

  /**
   * Get workflow execution result
   * @param params - Query parameters
   * @returns Promise resolving to workflow result
   */
  async getWorkflow(params: GetWorkflowParams): Promise<GetWorkflowResult> {
    const url = buildURL(this.config.baseUrl, `v1/workflows/run/${params.workflow_id}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
    });

    return handleResponse<GetWorkflowResult>(response);
  }

  /**
   * Stop a workflow task
   * @param params - Stop parameters
   * @returns Promise resolving to stop result
   */
  async stopWorkflowTask(params: StopWorkflowTaskParams): Promise<StopWorkflowTaskResult> {
    const url = buildURL(this.config.baseUrl, `v1/workflows/tasks/${params.task_id}/stop`);

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
      body: JSON.stringify({ user: params.user }),
    });

    return handleResponse<StopWorkflowTaskResult>(response);
  }

  /**
   * Get workflow execution logs
   * @param params - Query parameters
   * @returns Promise resolving to workflow logs
   */
  async getWorkflowLogs(params: GetWorkflowLogsParams): Promise<GetWorkflowLogsResult> {
    const queryParams: Record<string, string> = {};

    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.status) queryParams.status = params.status;
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);

    const url = buildURL(this.config.baseUrl, 'v1/workflows/logs', queryParams);

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
    });

    return handleResponse<GetWorkflowLogsResult>(response);
  }

  /**
   * Handle workflow streaming responses
   * @private
   */
  private async handleWorkflowStream(params: WorkflowRunParams, url: string): Promise<WorkflowChunkResponse[]> {
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
      body: JSON.stringify(params),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Workflow failed: ${response.status} ${response.statusText}`);
    }

    return handleStreamResponse<WorkflowChunkResponse>(response, params.chunkCompletionCallback);
  }
}
