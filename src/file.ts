/**
 * File and media-related API methods for Dify client
 */

import type {
  UploadFileParams,
  UploadFileResponse,
  AudioToTextParams,
  AudioToTextResult,
  TextToAudioParams,
  DifyConfiguration,
} from './types.js';

import { createHeaders, handleResponse, buildURL, createFormData } from './utils.js';

/**
 * File and Media API methods
 */
export class FileAPI {
  constructor(private config: DifyConfiguration) {}

  /**
   * Upload a file to Dify
   * @param params - Upload parameters
   * @returns Promise resolving to upload response
   */
  async uploadFile(params: UploadFileParams): Promise<UploadFileResponse> {
    const url = buildURL(this.config.baseUrl, 'v1/files/upload');
    const formData = createFormData(params);

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders, false),
      body: formData,
    });

    return handleResponse<UploadFileResponse>(response);
  }

  /**
   * Convert audio to text using speech recognition
   * @param params - Audio parameters
   * @returns Promise resolving to transcription result
   */
  async audioToText(params: AudioToTextParams): Promise<AudioToTextResult> {
    const url = buildURL(this.config.baseUrl, 'v1/audio-to-text');
    const formData = createFormData(params);

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders, false),
      body: formData,
    });

    return handleResponse<AudioToTextResult>(response);
  }

  /**
   * Convert text to speech audio
   * @param params - Text-to-speech parameters
   * @returns Promise resolving to audio blob
   */
  async textToAudio(params: TextToAudioParams): Promise<Blob> {
    const url = buildURL(this.config.baseUrl, 'v1/text-to-audio');

    const response = await fetch(url, {
      method: 'POST',
      headers: createHeaders(this.config.apiKey, this.config.requestOptions?.extraHeaders),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }
}
