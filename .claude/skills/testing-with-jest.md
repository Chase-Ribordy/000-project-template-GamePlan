# Testing with Jest - Agent Skill

**Purpose**: Guide agents in writing and running tests autonomously when features warrant testing beyond the mcp-contract-validation system.

**When to Use**: For non-trivial features that benefit from automated testing (not for simple changes or UI-only modifications).

---

## Overview

This skill enables agents to write and execute Jest tests for new features when appropriate. The project already has a comprehensive Jest testing infrastructure focused on **contract validation and architecture compliance**. This skill is for extending test coverage to new functionality when needed.

## When Testing is Warranted

### ✅ Write Tests For:
- **New utility functions** or helper libraries
- **Complex business logic** with multiple edge cases
- **Data transformation** or calculation functions
- **API integration** or service layers
- **State management** logic
- **Critical path** functionality

### ❌ Skip Testing For:
- **Simple UI components** (rely on visual testing)
- **Trivial getter/setter** functions
- **One-line** helper functions
- **Prototype/experimental** code
- **Configuration** files
- **Static content** or copy changes

## Existing Test Infrastructure

**Current Test Suites** (122 tests total):
- `test:contracts` - Contract compliance (19 tests)
- `test:mcp` - MCP integration (12 tests)
- `test:validation` - 4-level validation (17 tests)
- `test:architecture` - Architecture validation (31 tests)
- `test:skills` - Skills & workflows (25 tests)
- `test:smoke` - Smoke tests (18 tests)

**Do NOT modify these existing test suites** unless fixing bugs or updating for system changes.

## Writing New Tests

### 1. Determine Test Location

```
tests/
├── unit/                    # Pure unit tests (new feature tests go here)
│   └── [feature-name]/      # Group tests by feature
├── integration/             # Integration tests (existing suites)
└── fixtures/                # Test data and mocks
```

### 2. Test File Naming Convention

```javascript
// File: tests/unit/feature-name/feature-name.test.js
// OR
// File: tests/unit/feature-name/specific-function.test.js
```

### 3. Basic Test Structure

```javascript
/**
 * @jest-environment jsdom
 */

describe('FeatureName', () => {
  describe('functionName()', () => {
    it('should handle valid input correctly', () => {
      // Arrange
      const input = 'test';
      const expected = 'expected-output';

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle edge cases', () => {
      expect(functionName(null)).toBeNull();
      expect(functionName('')).toBe('');
    });

    it('should throw error for invalid input', () => {
      expect(() => functionName(undefined)).toThrow();
    });
  });
});
```

### 4. Jest Configuration

**Already configured** in `jest.config.js`:
- Parallel execution (50% CPU)
- jsdom environment
- 80% coverage thresholds
- Babel transformation for modern JS

**You can use**:
- ES6 modules (`import/export`)
- Modern JavaScript features
- async/await
- Jest matchers and utilities

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Your New Tests Only
```bash
npm test -- tests/unit/feature-name
```

### Run in Watch Mode
```bash
npm test -- --watch tests/unit/feature-name
```

### Run with Coverage
```bash
npm test -- --coverage tests/unit/feature-name
```

## Common Patterns

### Testing Utility Functions
```javascript
const { formatDate, parseJSON } = require('../../src/utils');

describe('Utils', () => {
  describe('formatDate()', () => {
    it('should format ISO date to MM/DD/YYYY', () => {
      expect(formatDate('2025-01-15')).toBe('01/15/2025');
    });
  });

  describe('parseJSON()', () => {
    it('should parse valid JSON', () => {
      const result = parseJSON('{"key":"value"}');
      expect(result).toEqual({ key: 'value' });
    });

    it('should return null for invalid JSON', () => {
      expect(parseJSON('invalid')).toBeNull();
    });
  });
});
```

### Testing Async Functions
```javascript
describe('async fetchData()', () => {
  it('should fetch and return data', async () => {
    const data = await fetchData('/api/users');
    expect(data).toHaveProperty('users');
    expect(data.users).toBeInstanceOf(Array);
  });

  it('should handle errors gracefully', async () => {
    await expect(fetchData('/invalid')).rejects.toThrow();
  });
});
```

### Testing with Mocks
```javascript
jest.mock('../../src/api');
const { getUser } = require('../../src/api');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call API with correct params', () => {
    getUser.mockResolvedValue({ id: 1, name: 'Test' });

    const user = await getUserById(1);

    expect(getUser).toHaveBeenCalledWith(1);
    expect(user.name).toBe('Test');
  });
});
```

## Coverage Thresholds

**Configured thresholds**: 80% across all metrics

If your tests don't meet coverage:
- Add more test cases for uncovered branches
- Test error paths and edge cases
- Consider if uncovered code is actually testable

## Integration with CI/CD

Tests run automatically in parallel during CI. Your new tests will be included in:
- `npm test` (all tests)
- GitHub Actions (if configured)
- Pre-commit hooks (if configured)

## Decision Framework

**Ask yourself**:
1. **Is this feature complex?** → If yes, write tests
2. **Will it be reused?** → If yes, write tests
3. **Is it business-critical?** → If yes, write tests
4. **Is it UI-only with no logic?** → If yes, skip tests
5. **Would a bug here be serious?** → If yes, write tests
6. **Is it a temporary prototype?** → If yes, skip tests

**Rule of thumb**: If you're unsure, write a few basic tests covering happy path and error cases.

## Example Workflow

1. **Create feature** in `src/` or appropriate location
2. **Determine if testing is needed** (see decision framework)
3. **Create test file** in `tests/unit/[feature-name]/`
4. **Write tests** covering:
   - Happy path (expected behavior)
   - Edge cases (empty, null, undefined)
   - Error cases (invalid input, failures)
5. **Run tests** to verify they pass
6. **Check coverage** if needed
7. **Commit** feature and tests together

## Common Jest Matchers

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality (objects/arrays)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(5);
expect(value).toBeCloseTo(0.3, 5);      // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ a: 1 }); // Subset match

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## Troubleshooting

### Tests not found
- Verify file ends with `.test.js` or `.spec.js`
- Check file is in `tests/` directory
- Run `npm test -- --listTests` to see discovered tests

### Import/require errors
- Check file paths are correct
- Use correct relative paths (`../../src/...`)
- Ensure modules export functions being tested

### Coverage not meeting threshold
- Run with `--coverage` to see coverage report
- Add tests for uncovered branches
- Consider excluding non-critical code from coverage

### Tests timing out
- Increase timeout: `jest.setTimeout(10000);` in test file
- Check for unhandled promises or infinite loops
- Use `--detectOpenHandles` to find what's keeping tests alive

## References

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Jest Config**: `jest.config.js` in project root
- **Package Scripts**: `package.json` - test scripts
- **Existing Tests**: `tests/` directory for examples
- **Parallel Testing Guide**: `docs/PARALLEL-TESTING-GUIDE.md`

---

## Summary

**Use this skill to**:
- Write unit tests for non-trivial features
- Extend test coverage beyond contract validation
- Ensure code quality for complex logic

**Remember**:
- Not every feature needs tests
- Focus on testable, reusable, complex logic
- Keep tests simple and readable
- Run tests before committing
- Maintain 80% coverage threshold

**When in doubt**: Write a few basic tests. Better to have some coverage than none.
