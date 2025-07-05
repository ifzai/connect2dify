/**
 * Conversation-related API methods for Dify client
 */

import type {
  DeleteConversationParams,
  DeleteConversationResult,
  DifyConfiguration,
  GetConversationsParams,
  GetConversationsResponse,
  RenameConversationParams,
  RenameConversationResult,
} from './types.js';

import { buildURL, createHeaders, handleResponse } from './utils.js';

/**
 * Conversation API methods
 */
export class ConversationAPI {
  constructor(private config: DifyConfiguration) {}

  /**
   * Get list of conversations
   * @param params - Query parameters
   * @returns Promise resolving to conversations response
   */
  async getConversations(
    params: GetConversationsParams,
  ): Promise<GetConversationsResponse> {
    const queryParams: Record<string, string> = { user: params.user };

    if (params.last_id) queryParams.last_id = params.last_id;
    if (params.limit) queryParams.limit = String(params.limit);
    if (params.sort_by) queryParams.sort_by = params.sort_by;

    const url = buildURL(this.config.baseUrl, 'conversations', queryParams);

    const response = await fetch(url, {
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
        false,
      ),
      method: 'GET',
    });

    return handleResponse<GetConversationsResponse>(response);
  }

  /**
   * Delete a conversation
   * @param params - Delete parameters
   * @returns Promise resolving to delete result
   */
  async deleteConversation(
    params: DeleteConversationParams,
  ): Promise<DeleteConversationResult> {
    const url = buildURL(
      this.config.baseUrl,
      `conversations/${params.conversation_id}`,
    );

    const response = await fetch(url, {
      method: 'DELETE',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify({ user: params.user }),
    });

    return handleResponse<DeleteConversationResult>(response);
  }

  /**
   * Rename a conversation
   * @param params - Rename parameters
   * @returns Promise resolving to rename result
   */
  async renameConversation(
    params: RenameConversationParams,
  ): Promise<RenameConversationResult> {
    const url = buildURL(
      this.config.baseUrl,
      `conversations/${params.conversation_id}/name`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(
        this.config.apiKey,
        this.config.requestOptions?.extraHeaders,
      ),
      body: JSON.stringify({
        name: params.name,
        auto_generate: params.auto_generate,
        user: params.user,
      }),
    });

    return handleResponse<RenameConversationResult>(response);
  }
}
