const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // 👈 підлаштуй під свою структуру
    },
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        '!app/**/*.d.ts',
        '!app/**/*.stories.tsx',
        '!app/**/layout.tsx'
    ],
    coverageThreshold: {
        global: {
            lines: 50,
            statements: 50
        }
    }
}

module.exports = createJestConfig(config)