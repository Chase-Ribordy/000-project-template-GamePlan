# Infrastructure Standards

> Technical setup, testing patterns, and deployment configuration for autonomous development.

## Purpose

This guide ensures:
- Consistent project setup across all implementations
- Dev agents can run tests autonomously
- Predictable build and deployment pipeline
- Minimal manual intervention required

---

## Project Structure

```
project/
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── services/           # Business logic
│   ├── api/                # API endpoints
│   ├── models/             # Data models
│   └── utils/              # Utilities
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── public/                 # Static assets
├── docs/                   # Documentation
│   ├── initial-planning/   # Idea pipeline output
│   ├── finalized-plan/     # PRD + Architecture
│   └── sprint-artifacts/   # Stories, chunks, status
├── .system/                # Agent coordination
│   ├── agents/             # Agent definitions
│   ├── contracts/          # Completion contracts
│   └── notifications/      # Hook notifications
└── .claude/                # Claude Code config
    ├── commands/           # Slash commands
    └── config/             # Settings
```

---

## Environment Setup

### Required Files

**.env.example** (commit this)
```bash
# Copy to .env and fill in values
# Do NOT commit .env

# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=

# External APIs
API_KEY_SERVICE_1=
API_KEY_SERVICE_2=

# Authentication
JWT_SECRET=
SESSION_SECRET=
```

**.gitignore**
```gitignore
# Dependencies
node_modules/
venv/
__pycache__/

# Environment
.env
.env.local
*.local

# Build output
dist/
build/
.next/

# IDE
.idea/
.vscode/
*.swp

# Testing
coverage/
.jest-cache/
playwright-report/

# System
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

---

## Testing Infrastructure

### Test Requirements

1. **Unit tests**: Run without external dependencies
2. **Integration tests**: May use test database/services
3. **E2E tests**: Use Playwright for browser automation

### Test Configuration

**package.json** (Node.js example)
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```

### Playwright Setup

For autonomous browser testing by dev agents:

**playwright.config.js**
```javascript
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
};
```

### Test Patterns

```javascript
// Unit test pattern
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle edge case', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

---

## Development Server

### Local Development

```bash
# Start development server
npm run dev          # Node.js
python -m flask run  # Flask
python manage.py runserver  # Django

# Default ports
# - Frontend: 3000
# - Backend API: 8000
# - Database: 5432 (Postgres) / 27017 (MongoDB)
```

### Dev Agent Access

Dev agents use Playwright MCP to interact with the local server:

```
1. Server must be running on expected port
2. No authentication required for local dev
3. Test data should be seedable
4. Clear console errors visible
```

---

## Build Pipeline

### Build Commands

```bash
# Install dependencies
npm install          # Node.js
pip install -r requirements.txt  # Python

# Build for production
npm run build

# Run production build locally
npm run start
```

### Build Validation

Before marking any pass complete:
- [ ] `npm run build` succeeds
- [ ] No TypeScript/ESLint errors
- [ ] Tests pass
- [ ] No console errors in browser

---

## Database Setup

### Local Development

**Option 1: SQLite** (simplest for MVP)
```javascript
// No setup needed, file-based
DATABASE_URL=file:./dev.db
```

**Option 2: Docker** (for Postgres/MySQL)
```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

### Migrations

```bash
# Create migration
npm run migrate:create

# Run migrations
npm run migrate:up

# Seed test data
npm run db:seed
```

---

## Error Handling

### API Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {
      "field": "email",
      "issue": "Invalid format"
    }
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

### Client-Side Error Handling

```javascript
try {
  const result = await api.call();
  return result;
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 400) {
    // Show validation errors
  } else {
    // Show generic error
  }
}
```

---

## Logging

### Log Levels

```javascript
// Use appropriate log level
logger.error('Failed to process payment', { orderId, error });
logger.warn('Rate limit approaching', { remaining });
logger.info('User logged in', { userId });
logger.debug('Cache hit', { key });
```

### What to Log

- **Errors**: All exceptions with stack traces
- **Warnings**: Degraded functionality, approaching limits
- **Info**: Key business events (login, purchase, etc.)
- **Debug**: Development troubleshooting only

---

## For Dev Agents

### First Pass Checklist
- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Dev server runs
- [ ] Basic tests pass
- [ ] No build errors

### Second Pass Checklist
- [ ] Components follow structure
- [ ] Playwright tests added for UI
- [ ] Responsive layouts work
- [ ] Loading states implemented

### Third Pass Checklist
- [ ] All tests passing
- [ ] Error handling complete
- [ ] No console errors
- [ ] Build succeeds
- [ ] Ready for deployment

---

## Deployment Notes

### Environment Variables
- Never commit secrets
- Use environment-specific configs
- Document all required vars in .env.example

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Environment vars documented
- [ ] Database migrations ready
- [ ] Manual tasks completed (see manual.md)

---

*Customize this guide based on your specific tech stack and deployment target.*
