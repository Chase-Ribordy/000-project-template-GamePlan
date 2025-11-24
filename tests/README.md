# Project Test Suite

## Purpose

This folder contains all project-level test files for Test-Driven Development (TDD) and documentation-driven testing. Tests serve as both validation and living documentation of system behavior.

## Testing Philosophy

### Quality-First Development

This template follows the **"Slow is Fast"** principle:

**Traditional Approach (Fast → Slow):**
1. Write code: 30 minutes
2. Debug integration: 3 hours
3. Fix cascading issues: 2 hours
**Total: 5.5 hours** ❌

**Quality-First Approach (Slow → Fast):**
1. Define contract: 10 minutes
2. Write tests: 20 minutes (TDD)
3. Write code: 30 minutes
4. Validate: 10 minutes
5. Sandbox test: 10 minutes
6. Integrate: 10 minutes
**Total: 1.3 hours** ✅

### Test-Driven Development (TDD)

**Red → Green → Refactor:**

1. **Red** - Write failing test based on contract
2. **Green** - Write minimal code to pass test
3. **Refactor** - Improve code while tests pass

**Benefits:**
- Tests define expected behavior before implementation
- Forces thinking through edge cases upfront
- Prevents 70% of integration bugs
- Creates comprehensive test coverage naturally
- Acts as executable documentation

## Test Structure

### Recommended Organization

```
tests/
├── unit/                    # Unit tests (isolated component tests)
│   ├── components/          # Component-specific unit tests
│   ├── services/            # Service/logic unit tests
│   └── utils/               # Utility function tests
├── integration/             # Integration tests (multi-component)
│   ├── api/                 # API integration tests
│   ├── database/            # Database integration tests
│   └── workflows/           # End-to-end workflow tests
├── e2e/                     # End-to-end tests (full user flows)
│   ├── auth/                # Authentication flows
│   ├── user-journeys/       # Complete user journeys
│   └── critical-paths/      # Business-critical paths
├── fixtures/                # Test data and fixtures
│   ├── mocks/               # Mock data
│   ├── seeds/               # Database seeds
│   └── samples/             # Sample files/inputs
├── utils/                   # Test utilities and helpers
│   ├── helpers.js           # Test helper functions
│   ├── setup.js             # Test environment setup
│   └── teardown.js          # Test cleanup
└── README.md                # This file
```

## Component Testing Workflow

### Relationship to .system/components/

**Project-Level Tests (tests/):**
- Integration tests across multiple components
- End-to-end user flows
- API/database integration tests
- System-level test utilities

**Component-Level Tests (.system/components/):**
- Individual component unit tests
- Component-specific validation
- Isolated sandbox testing
- Co-located with component code

**Example:**
```
tests/integration/user-authentication/
├── login-flow.test.js       # Full login workflow test

.system/components/login-form/
├── login-form.test.js       # Unit test for login form component
└── validation-report.md     # Component validation results
```

## Progressive Validation Levels

The template uses 4 progressive validation levels:

### Level 1: Syntax Validation (fast, <1s)
- HTML validity
- CSS parsing
- JavaScript syntax
- No runtime execution

### Level 2: Unit Tests (medium, <10s)
- Component-level tests
- Function-level tests
- Isolated behavior verification
- **Tests in this folder**

### Level 3: Contract Compliance (fast, <1s)
- Interface validation
- CSS namespace compliance
- Dependency verification
- Contract adherence

### Level 4: Integration Safety (medium, <30s)
- CSS conflict detection
- JavaScript namespace collisions
- Dependency resolution
- MCP server validation

## Writing Tests

### 1. Contract-First Testing

Before writing any code, define the contract:

```bash
# Define component contract
/define-contract my-feature

# Contract created in .system/contracts/my-feature-contract.md
```

**Contract defines:**
- Inputs (parameters, props, data)
- Outputs (return values, events, side effects)
- CSS namespace (`.component-my-feature-*`)
- DOM requirements
- Dependencies

### 2. Write Tests Based on Contract

```javascript
// tests/unit/components/my-feature.test.js

describe('MyFeature Component', () => {
  describe('Contract Compliance', () => {
    it('should accept required inputs', () => {
      // Test based on contract inputs
    });

    it('should emit expected outputs', () => {
      // Test based on contract outputs
    });

    it('should use correct CSS namespace', () => {
      // Verify .component-my-feature-* classes only
    });
  });

  describe('Behavior', () => {
    it('should handle edge case 1', () => {
      // Test edge cases
    });

    it('should handle error conditions', () => {
      // Test error handling
    });
  });
});
```

