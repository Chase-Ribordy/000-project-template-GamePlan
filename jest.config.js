module.exports = {
  // Use jsdom environment for DOM testing
  testEnvironment: 'jsdom',

  // Enable parallel test execution
  maxWorkers: '50%', // Use 50% of available CPU cores

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Ignore patterns - exclude boilerplate and node_modules
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.system/boilerplate/',
    '/.system/components/',
    '/.system/proven/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    '.system/components/**/*.js',
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Transform configuration for modern JS
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },

  // Parallel execution settings
  bail: false, // Don't stop on first failure
  verbose: true,

  // Test timeout
  testTimeout: 10000,

  // Cache for faster subsequent runs
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache'
};
