import { DifyClient } from '../src/index.js';

/**
 * Workflow Blocking Mode Demo
 * Tests the basic blocking workflow functionality
 */
async function workflowBlockingDemo() {
  // Initialize the Dify client
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('📋 Workflow Blocking Mode Demo');
  console.log('===============================\n');

  try {
    const startTime = Date.now();
    console.log('🚀 Running blocking workflow...');

    const blockingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'What is the current time?',
      },
      user: userId,
      response_mode: 'blocking',
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log(`✅ Blocking execution completed in ${executionTime}s`);
    console.log('Response structure:');

    if (!Array.isArray(blockingResponse)) {
      if ('task_id' in blockingResponse) {
        console.log(`- Task ID: ${blockingResponse.task_id}`);
      }
      if ('workflow_run_id' in blockingResponse) {
        console.log(`- Workflow Run ID: ${blockingResponse.workflow_run_id}`);
      }
    }

    if ('data' in blockingResponse && blockingResponse.data) {
      console.log(`- Status: ${blockingResponse.data.status}`);
      console.log(`- Total Steps: ${blockingResponse.data.total_steps}`);
      console.log(`- Total Tokens: ${blockingResponse.data.total_tokens}`);
      console.log(`- Elapsed Time: ${blockingResponse.data.elapsed_time}s`);

      if (blockingResponse.data.outputs) {
        console.log('- Output keys:', Object.keys(blockingResponse.data.outputs));

        // Show the result if available
        if ('result' in blockingResponse.data.outputs) {
          const result = blockingResponse.data.outputs.result as string;
          console.log(`- Result preview: ${result.substring(0, 200)}...`);
        }
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Blocking workflow failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  workflowBlockingDemo().catch(console.error);
}

export { workflowBlockingDemo };
