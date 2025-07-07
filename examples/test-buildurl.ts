import { buildURL } from '../src/utils.js';

/**
 * Test the buildURL function to ensure it works correctly
 */
function testBuildURL() {
  console.log('🔍 Testing buildURL function');
  console.log('===========================\n');

  // Test cases
  const testCases = [
    {
      baseUrl: 'https://api.dify.ai/v1',
      path: 'workflows/run',
      expected: 'https://api.dify.ai/v1/workflows/run',
    },
    {
      baseUrl: 'https://api.dify.ai/v1/',
      path: 'workflows/run',
      expected: 'https://api.dify.ai/v1/workflows/run',
    },
    {
      baseUrl: 'https://api.dify.ai/v1',
      path: '/workflows/run',
      expected: 'https://api.dify.ai/v1/workflows/run',
    },
    {
      baseUrl: 'https://api.dify.ai/v1/',
      path: '/workflows/run',
      expected: 'https://api.dify.ai/v1/workflows/run',
    },
    {
      baseUrl: 'https://api.dify.ai/v1',
      path: 'chat-messages',
      expected: 'https://api.dify.ai/v1/chat-messages',
    },
    {
      baseUrl: 'https://api.dify.ai/v1',
      path: 'parameters',
      expected: 'https://api.dify.ai/v1/parameters',
    },
  ];

  let allPassed = true;

  testCases.forEach((testCase, index) => {
    try {
      const result = buildURL(testCase.baseUrl, testCase.path);
      const passed = result === testCase.expected;

      console.log(`Test ${index + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`  Base URL: ${testCase.baseUrl}`);
      console.log(`  Path: ${testCase.path}`);
      console.log(`  Expected: ${testCase.expected}`);
      console.log(`  Actual: ${result}`);

      if (!passed) {
        allPassed = false;
      }
      console.log('');
    } catch (error) {
      console.log(`Test ${index + 1}: ❌ ERROR`);
      console.log(`  Base URL: ${testCase.baseUrl}`);
      console.log(`  Path: ${testCase.path}`);
      console.log(`  Error: ${error}`);
      console.log('');
      allPassed = false;
    }
  });

  // Test with query parameters
  console.log('Testing with query parameters:');
  try {
    const result = buildURL('https://api.dify.ai/v1', 'messages', {
      conversation_id: 'test-123',
      limit: '10',
    });
    const expected = 'https://api.dify.ai/v1/messages?conversation_id=test-123&limit=10';
    const passed = result === expected;

    console.log(`Query params test: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${result}`);

    if (!passed) {
      allPassed = false;
    }
  } catch (error) {
    console.log('Query params test: ❌ ERROR');
    console.log(`  Error: ${error}`);
    allPassed = false;
  }

  console.log('\n🏁 Test Summary:');
  console.log(`Overall result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  return allPassed;
}

testBuildURL();
