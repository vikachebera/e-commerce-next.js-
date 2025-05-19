// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^swiper/css$': 'identity-obj-proxy',
        '^swiper/css/navigation$': 'identity-obj-proxy',
        '^swiper/css/pagination$': 'identity-obj-proxy',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(swiper|ssr-window|dom7))'
    ],
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