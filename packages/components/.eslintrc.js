module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:storybook/recommended"],
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
    browser: true,
    node: true
  },
  plugins: ["jest"],
  env: {
    "jest/globals": true
  }
};