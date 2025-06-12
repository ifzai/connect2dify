/**
 * Main Dify API Client
 * Provides a unified interface to all Dify API endpoints
 */

import { AppAPI } from './app.js';
import { ChatAPI } from './chat.js';
import { ConversationAPI } from './conversation.js';
import { FileAPI } from './file.js';
import type {
  AppInfo,
  AppMeta,
  // App types
  AppParameters,
  AudioToTextParams,
  AudioToTextResult,
  ChatChunkCompletionResponse,
  ChatCompletionResponse,
  CompletionMessageChunkResponse,
  CompletionMessageResponse,
  CreateMessageFeedbackParams,
  CreateMessageFeedbackResult,
  DeleteConversationParams,
  DeleteConversationResult,
  DifyConfiguration,
  // Conversation types
  GetConversationsParams,
  GetConversationsResponse,
  GetMessageSuggestsParams,
  GetMessageSuggestsResult,
  GetMessagesParams,
  GetMessagesResponse,
  GetWorkflowLogsParams,
  GetWorkflowLogsResult,
  GetWorkflowParams,
  GetWorkflowResult,
  HttpClientConfig,
  RenameConversationParams,
  RenameConversationResult,
  // Completion types
  SendCompletionMessageParams,
  // Chat types
  SendMessageParams,
  StopCompletionMessageParams,
  StopCompletionMessageResult,
  StopMessageResponseParams,
  StopMessageResponseResult,
  StopWorkflowTaskParams,
  StopWorkflowTaskResult,
  // File types
  UploadFileParams,
  UploadFileResult,
  WorkflowChunkResponse,
  WorkflowCompletionResponse,
  // Workflow types
  WorkflowRunParams,
} from './types.js';
import { WorkflowAPI } from './workflow.js';

/**
 * Main Dify API Client
 */
export class DifyClient {
  private config: DifyConfiguration;

  // API modules
  public readonly chat: ChatAPI;
  public readonly conversation: ConversationAPI;
  public readonly workflow: WorkflowAPI;
  public readonly file: FileAPI;
  public readonly app: AppAPI;

  constructor(config: HttpClientConfig & Partial<DifyConfiguration>) {
    this.config = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      defaultResponseMode: config.defaultResponseMode || 'blocking',
      defaultUser: config.defaultUser,
      requestOptions: config.requestOptions,
    };

