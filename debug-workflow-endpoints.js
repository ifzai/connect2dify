// Debug script to test different workflow endpoints
const fetch = require('node-fetch');

const baseUrl = 'https://api.dify.ai/v1';
const apiKey = 'app-D9lvqK3YpGnOetRDA2yIHexo';
const workflowId = '7344ddfd-cc4b-46e7-a2dd-5af751fd1131';

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

async function testEndpoint(endpoint, method = 'GET', body = null) {
  console.log(`\n=== Testing ${method} ${endpoint} ===`);

  try {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}/${endpoint}`, options);

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response (text):', text);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  console.log('Testing different workflow endpoints...');

  // Test the current endpoint that's not working properly
  await testEndpoint(`workflows/run/${workflowId}`);

  // Test potential alternatives
  await testEndpoint(`workflows/${workflowId}`);
  await testEndpoint(`workflows/info/${workflowId}`);
  await testEndpoint(`workflows/details/${workflowId}`);
  await testEndpoint(`workflows/meta/${workflowId}`);

  // Test workflow listing endpoints that might give us info
  await testEndpoint('workflows');
  await testEndpoint('workflows/list');

  // Test app endpoints since we have an app key
  await testEndpoint('meta');
  await testEndpoint('info');
  await testEndpoint('parameters');

  console.log('\n=== Done testing endpoints ===');
}

main().catch(console.error);
