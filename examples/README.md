# Examples Directory

This directory contains example scripts demonstrating different aspects of the Dify API client.

## Available Examples

### 💬 Chat API Examples

#### `test-api-formats-demo.ts`

**Script:** `npm run example:api-format-demo`

Comprehensive API format demonstration with live testing:

- Tests both chat and workflow API formats
- Shows correct request structure and headers
- Handles API failures gracefully while demonstrating proper format
- Validates against official Dify documentation
- Includes type checking and response handling
- Perfect for understanding API requirements

#### `api-format-demo.ts`

**Script:** `npm run example:api-format`

Demonstrates correct API request formats based on official Dify documentation:

- Shows proper request structure for each API endpoint
- Displays headers, body, and parameters
- Validates API call formats even when calls fail
- Compares chat vs workflow API structures
- Helpful for debugging API integration issues

#### `chat-streaming-basic-demo.ts`

**Script:** `npm run example:chat-streaming`

Demonstrates chat functionality with streaming responses (agent-chat apps only support streaming):

- Single message sending with streaming
- Response structure analysis
- Performance timing
- Error handling

#### `chat-streaming-demo.ts`

**Script:** `npm run example:chat-streaming-callback`

Shows real-time streaming chat capabilities:

- Streaming message sending
- Real-time output display
- Chunk processing
- Event type analysis

#### `chat-conversation-demo.ts`

**Script:** `npm run example:chat-conversation`

Comprehensive conversation management:

- Starting new conversations
- Continuing conversations with context
- Retrieving conversation history
- Message tracking

### 🔄 Workflow API Examples

#### `workflow-blocking-demo.ts`

**Script:** `npm run example:workflow-blocking`

Basic workflow execution with blocking responses:

- Simple workflow execution
- Response structure analysis
- Output processing
- Performance metrics

#### `workflow-streaming-demo.ts`

**Script:** `npm run example:workflow-streaming`

Real-time streaming workflow execution:

- Streaming workflow processing
- Live output display
- Event tracking
- Chunk analysis

### 📱 App API Examples

#### `app-info-demo.ts`

**Script:** `npm run example:app-info`

Application information and configuration:

- App info retrieval
- Parameter configuration
- Meta information
- Capability detection

### 🎯 `comprehensive-workflow-demo.ts`

**Script:** `npm run example:workflow`

A comprehensive demonstration that automatically detects app type and runs appropriate demos:

- Auto-detection of app mode (chat vs workflow)
- Complete feature demonstration
- Blocking and streaming execution
- Custom input parameters
- Error handling patterns
- Information retrieval

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

### Chat Examples (use chat app API key)

```bash
# Test streaming chat (agent-chat apps only support streaming)
npm run example:chat-streaming

# Test streaming chat with callback
npm run example:chat-streaming-callback

# Test conversation management
npm run example:chat-conversation
```

### Workflow Examples (use workflow app API key)

```bash
# Test basic blocking workflow
npm run example:workflow-blocking

# Test streaming workflow
npm run example:workflow-streaming
```

### App Information

```bash
# Get app info and parameters
npm run example:app-info
```

### Comprehensive Tests

```bash
# Run comprehensive demo (auto-detects app type)
npm run example:workflow

# Run API debugging script
npm run debug:api

# Run raw API testing script
npm run test:raw
```

## Configuration

Examples are preconfigured with different API keys for different app types:

- **Chat Examples**: Use `app-BULne4gxjnuRCqcXisqqHn2I` (chat app)
- **Workflow Examples**: Use `app-D9lvqK3YpGnOetRDA2yIHexo` (workflow app)

For production use, you should:

1. Replace the API keys with your own
2. Update the base URL if using a different Dify instance
3. Modify user IDs and input parameters as needed
4. Adjust timeout values for your use case

## Notes

- Individual examples are faster and more focused than comprehensive demos
- Each example includes detailed logging and error handling
- Streaming examples show real-time output for better user experience
- Examples automatically handle different response types and error conditions
