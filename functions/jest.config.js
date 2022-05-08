module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  coverageDirectory: "<rootDir>/../coverage",
  collectCoverage: true,
  collectCoverageFrom: [
    "./**"
  ],
  coveragePathIgnorePatterns: [
    "index.[jt]s",
    "production.[jt]s",
    "test.[jt]s",
  ]
};
