// Raw API test using fetch to debug the endpoint structure
const API_KEY = 'app-D9lvqK3YpGnOetRDA2yIHexo';
const BASE_URL = 'https://api.dify.ai/v1';
const USER_ID = '803a546f-98d5-4f09-8b09-f237ae790704';

async function testRawAPI() {
  console.log('🧪 Testing Raw Dify API...\n');

  // Test different endpoint patterns
  const endpoints = [
    // Standard workflow endpoint
    { name: 'Workflow Run', url: `${BASE_URL}/workflows/run`, method: 'POST' },

    // Chat completion endpoints
    { name: 'Chat Messages', url: `${BASE_URL}/chat-messages`, method: 'POST' },
    {
      name: 'Completion Messages',
      url: `${BASE_URL}/completion-messages`,
      method: 'POST',
    },

    // App info endpoints
    { name: 'App Parameters', url: `${BASE_URL}/parameters`, method: 'GET' },
    { name: 'App Meta', url: `${BASE_URL}/meta`, method: 'GET' },

    // Alternative workflow patterns
    {
      name: 'Alternative Workflow',
      url: `${BASE_URL}/workflow/run`,
      method: 'POST',
    },
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.name}: ${endpoint.method} ${endpoint.url}`);

    try {
      const options = {
        method: endpoint.method,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      };

      // Add body for POST requests
      if (endpoint.method === 'POST') {
        options.body = JSON.stringify({
          inputs: { query: 'Test query' },
          user: USER_ID,
          response_mode: 'blocking',
        });
      }

      const response = await fetch(endpoint.url, options);

      console.log(`  Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('  ✅ Success:', JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        console.log(`  ❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.log('  ❌ Network Error:', error.message);
    }

    console.log('');
  }

  console.log('🧪 Raw API test complete.');
}

testRawAPI().catch(console.error);
