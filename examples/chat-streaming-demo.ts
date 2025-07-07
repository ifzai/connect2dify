import { DifyClient } from '../src/index.js';

/**
 * Chat Streaming Mode Demo
 * Tests the streaming chat functionality
 */
async function chatStreamingDemo() {
  // Initialize the Dify client
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-BULne4gxjnuRCqcXisqqHn2I',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('🔄 Chat Streaming Mode Demo');
  console.log('============================\n');

  try {
    const startTime = Date.now();

    console.log('🚀 Starting streaming chat...');
    console.log('📝 Streaming output:');
    console.log('---');

    let streamedText = '';
    let chunkCount = 0;
    let conversationId = '';

    // Use the streaming callback to show real-time output
    const streamingResponse = await client.chat.sendMessage({
      query: 'Design a logo for a coffee shop.',
      user: userId,
      response_mode: 'streaming',
      inputs: {}, // Required for agent-chat applications
      chunkCompletionCallback: (chunk) => {
        chunkCount++;

        // Show different types of events
        if (chunk.event === 'message') {
          console.log(`\n💬 Message started (ID: ${chunk.message_id})`);
          if (chunk.conversation_id) {
            conversationId = chunk.conversation_id;
          }
        } else if (chunk.event === 'agent_message') {
          // This is the actual streaming text - show it
          if (chunk.answer) {
            const newText = chunk.answer.slice(streamedText.length);
            process.stdout.write(newText);
            streamedText = chunk.answer;
          }
        } else if (chunk.event === 'message_end') {
          console.log(`\n\n✅ Message completed (ID: ${chunk.message_id})`);
          if (chunk.metadata?.usage) {
            console.log(`📊 Usage: ${chunk.metadata.usage.total_tokens} tokens`);
          }
        }
      },
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log('\n---');
    console.log(`✅ Streaming chat completed in ${executionTime}s`);
    console.log('📊 Statistics:');
    console.log(`- Total chunks received: ${chunkCount}`);
    console.log(`- Streamed text length: ${streamedText.length} characters`);
    console.log(`- Conversation ID: ${conversationId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Streaming chat failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  chatStreamingDemo().catch(console.error);
}

export { chatStreamingDemo };