### 3. Run Tests (should fail - Red)

```bash
npm test tests/unit/components/my-feature.test.js
# All tests should FAIL - no implementation yet
```

### 4. Implement to Pass Tests (Green)

Write minimal code to make tests pass.

### 5. Refactor While Tests Pass

Improve code quality while maintaining green tests.

## Testing Tools & Frameworks

### Recommended Stack

**Unit Testing:**
- Jest (JavaScript/Node.js)
- Mocha + Chai (alternative)
- Vitest (Vite projects)

**Integration Testing:**
- Supertest (API testing)
- Testing Library (React/Vue/etc.)
- Playwright Test (component testing)

**End-to-End Testing:**
- Playwright (recommended)
- Cypress (alternative)
- Puppeteer (headless browser)

**Test Utilities:**
- Faker.js (test data generation)
- MSW (API mocking)
- Sinon (spies, stubs, mocks)

### Installation Example (Jest)

```bash
npm install --save-dev jest @types/jest
```

**package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}"
    ]
  }
}
```

## Test Conventions

### Naming Conventions

**Test Files:**
- `[component-name].test.js` - Unit tests
- `[feature-name].integration.test.js` - Integration tests
- `[flow-name].e2e.test.js` - End-to-end tests

**Test Suites:**
```javascript
describe('ComponentName', () => {
  describe('methodName()', () => {
    it('should do expected behavior', () => {
      // test
    });
  });
});
```

### Test Organization

**Arrange-Act-Assert (AAA):**
```javascript
it('should calculate total correctly', () => {
  // Arrange - Set up test data
  const items = [{ price: 10 }, { price: 20 }];

  // Act - Execute the behavior
  const total = calculateTotal(items);

  // Assert - Verify the result
  expect(total).toBe(30);
});
```

**Given-When-Then (BDD):**
```javascript
it('should apply discount when coupon is valid', () => {
  // Given - Initial state
  const cart = { subtotal: 100 };
  const coupon = { code: 'SAVE20', discount: 0.2 };

  // When - Action occurs
  const result = applyCoupon(cart, coupon);

  // Then - Expected outcome
  expect(result.total).toBe(80);
  expect(result.discountApplied).toBe(true);
});
```

## Test Coverage

### Coverage Goals

- **Unit Tests:** 80%+ line coverage
- **Integration Tests:** All critical paths
- **E2E Tests:** All user-facing workflows

### Running Coverage

```bash
npm run test:coverage

