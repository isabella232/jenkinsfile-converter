module.exports = {
    coveragePathIgnorePatterns: ['node_modules', 'assets/jfc-module.js'],
    globals: {
        'ts-jest': {
            tsConfig: {
                noImplicitAny: false
            }
        }
    },
    moduleNameMapper: {
        '\\.html$': '<rootDir>/__mocks__/fileMock.js'
    },
    preset: 'ts-jest',
    reporters: [
        'default',
        [
            'jest-junit',
            { outputDirectory: 'test-results/jest', addFileAttribute: true }
        ]
    ],
    testEnvironment: 'node'
};
