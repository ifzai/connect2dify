/**
 * Chat-related API methods for Dify client
 */

import type {
  ChatChunkCompletionResponse,
  ChatCompletionResponse,
  CreateMessageFeedbackParams,
  CreateMessageFeedbackResult,
  DifyConfiguration,
  GetMessageSuggestsParams,
  GetMessageSuggestsResult,
  GetMessagesParams,
  GetMessagesResponse,
  SendMessageParams,
  StopMessageResponseParams,
  StopMessageResponseResult,
} from './types.js';

import {
  buildURL,
  createHeaders,
  handleResponse,
  handleStreamResponse,
  isStreamingSupported,
} from './utils.js';

/**
 * Chat API methods
 */
export class ChatAPI {
  constructor(private config: DifyConfiguration) {}

  /**
   * Send a chat message to the Dify application
   * @param params - Message parameters
   * @returns Promise resolving to chat completion response or stream chunks
   */
  async sendMessage(
    params: SendMessageParams,
  ): Promise<ChatCompletionResponse | ChatChunkCompletionResponse[]> {
    const url = buildURL(this.config.baseUrl, 'chat-messages');
    const body = { inputs: {}, ...params };

    // Handle streaming mode
    if (params.response_mode === 'streaming') {
      return this.handleChatStream(url, body, params);
    }

    // Handle blocking mode
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify(body),
    });

    return handleResponse<ChatCompletionResponse>(response);
  }

  /**
   * Get messages from a conversation
   * @param params - Query parameters
   * @returns Promise resolving to messages response
   */
  async getMessages(params: GetMessagesParams): Promise<GetMessagesResponse> {
    const queryParams: Record<string, string> = {
      conversation_id: params.conversation_id,
      user: params.user,
    };

    if (params.first_id) queryParams.first_id = params.first_id;
    if (params.limit) queryParams.limit = String(params.limit);

    const url = buildURL(this.config.baseUrl, 'messages', queryParams);

    const response = await fetch(url, {
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
        false,
      ),
      method: 'GET',
    });

    return handleResponse<GetMessagesResponse>(response);
  }

  /**
   * Create feedback for a message
   * @param params - Feedback parameters
   * @returns Promise resolving to feedback result
   */
  async createMessageFeedback(
    params: CreateMessageFeedbackParams,
  ): Promise<CreateMessageFeedbackResult> {
    const url = buildURL(
      this.config.baseUrl,
      `messages/${params.message_id}/feedbacks`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify({
        rating: params.rating,
        user: params.user,
        content: params.content,
      }),
    });

    return handleResponse<CreateMessageFeedbackResult>(response);
  }

  /**
   * Get suggested questions for a message
   * @param params - Query parameters
   * @returns Promise resolving to suggested questions
   */
  async getMessageSuggests(
    params: GetMessageSuggestsParams,
  ): Promise<GetMessageSuggestsResult> {
    const queryParams = { user: params.user };
    const url = buildURL(
      this.config.baseUrl,
      `messages/${params.message_id}/suggested`,
      queryParams,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
    });

    return handleResponse<GetMessageSuggestsResult>(response);
  }

  /**
   * Stop a message response
   * @param params - Stop parameters
   * @returns Promise resolving to stop result
   */
  async stopMessageResponse(
    params: StopMessageResponseParams,
  ): Promise<StopMessageResponseResult> {
    const url = buildURL(
      this.config.baseUrl,
      `chat-messages/${params.task_id}/stop`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify({ user: params.user }),
    });

    return handleResponse<StopMessageResponseResult>(response);
  }

  /**
   * Handle streaming chat responses
   * @private
   */
  private async handleChatStream(
    url: string,
    body: unknown,
    params: SendMessageParams,
  ): Promise<ChatChunkCompletionResponse[]> {
    const extraHeaders = this.config.requestOptions?.extraHeaders || {};

    // Check if streaming is supported
    if (!isStreamingSupported()) {
      throw new Error(
        'Streaming is not supported in this environment. Please use blocking mode instead.',
      );
    }

    // Use modern fetch with ReadableStream
    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, extraHeaders),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    return handleStreamResponse<ChatChunkCompletionResponse>(
      response,
      params.chunkCompletionCallback,
    );
  }
}
