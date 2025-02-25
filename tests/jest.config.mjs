export default {
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^./utils/logger.js$": "<rootDir>/tests/__mocks__/loggerMock.js" // Mock logger.js
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!chalk)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
