export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'], // Default, no need to transform node-fetch@2
  setupFiles: ['<rootDir>/jest.setup.js'], // Point to CommonJS file
};