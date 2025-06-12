# Rslib project

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
