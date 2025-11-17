// Jest setup file - runs before all tests

// Extend expect matchers if needed
global.beforeAll(() => {
  console.log('🚀 Starting test suite...');
});

global.afterAll(() => {
  console.log('✅ Test suite completed');
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
