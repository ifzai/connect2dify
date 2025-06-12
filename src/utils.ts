/**
 * HTTP utilities and stream handling for Dify API client
 */

import type {
  ChatChunkCompletionResponse,
  CompletionMessageChunkResponse,
  SendCompletionMessageParams,
  SendMessageParams,
  WorkflowChunkResponse,
  WorkflowRunParams,
} from './types.js';

/**
 * Creates standard headers for API requests
 */
export function createHeaders(
  apiKey: string,
  extraHeaders: Record<string, string> = {},
  includeContentType = true,
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    ...extraHeaders,
  };

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Handles API response errors
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Parses Server-Sent Events (SSE) data chunks
 */
export function parseSSEChunk(chunkData: string): unknown | null {
  if (!chunkData.trim().startsWith('data:')) {
    return null;
  }

  try {
    return JSON.parse(chunkData.replace(/^data: /, ''));
  } catch (error) {
    console.error('Failed to parse chunk:', chunkData);
    throw new Error(`Invalid chunk format: ${chunkData}`);
  }
}

/**
 * Processes buffer and extracts complete SSE chunks
 */
export function processSSEBuffer<T>(buffer: string, chunks: T[], onChunk?: (chunk: T) => void): string {
  const splitMark = '\n\n';
  let remainingBuffer = buffer;

  while (true) {
    const chunkEnd = remainingBuffer.indexOf(splitMark);
    if (chunkEnd === -1) break;

    const chunkData = remainingBuffer.slice(0, chunkEnd + splitMark.length);
    remainingBuffer = remainingBuffer.slice(chunkEnd + splitMark.length);

    const chunk = parseSSEChunk(chunkData);
    if (chunk) {
      chunks.push(chunk as T);
      onChunk?.(chunk as T);
    }
  }

  return remainingBuffer;
}

/**
 * Handles streaming response using modern fetch API
 */
export async function handleStreamResponse<T>(response: Response, onChunk?: (chunk: T) => void): Promise<T[]> {
  if (!response.body) {
    throw new Error('Response body is empty');
  }

  const reader = response.body.getReader();
  const chunks: T[] = [];
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (value) {
        buffer += new TextDecoder().decode(value, { stream: true });
        buffer = processSSEBuffer(buffer, chunks, onChunk);
      }

      if (done) {
        // Process any remaining data in buffer
        processSSEBuffer(buffer, chunks, onChunk);
        break;
      }
    }
  } finally {
    reader.releaseLock();
  }

  return chunks;
}

/**
 * Checks if streaming is supported in the current environment
 */
export function isStreamingSupported(): boolean {
  try {
    return typeof ReadableStream !== 'undefined' && new Response(new ReadableStream()).body?.getReader() !== undefined;
  } catch {
    return false;
  }
}

/**
 * Creates a FormData object for file uploads
 */
export function createFormData(params: { file: File | Blob; user: string }): FormData {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('user', params.user);
  return formData;
}

/**
 * Builds URL with query parameters
 */
export function buildURL(baseUrl: string, path: string, params: Record<string, string> = {}): string {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
