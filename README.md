# @ifzai/connect2dify

A comprehensive TypeScript client for the Dify API, providing a clean and modular interface for chat, workflow, file management, and application interactions.

## Features

- 🚀 **Modular Architecture**: Organized into focused API modules (Chat, Conversation, Workflow, File, App)
- 🔄 **Streaming Support**: Built-in support for real-time streaming responses
- 💪 **TypeScript**: Full type safety with comprehensive type definitions
- 🌐 **Universal**: Works in both browser and Node.js environments
- 📦 **Tree Shakable**: Import only the modules you need
- 🔧 **Configurable**: Flexible configuration options
- 🔄 **Backward Compatible**: Deprecated methods maintain compatibility

## Installation

```bash
npm install @ifzai/connect2dify
# or
pnpm add @ifzai/connect2dify
# or
yarn add @ifzai/connect2dify
```

## Quick Start

### Basic Usage

```typescript
import { DifyClient } from '@ifzai/connect2dify';

const client = new DifyClient({
  baseUrl: 'https://api.dify.ai',
  apiKey: 'your-api-key',
});

// Send a chat message (agent-chat apps only support streaming)
const response = await client.chat.sendMessage({
  user: 'user-123',
  query: 'Hello, how can you help me?',
  response_mode: 'streaming',
  inputs: {}, // Required for agent-chat applications
});

console.log(response.answer);
```

### Streaming Responses

```typescript
// Chat streaming example
const streamParams = {
  user: 'user-123',
  query: 'Tell me a story',
  response_mode: 'streaming' as const,
};

const result = await client.chat.sendMessage(streamParams);
if (Array.isArray(result)) {
  // Handle streaming chunks
  for (const chunk of result) {
    console.log(chunk.answer);
  }
}
```

### Workflow Execution

```typescript
// Execute a workflow in blocking mode
const workflowResponse = await client.workflow.runWorkflow({
  inputs: {
    query: 'What is artificial intelligence?',
  },
  user: 'user-123',
  response_mode: 'blocking',
});

console.log('Workflow result:', workflowResponse.data.outputs);

// Execute a workflow with streaming for real-time output
const streamingWorkflow = await client.workflow.runWorkflow({
  inputs: {
    query: 'Tell me a short story',
  },
  user: 'user-123',
  response_mode: 'streaming',
  chunkCompletionCallback: (chunk) => {
    if (chunk.event === 'text_chunk' && chunk.data?.text) {
      process.stdout.write(chunk.data.text); // Real-time text streaming
    }
  },
});
```

### Using Individual API Modules

```typescript
import { ChatAPI, WorkflowAPI } from '@ifzai/connect2dify';

const config = {
  baseUrl: 'https://api.dify.ai',
  apiKey: 'your-api-key',
};

const chatAPI = new ChatAPI(config);
const workflowAPI = new WorkflowAPI(config);

// Use APIs independently
const chatResponse = await chatAPI.sendMessage({
  user: 'user-123',
  query: 'Hello!',
});

const workflowResponse = await workflowAPI.runWorkflow({
  user: 'user-123',
  inputs: { text: 'Process this' },
});
```

## Workflow Examples

### Basic Workflow Execution

```typescript
import { DifyClient } from '@ifzai/connect2dify';

const client = new DifyClient({
  baseUrl: 'https://api.dify.ai/v1',
  apiKey: 'your-workflow-api-key',
});

// Execute workflow in blocking mode
const response = await client.workflow.runWorkflow({
  inputs: {
    query: 'What is the weather like today?',
  },
  user: 'user-123',
  response_mode: 'blocking',
});

console.log('Workflow result:', response.data.outputs);
```

### Streaming Workflow with Real-time Output

```typescript
// Execute workflow with real-time streaming
const streamingResponse = await client.workflow.runWorkflow({
  inputs: {
    query: 'Tell me a short story about a robot.',
  },
  user: 'user-123',
  response_mode: 'streaming',
  chunkCompletionCallback: (chunk) => {
    // Handle different event types
    if (chunk.event === 'workflow_started') {
      console.log('🎬 Workflow started...');
    } else if (chunk.event === 'node_started') {
      console.log(`🔧 Node started: ${chunk.data?.title || 'Unknown'}`);
    } else if (chunk.event === 'text_chunk' && chunk.data?.text) {
      // This is the actual streaming text - display it word by word
      process.stdout.write(chunk.data.text);
    } else if (chunk.event === 'node_finished') {
      console.log(`✅ Node finished: ${chunk.data?.title || 'Unknown'}`);
    } else if (chunk.event === 'workflow_finished') {
      console.log('\n🏁 Workflow finished!');
    }
  },
});

console.log('Streaming completed!');
```

