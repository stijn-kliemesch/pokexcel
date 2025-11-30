export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./test'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/*.(test|spec).ts'],
};