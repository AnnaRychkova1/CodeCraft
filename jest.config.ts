/** @type {import('jest').Config} */
const config: import("jest").Config = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next/image$": "<rootDir>/__mocks__/nextImageMock.tsx",
    "^next/router$": "<rootDir>/__mocks__/nextRouterMock.ts",
    "^next-auth/react$": "<rootDir>/__mocks__/nextAuthReactMock.ts",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@panva|jose|@auth/core|@next-auth|openid-client|preact-render-to-string|preact)/)",
  ],

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};

module.exports = config;