### Workflow with Custom Inputs

```typescript
// Execute workflow with custom parameters
const customResponse = await client.workflow.runWorkflow({
  inputs: {
    query: 'How do I cook pasta step by step?',
    language: 'en',
    detail_level: 'comprehensive',
    // Add any custom inputs your workflow expects
  },
  user: 'user-123',
  response_mode: 'blocking',
});

console.log('Custom workflow result:', customResponse.data.outputs);
```

### Retrieving Workflow Information

```typescript
// First execute a workflow to get a workflow_run_id
const runResponse = await client.workflow.runWorkflow({
  inputs: { query: 'Hello, this is a test.' },
  user: 'user-123',
  response_mode: 'blocking',
});

// Then get detailed information about the workflow run
if (runResponse.workflow_run_id) {
  const workflowInfo = await client.workflow.getWorkflow({
    workflow_run_id: runResponse.workflow_run_id,
  });

  console.log('Workflow Details:');
  console.log(`- Status: ${workflowInfo.status}`);
  console.log(`- Total Steps: ${workflowInfo.total_steps}`);
  console.log(`- Total Tokens: ${workflowInfo.total_tokens}`);
  console.log(`- Execution Time: ${workflowInfo.elapsed_time}s`);
}
```

### File Upload with Workflow

```typescript
// Upload a file first
const fileResponse = await client.file.uploadFile({
  file: fileBuffer, // or File object in browser
  user: 'user-123',
});

// Use the uploaded file in a workflow
const workflowResponse = await client.workflow.runWorkflow({
  inputs: {
    query: 'Analyze this document',
  },
  user: 'user-123',
  response_mode: 'blocking',
  files: [
    {
      type: 'document',
      transfer_method: 'local_file',
      upload_file_id: fileResponse.id,
    },
  ],
});
```

## API Reference

### DifyClient

The main client class that provides access to all API modules:

```typescript
const client = new DifyClient({
  baseUrl: 'https://api.dify.ai/v1', // Required: Your Dify API base URL
  apiKey: 'your-api-key', // Required: Your API key
  defaultResponseMode: 'blocking', // Optional: 'blocking' | 'streaming'
  defaultUser: 'default-user', // Optional: Default user ID for requests
  requestOptions: {
    // Optional: Additional request configuration
    extraHeaders: {
      'Custom-Header': 'value',
      'X-Source': 'my-app',
    },
    timeout: 30000, // Request timeout in milliseconds
  },
});
```

#### Configuration Options

| Option                        | Type                        | Required | Default      | Description                                             |
| ----------------------------- | --------------------------- | -------- | ------------ | ------------------------------------------------------- |
| `baseUrl`                     | string                      | ✅       | -            | Your Dify API base URL (e.g., `https://api.dify.ai/v1`) |
| `apiKey`                      | string                      | ✅       | -            | Your application API key from Dify dashboard            |
| `defaultResponseMode`         | `'blocking' \| 'streaming'` | ❌       | `'blocking'` | Default response mode for API calls                     |
| `defaultUser`                 | string                      | ❌       | -            | Default user ID to use when not specified in requests   |
| `requestOptions.extraHeaders` | Record<string, string>      | ❌       | `{}`         | Additional HTTP headers to include in requests          |
| `requestOptions.timeout`      | number                      | ❌       | `60000`      | Request timeout in milliseconds                         |

#### Environment Variables

You can also configure the client using environment variables:

```bash
# .env file
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=your-api-key-here
DIFY_DEFAULT_USER=default-user-id
```

```typescript
// Use environment variables
const client = new DifyClient({
  baseUrl: process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1',
  apiKey: process.env.DIFY_API_KEY,
  defaultUser: process.env.DIFY_DEFAULT_USER,
});
```

### Chat API (`client.chat`)

