// Debug script to test Dify API endpoints and responses
import { DifyClient } from '../src/index.js';

async function debugDifyAPI() {
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  const userId = '803a546f-98d5-4f09-8b09-f237ae790704';

  console.log('🔍 Debugging Dify API...\n');

  // Test 1: Check app info to verify API key works
  console.log('1. Testing App Info API...');
  try {
    const appInfo = await client.app.getInfo();
    console.log('✅ App Info:', JSON.stringify(appInfo, null, 2));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ App Info failed:', errorMessage);
  }

  // Test 2: Check app parameters
  console.log('\n2. Testing App Parameters API...');
  try {
    const appParams = await client.app.getParameters();
    console.log('✅ App Parameters:', JSON.stringify(appParams, null, 2));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ App Parameters failed:', errorMessage);
  }

  // Test 3: Skip chat completion for workflow apps
  console.log('\n3. Checking App Mode...');
  try {
    const appInfo = await client.app.getInfo();
    console.log(`✅ App mode: ${appInfo.mode}`);

    if (appInfo.mode === 'workflow') {
      console.log('ℹ️  This is a workflow app, skipping chat completion test');
    } else {
      console.log('Testing Chat Completion API...');
      const chatResponse = await client.app.sendCompletionMessage({
        inputs: { query: 'Hello, this is a test.' },
        user: userId,
        response_mode: 'blocking',
      });
      console.log('✅ Chat Completion:', JSON.stringify(chatResponse, null, 2));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Chat Completion failed:', errorMessage);
  }

  // Test 4: Try direct workflow call with debug info
  console.log('\n4. Testing Workflow API with debug...');
  try {
    const workflowResponse = await client.workflow.runWorkflow({
      inputs: { query: 'Simple test' },
      user: userId,
      response_mode: 'blocking',
    });
    console.log('✅ Workflow Response:', JSON.stringify(workflowResponse, null, 2));
  } catch (error: unknown) {
    console.error('❌ Workflow failed:', error);

    // Check if it's a fetch error to get more details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      });
    }
  }

  console.log('\n🔍 Debug complete.');
}

debugDifyAPI().catch(console.error);
