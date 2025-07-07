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
        console.log('- Output keys:', Object.keys(blockingResponse.data.outputs));
      }
    }
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    console.log('⚠️  Empty inputs were accepted (might be valid for some workflows)');
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
        console.log('This might indicate the endpoint expects different parameters');
      }
    } else {
      console.log('❌ No workflow_run_id found in response');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Getting workflow run information failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

/**
 * Comprehensive chat demonstration including all chat API features
 * This example showcases:
 * - Blocking chat message sending
 * - Streaming chat message sending
 * - Conversation management
 * - Message feedback
 * - Error handling
 */
async function comprehensiveChatDemo() {
  // Initialize the Dify client with real credentials
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('💬 Comprehensive Dify Chat Demo');
  console.log('===============================\n');

  // Test 1: Blocking chat message
  console.log('📋 Test 1: Blocking Chat Message');
  console.log('---------------------------------');

  try {
    const startTime = Date.now();
    const chatResponse = await client.chat.sendMessage({
      query: 'Hello! Can you tell me about artificial intelligence?',
      user: userId,
      response_mode: 'blocking',
      inputs: {},
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log(`✅ Blocking chat completed in ${executionTime}s`);
    console.log('Response structure:');

    if (!Array.isArray(chatResponse)) {
      console.log(`- Event: ${chatResponse.event}`);
      console.log(`- Message ID: ${chatResponse.message_id}`);
      console.log(`- Conversation ID: ${chatResponse.conversation_id}`);
      console.log(`- Created At: ${new Date(chatResponse.created_at * 1000).toLocaleString()}`);

      if (chatResponse.answer) {
        console.log(`- Answer length: ${chatResponse.answer.length} characters`);
        console.log(`- Answer preview: ${chatResponse.answer.substring(0, 100)}...`);
      }

      if (chatResponse.metadata) {
        console.log(`- Usage: ${chatResponse.metadata.usage?.total_tokens || 'N/A'} tokens`);
      }
    }
    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Blocking chat failed:', errorMessage);
    console.log('\n');
  }

  // Test 2: Streaming chat message
  console.log('🔄 Test 2: Streaming Chat Message');
  console.log('----------------------------------');

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
      query: 'Write a short poem about coding.',
      user: userId,
      response_mode: 'streaming',
      inputs: {},
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
            process.stdout.write(chunk.answer.slice(streamedText.length));
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

    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Streaming chat failed:', errorMessage);
    console.log('\n');
  }

  // Test 3: Continue conversation
  console.log('🔗 Test 3: Continue Conversation');
  console.log('--------------------------------');

  try {
    // First message to start a conversation
    const firstMessage = await client.chat.sendMessage({
      query: 'My name is John. What is your name?',
      user: userId,
      response_mode: 'blocking',
      inputs: {},
    });

    let conversationId = '';
    if (!Array.isArray(firstMessage)) {
      conversationId = firstMessage.conversation_id;
      console.log(`✅ Started conversation: ${conversationId}`);
    }

    // Second message in the same conversation
    if (conversationId) {
      const secondMessage = await client.chat.sendMessage({
        query: 'Do you remember my name?',
        user: userId,
        response_mode: 'blocking',
        inputs: {},
        conversation_id: conversationId,
      });

      if (!Array.isArray(secondMessage)) {
        console.log(`✅ Continued conversation: ${secondMessage.conversation_id}`);
        console.log(`- Answer preview: ${secondMessage.answer?.substring(0, 100)}...`);
      }
    }

    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Conversation continuation failed:', errorMessage);
    console.log('\n');
  }

  // Test 4: Get conversation messages
  console.log('📜 Test 4: Get Conversation Messages');
  console.log('------------------------------------');

  try {
    // First create a conversation
    const chatResponse = await client.chat.sendMessage({
      query: 'This is a test message for conversation history.',
      user: userId,
      response_mode: 'blocking',
      inputs: {},
    });

    if (!Array.isArray(chatResponse) && chatResponse.conversation_id) {
      const conversationId = chatResponse.conversation_id;

      // Get messages from the conversation
      const messages = await client.chat.getMessages({
        conversation_id: conversationId,
        user: userId,
      });

      console.log(`✅ Retrieved ${messages.data.length} messages from conversation`);
      console.log(`- Has more: ${messages.has_more}`);
      console.log(`- Limit: ${messages.limit}`);

      if (messages.data.length > 0) {
        const firstMessage = messages.data[0];
        console.log(`- First message ID: ${firstMessage.id}`);
        console.log(`- First message query: ${firstMessage.query}`);
      }
    }

    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Getting conversation messages failed:', errorMessage);
    console.log('\n');
  }

  // Test 5: Message feedback
  console.log('👍 Test 5: Message Feedback');
  console.log('---------------------------');

  try {
    // First create a message
    const chatResponse = await client.chat.sendMessage({
      query: 'This is a test message for feedback.',
      user: userId,
      response_mode: 'blocking',
      inputs: {},
    });

    if (!Array.isArray(chatResponse) && chatResponse.message_id) {
      const messageId = chatResponse.message_id;

      // Give positive feedback
      await client.chat.createMessageFeedback({
        message_id: messageId,
        rating: 'like',
        user: userId,
      });

      console.log(`✅ Positive feedback sent for message: ${messageId}`);
    }

    console.log('\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Message feedback failed:', errorMessage);
    console.log('\n');
  }

  console.log('🏁 Chat demo completed!');
}

// Combined demo function
async function runAllDemos() {
  console.log('🚀 Running All Dify API Demos');
  console.log('==============================\n');

  // First check if it's a chat app or workflow app
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  try {
    const appInfo = await client.app.getInfo();
    console.log(`📱 App: ${appInfo.name}`);
    console.log(`🔧 Mode: ${appInfo.mode}`);
    console.log(`👤 Author: ${appInfo.author_name}\n`);

    if (appInfo.mode === 'workflow') {
      console.log('🔄 Running Workflow Demo...\n');
      await comprehensiveWorkflowDemo();
    } else if (appInfo.mode === 'chat') {
      console.log('💬 Running Chat Demo...\n');
      await comprehensiveChatDemo();
    } else {
      console.log('🔄 Running Workflow Demo...\n');
      await comprehensiveWorkflowDemo();
      console.log('\n💬 Running Chat Demo...\n');
      await comprehensiveChatDemo();
    }
  } catch (error: unknown) {
    console.error('❌ Failed to get app info:', error);
    console.log('\n🔄 Running Workflow Demo...\n');
    await comprehensiveWorkflowDemo();
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos().catch(console.error);
}

export { comprehensiveWorkflowDemo, comprehensiveChatDemo, runAllDemos };
