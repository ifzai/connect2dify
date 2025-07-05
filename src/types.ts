/**
 * Base types and interfaces for Dify API client
 */

// ============= Base Types =============
export type ResponseMode = 'streaming' | 'blocking';

export interface WithResponseMode {
  response_mode?: ResponseMode;
}

export interface WithInputs {
  inputs?: Record<string, unknown>;
}

export interface BaseParams {
  user: string;
}

// ============= HTTP Configuration =============
export interface RequestOptions {
  extraHeaders?: Record<string, string>;
}

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
}

export interface DifyConfiguration extends HttpClientConfig {
  defaultResponseMode: ResponseMode;
  defaultUser?: string;
  requestOptions?: RequestOptions;
}

// ============= File Upload Types =============
export interface UploadFileParams extends BaseParams {
  file: File | Blob;
}

export interface UploadFileResponse {
  id: string;
  name: string;
  size: number;
  extension: string;
  mime_type: string;
  created_by: string;
  created_at: number;
}

export interface UploadFileResult extends UploadFileResponse {}

// ============= Chat Message Types =============
export interface SendMessageParams extends BaseParams, WithResponseMode {
  inputs?: Record<string, unknown>;
  query: string;
  conversation_id?: string;
  files?: Array<{
    type: 'image' | 'document' | 'audio' | 'video';
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
  auto_generate_name?: boolean;
  chunkCompletionCallback?: (chunk: ChatChunkCompletionResponse) => void;
}

export interface ChatCompletionResponse {
  event: string;
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: {
    usage: {
      prompt_tokens: number;
      prompt_unit_price: string;
      prompt_price_unit: string;
      prompt_price: string;
      completion_tokens: number;
      completion_unit_price: string;
      completion_price_unit: string;
      completion_price: string;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
    retriever_resources?: Array<{
      id: string;
      name: string;
      document_id: string;
      data_source_type: string;
      segment_id: string;
      score: number;
      content: string;
    }>;
  };
  created_at: number;
}

export interface ChatChunkCompletionResponse {
  event: 'message' | 'agent_message' | 'message_file' | 'message_end' | 'error';
  id?: string;
  message_id?: string;
  conversation_id?: string;
  answer?: string;
  created_at?: number;
  file?: {
    id: string;
    type: string;
    url: string;
    belongs_to: string;
  };
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
  };
}

// ============= Completion Message Types =============
export interface SendCompletionMessageParams
  extends BaseParams,
    WithResponseMode {
  inputs?: Record<string, unknown>;
  files?: Array<{
    type: 'image' | 'document' | 'audio' | 'video';
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
  chunkCompletionCallback?: (chunk: CompletionMessageChunkResponse) => void;
}

export interface CompletionMessageResponse {
  answer: string;
  message_id: string;
  conversation_id: string;
  created_at: number;
  metadata: {
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
  };
}

export interface CompletionMessageChunkResponse {
  event: 'message' | 'message_end' | 'error';
  answer?: string;
  message_id?: string;
  conversation_id?: string;
  created_at?: number;
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
  };
}

// ============= Conversation Types =============
export interface GetConversationsParams extends BaseParams {
  last_id?: string;
  limit?: number;
  sort_by?: 'created_at' | '-created_at' | 'updated_at' | '-updated_at';
}

export interface GetConversationsResponse {
  data: Array<{
    id: string;
    name: string;
    inputs: Record<string, unknown>;
    status: string;
    introduction: string;
    created_at: number;
    updated_at: number;
  }>;
  has_more: boolean;
  limit: number;
}

export interface DeleteConversationParams extends BaseParams {
  conversation_id: string;
}

export interface DeleteConversationResult {
  result: 'success';
}

export interface RenameConversationParams extends BaseParams {
  conversation_id: string;
  name?: string;
  auto_generate?: boolean;
}

export interface RenameConversationResult {
  result: 'success';
}

// ============= Message Types =============
export interface GetMessagesParams extends BaseParams {
  conversation_id: string;
  first_id?: string;
  limit?: number;
}

export interface GetMessagesResponse {
  data: Array<{
    id: string;
    conversation_id: string;
    inputs: Record<string, unknown>;
    query: string;
    answer: string;
    message_files: Array<{
      id: string;
      type: string;
      url: string;
      belongs_to: string;
    }>;
    feedback: {
      rating: 'like' | 'dislike' | null;
      content: string | null;
    } | null;
    retriever_resources: Array<{
      id: string;
      name: string;
      document_id: string;
      data_source_type: string;
      segment_id: string;
      score: number;
      content: string;
    }>;
    created_at: number;
    agent_thoughts: Array<{
      id: string;
      chain_id: string;
      message_id: string;
      position: number;
      thought: string;
      tool: string;
      tool_labels: Record<string, string>;
      tool_input: string;
      created_at: number;
      observation: string;
      files: string[];
    }>;
  }>;
  has_more: boolean;
  limit: number;
}

// ============= Feedback Types =============
export interface CreateMessageFeedbackParams extends BaseParams {
  message_id: string;
  rating: 'like' | 'dislike';
  content?: string;
}

export interface CreateMessageFeedbackResult {
  result: 'success';
}

// ============= Suggests Types =============
export interface GetMessageSuggestsParams extends BaseParams {
  message_id: string;
}

export interface GetMessageSuggestsResult {
  data: string[];
}

// ============= Stop Message Types =============
export interface StopMessageResponseParams extends BaseParams {
  task_id: string;
}

export interface StopMessageResponseResult {
  result: 'success';
}

export interface StopCompletionMessageParams extends BaseParams {
  task_id: string;
}

export interface StopCompletionMessageResult {
  result: 'success';
}

// ============= Audio Types =============
export interface AudioToTextParams extends BaseParams {
  file: File | Blob;
}

export interface AudioToTextResult {
  text: string;
}

export interface TextToAudioParams extends BaseParams {
  text: string;
  voice?: string;
}

// ============= App Info Types =============
export interface AppParameters {
  opening_statement: string;
  suggested_questions: string[];
  suggested_questions_after_answer: {
    enabled: boolean;
  };
  speech_to_text: {
    enabled: boolean;
  };
  text_to_speech: {
    enabled: boolean;
    voice: string;
    language: string;
  };
  retriever_resource: {
    enabled: boolean;
  };
  annotation_reply: {
    enabled: boolean;
  };
  user_input_form: Array<{
    text_input: {
      label: string;
      variable: string;
      required: boolean;
      max_length: number;
      default: string;
    };
  }>;
  file_upload: {
    image: {
      enabled: boolean;
      number_limits: number;
      detail: string;
      transfer_methods: string[];
    };
  };
  system_parameters: {
    image_file_size_limit: string;
    video_file_size_limit: string;
    audio_file_size_limit: string;
    file_size_limit: string;
    workflow_file_upload_limit: string;
  };
}

export interface AppInfo {
  icon: string;
  icon_background: string;
  name: string;
  description: string;
  copyright: string;
  privacy_policy: string;
  custom_disclaimer: string;
  tags: string[];
  mode: 'chat' | 'workflow' | 'completion';
  author_name: string;
}

export interface AppMeta {
  tool_icons: Record<string, string>;
}

// ============= Workflow Types =============
export interface WorkflowRunParams
  extends BaseParams,
    WithResponseMode,
    WithInputs {
  files?: Array<{
    type: 'image' | 'document' | 'audio' | 'video';
    transfer_method: 'remote_url' | 'local_file';
    url?: string;
    upload_file_id?: string;
  }>;
  chunkCompletionCallback?: (chunk: WorkflowChunkResponse) => void;
}

export interface WorkflowCompletionResponse {
  workflow_run_id: string;
  task_id: string;
  data: {
    id: string;
    workflow_id: string;
    status: 'running' | 'succeeded' | 'failed' | 'stopped';
    outputs: Record<string, unknown>;
    error: string | null;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
}

export interface WorkflowChunkResponse {
  event:
    | 'workflow_started'
    | 'workflow_finished'
    | 'node_started'
    | 'node_finished'
    | 'text_chunk'
    | 'error';
  task_id?: string;
  workflow_run_id?: string;
  data?: {
    id?: string;
    workflow_id?: string;
    sequence_number?: number;
    status?: 'running' | 'succeeded' | 'failed' | 'stopped';
    outputs?: Record<string, unknown>;
    error?: string | null;
    elapsed_time?: number;
    total_tokens?: number;
    total_steps?: number;
    created_at?: number;
    finished_at?: number;
    node_id?: string;
    node_type?: string;
    title?: string;
    index?: number;
    predecessor_node_id?: string | null;
    inputs?: Record<string, unknown>;
    process_data?: Record<string, unknown>;
    execution_metadata?: {
      total_tokens?: number;
      total_price?: string;
      currency?: string;
    };
    // For text_chunk events
    text?: string;
    from_variable_selector?: string[];
  };
}

export interface GetWorkflowParams {
  /** The workflow run ID (specific execution instance) to get information about */
  workflow_run_id: string;
}

export interface GetWorkflowResult {
  id: string;
  workflow_id: string;
  status: 'running' | 'succeeded' | 'failed' | 'stopped';
  outputs: Record<string, unknown>;
  error: string | null;
  elapsed_time: number;
  total_tokens: number;
  total_steps: number;
  created_at: number;
  finished_at: number;
}

export interface StopWorkflowTaskParams extends BaseParams {
  task_id: string;
}

export interface StopWorkflowTaskResult {
  result: 'success';
}

export interface GetWorkflowLogsParams {
  keyword?: string;
  status?: 'running' | 'succeeded' | 'failed' | 'stopped';
  page?: number;
  limit?: number;
}

export interface GetWorkflowLogsResult {
  data: Array<{
    id: string;
    workflow_id: string;
    status: 'running' | 'succeeded' | 'failed' | 'stopped';
    outputs: Record<string, unknown>;
    error: string | null;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  }>;
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============= MIME Types =============
export const MIME_MAP = {
  document: {
    mimeTypes: [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/csv',
      'message/rfc822',
      'application/vnd.ms-outlook',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'application/xml',
      'text/xml',
      'application/epub+zip',
    ],
    extensions: [
      '.txt',
      '.md',
      '.mdx',
      '.html',
      '.htm',
      '.pdf',
      '.xlsx',
      '.xls',
      '.docx',
      '.doc',
      '.csv',
      '.eml',
      '.msg',
      '.pptx',
      '.ppt',
      '.xml',
      '.epub',
    ],
  },
  image: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  },
  audio: {
    mimeTypes: [
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/webm',
      'audio/amr',
    ],
    extensions: ['.mp3', '.mpga', '.m4a', '.wav', '.webm', '.amr'],
  },
  video: {
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/mpeg', 'audio/mpeg'],
    extensions: ['.mp4', '.mov', '.mpeg', '.mpg', '.mpe'],
  },
} as const;

// ============= Action Definition Types =============
export type DifyActionDefinition = {
  'chatflow-/chat-messages': [
    SendMessageParams,
    ChatCompletionResponse,
    ChatCompletionResponse,
    ChatChunkCompletionResponse,
  ];
  'chatflow-/files/upload': [UploadFileParams, UploadFileResponse];
  'chatflow-/chat-messages/:task_id/stop': [
    StopMessageResponseParams,
    StopMessageResponseResult,
  ];
  'chatflow-/messages/:message_id/feedbacks': [
    CreateMessageFeedbackParams,
    CreateMessageFeedbackResult,
  ];
  'chatflow-/messages/{message_id}/suggested': [
    GetMessageSuggestsParams,
    GetMessageSuggestsResult,
  ];
  'chatflow-/messages': [GetMessagesParams, GetMessagesResponse];
  'chatflow-/conversations': [GetConversationsParams, GetConversationsResponse];
  'workflow-/workflows/run': [
    WorkflowRunParams,
    WorkflowCompletionResponse,
    WorkflowCompletionResponse,
    WorkflowChunkResponse,
  ];
  'workflow-/workflows/tasks/:task_id/stop': [
    StopWorkflowTaskParams,
    StopWorkflowTaskResult,
  ];
};

export type DifyActionType = keyof DifyActionDefinition;
export type DifyActionParams<T extends DifyActionType> =
  DifyActionDefinition[T][0];
export type DifyActionReturnData<T extends DifyActionType> =
  DifyActionDefinition[T][1];
export type DifyActionFn<T extends DifyActionType> = (
  params: DifyActionParams<T>,
) => DifyActionReturnData<T>;

export type DifyActionBlockResponse<T extends DifyActionType> =
  DifyActionDefinition[T][2];
export type DifyActionStreamResponse<T extends DifyActionType> =
  DifyActionDefinition[T][3];

export type DifyActionPath<T extends DifyActionType> =
  T extends `${infer Name}-${infer Path}` ? Path : never;

export type DifyRequestFnCallbacks<Action extends DifyActionType> = {
  onUpdate?: (message: DifyActionStreamResponse<Action>) => void;
  onSuccess?: (message: DifyActionReturnData<Action>) => void;
  onError?: (error: Error) => void;
};

export type WithResponseModeParams<Action extends DifyActionType> =
  DifyActionParams<Action> extends WithResponseMode
    ? DifyActionParams<Action>
    : never;

export type WithInputsParams<Action extends DifyActionType> =
  DifyActionParams<Action> extends WithInputs
    ? DifyActionParams<Action>
    : never;