# View coverage report
open coverage/index.html
```

### Coverage Reports

**Lines covered:**
- 100%: Excellent ✅
- 80-99%: Good 👍
- 60-79%: Acceptable ⚠️
- <60%: Needs improvement ❌

**Focus on:**
- Critical business logic
- Error handling paths
- Edge cases
- Integration points

## Integration with Component Workflow

### Full Quality Workflow

**Phase 1: Contract-First**
```bash
/define-contract my-component
```

**Phase 2: Test-First (TDD)**
```bash
# Write tests in tests/unit/
npm test tests/unit/my-component.test.js
# Should fail - no implementation
```

**Phase 3: Implementation**
```bash
# Write code to pass tests
# Iteratively run tests until all pass
```

**Phase 4: Progressive Validation**
```bash
/validate-component my-component
# Runs all 4 validation levels
```

**Phase 5: Sandbox Proof**
```bash
/prove-it-works my-component
# Isolated visual testing
```

**Phase 6: Safe Integration**
```bash
/integrate my-component target-file
# MCP validates, integrates safely
```

## Continuous Testing

### Watch Mode

```bash
# Auto-run tests on file changes
npm test -- --watch
```

### Pre-commit Hooks

```bash
# Add to .git/hooks/pre-commit
npm test
npm run lint
```

### CI/CD Integration

**GitHub Actions example:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Test Data Management

### Fixtures

Store reusable test data in `fixtures/`:

```javascript
// tests/fixtures/users.js
module.exports = {
  validUser: {
    email: 'test@example.com',
    password: 'Password123!'
  },
  invalidUser: {
    email: 'invalid-email',
    password: '123'
  }
};
```

### Mocks

Mock external dependencies:

```javascript
// tests/utils/mocks.js
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};
```

### Factories

Generate dynamic test data:

```javascript
// tests/utils/factories.js
import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  ...overrides
});
```

## Best Practices

### DO ✅

- **Write tests before code (TDD)**
- **Test behavior, not implementation**
- **Keep tests isolated and independent**
- **Use descriptive test names**
- **Test edge cases and error conditions**
- **Maintain tests as code evolves**
- **Run tests frequently**
- **Use fixtures for consistent test data**
- **Mock external dependencies**
- **Aim for fast test execution**

### DON'T ❌

- **Skip writing tests "for now"**
- **Test private methods directly**
- **Create interdependent tests**
- **Use production data in tests**
- **Ignore failing tests**
- **Over-mock (mock only what's necessary)**
- **Write flaky tests**
- **Duplicate test logic**
- **Test framework code**
- **Commit broken tests**

## Documentation as Tests

Tests serve as **executable documentation**:

```javascript
describe('User Authentication', () => {
  it('should allow login with valid credentials', () => {
    // This test documents: "Users can log in with valid credentials"
  });

  it('should reject login with invalid password', () => {
    // This test documents: "Invalid passwords are rejected"
  });

  it('should lock account after 5 failed attempts', () => {
    // This test documents: "Security policy: 5 attempts then lockout"
  });
});
```

**Benefits:**
- Always up-to-date (code changes = test updates)
- Executable (proves documentation is accurate)
- Examples-driven (shows real usage)
- Comprehensive (covers edge cases)

## Troubleshooting

### Tests Failing After Code Changes

**Solution:** Tests are working correctly - they caught a regression!
1. Review what changed
2. Update code to pass tests OR
3. Update tests if requirements changed

### Tests Are Slow

**Solution:**
1. Run unit tests only: `npm test -- tests/unit`
2. Use watch mode: `npm test -- --watch`
3. Parallelize: `npm test -- --maxWorkers=4`
4. Mock expensive operations (DB, API)

### Flaky Tests (Intermittent Failures)

**Common causes:**
- Race conditions (async timing)
- Global state pollution
- External dependencies
- Random test data

**Solutions:**
- Add proper async/await handling
- Reset state between tests
- Mock external services
- Use seeded random data

## Integration with Autonomous Execution

### Three-Pass Testing Strategy

**First-Pass (Backend):**
- Write unit tests for business logic
- Test API endpoints
- Validate data models
- **Focus:** Functionality correctness

**Second-Pass (Component Integration):**
- Sandbox testing (automatic)
- Component unit tests
- Integration validation
- **Focus:** Component assembly

**Third-Pass (Polish):**
- End-to-end tests
- Visual regression tests
- Performance tests
- **Focus:** User experience

### Autonomous Validation

When you run `/integrate`, component tests are:
1. **Discovered** - Found in `.system/components/*/`
2. **Executed** - Run during Level 2 validation
3. **Reported** - Results in validation-report.md
4. **Gated** - Must pass to proceed to sandbox

## Getting Started

### 1. Install Testing Framework

```bash
npm install --save-dev jest @types/jest
```

### 2. Create First Test

```bash
mkdir -p tests/unit
touch tests/unit/example.test.js
```

```javascript
// tests/unit/example.test.js
describe('Example Test Suite', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### 3. Run Tests

```bash
npm test
```

### 4. Add More Tests

Follow TDD workflow:
1. Define contract
2. Write test (Red)
3. Implement (Green)
4. Refactor

## Resources

### Documentation

- **Quality-First Workflow:** `.system/template/README-STRUCTURE.md`
- **Component Validation:** `.system/validation/README.md`
- **Autonomous Execution:** `.system/README-AUTONOMOUS.md`

## Summary

This `tests/` folder is the foundation for:

- **Test-Driven Development** - Write tests first, code second
- **Quality Assurance** - Catch bugs before they reach production
- **Living Documentation** - Tests document expected behavior
- **Regression Prevention** - Ensure changes don't break existing functionality
- **Confidence** - Know your code works as expected

**Remember:** Tests are not overhead - they're the fastest path to working, maintainable code.

**The best time to write tests is before writing code.**
