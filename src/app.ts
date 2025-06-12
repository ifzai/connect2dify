/**
 * Application info and completion-related API methods for Dify client
 */

import type {
  AppInfo,
  AppMeta,
  AppParameters,
  CompletionMessageChunkResponse,
  CompletionMessageResponse,
  DifyConfiguration,
  SendCompletionMessageParams,
  StopCompletionMessageParams,
  StopCompletionMessageResult,
} from './types.js';

import {
  buildURL,
  createHeaders,
  handleResponse,
  handleStreamResponse,
} from './utils.js';

/**
 * Application and Completion API methods
 */
export class AppAPI {
  constructor(private config: DifyConfiguration) {}

  /**
   * Get application parameters
   * @returns Promise resolving to app parameters
   */
  async getParameters(): Promise<AppParameters> {
    const url = buildURL(this.config.baseUrl, 'parameters');

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
        false,
      ),
    });

    return handleResponse<AppParameters>(response);
  }

  /**
   * Get application basic information
   * @returns Promise resolving to app info
   */
  async getInfo(): Promise<AppInfo> {
    const url = buildURL(this.config.baseUrl, 'info');

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
        false,
      ),
    });

    return handleResponse<AppInfo>(response);
  }

  /**
   * Get application meta information (tool icons, etc.)
   * @returns Promise resolving to app meta
   */
  async getMeta(): Promise<AppMeta> {
    const url = buildURL(this.config.baseUrl, 'meta');

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
        false,
      ),
    });

    return handleResponse<AppMeta>(response);
  }

  /**
   * Send a completion message (text generation)
   * @param params - Completion parameters
   * @returns Promise resolving to completion response or stream chunks
   */
  async sendCompletionMessage(
    params: SendCompletionMessageParams,
  ): Promise<CompletionMessageResponse | CompletionMessageChunkResponse[]> {
    const url = buildURL(this.config.baseUrl, 'v1/completion-messages');
    const body = {
      inputs: params.inputs || {},
      response_mode: params.response_mode,
      user: params.user,
      files: params.files,
    };

    // Handle blocking mode
    if (params.response_mode === 'blocking') {
      const response = await fetch(url, {
        method: 'POST',
        headers: createHeaders(
          this.config.apiKey,
          this.config.requestOptions?.extraHeaders,
        ),
        body: JSON.stringify(body),
      });

      return handleResponse<CompletionMessageResponse>(response);
    }

    // Handle streaming mode
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    return handleStreamResponse<CompletionMessageChunkResponse>(
      response,
      params.chunkCompletionCallback,
    );
  }

  /**
   * Stop a completion message stream
   * @param params - Stop parameters
   * @returns Promise resolving to stop result
   */
  async stopCompletionMessage(
    params: StopCompletionMessageParams,
  ): Promise<StopCompletionMessageResult> {
    const url = buildURL(
      this.config.baseUrl,
      `v1/completion-messages/${params.task_id}/stop`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify({ user: params.user }),
    });

    return handleResponse<StopCompletionMessageResult>(response);
  }
}
