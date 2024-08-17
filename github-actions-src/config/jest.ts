export default {
  rootDir: "../",
  displayName: 'github-actions-src',
  coveragePathIgnorePatterns: [],
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'build/reports/coverage',
  coverageProvider: 'babel',
  coverageReporters: ['text', 'cobertura', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  reporters: [
    ['jest-junit', { suiteName: '', outputFile: 'build/reports/tests/junit.xml', includeConsoleOutput: 'true' }],
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Unit Test Report',
        outputPath: 'build/reports/tests/unit-tests.html',
        includeFailureMsg: true,
      },
    ],
  ],
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['node_modules'],
};
