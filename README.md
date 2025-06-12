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

// Send a chat message
const response = await client.chat.sendMessage({
  user: 'user-123',
  query: 'Hello, how can you help me?',
  response_mode: 'blocking',
});

console.log(response.answer);
```

### Streaming Responses

```typescript
// Using streaming mode
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

## API Reference

### DifyClient

The main client class that provides access to all API modules:

```typescript
const client = new DifyClient({
  baseUrl: 'https://api.dify.ai',
  apiKey: 'your-api-key',
  defaultResponseMode: 'blocking', // optional
  defaultUser: 'default-user', // optional
  requestOptions: {
    // optional
    extraHeaders: {
      'Custom-Header': 'value',
    },
  },
});
```

### Chat API (`client.chat`)

- `sendMessage(params)` - Send a chat message (supports both blocking and streaming)
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

```typescript
try {
  const response = await client.chat.sendMessage({
    user: 'user-123',
    query: 'Hello!',
  });
} catch (error) {
  console.error('API Error:', error.message);
}
```

### Streaming Error Handling

```typescript
try {
  const result = await client.chat.sendMessage({
    user: 'user-123',
    query: 'Tell me a story',
    response_mode: 'streaming',
  });

  if (Array.isArray(result)) {
    // Handle streaming chunks
    for (const chunk of result) {
      console.log(chunk.answer);
    }
  }
} catch (error) {
  if (error.message.includes('Streaming is not supported')) {
    // Fallback to blocking mode
    const response = await client.chat.sendMessage({
      user: 'user-123',
      query: 'Tell me a story',
      response_mode: 'blocking',
    });
    console.log(response.answer);
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
