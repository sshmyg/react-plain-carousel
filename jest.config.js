const ignorePaths = [
    '<rootDir>/node_modules',
    '__snapshots__'
];

module.exports = {
    testURL: 'http://localhost',
    setupFiles: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ignorePaths,
    testPathIgnorePatterns: [
        ...ignorePaths,
        '<rootDir>/coverage'
    ],
    roots: [
        '<rootDir>/src'
    ]
};