- `sendMessage(params)` - Send a chat message (agent-chat apps only support streaming mode)
- `getMessages(params)` - Get conversation messages
- `createMessageFeedback(params)` - Provide feedback on a message
- `getMessageSuggests(params)` - Get suggested questions
- `stopMessageResponse(params)` - Stop a message response

### Conversation API (`client.conversation`)

- `getConversations(params)` - List conversations
- `deleteConversation(params)` - Delete a conversation
- `renameConversation(params)` - Rename a conversation

### Workflow API (`client.workflow`)

- `runWorkflow(params)` - Execute a workflow (supports both blocking and streaming)
- `getWorkflow(params)` - Get workflow details
- `stopWorkflowTask(params)` - Stop a workflow task
- `getWorkflowLogs(params)` - Get workflow execution logs

### File API (`client.file`)

- `uploadFile(params)` - Upload a file
- `audioToText(params)` - Convert audio to text

### App API (`client.app`)

- `getParameters()` - Get application parameters
- `getInfo()` - Get application information
- `getMeta()` - Get application metadata
- `sendCompletionMessage(params)` - Send completion message (supports both blocking and streaming)
- `stopCompletionMessage(params)` - Stop completion message

## Environment Support

This package works in both browser and Node.js environments using modern web APIs:

- ✅ Node.js 18+ (native fetch and ReadableStream support)
- ✅ Modern browsers (Chrome 66+, Firefox 65+, Safari 12+)
- ✅ Edge runtime environments (Vercel Edge, Cloudflare Workers)
- ❌ Node.js < 18 (requires fetch polyfill)

## Error Handling

### Basic Error Handling

```typescript
try {
  const response = await client.chat.sendMessage({
    user: 'user-123',
    query: 'Hello!',
  });
  console.log('Success:', response.answer);
} catch (error) {
  console.error('API Error:', error.message);

  // Handle specific error types
  if (error.message.includes('unauthorized')) {
    console.error('Check your API key');
  } else if (error.message.includes('quota')) {
    console.error('API quota exceeded');
  }
}
```

### Workflow Error Handling

```typescript
try {
  const response = await client.workflow.runWorkflow({
    inputs: { query: 'Process this data' },
    user: 'user-123',
    response_mode: 'blocking',
  });

  // Check workflow execution status
  if (response.data.status === 'failed') {
    console.error('Workflow failed:', response.data.error);
    return;
  }

  console.log('Workflow succeeded:', response.data.outputs);
} catch (error) {
  console.error('Workflow execution error:', error.message);

  // Handle specific workflow errors
  if (error.message.includes('workflow not found')) {
    console.error('Check your workflow ID and permissions');
  } else if (error.message.includes('invalid inputs')) {
    console.error('Check your input parameters match workflow requirements');
  }
}
```

### Streaming Error Handling

```typescript
try {
  const result = await client.workflow.runWorkflow({
    inputs: { query: 'Tell me a story' },
    user: 'user-123',
    response_mode: 'streaming',
    chunkCompletionCallback: (chunk) => {
      // Handle streaming errors
      if (chunk.event === 'error') {
        console.error('Streaming error:', chunk.data?.error);
        return;
      }

      // Process successful chunks
      if (chunk.event === 'text_chunk' && chunk.data?.text) {
        process.stdout.write(chunk.data.text);
      }
    },
  });
} catch (error) {
  if (error.message.includes('Streaming is not supported')) {
    // Fallback to blocking mode
    console.log('Falling back to blocking mode...');
    const response = await client.workflow.runWorkflow({
      inputs: { query: 'Tell me a story' },
      user: 'user-123',
      response_mode: 'blocking',
    });
    console.log(response.data.outputs);
  } else {
    console.error('Streaming workflow failed:', error.message);
  }
}
```

## Migration from Previous Versions

The new modular structure provides a cleaner API while maintaining backward compatibility:

```typescript
// Old way (still works, but deprecated)
const response = await client.sendMessage(params);
const workflowResult = await client.runWorkflow(params);

// New way (recommended)
const response = await client.chat.sendMessage(params);
const workflowResult = await client.workflow.runWorkflow(params);
```

## Running Examples

This package includes comprehensive examples demonstrating real-world usage patterns. All examples use actual Dify API endpoints and showcase different functionality.

### Prerequisites

