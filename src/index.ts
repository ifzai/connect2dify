/**
 * Dify API Client
 * A comprehensive TypeScript client for the Dify API
 */

// Main client export
export { DifyClient, Client } from './client.js';

// API modules for direct use
export { ChatAPI } from './chat.js';
export { ConversationAPI } from './conversation.js';
export { WorkflowAPI } from './workflow.js';
export { FileAPI } from './file.js';
export { AppAPI } from './app.js';

// All types
export * from './types.js';

// Utilities (for advanced usage)
export {
  createHeaders,
  handleResponse,
  handleStreamResponse,
  parseSSEChunk,
  buildURL,
} from './utils.js';
