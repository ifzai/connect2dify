import { DifyClient } from '../src/index.js';

/**
 * Simple test script to verify the Dify API endpoint
 */

async function testDifyAPI() {
  console.log('🔍 Testing Dify API...\n');

  // Test with the provided credentials
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  try {
    // Try the simplest endpoint first - app info
    console.log('📱 Testing App Info endpoint...');
    const appInfo = await client.app.getInfo();
    console.log('✅ App Info Success:', JSON.stringify(appInfo, null, 2));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ App Info Error:', errorMessage);
  }

  try {
    // Test chat endpoint which is more commonly available
    console.log('\n💬 Testing Chat endpoint...');
    const chatResponse = await client.chat.sendMessage({
      query: 'Hello',
      user: '803a546f-98d5-4f09-8b09-f237ae790704',
      response_mode: 'blocking',
    });
    console.log('✅ Chat Success:', JSON.stringify(chatResponse, null, 2));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Chat Error:', errorMessage);
  }

  console.log('\n🏁 Test completed!');
}

testDifyAPI().catch(console.error);
