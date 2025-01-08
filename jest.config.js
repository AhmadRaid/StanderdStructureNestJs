module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testMatch: ['**/*.spec.ts'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1'
    },
    rootDir: '.',
    modulePaths: ['<rootDir>'],
  };
  