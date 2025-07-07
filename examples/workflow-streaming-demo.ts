import { DifyClient } from '../src/index.js';

/**
 * Workflow Streaming Mode Demo
 * Tests the streaming workflow functionality
 */
async function workflowStreamingDemo() {
  // Initialize the Dify client
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('🔄 Workflow Streaming Mode Demo');
  console.log('================================\n');

  try {
    const startTime = Date.now();

    console.log('🚀 Starting streaming workflow...');
    console.log('📝 Streaming output:');
    console.log('---');

    let streamedText = '';
    let chunkCount = 0;
    const eventTypes: Record<string, number> = {};

    // Use the streaming callback to show real-time output
    const streamingResponse = await client.workflow.runWorkflow({
      inputs: {
        query: 'Tell me a very short joke.',
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Streaming workflow failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  workflowStreamingDemo().catch(console.error);
}

export { workflowStreamingDemo };
