// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/src/routes/'],
    moduleDirectories: ['node_modules', 'src'],
    verbose: true,
    testTimeout: 10000,
    setupFiles: ['dotenv/config']
  };
  