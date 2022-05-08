module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  coverageDirectory: "<rootDir>/../coverage",
  coveragePathIgnorePatterns: [
    "index.[jt]s",
    "local.[jt]s",
  ]
};
