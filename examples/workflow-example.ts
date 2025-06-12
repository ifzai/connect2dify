import { DifyClient } from '../src/index.js';

/**
 * Example script demonstrating how to use the Dify workflow API
 * This script makes real API calls to the Dify service
 */

async function runWorkflowExample() {
  // Initialize the Dify client with real credentials
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('🚀 Starting Dify Workflow Example...\n');

  // Example 1: Blocking workflow execution
  console.log('📋 Example 1: Blocking Workflow Execution');
  console.log('----------------------------------------');

  try {
    const blockingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'What are the benefits of TypeScript over JavaScript?',
      },
      user: userId,
      response_mode: 'blocking',
    });

    console.log('✅ Blocking Response:');
    console.log(JSON.stringify(blockingResponse, null, 2));
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Blocking workflow failed:', errorMessage);
    console.log('\n');
  }

  // Example 2: Streaming workflow execution
  console.log('🔄 Example 2: Streaming Workflow Execution');
  console.log('------------------------------------------');

  try {
    const streamingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'Write a short poem about programming.',
      },
      user: userId,
      response_mode: 'streaming',
    });

    if (Array.isArray(streamingResponse)) {
      console.log('✅ Streaming Response (chunks):');
      streamingResponse.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1}:`, chunk);
      });
    } else {
      console.log('✅ Non-streaming Response:');
      console.log(JSON.stringify(streamingResponse, null, 2));
    }
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Streaming workflow failed:', errorMessage);
    console.log('\n');
  }

  // Example 3: Workflow with multiple inputs
  console.log('🎯 Example 3: Workflow with Multiple Inputs');
  console.log('--------------------------------------------');

  try {
    const multiInputResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'How do I deploy a Node.js application?',
        context: 'web development',
        difficulty: 'beginner',
      },
      user: userId,
      response_mode: 'blocking',
    });

    console.log('✅ Multi-input Response:');
    console.log(JSON.stringify(multiInputResponse, null, 2));
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Multi-input workflow failed:', errorMessage);
    console.log('\n');
  }

  console.log('🎉 Workflow examples completed!');
}

// Run the example
runWorkflowExample().catch(console.error);
