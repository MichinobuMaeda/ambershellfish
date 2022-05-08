module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "airbnb/base",
    "airbnb-typescript/base",
  ],
  parserOptions: {
    project: [
      "**/tsconfig.json",
      "**/tsconfig.dev.json",
    ],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/*.js",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "react/function-component-definition": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "no-nested-ternary": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/lines-between-class-members": "off"
  },
};
