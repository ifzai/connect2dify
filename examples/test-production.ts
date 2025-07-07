import { buildURL } from '../src/utils.js';

/**
 * Simple test to verify buildURL is working correctly in production scenario
 */
function testProductionScenario() {
  console.log('🧪 Testing production scenario');
  console.log('==============================\n');

  // The exact case that was failing in production
  const baseUrl = 'https://api.dify.ai/v1';
  const path = 'workflows/run';

  console.log('🔍 Testing the exact production case:');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Path: ${path}`);

  try {
    const result = buildURL(baseUrl, path);
    console.log(`✅ Success! Result: ${result}`);

    // Verify the URL is valid
    const url = new URL(result);
    console.log('✅ URL validation passed');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Host: ${url.host}`);
    console.log(`   Pathname: ${url.pathname}`);

    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

const result = testProductionScenario();
process.exit(result ? 0 : 1);
