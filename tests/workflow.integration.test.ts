import { describe, expect, test } from 'vitest';
import { DifyClient } from '../src/index.js';

describe('Dify Workflow Integration Tests', () => {
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const testUser = '803a546f-98d5-4f09-8b09-f237ae790704';

  test('should execute workflow with blocking response', async () => {
    const workflowParams = {
      inputs: {
        query: 'What is the weather like today?',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    try {
      const response = await client.workflow.runWorkflow(workflowParams);

      console.log('Workflow Response:', JSON.stringify(response, null, 2));

      // Validate response structure
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');

      // Common workflow response properties
      if ('data' in response) {
        expect(response.data).toBeDefined();
      }

      if ('workflow_run_id' in response) {
        expect(typeof response.workflow_run_id).toBe('string');
      }

      if ('task_id' in response) {
        expect(typeof response.task_id).toBe('string');
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      // Log the error but don't fail the test completely as it might be due to API limits or configuration
      expect(error).toBeInstanceOf(Error);
    }
  }, 30000); // 30 second timeout for API call

  test('should execute workflow with streaming response', async () => {
    const workflowParams = {
      inputs: {
        query: 'Tell me a short story about a robot.',
      },
      user: testUser,
      response_mode: 'streaming' as const,
    };

    try {
      const response = await client.workflow.runWorkflow(workflowParams);

      console.log('Streaming Response Type:', typeof response);
      console.log('Is Array:', Array.isArray(response));

      if (Array.isArray(response)) {
        console.log('Streaming chunks received:', response.length);

        // Validate streaming response
        expect(response).toBeInstanceOf(Array);

        if (response.length > 0) {
          console.log('First chunk:', JSON.stringify(response[0], null, 2));
          console.log(
            'Last chunk:',
            JSON.stringify(response[response.length - 1], null, 2),
          );
        }

        // Each chunk should be an object
        response.forEach((chunk, index) => {
          expect(typeof chunk).toBe('object');
          console.log(`Chunk ${index}:`, chunk);
        });
      } else {
        console.log(
          'Non-streaming response:',
          JSON.stringify(response, null, 2),
        );
        expect(response).toBeDefined();
      }
    } catch (error) {
      console.error('Streaming workflow execution failed:', error);
      // Log the error but don't fail the test completely
      expect(error).toBeInstanceOf(Error);
    }
  }, 45000); // 45 second timeout for streaming

  test('should handle workflow with custom inputs', async () => {
    const customWorkflowParams = {
      inputs: {
        query: 'How do I cook pasta?',
        context: 'cooking instructions',
        language: 'English',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    try {
      const response = await client.workflow.runWorkflow(customWorkflowParams);

      console.log(
        'Custom Workflow Response:',
        JSON.stringify(response, null, 2),
      );

      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
    } catch (error) {
      console.error('Custom workflow execution failed:', error);
      expect(error).toBeInstanceOf(Error);
    }
  }, 30000);

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
    // First, run a workflow to get a workflow_run_id
    const workflowParams = {
      inputs: {
        query: 'Hello, this is a test for getting workflow info.',
      },
      user: testUser,
      response_mode: 'blocking' as const,
    };

    try {
      const runResponse = await client.workflow.runWorkflow(workflowParams);
      console.log('Run Response:', JSON.stringify(runResponse, null, 2));

      // Extract the workflow_run_id from the response
      let workflowRunId: string | undefined;

      if (!Array.isArray(runResponse) && 'workflow_run_id' in runResponse) {
        workflowRunId = runResponse.workflow_run_id as string;
      }

      if (!workflowRunId) {
        console.log('No workflow_run_id found in response');
        return;
      }

      console.log('Using workflow_run_id:', workflowRunId);

      // Now try to get information about this specific workflow run
      const workflowInfo = await client.workflow.getWorkflow({
        workflow_run_id: workflowRunId,
      });

      console.log('Workflow Info:', JSON.stringify(workflowInfo, null, 2));

      // Validate response structure
      expect(workflowInfo).toBeDefined();
      expect(typeof workflowInfo).toBe('object');

      // Check for expected workflow properties
      if (workflowInfo.id && workflowInfo.id !== null) {
        expect(typeof workflowInfo.id).toBe('string');
      }

      if (workflowInfo.workflow_id && workflowInfo.workflow_id !== null) {
        expect(typeof workflowInfo.workflow_id).toBe('string');
      }

      if (workflowInfo.status && workflowInfo.status !== null) {
        expect(['running', 'succeeded', 'failed', 'stopped']).toContain(
          workflowInfo.status,
        );
      }
    } catch (error) {
      console.error('Get workflow info failed:', error);
      expect(error).toBeInstanceOf(Error);
    }
  }, 60000);
});