Before running examples, ensure you have:

1. **Node.js 18+** installed
2. **Valid Dify API credentials** (API key and base URL)
3. **Dependencies installed**: `pnpm install`

### Available Examples

#### 1. Comprehensive Workflow Demo

**Location**: `examples/comprehensive-workflow-demo.ts`

**Run Command**:

```bash
npm run example:workflow
```

**What it demonstrates**:

- ✅ Blocking workflow execution with timing
- 🔄 Streaming workflow execution with real-time text output
- ⚙️ Custom input parameters
- 📊 Workflow run information retrieval
- ✅ Parameter validation
- 🎬 Event handling for different workflow stages

**Sample Output**:

```
🎯 Comprehensive Dify Workflow Demo
===================================

📋 Test 1: Blocking Workflow Execution
--------------------------------------
✅ Blocking execution completed in 6.852s
Response structure:
- Task ID: 95cc6b94-22ea-468d-94f8-8ecd46601fc1
- Status: succeeded
- Total Tokens: 268

🔄 Test 2: Streaming Workflow Execution
---------------------------------------
🚀 Starting streaming workflow...
📝 Streaming output (word by word):
---
Here's a short story about a curious robot... [streaming text appears here]
✅ Streaming execution completed in 13.708s
- Total chunks received: 428
- Event type distribution: { text_chunk: 420, workflow_started: 1, ... }
```

#### 2. API Debugging Tool

**Location**: `examples/debug-api.ts`

**Run Command**:

```bash
npm run debug:api
```

**What it demonstrates**:

- 🔍 App info and parameters retrieval
- 💬 Chat completion API usage
- 🔧 Workflow API with detailed logging
- 🐛 Error analysis and troubleshooting

#### 3. Raw API Testing

**Location**: `examples/raw-api-test.js`

**Run Command**:

```bash
npm run test:raw
```

**What it demonstrates**:

- 🧪 Low-level API testing with raw fetch calls
- 📡 Direct HTTP request/response analysis
- 🔧 API connectivity troubleshooting
- ⚡ Bypasses client library for pure API testing

### Configuring Examples

Most examples include API credentials that you'll need to update:

```typescript
// Update these values in the example files
const client = new DifyClient({
  baseUrl: 'https://api.dify.ai/v1', // Your Dify instance URL
  apiKey: 'your-api-key-here', // Your workflow/app API key
});

const userId = 'your-user-id'; // Your user identifier
```

### Example Output Features

The examples showcase:

- **Real-time Streaming**: Watch AI responses generate word-by-word
- **Performance Metrics**: Execution time, token usage, chunk counts
- **Event Tracking**: Workflow progression through different stages
- **Error Handling**: Robust error catching and user-friendly messages
- **Type Safety**: Full TypeScript integration with proper typing

### Creating Custom Examples

You can create your own examples by following this pattern:

```typescript
import { DifyClient } from '../src/index.js';

async function myCustomExample() {
  const client = new DifyClient({
    baseUrl: 'https://api.dify.ai/v1',
    apiKey: 'your-api-key',
  });

  try {
    const response = await client.workflow.runWorkflow({
      inputs: { query: 'Your custom input' },
      user: 'your-user-id',
      response_mode: 'streaming',
      chunkCompletionCallback: (chunk) => {
        // Handle streaming chunks
        console.log('Received chunk:', chunk.event);
      },
    });

    console.log('Success:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

myCustomExample().catch(console.error);
```

### Troubleshooting Examples

If examples fail to run:

1. **Check API credentials** - Ensure your API key and base URL are correct
2. **Verify network connectivity** - Test if you can reach the Dify API
3. **Review console output** - Examples provide detailed error messages
4. **Check API quotas** - Ensure you have sufficient API credits
5. **Validate workflow configuration** - Make sure your workflow accepts the input parameters

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must be formatted as:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add user authentication
fix: resolve memory leak in data processing
docs: update API documentation
style: format code with prettier
refactor: extract utility functions
perf: optimize database queries
test: add unit tests for user service
build: update dependencies
ci: add automated testing workflow
chore: update .gitignore
```

### Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run git hooks:

- **pre-commit**: Runs code formatting and tests
- **commit-msg**: Validates commit message format

The hooks will automatically run when you commit. If they fail, the commit will be rejected.
