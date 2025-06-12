import { describe, expect, test } from 'vitest';
import { AppAPI, ChatAPI, ConversationAPI, DifyClient, FileAPI, WorkflowAPI } from '../src/index.js';

describe('Dify Client', () => {
  test('should export DifyClient class', () => {
    expect(DifyClient).toBeDefined();
    expect(typeof DifyClient).toBe('function');
  });

  test('should export API modules', () => {
    expect(ChatAPI).toBeDefined();
    expect(ConversationAPI).toBeDefined();
    expect(WorkflowAPI).toBeDefined();
    expect(FileAPI).toBeDefined();
    expect(AppAPI).toBeDefined();
  });

  test('should create DifyClient instance', () => {
    const client = new DifyClient({
      baseUrl: 'https://api.dify.ai',
      apiKey: 'test-key',
    });

    expect(client).toBeInstanceOf(DifyClient);
    expect(client.chat).toBeInstanceOf(ChatAPI);
    expect(client.conversation).toBeInstanceOf(ConversationAPI);
    expect(client.workflow).toBeInstanceOf(WorkflowAPI);
    expect(client.file).toBeInstanceOf(FileAPI);
    expect(client.app).toBeInstanceOf(AppAPI);
  });

  test('should allow config updates', () => {
    const client = new DifyClient({
      baseUrl: 'https://api.dify.ai',
      apiKey: 'test-key',
    });

    client.updateConfig({
      defaultResponseMode: 'streaming',
      defaultUser: 'test-user',
    });

    const config = client.getConfig();
    expect(config.defaultResponseMode).toBe('streaming');
    expect(config.defaultUser).toBe('test-user');
  });
});
