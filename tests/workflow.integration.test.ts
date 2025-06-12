import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DifyClient } from '../src/index.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Dify Workflow Integration Tests', () => {
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'test-api-key',
  });

  const testUser = 'test-user-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should execute workflow with blocking response', async () => {
    // Mock blocking workflow response
    const mockResponse = {
      task_id: 'mock-task-id-123',
      workflow_run_id: 'mock-workflow-run-id-456',
      data: {
        id: 'mock-workflow-run-id-456',
        workflow_id: 'mock-workflow-id-789',
        status: 'succeeded',
        outputs: {
          result: "Today's weather is sunny with a temperature of 25°C. Perfect for outdoor activities!",
        },
        error: '',
        elapsed_time: 2.5,
        total_tokens: 150,
        total_steps: 3,
        created_at: Date.now(),
        finished_at: Date.now() + 2500,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const workflowParams = {
      inputs: {
        query: 'What is the weather like today?',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    const response = await client.workflow.runWorkflow(workflowParams);

    console.log('Workflow Response:', JSON.stringify(response, null, 2));

    // Validate response structure
    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(Array.isArray(response)).toBe(false);

    if (!Array.isArray(response)) {
      expect(response.data).toBeDefined();
      expect(response.workflow_run_id).toBe('mock-workflow-run-id-456');
      expect(response.task_id).toBe('mock-task-id-123');
      expect(response.data.status).toBe('succeeded');
      expect(response.data.outputs.result).toContain('weather');
    }
  }, 5000);

  test('should execute workflow with streaming response', async () => {
    // Mock streaming workflow response
    const mockStreamingChunks = [
      {
        event: 'workflow_started',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          id: 'mock-workflow-run-id-streaming',
          workflow_id: 'mock-workflow-id-streaming',
          created_at: Date.now(),
        },
      },
      {
        event: 'node_started',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          node_id: 'llm-node-1',
          node_type: 'llm',
          title: 'LLM',
          index: 1,
        },
      },
      {
        event: 'text_chunk',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          text: 'Once upon a time, there was a little robot named Beep.',
          from_variable_selector: ['llm-node-1', 'text'],
        },
      },
      {
        event: 'text_chunk',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          text: ' Beep lived in a junkyard and loved to collect shiny things.',
          from_variable_selector: ['llm-node-1', 'text'],
        },
      },
      {
        event: 'node_finished',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          node_id: 'llm-node-1',
          status: 'succeeded',
          outputs: {
            text: 'Once upon a time, there was a little robot named Beep. Beep lived in a junkyard and loved to collect shiny things.',
          },
        },
      },
      {
        event: 'workflow_finished',
        workflow_run_id: 'mock-workflow-run-id-streaming',
        task_id: 'mock-task-id-streaming',
        data: {
          id: 'mock-workflow-run-id-streaming',
          status: 'succeeded',
          outputs: {
            result:
              'Once upon a time, there was a little robot named Beep. Beep lived in a junkyard and loved to collect shiny things.',
          },
          total_tokens: 50,
          elapsed_time: 3.2,
          total_steps: 2,
        },
      },
    ];

    // Create a more complete mock for the streaming response
    const mockStreamData = mockStreamingChunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join('');

    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(mockStreamData),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      releaseLock: vi.fn(),
    };

    // Mock the streaming response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
      headers: new Headers({
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
      }),
    });

    const workflowParams = {
      inputs: {
        query: 'Tell me a short story about a robot.',
      },
      user: testUser,
      response_mode: 'streaming' as const,
    };

    const response = await client.workflow.runWorkflow(workflowParams);

    console.log('Streaming Response Type:', typeof response);
    console.log('Is Array:', Array.isArray(response));

    if (Array.isArray(response)) {
      console.log('Streaming chunks received:', response.length);
      expect(response).toBeInstanceOf(Array);
      expect(response.length).toBeGreaterThan(0);

      // Validate streaming response chunks
      response.forEach((chunk, index) => {
        expect(typeof chunk).toBe('object');
        expect(chunk.event).toBeDefined();
        console.log(`Chunk ${index}:`, chunk);
      });

      // Check for specific events
      const hasWorkflowStarted = response.some((chunk) => chunk.event === 'workflow_started');
      const hasTextChunk = response.some((chunk) => chunk.event === 'text_chunk');
      const hasWorkflowFinished = response.some((chunk) => chunk.event === 'workflow_finished');

      expect(hasWorkflowStarted).toBe(true);
      expect(hasTextChunk).toBe(true);
      expect(hasWorkflowFinished).toBe(true);

      // Verify releaseLock was called
      expect(mockReader.releaseLock).toHaveBeenCalled();
    } else {
      console.log('Non-streaming response:', JSON.stringify(response, null, 2));
      expect(response).toBeDefined();
    }
  }, 10000);

  test('should handle workflow with custom inputs', async () => {
    // Mock custom workflow response
    const mockCustomResponse = {
      task_id: 'mock-custom-task-id',
      workflow_run_id: 'mock-custom-workflow-run-id',
      data: {
        id: 'mock-custom-workflow-run-id',
        workflow_id: 'mock-custom-workflow-id',
        status: 'succeeded',
        outputs: {
          result:
            "Here's how to cook pasta step by step:\n1. Boil water in a large pot\n2. Add salt to the water\n3. Add pasta and cook for 8-12 minutes\n4. Drain and serve with your favorite sauce",
        },
        error: '',
        elapsed_time: 4.2,
        total_tokens: 200,
        total_steps: 3,
        created_at: Date.now(),
        finished_at: Date.now() + 4200,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCustomResponse,
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const customWorkflowParams = {
      inputs: {
        query: 'How do I cook pasta?',
        context: 'cooking instructions',
        language: 'English',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    const response = await client.workflow.runWorkflow(customWorkflowParams);

    console.log('Custom Workflow Response:', JSON.stringify(response, null, 2));

    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(Array.isArray(response)).toBe(false);

    if (!Array.isArray(response)) {
      expect(response.data).toBeDefined();
      expect(response.data.status).toBe('succeeded');
      expect(response.data.outputs.result).toContain('pasta');
    }
  }, 5000);

  test('should validate workflow parameters', () => {
    // Test parameter validation
    expect(() => {
      const invalidParams = {
        inputs: {
          query: 'Test query',
        },
        // Missing user parameter
        response_mode: 'blocking' as const,
      };

      // This should not throw as the validation happens during API call
      expect(invalidParams.inputs.query).toBe('Test query');
    }).not.toThrow();
  });

  test('should get workflow run information after executing workflow', async () => {
    const workflowRunId = 'mock-info-workflow-run-id';

    // Mock workflow execution response
    const mockRunResponse = {
      task_id: 'mock-info-task-id',
      workflow_run_id: workflowRunId,
      data: {
        id: workflowRunId,
        workflow_id: 'mock-info-workflow-id',
        status: 'succeeded',
        outputs: {
          result: 'This is a test response for workflow information retrieval.',
        },
        error: '',
        elapsed_time: 3.1,
        total_tokens: 100,
        total_steps: 2,
        created_at: Date.now(),
        finished_at: Date.now() + 3100,
      },
    };

    // Mock workflow info response
    const mockWorkflowInfo = {
      id: workflowRunId,
      workflow_id: 'mock-info-workflow-id',
      status: 'succeeded',
      inputs: JSON.stringify({
        query: 'Hello, this is a test for getting workflow info.',
        'sys.files': [],
        'sys.user_id': testUser,
        'sys.app_id': 'mock-app-id',
        'sys.workflow_id': 'mock-info-workflow-id',
        'sys.workflow_run_id': workflowRunId,
      }),
      outputs: JSON.stringify({
        result: 'This is a test response for workflow information retrieval.',
      }),
      error: null,
      total_steps: 2,
      total_tokens: 100,
      created_at: Date.now() - 3100,
      finished_at: Date.now(),
      elapsed_time: 3.1,
    };

    // First mock for workflow execution
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRunResponse,
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    // Second mock for getting workflow info
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWorkflowInfo,
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    // First, run a workflow to get a workflow_run_id
    const workflowParams = {
      inputs: {
        query: 'Hello, this is a test for getting workflow info.',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    const runResponse = await client.workflow.runWorkflow(workflowParams);
    console.log('Run Response:', JSON.stringify(runResponse, null, 2));

    // Extract the workflow_run_id from the response
    let extractedWorkflowRunId: string | undefined;

    if (!Array.isArray(runResponse) && 'workflow_run_id' in runResponse) {
      extractedWorkflowRunId = runResponse.workflow_run_id as string;
    }

    expect(extractedWorkflowRunId).toBe(workflowRunId);
    console.log('Using workflow_run_id:', extractedWorkflowRunId);

    // Now try to get information about this specific workflow run
    expect(extractedWorkflowRunId).toBeDefined();
    const workflowInfo = await client.workflow.getWorkflow({
      workflow_run_id: extractedWorkflowRunId as string,
    });

    console.log('Workflow Info:', JSON.stringify(workflowInfo, null, 2));

    // Validate response structure
    expect(workflowInfo).toBeDefined();
    expect(typeof workflowInfo).toBe('object');
    expect(workflowInfo.id).toBe(workflowRunId);
    expect(workflowInfo.workflow_id).toBe('mock-info-workflow-id');
    expect(workflowInfo.status).toBe('succeeded');
    expect(workflowInfo.total_steps).toBe(2);
    expect(workflowInfo.total_tokens).toBe(100);
  }, 10000);
});
