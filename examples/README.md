# Examples Directory

This directory contains example scripts demonstrating different aspects of the Dify API client.

## Available Examples

### 🎯 `comprehensive-workflow-demo.ts`

**Script:** `npm run example:workflow`

A comprehensive demonstration of the Dify workflow API including:

- Blocking workflow execution with timing
- Streaming workflow execution with chunk analysis
- Custom input parameters
- Error handling patterns
- Workflow run information retrieval
- Parameter validation

### 🔍 `debug-api.ts`

**Script:** `npm run debug:api`

A debugging script that tests various Dify API endpoints using the TypeScript client:

- App info and parameters
- Chat completion API
- Workflow API with detailed logging
- Error analysis and troubleshooting

### 🧪 `raw-api-test.js`

**Script:** `npm run test:raw`

A low-level debugging script that tests API endpoints using raw fetch calls:

- Multiple endpoint patterns testing
- Direct HTTP request/response analysis
- Useful for troubleshooting API connectivity issues
- Bypasses the client library for pure API testing

## Running Examples

All examples use real API credentials and will make actual API calls. Make sure you have:

1. Valid Dify API credentials configured in the example files
2. Internet connectivity
3. Sufficient API quota/credits

```bash
# Run the comprehensive workflow demo
npm run example:workflow

# Run the API debugging script
npm run debug:api

# Run the raw API testing script
npm run test:raw
```

## Configuration

Examples are preconfigured with test credentials. For production use, you should:

1. Replace the API key with your own
2. Update the base URL if using a different Dify instance
3. Modify user IDs and input parameters as needed
4. Adjust timeout values for your use case