    // Initialize API modules
    this.chat = new ChatAPI(this.config);
    this.conversation = new ConversationAPI(this.config);
    this.workflow = new WorkflowAPI(this.config);
    this.file = new FileAPI(this.config);
    this.app = new AppAPI(this.config);
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<DifyConfiguration>): void {
    this.config = { ...this.config, ...newConfig };

    // Re-initialize API modules with new config
    Object.assign(this.chat, new ChatAPI(this.config));
    Object.assign(this.conversation, new ConversationAPI(this.config));
    Object.assign(this.workflow, new WorkflowAPI(this.config));
    Object.assign(this.file, new FileAPI(this.config));
    Object.assign(this.app, new AppAPI(this.config));
  }

  /**
   * Get current configuration
   */
  public getConfig(): DifyConfiguration {
    return { ...this.config };
  }

  // ============= Deprecated Methods (for backward compatibility) =============
  // These methods proxy to the appropriate API modules

  /**
   * @deprecated Use client.chat.sendMessage() instead
   */
  async sendMessage(params: SendMessageParams): Promise<ChatCompletionResponse> {
    const result = await this.chat.sendMessage(params);
    if (Array.isArray(result)) {
      throw new Error('Use sendMessageStream for streaming responses');
    }
    return result;
  }

  /**
   * @deprecated Use client.chat.sendMessage() with streaming mode instead
   */
  async sendMessageStream(params: SendMessageParams): Promise<AsyncIterableIterator<ChatChunkCompletionResponse>> {
    const streamParams = { ...params, response_mode: 'streaming' as const };
    const result = await this.chat.sendMessage(streamParams);
    if (!Array.isArray(result)) {
      throw new Error('Expected streaming response');
    }
    return (async function* () {
      for (const chunk of result) {
        yield chunk;
      }
    })();
  }

  /**
   * @deprecated Use client.chat.stopMessageResponse() instead
   */
  async stopMessage(params: StopMessageResponseParams): Promise<StopMessageResponseResult> {
    return this.chat.stopMessageResponse(params);
  }

  /**
   * @deprecated Use client.chat.createMessageFeedback() instead
   */
  async createMessageFeedback(params: CreateMessageFeedbackParams): Promise<CreateMessageFeedbackResult> {
    return this.chat.createMessageFeedback(params);
  }

  /**
   * @deprecated Use client.chat.getMessageSuggests() instead
   */
  async getMessageSuggests(params: GetMessageSuggestsParams): Promise<GetMessageSuggestsResult> {
    return this.chat.getMessageSuggests(params);
  }

  /**
   * @deprecated Use client.conversation.getConversations() instead
   */
  async getConversations(params: GetConversationsParams): Promise<GetConversationsResponse> {
    return this.conversation.getConversations(params);
  }

  /**
   * @deprecated Use client.conversation.deleteConversation() instead
   */
  async deleteConversation(params: DeleteConversationParams): Promise<DeleteConversationResult> {
    return this.conversation.deleteConversation(params);
  }

  /**
   * @deprecated Use client.conversation.renameConversation() instead
   */
  async renameConversation(params: RenameConversationParams): Promise<RenameConversationResult> {
    return this.conversation.renameConversation(params);
  }

  /**
   * @deprecated Use client.conversation.getMessages() instead
   */
  async getMessages(params: GetMessagesParams): Promise<GetMessagesResponse> {
    return this.chat.getMessages(params);
  }

  /**
   * @deprecated Use client.workflow.runWorkflow() instead
   */
  async runWorkflow(params: WorkflowRunParams): Promise<WorkflowCompletionResponse> {
    const result = await this.workflow.runWorkflow(params);
    if (Array.isArray(result)) {
      throw new Error('Use runWorkflowStream for streaming responses');
    }
    return result;
  }

  /**
   * @deprecated Use client.workflow.runWorkflow() with streaming mode instead
   */
  async runWorkflowStream(params: WorkflowRunParams): Promise<AsyncIterableIterator<WorkflowChunkResponse>> {
    const streamParams = { ...params, response_mode: 'streaming' as const };
    const result = await this.workflow.runWorkflow(streamParams);
    if (!Array.isArray(result)) {
      throw new Error('Expected streaming response');
    }
    return (async function* () {
      for (const chunk of result) {
        yield chunk;
      }
    })();
  }

  /**
   * @deprecated Use client.workflow.getWorkflow() instead
   */
  async getWorkflow(params: GetWorkflowParams): Promise<GetWorkflowResult> {
    return this.workflow.getWorkflow(params);
  }

  /**
   * @deprecated Use client.workflow.stopWorkflowTask() instead
   */
  async stopWorkflowTask(params: StopWorkflowTaskParams): Promise<StopWorkflowTaskResult> {
    return this.workflow.stopWorkflowTask(params);
  }

  /**
   * @deprecated Use client.workflow.getWorkflowLogs() instead
   */
  async getWorkflowLogs(params: GetWorkflowLogsParams): Promise<GetWorkflowLogsResult> {
    return this.workflow.getWorkflowLogs(params);
  }

  /**
   * @deprecated Use client.file.uploadFile() instead
   */
  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    return this.file.uploadFile(params);
  }

  /**
   * @deprecated Use client.file.audioToText() instead
   */
  async audioToText(params: AudioToTextParams): Promise<AudioToTextResult> {
    return this.file.audioToText(params);
  }

  /**
   * @deprecated Use client.app.getParameters() instead
   */
  async getAppParameters(params: { user: string }): Promise<AppParameters> {
    return this.app.getParameters();
  }

  /**
   * @deprecated Use client.app.getInfo() instead
   */
  async getAppInfo(params: { user: string }): Promise<AppInfo> {
    return this.app.getInfo();
  }

  /**
   * @deprecated Use client.app.getMeta() instead
   */
  async getAppMeta(params: { user: string }): Promise<AppMeta> {
    return this.app.getMeta();
  }

  /**
   * @deprecated Use client.app.sendCompletionMessage() instead
   */
  async sendCompletionMessage(params: SendCompletionMessageParams): Promise<CompletionMessageResponse> {
    const result = await this.app.sendCompletionMessage(params);
    if (Array.isArray(result)) {
      throw new Error('Use sendCompletionMessageStream for streaming responses');
    }
    return result;
  }

  /**
   * @deprecated Use client.app.sendCompletionMessage() with streaming mode instead
   */
  async sendCompletionMessageStream(
    params: SendCompletionMessageParams,
  ): Promise<AsyncIterableIterator<CompletionMessageChunkResponse>> {
    const streamParams = { ...params, response_mode: 'streaming' as const };
    const result = await this.app.sendCompletionMessage(streamParams);
    if (!Array.isArray(result)) {
      throw new Error('Expected streaming response');
    }
    return (async function* () {
      for (const chunk of result) {
        yield chunk;
      }
    })();
  }

  /**
   * @deprecated Use client.app.stopCompletionMessage() instead
   */
  async stopCompletionMessage(params: StopCompletionMessageParams): Promise<StopCompletionMessageResult> {
    return this.app.stopCompletionMessage(params);
  }
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use DifyClient instead
 */
export const Client = DifyClient;

// Export all types
export * from './types.js';

// Export API modules for direct use
export { ChatAPI } from './chat.js';
export { ConversationAPI } from './conversation.js';
export { WorkflowAPI } from './workflow.js';
export { FileAPI } from './file.js';
export { AppAPI } from './app.js';
