module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },
    testMatch: ["**/Tests/**/*.test.ts", "**/*.spec.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
    coverageDirectory: "coverage",
    verbose: true,
  };