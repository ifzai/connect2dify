import { DifyClient } from '../src/index.js';

/**
 * Chat Streaming Mode Demo
 * Tests the basic streaming chat functionality (agent-chat apps only support streaming)
 */
async function chatStreamingDemo() {
  // Initialize the Dify client
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-BULne4gxjnuRCqcXisqqHn2I',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('💬 Chat Streaming Mode Demo');
  console.log('============================\n');

  console.log('ℹ️  Agent-chat applications only support streaming mode');
  console.log('   This demo shows the correct streaming implementation.\n');

  try {
    const startTime = Date.now();
    console.log('🚀 Sending streaming chat message...');

    const chatResponse = await client.chat.sendMessage({
      query: 'Hello! Can you design a simple logo for a tech company?',
      user: userId,
      response_mode: 'streaming',
      inputs: {}, // Required parameter for agent-chat
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log(`✅ Chat streaming completed in ${executionTime} seconds`);
    console.log('\n📊 Response Analysis:');
    console.log(`   Response Type: ${typeof chatResponse}`);
    console.log(`   Is Array: ${Array.isArray(chatResponse)}`);

    if (Array.isArray(chatResponse)) {
      console.log(`   Total chunks: ${chatResponse.length}`);
      console.log('\n📝 First few chunks:');
      chatResponse.slice(0, 3).forEach((chunk, index) => {
        console.log(`   Chunk ${index}: ${JSON.stringify(chunk, null, 2)}`);
      });

      // Show final response if available
      const finalChunk = chatResponse.find((chunk) => chunk.event === 'message_end');
      if (finalChunk) {
        console.log('\n🎯 Final Response:');
        console.log(`   Message ID: ${finalChunk.message_id}`);
        console.log(`   Conversation ID: ${finalChunk.conversation_id}`);
      }
    } else {
      console.log('\n📝 Response Details:');
      console.log(JSON.stringify(chatResponse, null, 2));
    }
  } catch (error) {
    console.log('❌ Chat streaming failed:', error);

    // Show the correct API format for reference
    console.log('\n📋 Correct API Request Format:');
    console.log('   POST /v1/chat-messages');
    console.log('   Headers: Authorization: Bearer app-BULne4gxjnuRCqcXisqqHn2I');
    console.log('   Body: {');
    console.log('     "query": "Your message here",');
    console.log(`     "user": "${userId}",`);
    console.log('     "response_mode": "streaming",');
    console.log('     "inputs": {}');
    console.log('   }');
  }

  console.log('\n🏁 Demo completed!');
}

chatStreamingDemo().catch(console.error);
