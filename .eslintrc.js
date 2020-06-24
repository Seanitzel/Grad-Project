module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off', // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'template-curly-spacing': 'off',
    indent: 'off',
    'vue/no-async-in-computed-properties': 'error',
    'vue/html-closing-bracket-newline': [
      'error', {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'vue/html-closing-bracket-spacing': [
      'error', {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never'
      }
    ],
    'vue/max-attributes-per-line': [
      'error', {
        singleline: 6,
        multiline: {
          max: 6,
          allowFirstLine: true
        }
      }
    ],
    'vue/multiline-html-element-content-newline': [
      'error', {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea', 'br', 'span', 'VueComponent'],
        allowEmptyLines: false
      }
    ],
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'no-multi-spaces': 'off',
    'comma-dangle': 0,
    'key-spacing': 0,
    '@typescript-eslint/no-use-before-define': 'off',
    'no-undef': 'off',
    'no-new': 'off',
    'new-cap': 'off',
    'eol-last': 'off',
    'space-before-function-paren': "off",
    'object-curly-spacing': 'off'
  }
}
