const { jest: lernaAliases } = require('lerna-alias');
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        baseUrl: '.',
        paths: {
          'xstate': ['../core/src/index.ts']
        }
      }
    }
  },
  moduleNameMapper: {
    ...lernaAliases(),
    '^xstate$': path.resolve(__dirname, '../core/src/index.ts')
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transformIgnorePatterns: [],
  roots: ['<rootDir>/src']
};

