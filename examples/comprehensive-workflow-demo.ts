import { DifyClient } from '../src/index.js';

/**
 * Comprehensive workflow demonstration including all API features
 * This example showcases:
 * - Blocking workflow execution
 * - Streaming workflow execution
 * - Custom input parameters
 * - Error handling
 * - Workflow run information retrieval
 */

async function comprehensiveWorkflowDemo() {
  // Initialize the Dify client with real credentials
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('🎯 Comprehensive Dify Workflow Demo');
  console.log('===================================\n');

  // Test 1: Blocking workflow execution
  console.log('📋 Test 1: Blocking Workflow Execution');
  console.log('--------------------------------------');

  try {
    const startTime = Date.now();
    const blockingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'What is the weather like today?',
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
        console.log(
          '- Output keys:',
          Object.keys(blockingResponse.data.outputs),
        );
      }
    }
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Blocking workflow failed:', errorMessage);
    console.log('\n');
  }

  // Test 2: Streaming workflow execution
  console.log('🔄 Test 2: Streaming Workflow Execution');
  console.log('---------------------------------------');

  try {
    const startTime = Date.now();

    console.log('🚀 Starting streaming workflow...');
    console.log('📝 Streaming output (word by word):');
    console.log('---');

    let streamedText = '';
    let chunkCount = 0;
    const eventTypes: Record<string, number> = {};

    // Use the streaming callback to show real-time output
    const streamingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'Tell me a short story about a robot.',
      },
      user: userId,
      response_mode: 'streaming',
      chunkCompletionCallback: (chunk) => {
        chunkCount++;
        eventTypes[chunk.event] = (eventTypes[chunk.event] || 0) + 1;

        // Show workflow events
        if (chunk.event === 'workflow_started') {
          console.log('\n🎬 Workflow started...');
        } else if (chunk.event === 'node_started') {
          console.log(`\n🔧 Node started: ${chunk.data?.title || 'Unknown'}`);
        } else if (chunk.event === 'text_chunk' && chunk.data?.text) {
          // This is the actual streaming text - show it word by word
          process.stdout.write(chunk.data.text);
          streamedText += chunk.data.text;
        } else if (chunk.event === 'node_finished') {
          console.log(`\n✅ Node finished: ${chunk.data?.title || 'Unknown'}`);
        } else if (chunk.event === 'workflow_finished') {
          console.log('\n\n🏁 Workflow finished!');
        }
      },
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log('\n---');
    console.log(`✅ Streaming execution completed in ${executionTime}s`);
    console.log('📊 Statistics:');
    console.log(`- Total chunks received: ${chunkCount}`);
    console.log(`- Streamed text length: ${streamedText.length} characters`);
    console.log('- Event type distribution:', eventTypes);

    // Also show the final response structure
    if (Array.isArray(streamingResponse) && streamingResponse.length > 0) {
      const lastChunk = streamingResponse[streamingResponse.length - 1];
      if (lastChunk.event === 'workflow_finished' && lastChunk.data) {
        console.log(`- Final status: ${lastChunk.data.status}`);
        console.log(`- Total tokens: ${lastChunk.data.total_tokens}`);
        console.log(`- Execution time: ${lastChunk.data.elapsed_time}s`);
      }
    }

    console.log('\n');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Streaming workflow failed:', errorMessage);
    console.log('\n');
  }

  // Test 3: Custom input parameters
  console.log('⚙️  Test 3: Custom Input Parameters');
  console.log('-----------------------------------');

  try {
    const customResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'How do I cook pasta step by step?',
        // You can add more custom inputs here based on your workflow configuration
      },
      user: userId,
      response_mode: 'blocking',
    });

    console.log('✅ Custom inputs workflow executed successfully');
    if ('data' in customResponse && customResponse.data?.outputs) {
      const outputKeys = Object.keys(customResponse.data.outputs);
      console.log(`- Output fields: ${outputKeys.join(', ')}`);
    }
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Custom inputs workflow failed:', errorMessage);
    console.log('\n');
  }

  // Test 4: Parameter validation
  console.log('✅ Test 4: Parameter Validation');
  console.log('-------------------------------');

  try {
    // This should work
    await client.workflow.runWorkflow({
      inputs: { query: 'Valid query' },
      user: userId,
      response_mode: 'blocking',
    });
    console.log('✅ Valid parameters accepted');
  } catch (error: unknown) {
    console.log('❌ Unexpected error with valid parameters:', error);
  }

  try {
    // This might fail due to invalid parameters
    await client.workflow.runWorkflow({
      inputs: {}, // Empty inputs
      user: userId,
      response_mode: 'blocking',
    });
    console.log(
      '⚠️  Empty inputs were accepted (might be valid for some workflows)',
    );
  } catch (error: unknown) {
    console.log('✅ Empty inputs properly rejected');
  }

  console.log('\n');

  // Test 5: Workflow run information (if we have a workflow_run_id)
  console.log('📊 Test 5: Workflow Run Information');
  console.log('-----------------------------------');

  try {
    // First execute a workflow to get a workflow_run_id
    const runResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'Hello, this is a test for getting workflow info.',
      },
      user: userId,
      response_mode: 'blocking',
    });

    if ('workflow_run_id' in runResponse && runResponse.workflow_run_id) {
      console.log(`Using workflow_run_id: ${runResponse.workflow_run_id}`);

      // Now try to get information about this specific workflow run
      const workflowInfo = await client.workflow.getWorkflow({
        workflow_run_id: runResponse.workflow_run_id,
      });

      if (workflowInfo.id) {
        console.log('✅ Successfully retrieved workflow run information');
        console.log(`- Run ID: ${workflowInfo.id}`);
        console.log(`- Workflow ID: ${workflowInfo.workflow_id}`);
        console.log(`- Status: ${workflowInfo.status}`);
        console.log(`- Total Steps: ${workflowInfo.total_steps}`);
        console.log(`- Total Tokens: ${workflowInfo.total_tokens}`);
      } else {
        console.log('⚠️  Workflow run information returned null values');
        console.log(
          'This might indicate the endpoint expects different parameters',
        );
      }
    } else {
      console.log('❌ No workflow_run_id found in response');
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Getting workflow run information failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  comprehensiveWorkflowDemo().catch(console.error);
}

export { comprehensiveWorkflowDemo };
