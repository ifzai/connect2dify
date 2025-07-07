import { DifyClient } from '../src/index.js';

/**
 * App Info and Parameters Demo
 * Tests app information retrieval and parameter checking
 */
async function appInfoDemo() {
  // Initialize the Dify client
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-D9lvqK3YpGnOetRDA2yIHexo',
  });

  console.log('📱 App Info and Parameters Demo');
  console.log('===============================\n');

  try {
    // Test 1: Get app info
    console.log('📋 Test 1: Getting App Info...');
    const appInfo = await client.app.getInfo();

    console.log('✅ App Info Retrieved:');
    console.log(`- Name: ${appInfo.name}`);
    console.log(`- Description: ${appInfo.description || 'No description'}`);
    console.log(`- Mode: ${appInfo.mode}`);
    console.log(`- Author: ${appInfo.author_name}`);
    console.log(`- Tags: ${appInfo.tags?.join(', ') || 'No tags'}`);

    // Test 2: Get app parameters
    console.log('\n⚙️  Test 2: Getting App Parameters...');
    const appParams = await client.app.getParameters();

    console.log('✅ App Parameters Retrieved:');
    console.log(`- Opening statement: ${appParams.opening_statement || 'None'}`);
    console.log(`- Speech to text enabled: ${appParams.speech_to_text?.enabled}`);
    console.log(`- Text to speech enabled: ${appParams.text_to_speech?.enabled}`);
    console.log(`- File upload enabled: ${appParams.file_upload?.image?.enabled || false}`);

    if (appParams.user_input_form && appParams.user_input_form.length > 0) {
      console.log('- User input form fields:');
      appParams.user_input_form.forEach((field, index) => {
        const fieldName = Object.keys(field)[0];
        const fieldConfig = field[fieldName];
        console.log(`  ${index + 1}. ${fieldName}: ${fieldConfig.variable} (${fieldConfig.type})`);
      });
    }

    if (appParams.suggested_questions && appParams.suggested_questions.length > 0) {
      console.log('- Suggested questions:');
      appParams.suggested_questions.forEach((question, index) => {
        console.log(`  ${index + 1}. ${question}`);
      });
    }

    // Test 3: Get app meta (if available)
    console.log('\n🎨 Test 3: Getting App Meta...');
    try {
      const appMeta = await client.app.getMeta();
      console.log('✅ App Meta Retrieved:');
      console.log(`- Tool icons: ${Object.keys(appMeta.tool_icons || {}).length} available`);
    } catch (metaError) {
      console.log('ℹ️  App meta not available or not supported');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ App info retrieval failed:', errorMessage);
  }

  console.log('\n🏁 Demo completed!');
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  appInfoDemo().catch(console.error);
}

export { appInfoDemo };
