// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const config = {
    projects: [
        {
            displayName: 'server',
            testMatch: [
                '**/__tests__/api/**/*.test.ts',
                '**/__tests__/api/**/*.spec.ts'
            ],
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^@lib/(.*)$': '<rootDir>/src/lib/$1',
                '^@app/(.*)$': '<rootDir>/src/app/$1',
                '^swiper/css$': 'identity-obj-proxy',
                '^swiper/css/navigation$': 'identity-obj-proxy',
                '^swiper/css/pagination$': 'identity-obj-proxy',
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
            },
            transform: {
                '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}]
            },
            transformIgnorePatterns: [
                '/node_modules/(?!(swiper|ssr-window|dom7))'
            ],
        }, {
            displayName: 'client',
            testMatch: ['**/__tests__/components/**/*.test.tsx'],
            testEnvironment: 'jsdom',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^@lib/(.*)$': '<rootDir>/src/lib/$1',
                '^@app/(.*)$': '<rootDir>/src/app/$1',
                '^swiper/css$': 'identity-obj-proxy',
                '^swiper/css/navigation$': 'identity-obj-proxy',
                '^swiper/css/pagination$': 'identity-obj-proxy',
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
            },
            transform: {
                '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}]
            },
            transformIgnorePatterns: [
                '/node_modules/(?!(swiper|ssr-window|dom7))'
            ],
        },
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40,
        },
    }
}

module.exports = createJestConfig(config)